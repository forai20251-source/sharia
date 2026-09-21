export const MYSQL_SCHEMA_SQL = `-- ====================================================================
-- سامانه مدیریت آگهی‌های سازمانی (دیوار سازمانی)
-- Database DDL Schema for MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 / Collation: utf8mb4_persian_ci
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`divar_enterprise_db\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_persian_ci;

USE \`divar_enterprise_db\`;

-- 1. جدول کاربران سازمانی و نگاشت اکتیو دایرکتوری (Active Directory Users)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`username\` VARCHAR(128) NOT NULL UNIQUE COMMENT 'CORP\\\\sAMAccountName or UPN',
  \`display_name\` VARCHAR(191) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`department\` VARCHAR(191) NULL,
  \`internal_phone\` VARCHAR(32) NULL,
  \`mobile_phone\` VARCHAR(32) NULL,
  \`role\` ENUM('SUPER_ADMIN', 'CATEGORY_MANAGER', 'USER') DEFAULT 'USER',
  \`ad_guid\` VARCHAR(64) NULL COMMENT 'Active Directory ObjectGUID',
  \`ad_distinguished_name\` TEXT NULL,
  \`ad_groups_json\` JSON NULL COMMENT 'List of AD Security Groups',
  \`avatar_url\` TEXT NULL,
  \`status\` ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  \`last_login_at\` DATETIME NULL,
  \`last_login_shamsi\` VARCHAR(64) NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_username\` (\`username\`),
  INDEX \`idx_role\` (\`role\`),
  INDEX \`idx_department\` (\`department\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 2. جدول دسته‌بندی‌ها با انتساب مدیر اختصاصی هر دسته (Categories & Managers)
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`title\` VARCHAR(191) NOT NULL,
  \`slug\` VARCHAR(128) NOT NULL UNIQUE,
  \`icon\` VARCHAR(64) NOT NULL DEFAULT 'Tag',
  \`description\` TEXT NULL,
  \`color\` VARCHAR(64) DEFAULT 'from-blue-500 to-indigo-600',
  \`manager_id\` VARCHAR(64) NULL COMMENT 'FK to users.id',
  \`allow_auto_approve\` TINYINT(1) DEFAULT 0 COMMENT '0: Requires Moderator review, 1: Auto-published',
  \`default_image\` VARCHAR(500) NULL COMMENT 'تصویر پیش‌فرض دسته‌بندی',
  \`order_num\` INT DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_category_manager\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 3. جدول فیلدهای پویا و ویژگی‌های اختصاصی هر دسته (Dynamic Category Fields)
CREATE TABLE IF NOT EXISTS \`category_fields\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`category_id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(64) NOT NULL COMMENT 'Key used in JSON and filters e.g. mileage, rooms',
  \`label\` VARCHAR(191) NOT NULL COMMENT 'Persian display label',
  \`type\` ENUM('text', 'number', 'select', 'boolean', 'date', 'price') NOT NULL DEFAULT 'text',
  \`options_json\` JSON NULL COMMENT 'Dropdown options for select type',
  \`required\` TINYINT(1) DEFAULT 0,
  \`unit\` VARCHAR(32) NULL COMMENT 'Unit like km, sq-meter, months',
  \`placeholder\` VARCHAR(191) NULL,
  \`show_in_card\` TINYINT(1) DEFAULT 0 COMMENT 'Show badge on listing card',
  \`order_num\` INT DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_field_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_category_order\` (\`category_id\`, \`order_num\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 4. جدول آگهی‌ها (Classified Ads)
CREATE TABLE IF NOT EXISTS \`ads\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` MEDIUMTEXT NOT NULL,
  \`category_id\` VARCHAR(64) NOT NULL,
  \`price\` BIGINT UNSIGNED DEFAULT 0 COMMENT 'In Toman, 0 if free or agreement',
  \`is_agreement_price\` TINYINT(1) DEFAULT 0,
  \`is_free\` TINYINT(1) DEFAULT 0,
  \`is_urgent\` TINYINT(1) DEFAULT 0,
  \`city\` VARCHAR(100) DEFAULT 'تهران',
  \`department_location\` VARCHAR(191) NULL COMMENT 'Internal location e.g. ساختمان مرکزی، طبقه ۴',
  \`author_id\` VARCHAR(64) NOT NULL,
  \`author_phone\` VARCHAR(64) NULL,
  \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED') DEFAULT 'PENDING',
  \`rejection_reason\` TEXT NULL,
  \`reviewed_by\` VARCHAR(64) NULL,
  \`reviewed_at\` DATETIME NULL,
  \`views_count\` INT UNSIGNED DEFAULT 0,
  \`contact_views_count\` INT UNSIGNED DEFAULT 0,
  \`created_at_shamsi\` VARCHAR(32) NOT NULL,
  \`expiry_date_shamsi\` VARCHAR(32) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_ad_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT,
  CONSTRAINT \`fk_ad_author\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_ad_status\` (\`status\`),
  INDEX \`idx_ad_category\` (\`category_id\`),
  INDEX \`idx_ad_author\` (\`author_id\`),
  INDEX \`idx_created_at\` (\`created_at\`),
  FULLTEXT KEY \`ft_ad_search\` (\`title\`, \`description\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 5. جدول مقادیر فیلدهای پویا برای هر آگهی (EAV / JSON Values)
CREATE TABLE IF NOT EXISTS \`ad_field_values\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`ad_id\` VARCHAR(64) NOT NULL,
  \`field_id\` VARCHAR(64) NOT NULL,
  \`field_name\` VARCHAR(64) NOT NULL,
  \`value_text\` TEXT NULL,
  \`value_number\` DECIMAL(15,2) NULL,
  \`value_boolean\` TINYINT(1) NULL,
  \`value_date_shamsi\` VARCHAR(32) NULL,
  CONSTRAINT \`fk_value_ad\` FOREIGN KEY (\`ad_id\`) REFERENCES \`ads\`(\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_value_field\` FOREIGN KEY (\`field_id\`) REFERENCES \`category_fields\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_ad_field\` (\`ad_id\`, \`field_name\`),
  INDEX \`idx_field_num\` (\`field_name\`, \`value_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 6. جدول تصاویر آگهی‌ها (Ad Images)
CREATE TABLE IF NOT EXISTS \`ad_images\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`ad_id\` VARCHAR(64) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  \`order_num\` INT DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_image_ad\` FOREIGN KEY (\`ad_id\`) REFERENCES \`ads\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 7. جدول لاگ‌های نظارتی، امنیتی و عملکردی (Audit & Activity Logs)
CREATE TABLE IF NOT EXISTS \`audit_logs\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` VARCHAR(64) NULL,
  \`user_name\` VARCHAR(191) NOT NULL,
  \`action\` VARCHAR(64) NOT NULL COMMENT 'LOGIN_AD, APPROVE_AD, REJECT_AD, CREATE_AD, etc.',
  \`details\` TEXT NULL,
  \`ip_address\` VARCHAR(64) NULL,
  \`timestamp_shamsi\` VARCHAR(64) NOT NULL,
  \`status\` ENUM('SUCCESS', 'FAILED', 'WARNING') DEFAULT 'SUCCESS',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_log_user\` (\`user_id\`),
  INDEX \`idx_log_action\` (\`action\`),
  INDEX \`idx_log_created\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 8. جدول تنظیمات اتصال به اکتیو دایرکتوری (Active Directory LDAP Config)
CREATE TABLE IF NOT EXISTS \`ldap_settings\` (
  \`id\` INT PRIMARY KEY DEFAULT 1,
  \`server_host\` VARCHAR(191) NOT NULL DEFAULT 'ad.company.local',
  \`port\` INT NOT NULL DEFAULT 389,
  \`use_ssl\` TINYINT(1) DEFAULT 0,
  \`base_dn\` VARCHAR(255) NOT NULL DEFAULT 'DC=company,DC=local',
  \`domain_name\` VARCHAR(64) NOT NULL DEFAULT 'CORP',
  \`bind_user_dn\` VARCHAR(255) NULL,
  \`bind_password_enc\` TEXT NULL,
  \`user_filter\` VARCHAR(255) DEFAULT '(&(objectCategory=person)(objectClass=user)(sAMAccountName={username}))',
  \`group_admin_dn\` VARCHAR(255) NULL,
  \`group_manager_dn\` VARCHAR(255) NULL,
  \`auto_create_user\` TINYINT(1) DEFAULT 1,
  \`sync_interval_min\` INT DEFAULT 30,
  \`is_connected\` TINYINT(1) DEFAULT 1,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;
`;

