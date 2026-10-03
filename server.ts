import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import net from 'net';
import ldap from 'ldapjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanitize host string to remove annotations like (localhost) or brackets
function cleanHost(rawHost: any): string {
  if (!rawHost || typeof rawHost !== 'string') return '';
  let cleaned = rawHost.replace(/\s*\(.*?\)/g, '').trim();
  if (cleaned.toLowerCase() === 'localhost') return '127.0.0.1';
  return cleaned;
}

// Global server-side Active Directory configuration
let serverAdConfig: any = {
  serverHost: cleanHost(process.env.AD_HOST || ''),
  port: Number(process.env.AD_PORT) || 389,
  useSsl: process.env.AD_SSL === 'true',
  baseDn: (process.env.AD_BASE_DN || '').trim(),
  domainName: (process.env.AD_DOMAIN || '').trim(),
  bindUserDn: (process.env.AD_BIND_USER || '').trim(),
  bindPassword: (process.env.AD_BIND_PASSWORD || '').trim(),
  userFilter: process.env.AD_USER_FILTER || '(&(objectCategory=person)(objectClass=user)(sAMAccountName={username}))',
  groupAdminDn: (process.env.AD_GROUP_ADMIN || '').trim(),
  groupManagerDn: (process.env.AD_GROUP_MANAGER || '').trim(),
  autoCreateUser: true,
};

// Real TCP socket probe to verify if the server and port are genuinely reachable
function testTcpConnection(
  host: string,
  port: number,
  timeoutMs = 3500
): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let settled = false;

    const cleanup = () => {
      if (!settled) {
        settled = true;
        socket.destroy();
      }
    };

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      const latencyMs = Date.now() - start;
      cleanup();
      resolve({ reachable: true, latencyMs });
    });

    socket.on('timeout', () => {
      const latencyMs = Date.now() - start;
      cleanup();
      resolve({ reachable: false, latencyMs, error: 'ETIMEDOUT: مهلت اتصال به سرور به پایان رسید.' });
    });

    socket.on('error', (err: any) => {
      const latencyMs = Date.now() - start;
      cleanup();
      resolve({ reachable: false, latencyMs, error: err.message });
    });

    socket.connect(port, host);
  });
}

