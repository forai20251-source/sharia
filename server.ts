import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Real MySQL Test Connection endpoint
  app.post('/api/mysql/test', async (req, res) => {
    const config = {
      host: req.body.host || process.env.DB_HOST || '127.0.0.1',
      port: Number(req.body.port || process.env.DB_PORT || 3306),
      database: req.body.database || process.env.DB_NAME || 'divar_org',
      user: req.body.user || process.env.DB_USER || 'root',
      password: req.body.password !== undefined && req.body.password !== ''
        ? req.body.password
        : (process.env.DB_PASSWORD || ''),
      connectTimeout: 4000,
    };

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
    const config = {
      host: req.body.host || process.env.DB_HOST || '127.0.0.1',
      port: Number(req.body.port || process.env.DB_PORT || 3306),
      database: req.body.database || process.env.DB_NAME || 'divar_org',
      user: req.body.user || process.env.DB_USER || 'root',
      password: req.body.password !== undefined && req.body.password !== ''
        ? req.body.password
        : (process.env.DB_PASSWORD || ''),
    };

    try {
      const serverConn = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        multipleStatements: true,
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
      return res.status(500).json({
        success: false,
        message: `خطا در ایجاد جداول: ${err.message}`,
      });
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
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