export const NUXT_SERVER_CODE_GUIDE = `
// ====================================================================
// راهنمای راه‌اندازی در سرور محلی با Nuxt 3 (Nitro + MySQL + Active Directory LDAP)
// ====================================================================

// 1. نصب بسته‌ها در پروژه Nuxt 3:
// npm install mysql2 ldapts dotenv jsonwebtoken bcrypt

// 2. تنظیمات فایل server/utils/db.ts برای اتصال به MySQL سرور محلی:
import mysql from 'mysql2/promise';

export const dbPool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'divar_admin',
  password: process.env.MYSQL_PASSWORD || 'secret',
  database: process.env.MYSQL_DATABASE || 'divar_enterprise_db',
  charset: 'utf8mb4_persian_ci',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

// 3. سرویس احراز هویت با Active Directory در server/api/auth/ad-login.post.ts:
import { Client } from 'ldapts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body; // e.g. "CORP\\\\m.ahmadi" or "m.ahmadi"

  const client = new Client({
    url: \`ldap://\${process.env.AD_HOST || 'ad.company.local'}:389\`,
    timeout: 5000,
  });

  try {
    // اتصال و اعتبارسنجی مستقیم با کنترلر دامنه اکتیو دایرکتوری ویندوز
    const upn = username.includes('@') ? username : \`\${username}@company.local\`;
    await client.bind(upn, password);

    // جستجوی ویژگی‌های کاربر از اکتیو دایرکتوری
    const { searchEntries } = await client.search(process.env.AD_BASE_DN || 'DC=company,DC=local', {
      scope: 'sub',
      filter: \`(&(objectCategory=person)(sAMAccountName=\${username}))\`,
      attributes: ['sAMAccountName', 'displayName', 'mail', 'department', 'telephoneNumber', 'memberOf'],
    });

    await client.unbind();
    return { success: true, user: searchEntries[0] };
  } catch (error) {
    return createError({ statusCode: 401, statusMessage: 'احراز هویت اکتیو دایرکتوری ناموفق بود.' });
  }
});
`;