// Get effective DB configuration, prioritizing server-side .env file
function getEffectiveDbConfig(body?: any) {
  const host = cleanHost(process.env.DB_HOST || body?.host);
  const port = Number(process.env.DB_PORT || body?.port || 3306);
  const database = (process.env.DB_NAME || body?.database || 'divar_org').toString().trim();
  const user = (process.env.DB_USER || body?.user || 'root').toString().trim();
  const password = process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== ''
    ? process.env.DB_PASSWORD
    : (body?.password !== undefined && body?.password !== '' ? body.password : '');

  return { host, port, database, user, password };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // URL rewrite middleware: seamlessly handle requests under /divar/api/* as /api/*
  app.use((req, res, next) => {
    if (req.url.startsWith('/divar/api/')) {
      req.url = req.url.replace('/divar/api', '/api');
    } else if (req.url === '/divar/api') {
      req.url = '/api';
    }
    next();
  });

  // ----------------------------------------------------
  // REAL ACTIVE DIRECTORY (LDAP) ENDPOINTS
  // ----------------------------------------------------

  // Get current active AD config
  app.get('/api/ad/config', (req, res) => {
    res.json({
      serverHost: serverAdConfig.serverHost,
      port: serverAdConfig.port,
      useSsl: serverAdConfig.useSsl,
      baseDn: serverAdConfig.baseDn,
      domainName: serverAdConfig.domainName,
      bindUserDn: serverAdConfig.bindUserDn,
      hasBindPassword: Boolean(serverAdConfig.bindPassword),
      userFilter: serverAdConfig.userFilter,
      groupAdminDn: serverAdConfig.groupAdminDn,
      groupManagerDn: serverAdConfig.groupManagerDn,
      autoCreateUser: serverAdConfig.autoCreateUser,
    });
  });

  // Fast live probe of Active Directory reachability
  app.get('/api/ad/status', async (req, res) => {
    const host = cleanHost(serverAdConfig.serverHost);
    const port = Number(serverAdConfig.port || 389);
    if (!host) {
      return res.json({
        connected: false,
        configured: false,
        serverHost: '',
        port,
        latencyMs: 0,
        message: 'آدرس سرور اکتیو دایرکتوری در تنظیمات سامانه پیکربندی نشده است.',
        error: 'تنظیمات سرور دامنه خالی است',
      });
    }
    const tcp = await testTcpConnection(host, port, 1500);
    res.json({
      connected: tcp.reachable,
      configured: true,
      serverHost: host,
      port,
      latencyMs: tcp.latencyMs,
      message: tcp.reachable
        ? `ارتباط با کنترلر دامنه در آدرس ${host}:${port} برقرار است`
        : `عدم برقراری ارتباط با سرور دامنه در آدرس ${host}:${port} (${tcp.error || 'عدم پاسخگویی'})`,
      error: tcp.error || null,
    });
  });

  // Save active AD config
  app.post('/api/ad/config', (req, res) => {
    const body = req.body || {};
    serverAdConfig = {
      ...serverAdConfig,
      ...body,
      serverHost: cleanHost(body.serverHost || serverAdConfig.serverHost),
      port: Number(body.port || serverAdConfig.port || 389),
      useSsl: Boolean(body.useSsl ?? serverAdConfig.useSsl),
    };
    if (body.bindPassword && !body.bindPassword.includes('••••')) {
      serverAdConfig.bindPassword = body.bindPassword;
    }
    res.json({ success: true, message: 'پیکربندی اکتیو دایرکتوری در سرور ذخیره شد.' });
  });

  // Test Real Connection to Active Directory Server
  app.post('/api/ad/test', async (req, res) => {
    const body = req.body || {};
    const host = cleanHost(body.serverHost || serverAdConfig.serverHost);
    const port = Number(body.port || serverAdConfig.port || 389);
    const useSsl = Boolean(body.useSsl ?? serverAdConfig.useSsl);
    const domainName = (body.domainName || serverAdConfig.domainName || 'CORP').trim();
    const bindUserDn = (body.bindUserDn || serverAdConfig.bindUserDn || '').trim();
    const bindPassword = (body.bindPassword || body.bindPasswordMasked || serverAdConfig.bindPassword || '').trim();
    const baseDn = (body.baseDn || serverAdConfig.baseDn || '').trim();

    // 1. Test genuine TCP reachability
    const tcp = await testTcpConnection(host, port, 3500);
    if (!tcp.reachable) {
      return res.json({
        success: false,
        connected: false,
        code: 'TCP_CONNECT_FAIL',
        latencyMs: tcp.latencyMs,
        message: `ارتباط با کنترلر دامنه در آدرس ${host}:${port} برقرار نشد. سرور خاموش است، آدرس IP اشتباه است یا فایروال پورت ${port} را مسدود کرده است (${tcp.error || 'خطا'}).`,
        details: { host, port, error: tcp.error },
      });
    }

    // 2. Real LDAP connection
    try {
      const client = ldap.createClient({
        url: `${useSsl ? 'ldaps' : 'ldap'}://${host}:${port}`,
        timeout: 5000,
        connectTimeout: 5000,
        tlsOptions: { rejectUnauthorized: false },
      });

      let clientError: any = null;
      client.on('error', (e) => {
        clientError = e;
      });

      // If no bind credentials provided, test LDAP ping
      if (!bindUserDn || !bindPassword || bindPassword.includes('••••')) {
        client.search('', { scope: 'base', filter: '(objectClass=*)' }, (searchErr) => {
          client.unbind(() => {});
          if (searchErr || clientError) {
            return res.json({
              success: false,
              connected: false,
              code: 'LDAP_ANON_REJECTED',
              latencyMs: tcp.latencyMs,
              message: `پورت ${port} روی سرور ${host} باز است اما سرور اکتیو دایرکتوری دسترسی ناشناس را مسدود کرده است. لطفاً نام کاربری و رمز عبور حساب سرویس (Bind DN) را وارد فرمایید.`,
              details: { host, port, useSsl },
            });
          }
          return res.json({
            success: true,
            connected: true,
            latencyMs: tcp.latencyMs,
            message: `پورت ${port} روی سرور ${host} باز است و سرویس LDAP دایرکتوری در حال پاسخگویی است.`,
            details: { host, port, useSsl, domainName },
          });
        });
        return;
      }

      let bindPrincipal = bindUserDn;
      if (!bindPrincipal.toLowerCase().includes('dc=') && !bindPrincipal.includes('\\') && !bindPrincipal.includes('@')) {
        bindPrincipal = domainName ? `${domainName}\\${bindPrincipal}` : bindPrincipal;
      }

      client.bind(bindPrincipal, bindPassword, (bindErr) => {
        client.unbind(() => {});
        if (bindErr) {
          const msg = bindErr.message || '';
          const isInvalidCreds = msg.includes('49') || (bindErr as any).code === 49;
          return res.json({
            success: false,
            connected: false,
            code: isInvalidCreds ? 'INVALID_BIND_CREDENTIALS' : 'LDAP_BIND_ERROR',
            latencyMs: tcp.latencyMs,
            message: isInvalidCreds
              ? `ارتباط شبکه با سرور ${host}:${port} برقرار است، اما نام کاربری (${bindPrincipal}) یا رمز عبور Bind در اکتیو دایرکتوری نامعتبر است (Error 49 - Invalid Credentials).`
              : `خطای احراز هویت سرویس اکتیو دایرکتوری: ${msg}`,
            details: { host, port, bindPrincipal },
          });
        }

        return res.json({
          success: true,
          connected: true,
          latencyMs: tcp.latencyMs,
          message: `ارتباط واقعی با کنترلر دامنه ${host}:${port} تایید شد و حساب اتصال (${bindPrincipal}) با موفقیت در اکتیو دایرکتوری احراز هویت گردید.`,
          details: { host, port, bindPrincipal, baseDn, useSsl },
        });
      });
    } catch (err: any) {
      return res.json({
        success: false,
        connected: false,
        code: 'LDAP_CLIENT_ERROR',
        latencyMs: tcp.latencyMs,
        message: `خطای کلاینت LDAP: ${err.message}`,
        details: { host, port },
      });
    }
  });

  // Real Active Directory User Authentication Endpoint
  app.post('/api/ad/login', async (req, res) => {
    const { username, password, domain, adConfig } = req.body || {};

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ success: false, message: 'لطفاً نام کاربری ویندوز را وارد نمایید.' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'لطفاً کلمه عبور را وارد نمایید.' });
    }

    const effectiveConfig = {
      ...serverAdConfig,
      ...(adConfig || {}),
    };

    const host = cleanHost(effectiveConfig.serverHost);
    const port = Number(effectiveConfig.port || 389);
    const useSsl = Boolean(effectiveConfig.useSsl);
    const domainName = (domain || effectiveConfig.domainName || '').toString().trim().toUpperCase();
    const baseDn = (effectiveConfig.baseDn || '').toString().trim();

    if (!host) {
      return res.json({
        success: false,
        connected: false,
        code: 'AD_NOT_CONFIGURED',
        message: 'آدرس سرور اکتیو دایرکتوری در سامانه تنظیم نشده است. لطفاً ابتدا در پنل مدیریت مشخصات سرور دامنه را وارد فرمایید.',
      });
    }

    let cleanUser = username.trim();
    if (cleanUser.includes('\\')) {
      cleanUser = cleanUser.split('\\')[1];
    } else if (cleanUser.includes('@')) {
      cleanUser = cleanUser.split('@')[0];
    }

    // 1. Check TCP connection to domain controller
    const tcp = await testTcpConnection(host, port, 3500);
    if (!tcp.reachable) {
      return res.json({
        success: false,
        connected: false,
        code: 'AD_UNREACHABLE',
        message: `عدم برقراری ارتباط با کنترلر دامنه در آدرس ${host}:${port}: سرور در دسترس نیست یا ارتباط شبکه قطع است (${tcp.error || 'خطا'}).`,
        error: tcp.error,
      });
    }

    // 2. Perform LDAP bind for this user
    try {
      const client = ldap.createClient({
        url: `${useSsl ? 'ldaps' : 'ldap'}://${host}:${port}`,
        timeout: 5000,
        connectTimeout: 5000,
        tlsOptions: { rejectUnauthorized: false },
      });

      client.on('error', () => {});

      const userPrincipal = domainName ? `${domainName}\\${cleanUser}` : cleanUser;

      client.bind(userPrincipal, password, (bindErr) => {
        if (bindErr) {
          client.unbind(() => {});
          const msg = bindErr.message || '';
          const isInvalidCreds = msg.includes('49') || (bindErr as any).code === 49;
          return res.json({
            success: false,
            code: isInvalidCreds ? 'INVALID_CREDENTIALS' : 'LDAP_AUTH_ERROR',
            message: isInvalidCreds
              ? `کلمه عبور یا نام کاربری وارد شده در اکتیو دایرکتوری (${userPrincipal}) نامعتبر است.`
              : `خطا در احراز هویت با اکتیو دایرکتوری: ${msg}`,
          });
        }

        const fallbackUserObj = {
          id: `usr-ad-${cleanUser.toLowerCase()}`,
          username: `${domainName}\\${cleanUser}`,
          displayName: cleanUser,
          email: `${cleanUser.toLowerCase()}@${domainName.toLowerCase()}.local`,
          department: 'پرسنل سازمان',
          internalPhone: '',
          mobilePhone: '',
          role: 'USER' as const,
          adGroups: ['Domain Users'],
          status: 'ACTIVE' as const,
        };

        if (!baseDn) {
          client.unbind(() => {});
          return res.json({
            success: true,
            user: fallbackUserObj,
            message: 'احراز هویت با موفقیت در اکتیو دایرکتوری انجام شد.',
          });
        }

        const filter = `(&(objectCategory=person)(objectClass=user)(sAMAccountName=${cleanUser}))`;
        client.search(baseDn, {
          filter,
          scope: 'sub',
          attributes: ['dn', 'sAMAccountName', 'displayName', 'cn', 'telephoneNumber', 'mobile', 'department', 'mail', 'memberOf'],
        }, (searchErr, searchRes) => {
          if (searchErr) {
            client.unbind(() => {});
            return res.json({
              success: true,
              user: fallbackUserObj,
              message: 'احراز هویت در اکتیو دایرکتوری تایید شد.',
            });
          }

          let foundEntry: any = null;

          searchRes.on('searchEntry', (entry: any) => {
            foundEntry = entry?.object || entry?.pojo;
          });

          searchRes.on('error', () => {
            client.unbind(() => {});
            return res.json({
              success: true,
              user: fallbackUserObj,
              message: 'احراز هویت با موفقیت انجام شد.',
            });
          });

          searchRes.on('end', () => {
            client.unbind(() => {});
            if (!foundEntry) {
              return res.json({
                success: true,
                user: fallbackUserObj,
                message: 'احراز هویت در اکتیو دایرکتوری تایید شد.',
              });
            }

            const displayName = foundEntry.displayName || foundEntry.cn || cleanUser;
            const department = foundEntry.department || 'پرسنل سازمان';
            const internalPhone = foundEntry.telephoneNumber || foundEntry.ipPhone || '';
            const mobilePhone = foundEntry.mobile || '';
            const email = foundEntry.mail || `${cleanUser.toLowerCase()}@${domainName.toLowerCase()}.local`;

            let memberOf: string[] = [];
            if (Array.isArray(foundEntry.memberOf)) {
              memberOf = foundEntry.memberOf;
            } else if (typeof foundEntry.memberOf === 'string') {
              memberOf = [foundEntry.memberOf];
            }

            const groupNames = memberOf.map((str: string) => {
              const m = str.match(/CN=([^,]+)/i);
              return m ? m[1] : str;
            });

            let role: 'SUPER_ADMIN' | 'CATEGORY_MANAGER' | 'USER' = 'USER';
            const adminDn = (effectiveConfig.groupAdminDn || '').toLowerCase();
            const managerDn = (effectiveConfig.groupManagerDn || '').toLowerCase();
            const memberOfLower = memberOf.map((m: string) => m.toLowerCase());
            const groupNamesLower = groupNames.map((g: string) => g.toLowerCase());

            if (
              (adminDn && memberOfLower.some(g => g.includes(adminDn))) ||
              groupNamesLower.includes('domain admins') ||
              groupNamesLower.includes('enterprise admins') ||
              groupNamesLower.includes('it_admins')
            ) {
              role = 'SUPER_ADMIN';
            } else if (
              (managerDn && memberOfLower.some(g => g.includes(managerDn))) ||
              groupNamesLower.includes('category_managers') ||
              groupNamesLower.includes('app_moderators')
            ) {
              role = 'CATEGORY_MANAGER';
            }

            const realUser = {
              id: `usr-ad-${cleanUser.toLowerCase()}`,
              username: `${domainName}\\${cleanUser}`,
              displayName,
              email,
              department,
              internalPhone,
              mobilePhone,
              role,
              adGroups: groupNames.length > 0 ? groupNames : ['Domain Users'],
              status: 'ACTIVE' as const,
            };

            return res.json({
              success: true,
              user: realUser,
              message: `احراز هویت با موفقیت در اکتیو دایرکتوری (${userPrincipal}) انجام شد.`,
            });
          });
        });
      });
    } catch (err: any) {
      return res.json({
        success: false,
        code: 'LDAP_ERROR',
        message: `خطای اتصال به اکتیو دایرکتوری: ${err.message}`,
      });
    }
  });

  // Real MySQL Test Connection endpoint
  app.post('/api/mysql/test', async (req, res) => {
    const config = getEffectiveDbConfig(req.body);

    const startTime = Date.now();

    try {
      // Attempt connection to the specific database
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        connectTimeout: 4000,
      });

      const latencyMs = Date.now() - startTime;

      // Query tables to check if schema is initialized
      const [rows] = await connection.query('SHOW TABLES');
      const tableList = Array.isArray(rows)
        ? rows.map((r: any) => Object.values(r)[0] as string)
        : [];

      await connection.end();

      const expectedTables = ['users', 'categories', 'category_fields', 'ads', 'ad_custom_values', 'audit_logs'];
      const missingTables = expectedTables.filter(t => !tableList.includes(t));

      return res.json({
        success: true,
        connected: true,
        latencyMs,
        databaseExists: true,
        tablesCount: tableList.length,
        tables: tableList,
        missingTables,
        message: missingTables.length === 0
          ? `اتصال واقعی به پایگاه داده ${config.database} روی پورت ${config.port} برقرار شد و تمام ${tableList.length} جدول آماده بهره‌برداری هستند.`
          : `اتصال به پایگاه داده ${config.database} برقرار است، اما جداول هنوز ایجاد نشده‌اند (${missingTables.length} جدول مفقود: ${missingTables.join(', ')}).`,
        details: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          tablesFound: tableList,
        },
      });
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const code = err.code || err.errno || 'UNKNOWN';

      // If database does not exist, check if MySQL server itself is reachable
      if (code === 'ER_BAD_DB_ERROR') {
        try {
          const serverConn = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            connectTimeout: 3000,
          });
          await serverConn.end();

          return res.status(200).json({
            success: false,
            connected: false,
            serverReachable: true,
            databaseExists: false,
            latencyMs,
            code,
            message: `سرور MySQL در دسترس است، اما پایگاه داده «${config.database}» هنوز ساخته نشده است!`,
            tip: `جهت ساخت دیتابیس، دستور CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci; را در MySQL اجرا کنید، یا از دکمه «ساخت خودکار جداول» استفاده نمایید.`,
            error: err.message,
          });
        } catch {
          // fall through to general error
        }
      }

      let persianMsg = 'خطا در اتصال به MySQL: ';
      let tip = '';

      if (code === 'ECONNREFUSED') {
        persianMsg += `امکان اتصال به آدرس ${config.host}:${config.port} وجود ندارد.`;
        tip = 'آیا سرویس MySQL روی سرور اجرا است؟ دستور (sudo systemctl status mysql) را بررسی کنید یا پورت 3306 را چک فرمایید.';
      } else if (code === 'ER_ACCESS_DENIED_ERROR') {
        persianMsg += `نام کاربری (${config.user}) یا کلمه عبور وارد شده در .env نامعتبر است (دسترسی رد شد).`;
        tip = 'لطفاً نام کاربری و کلمه عبور را در فایل .env اصلاح نموده یا مجوز دسترسی کاربر MySQL را بررسی نمایید.';
      } else if (code === 'ETIMEDOUT') {
        persianMsg += `زمان اتصال به سرور ${config.host}:${config.port} به پایان رسید (Timeout).`;
        tip = 'آدرس IP سرور یا پورت در دسترس نیست یا فایروال آن را مسدود کرده است.';
      } else {
        persianMsg += err.message || 'خطای نامشخص';
      }

      return res.status(200).json({
        success: false,
        connected: false,
        latencyMs,
        code,
        message: persianMsg,
        tip,
        error: err.message,
      });
    }
  });

  // Get current active database env configuration (without exposing password)
  app.get('/api/mysql/config', (req, res) => {
    res.json({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'divar_org',
      user: process.env.DB_USER || 'divar_user',
      hasPassword: Boolean(process.env.DB_PASSWORD),
      ssl: process.env.DB_SSL === 'true',
      source: process.env.DB_HOST ? 'ENV_FILE' : 'DEFAULT',
    });
  });

  // Initialize DB tables automatically endpoint
  app.post('/api/mysql/init-schema', async (req, res) => {
    const config = getEffectiveDbConfig(req.body);

    try {
      const serverConn = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        multipleStatements: true,
        connectTimeout: 5000,
      });

      await serverConn.query(
        `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci;`
      );
      await serverConn.query(`USE \`${config.database}\`;`);

      const tablesDdl = `
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) PRIMARY KEY,
            username VARCHAR(100) NOT NULL UNIQUE,
            display_name VARCHAR(150) NOT NULL,
            department VARCHAR(100),
            phone VARCHAR(50),
            email VARCHAR(150),
            role ENUM('USER', 'CATEGORY_MANAGER', 'SUPER_ADMIN') DEFAULT 'USER',
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

        CREATE TABLE IF NOT EXISTS categories (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            icon VARCHAR(50),
            description TEXT,
            manager_id VARCHAR(64),
            manager_name VARCHAR(150),
            manager_department VARCHAR(100),
            auto_approve BOOLEAN DEFAULT FALSE,
            default_image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

        CREATE TABLE IF NOT EXISTS category_fields (
            id VARCHAR(64) PRIMARY KEY,
            category_id VARCHAR(64) NOT NULL,
            name VARCHAR(100) NOT NULL,
            label VARCHAR(150) NOT NULL,
            type ENUM('text', 'number', 'select', 'boolean') NOT NULL,
            required BOOLEAN DEFAULT FALSE,
            options_json JSON,
            unit VARCHAR(30),
            placeholder VARCHAR(150),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

        CREATE TABLE IF NOT EXISTS ads (
            id VARCHAR(64) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category_id VARCHAR(64) NOT NULL,
            author_id VARCHAR(64) NOT NULL,
            author_name VARCHAR(150) NOT NULL,
            author_department VARCHAR(100),
            author_phone VARCHAR(50),
            price BIGINT DEFAULT 0,
            is_agreement_price BOOLEAN DEFAULT FALSE,
            is_free BOOLEAN DEFAULT FALSE,
            status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'APPROVED',
            is_immediate BOOLEAN DEFAULT FALSE,
            department_location VARCHAR(100),
            images_json JSON,
            views_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

        CREATE TABLE IF NOT EXISTS ad_custom_values (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            ad_id VARCHAR(64) NOT NULL,
            field_name VARCHAR(100) NOT NULL,
            field_value TEXT,
            FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

        CREATE TABLE IF NOT EXISTS audit_logs (
            id VARCHAR(64) PRIMARY KEY,
            actor_id VARCHAR(64),
            actor_name VARCHAR(150),
            action VARCHAR(100) NOT NULL,
            target_type VARCHAR(50),
            target_id VARCHAR(64),
            details TEXT,
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;
      `;

      await serverConn.query(tablesDdl);
      await serverConn.end();

      return res.json({
        success: true,
        message: `پایگاه داده «${config.database}» و تمام ۶ جدول سازمانی با موفقیت ایجاد شدند.`,
      });
    } catch (err: any) {
      let friendlyMsg = `خطا در ایجاد پایگاه داده و جداول: ${err.message}`;
      if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        friendlyMsg = `دسترسی رد شد: نام کاربری (${config.user}) یا رمز عبور اشتباه است یا کاربر دسترسی CREATE DATABASE ندارد.`;
      } else if (err.code === 'ECONNREFUSED') {
        friendlyMsg = `امکان اتصال به سرور MySQL روی ${config.host}:${config.port} وجود ندارد (سرویس خاموش است یا پورت مسدود است).`;
      } else if (err.code === 'ENOTFOUND') {
        friendlyMsg = `آدرس سرور MySQL (${config.host}) معتبر نیست یا در شبکه یافت نشد.`;
      }

      return res.status(200).json({
        success: false,
        code: err.code,
        message: friendlyMsg,
      });
    }
  });

  // DB Connection Pool for API Queries
  let dbPool: mysql.Pool | null = null;
  function getDbPool() {
    const config = getEffectiveDbConfig();
    if (!dbPool) {
      dbPool = mysql.createPool({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return dbPool;
  }

  // Get table row stats from MySQL
  app.get('/api/mysql/stats', async (req, res) => {
    try {
      const pool = getDbPool();
      const [rows]: any = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM ads) AS ads_count,
          (SELECT COUNT(*) FROM categories) AS categories_count,
          (SELECT COUNT(*) FROM users) AS users_count,
          (SELECT COUNT(*) FROM audit_logs) AS audit_logs_count
      `);
      const stats = rows[0] || {};
      res.json({
        success: true,
        connected: true,
        adsCount: Number(stats.ads_count || 0),
        categoriesCount: Number(stats.categories_count || 0),
        usersCount: Number(stats.users_count || 0),
        auditLogsCount: Number(stats.audit_logs_count || 0),
      });
    } catch (err: any) {
      res.json({
        success: false,
        connected: false,
        message: err.message,
        adsCount: 0,
        categoriesCount: 0,
        usersCount: 0,
        auditLogsCount: 0,
      });
    }
  });

  // Read all organizational data from MySQL
  app.get('/api/mysql/data', async (req, res) => {
    try {
      const pool = getDbPool();

      // 1. Users
      const [userRows]: any = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
      const users = userRows.map((u: any) => ({
        id: u.id,
        username: u.username,
        displayName: u.display_name,
        department: u.department || '',
        internalPhone: u.phone ? (u.phone.match(/داخلی\s*(\d+)/)?.[1] || '۱۰۱') : '۱۰۱',
        mobilePhone: u.phone ? u.phone.replace(/\(داخلی.*?\)/, '').trim() : '۰۹۱۲۰۰۰۰۰۰۰',
        email: u.email || '',
        role: u.role || 'USER',
        managedCategoryIds: [],
        adGroups: ['Domain Users'],
        avatar: u.avatar_url || '',
        status: 'ACTIVE',
      }));

      // 2. Categories & Fields
      const [catRows]: any = await pool.query('SELECT * FROM categories ORDER BY created_at ASC');
      const [fieldRows]: any = await pool.query('SELECT * FROM category_fields');

      const categories = catRows.map((c: any) => {
        const fields = fieldRows
          .filter((f: any) => f.category_id === c.id)
          .map((f: any) => {
            let options: string[] = [];
            if (f.options_json) {
              options = typeof f.options_json === 'string' ? JSON.parse(f.options_json) : f.options_json;
            }
            return {
              id: f.id,
              categoryId: f.category_id,
              name: f.name,
              label: f.label,
              type: f.type,
              required: Boolean(f.required),
              options,
              unit: f.unit || '',
              placeholder: f.placeholder || '',
              showInCard: true,
              order: 1,
            };
          });

        return {
          id: c.id,
          title: c.title,
          slug: c.slug,
          icon: c.icon || 'Tag',
          description: c.description || '',
          color: 'from-blue-500 to-indigo-600',
          managerId: c.manager_id || '',
          managerName: c.manager_name || '',
          managerDepartment: c.manager_department || '',
          allowAutoApprove: Boolean(c.auto_approve),
          fields,
          defaultImage: c.default_image || '',
        };
      });

      // 3. Ads & Custom Values
      const [adRows]: any = await pool.query('SELECT * FROM ads ORDER BY created_at DESC');
      const [valRows]: any = await pool.query('SELECT * FROM ad_custom_values');

      const ads = adRows.map((a: any) => {
        const customValues: Record<string, any> = {};
        valRows
          .filter((v: any) => v.ad_id === a.id)
          .forEach((v: any) => {
            customValues[v.field_name] = v.field_value;
          });

        let images: string[] = [];
        try {
          if (a.images_json) {
            images = typeof a.images_json === 'string' ? JSON.parse(a.images_json) : a.images_json;
          }
        } catch {}

        const cat = categories.find((c: any) => c.id === a.category_id);

        return {
          id: a.id,
          title: a.title,
          description: a.description,
          categoryId: a.category_id,
          categoryTitle: cat?.title || 'عمومی',
          price: Number(a.price || 0),
          isAgreementPrice: Boolean(a.is_agreement_price),
          isFree: Boolean(a.is_free),
          isUrgent: Boolean(a.is_immediate),
          badgeRequested: Boolean(a.is_immediate),
          badgeApproved: Boolean(a.is_immediate),
          images: Array.isArray(images) && images.length > 0 ? images : [cat?.defaultImage || ''],
          city: 'تهران',
          departmentLocation: a.department_location || '',
          authorId: a.author_id,
          authorName: a.author_name,
          authorUsername: `CORP\\${a.author_id}`,
          authorDepartment: a.author_department || '',
          authorPhone: a.author_phone || '',
          createdAt: a.created_at ? new Date(a.created_at).toISOString() : new Date().toISOString(),
          status: a.status || 'APPROVED',
          viewsCount: Number(a.views_count || 0),
          contactViewsCount: 0,
          customFields: customValues,
        };
      });

      // 4. Audit Logs
      const [logRows]: any = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 150');
      const auditLogs = logRows.map((l: any) => ({
        id: l.id,
        userId: l.actor_id || '',
        userName: l.actor_name || '',
        action: l.action || 'CONFIG_CHANGE',
        details: l.details || '',
        ipAddress: l.ip_address || '',
        timestamp: l.created_at ? new Date(l.created_at).toISOString() : new Date().toISOString(),
        status: 'SUCCESS',
      }));

      res.json({
        success: true,
        source: 'MYSQL',
        users,
        categories,
        ads,
        auditLogs,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: `خطا در دریافت داده‌ها از دیتابیس MySQL: ${err.message}`,
      });
    }
  });

  // Sync / Seed current data directly to MySQL
  app.post('/api/mysql/seed', async (req, res) => {
    try {
      const pool = getDbPool();
      const { users = [], categories = [], ads = [], auditLogs = [] } = req.body;

      await pool.query('SET FOREIGN_KEY_CHECKS = 0');

      // 1. Insert/Update Users
      for (const u of users) {
        await pool.query(
          `INSERT INTO users (id, username, display_name, department, phone, email, role, avatar_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), department = VALUES(department), phone = VALUES(phone), role = VALUES(role), avatar_url = VALUES(avatar_url)`,
          [
            u.id,
            u.username,
            u.displayName,
            u.department || '',
            u.mobilePhone ? `${u.mobilePhone} (داخلی ${u.internalPhone || ''})` : '',
            u.email || '',
            u.role || 'USER',
            u.avatar || '',
          ]
        );
      }

      // 2. Insert/Update Categories and Fields
      for (const c of categories) {
        await pool.query(
          `INSERT INTO categories (id, title, slug, icon, description, manager_id, manager_name, manager_department, auto_approve, default_image)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), slug = VALUES(slug), icon = VALUES(icon), description = VALUES(description),
           manager_id = VALUES(manager_id), manager_name = VALUES(manager_name), manager_department = VALUES(manager_department),
           auto_approve = VALUES(auto_approve), default_image = VALUES(default_image)`,
          [
            c.id,
            c.title,
            c.slug || c.id,
            c.icon || 'Tag',
            c.description || '',
            c.managerId || null,
            c.managerName || '',
            c.managerDepartment || '',
            c.allowAutoApprove ? 1 : 0,
            c.defaultImage || '',
          ]
        );

        if (Array.isArray(c.fields)) {
          for (const f of c.fields) {
            await pool.query(
              `INSERT INTO category_fields (id, category_id, name, label, type, required, options_json, unit, placeholder)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE label = VALUES(label), type = VALUES(type), required = VALUES(required), options_json = VALUES(options_json), unit = VALUES(unit), placeholder = VALUES(placeholder)`,
              [
                f.id,
                c.id,
                f.name,
                f.label,
                f.type || 'text',
                f.required ? 1 : 0,
                JSON.stringify(f.options || []),
                f.unit || '',
                f.placeholder || '',
              ]
            );
          }
        }
      }

      // 3. Insert/Update Ads and Custom Values
      for (const a of ads) {
        await pool.query(
          `INSERT INTO ads (id, title, description, category_id, author_id, author_name, author_department, author_phone, price, is_agreement_price, is_free, status, is_immediate, department_location, images_json, views_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), category_id = VALUES(category_id), price = VALUES(price),
           is_agreement_price = VALUES(is_agreement_price), is_free = VALUES(is_free), status = VALUES(status), is_immediate = VALUES(is_immediate), department_location = VALUES(department_location), images_json = VALUES(images_json), views_count = VALUES(views_count)`,
          [
            a.id,
            a.title,
            a.description,
            a.categoryId,
            a.authorId,
            a.authorName,
            a.authorDepartment || '',
            a.authorPhone || '',
            a.price || 0,
            a.isAgreementPrice ? 1 : 0,
            a.isFree ? 1 : 0,
            a.status || 'APPROVED',
            a.isUrgent ? 1 : 0,
            a.departmentLocation || '',
            JSON.stringify(a.images || []),
            a.viewsCount || 0,
          ]
        );

        if (a.customFields && typeof a.customFields === 'object') {
          await pool.query('DELETE FROM ad_custom_values WHERE ad_id = ?', [a.id]);
          for (const [key, val] of Object.entries(a.customFields)) {
            if (val !== undefined && val !== null && val !== '') {
              await pool.query(
                'INSERT INTO ad_custom_values (ad_id, field_name, field_value) VALUES (?, ?, ?)',
                [a.id, key, String(val)]
              );
            }
          }
        }
      }

      // 4. Insert Audit Logs
      for (const l of auditLogs) {
        await pool.query(
          `INSERT INTO audit_logs (id, actor_id, actor_name, action, details, ip_address)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE details = VALUES(details)`,
          [l.id, l.userId || null, l.userName || '', l.action || 'CONFIG_CHANGE', l.details || '', l.ipAddress || '127.0.0.1']
        );
      }

      await pool.query('SET FOREIGN_KEY_CHECKS = 1');

      res.json({
        success: true,
        message: `همگام‌سازی موفقیت‌آمیز بود: ${users.length} کاربر، ${categories.length} دسته‌بندی و ${ads.length} آگهی در دیتابیس MySQL ذخیره شدند.`,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: `خطا در همگام‌سازی با MySQL: ${err.message}`,
      });
    }
  });

  // Create Ad in MySQL
  app.post('/api/ads', async (req, res) => {
    try {
      const pool = getDbPool();
      const a = req.body;
      await pool.query(
        `INSERT INTO ads (id, title, description, category_id, author_id, author_name, author_department, author_phone, price, is_agreement_price, is_free, status, is_immediate, department_location, images_json, views_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          a.id,
          a.title,
          a.description,
          a.categoryId,
          a.authorId,
          a.authorName,
          a.authorDepartment || '',
          a.authorPhone || '',
          a.price || 0,
          a.isAgreementPrice ? 1 : 0,
          a.isFree ? 1 : 0,
          a.status || 'APPROVED',
          a.isUrgent ? 1 : 0,
          a.departmentLocation || '',
          JSON.stringify(a.images || []),
          a.viewsCount || 0,
        ]
      );

      if (a.customFields && typeof a.customFields === 'object') {
        for (const [key, val] of Object.entries(a.customFields)) {
          if (val !== undefined && val !== null && val !== '') {
            await pool.query(
              'INSERT INTO ad_custom_values (ad_id, field_name, field_value) VALUES (?, ?, ?)',
              [a.id, key, String(val)]
            );
          }
        }
      }

      res.json({ success: true, ad: a });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Update Ad in MySQL
  app.put('/api/ads/:id', async (req, res) => {
    try {
      const pool = getDbPool();
      const { id } = req.params;
      const updates = req.body;

      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
      if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
      if (updates.categoryId !== undefined) { fields.push('category_id = ?'); values.push(updates.categoryId); }
      if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
      if (updates.isAgreementPrice !== undefined) { fields.push('is_agreement_price = ?'); values.push(updates.isAgreementPrice ? 1 : 0); }
      if (updates.isFree !== undefined) { fields.push('is_free = ?'); values.push(updates.isFree ? 1 : 0); }
      if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
      if (updates.isUrgent !== undefined) { fields.push('is_immediate = ?'); values.push(updates.isUrgent ? 1 : 0); }
      if (updates.departmentLocation !== undefined) { fields.push('department_location = ?'); values.push(updates.departmentLocation); }
      if (updates.images !== undefined) { fields.push('images_json = ?'); values.push(JSON.stringify(updates.images)); }
      if (updates.viewsCount !== undefined) { fields.push('views_count = ?'); values.push(updates.viewsCount); }

      if (fields.length > 0) {
        values.push(id);
        await pool.query(`UPDATE ads SET ${fields.join(', ')} WHERE id = ?`, values);
      }

      if (updates.customFields && typeof updates.customFields === 'object') {
        await pool.query('DELETE FROM ad_custom_values WHERE ad_id = ?', [id]);
        for (const [key, val] of Object.entries(updates.customFields)) {
          if (val !== undefined && val !== null && val !== '') {
            await pool.query(
              'INSERT INTO ad_custom_values (ad_id, field_name, field_value) VALUES (?, ?, ?)',
              [id, key, String(val)]
            );
          }
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Delete Ad in MySQL
  app.delete('/api/ads/:id', async (req, res) => {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM ads WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Save Category in MySQL
  app.post('/api/categories', async (req, res) => {
    try {
      const pool = getDbPool();
      const c = req.body;
      await pool.query(
        `INSERT INTO categories (id, title, slug, icon, description, manager_id, manager_name, manager_department, auto_approve, default_image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), slug = VALUES(slug), icon = VALUES(icon), description = VALUES(description),
         manager_id = VALUES(manager_id), manager_name = VALUES(manager_name), manager_department = VALUES(manager_department),
         auto_approve = VALUES(auto_approve), default_image = VALUES(default_image)`,
        [
          c.id,
          c.title,
          c.slug || c.id,
          c.icon || 'Tag',
          c.description || '',
          c.managerId || null,
          c.managerName || '',
          c.managerDepartment || '',
          c.allowAutoApprove ? 1 : 0,
          c.defaultImage || '',
        ]
      );

      if (Array.isArray(c.fields)) {
        await pool.query('DELETE FROM category_fields WHERE category_id = ?', [c.id]);
        for (const f of c.fields) {
          await pool.query(
            `INSERT INTO category_fields (id, category_id, name, label, type, required, options_json, unit, placeholder)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              f.id,
              c.id,
              f.name,
              f.label,
              f.type || 'text',
              f.required ? 1 : 0,
              JSON.stringify(f.options || []),
              f.unit || '',
              f.placeholder || '',
            ]
          );
        }
      }

      res.json({ success: true, category: c });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Delete Category in MySQL
  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const pool = getDbPool();
      await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Insert Audit Log in MySQL
  app.post('/api/audit-logs', async (req, res) => {
    try {
      const pool = getDbPool();
      const l = req.body;
      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_name, action, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [l.id, l.userId || null, l.userName || '', l.action || 'CONFIG_CHANGE', l.details || '', l.ipAddress || '127.0.0.1']
      );
      res.json({ success: true });
    } catch {
      res.json({ success: false });
    }
  });

  // Serve frontend in production or Vite in dev
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files both at /divar and at root /
    app.use('/divar', express.static(path.resolve(__dirname, 'dist')));
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get(['/divar', '/divar/*', '*'], (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
