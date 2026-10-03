import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';
import fs from 'fs';
import path from 'path';

async function generateProposal() {
  const primaryColor = '1E293B'; // Dark Slate
  const accentColor = 'E11D48'; // Rose
  const secondaryColor = '0284C7'; // Blue
  const bgSoft = 'F8FAFC';
  const borderLight = 'CBD5E1';

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'سامانه جامع نیازمندی‌ها و تبادلات درون‌سازمانی (دیوار سازمانی)',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200, before: 100 },
            bidirectional: true,
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'پروپوزال فنی، مستندات معرفی و راهنمای استقرار سازمانی (مخصوص سازمان‌ها و ارگان‌ها)',
                bold: true,
                size: 24,
                color: accentColor,
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'نسخه سند: ۲.۴ (نسخه عملیاتی سازمانی)', bidirectional: true })],
                    shading: { fill: bgSoft, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'هدف استقرار: شبکه داخلی سازمان و اینترانت (shahr.ir/divar)', bidirectional: true })],
                    shading: { fill: bgSoft, type: ShadingType.CLEAR },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'معماری احراز هویت: Active Directory / LDAP ویندوز سرور', bidirectional: true })],
                    shading: { fill: bgSoft, type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'پایگاه داده: MySQL 8.0+ محلی و ایمن', bidirectional: true })],
                    shading: { fill: bgSoft, type: ShadingType.CLEAR },
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // 1. مقدمه و چکیده مدیریتی
          new Paragraph({
            text: '۱. مقدمه و چکیده مدیریتی (Executive Summary)',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'سامانه دیوار سازمانی، یک پلتفرم بومی، امن و اختصاصی جهت ثبت و تبادل آگهی‌ها، خدمات، کالاهای مازاد و نیازمندی‌های پرسنل در سطح شبکه داخلی سازمان‌ها و شهرداری‌ها است. این سیستم با الهام از تجربه کاربری موفق و آشنای «دیوار» طراحی شده تا کارکنان بدون نیاز به آموزش پیچیده، بتوانند به راحتی نیازمندی‌های خود را در محیطی مورد اعتماد و کنترل‌شده به اشتراک بگذارند.',
                size: 22,
              }),
            ],
          }),

          // 2. اهداف و ارزش‌آفرینی
          new Paragraph({
            text: '۲. اهداف و ارزش‌آفرینی برای سازمان',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• ایجاد بستر معتمد و اختصاصی درون‌سازمانی:', bold: true }),
              new TextRun({ text: ' جلوگیری از انتشار نیازمندی‌های کاری یا شخصی در کانال‌های غیررسمی مانند تلگرام و واتساپ.' }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• امنیت و عدم خروج داده‌ها (Data Sovereignty):', bold: true }),
              new TextRun({ text: ' نگهداری ۱۰۰٪ داده‌ها روی سرورهای داخلی سازمان و عدم نیاز به اینترنت خارجی.' }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• تقویت هم‌افزایی و رفاه پرسنل:', bold: true }),
              new TextRun({ text: ' تسهیل خرید و فروش کالاها و خدمات بین همکاران در محیطی امن و شفاف.' }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '• توزیع عادلانه فرصت‌ها:', bold: true }),
              new TextRun({ text: ' اعمال سهمیه‌بندی ماهانه و فاصله زمانی بین ثبت‌ها برای ممانعت از رفتارهای رگباری و نامتعارف.' }),
            ],
          }),

          // 3. قابلیت‌ها و ویژگی‌های کلیدی
          new Paragraph({
            text: '۳. قابلیت‌ها و امکانات برجسته سامانه',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),

          // AD Feature
          new Paragraph({
            text: 'الف) احراز هویت متمرکز با اکتیو دایرکتوری (Active Directory SSO):',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'پرسنل نیاز به ثبت‌نام جدید یا حفظ کردن رمز عبور دیگری ندارند؛ با همان نام کاربری و کلمه عبور ویندوز سازمانی (شبکه دومین) وارد سیستم می‌شوند. اطلاعات پایه نظیر نام و نام خانوادگی، شماره تماس داخلی و بخش سازمانی به صورت خودکار خوانده و همگام‌سازی می‌شود.',
                size: 22,
              }),
            ],
          }),

          // Hidden Admin Feature
          new Paragraph({
            text: 'ب) مخفی‌سازی کامل پنل مدیریت از دید کاربران عادی:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'جهت حفظ امنیت و سادگی رابط کاربری، هیچ دکمه یا لینکی به پنل مدیریت برای کاربران عادی وجود ندارد. مدیران ارشد از طریق میانبرهای امنیتی (Ctrl+Shift+A)، آدرس مستقیم (#admin) یا ورود با حساب ادمین به پرتال نظارتی دسترسی پیدا می‌کنند.',
                size: 22,
              }),
            ],
          }),

          // Quota & Cooldown Feature
          new Paragraph({
            text: 'ج) سیاست‌های سهمیه‌بندی و فاصله زمانی بین دو ثبت متوالی (۱ الی ۱۴ روز):',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'مدیر سامانه می‌تواند به دقت قوانین انتشار آگهی را تنظیم کند: سقف ماهانه آگهی‌ها، سقف آگهی‌های همزمان، سقف نشان فوری و همچنین «فاصله اجباری بین دو ثبت متوالی» از ۱ روز تا ۱۴ روز. کاربر در صورت تلاش برای ارسال زودهنگام با پیامی محترمانه حاوی زمان دقیق باقیمانده به روز و ساعت مواجه می‌شود.',
                size: 22,
              }),
            ],
          }),

          // Categories & Dynamic Fields
          new Paragraph({
            text: 'د) دسته‌بندی‌ها و فیلدهای اختصاصی پویا:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'امکان تعریف نامحدود دسته‌بندی با فیلدهای ویژه (مانند کارکرد خودرو، متراژ ملک، مدل قطعه، وضعیت گارانتی و ...) همراه با قابلیت انتساب مدیر ناظر اختصاصی به ازای هر دسته برای بررسی و تایید آگهی‌ها قبل از انتشار عمومی.',
                size: 22,
              }),
            ],
          }),

          // Audit Logs
          new Paragraph({
            text: 'هـ) ثبت جامع وقایع امنیتی (Audit Logs) و گزارش عملکرد:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'تمام عملیات حساس (ورود، رد یا تایید آگهی، تغییر تنظیمات شبکه، مشاهده اطلاعات تماس) با ثبت IP، نام اقدام‌کننده، زمان دقیق خورشیدی و جزئیات کامل ذخیره شده و در داشبورد مدیریتی قابل مشاهده است.',
                size: 22,
              }),
            ],
          }),

          // 4. معماری فنی
          new Paragraph({
            text: '۴. مشخصات فنی و تکنولوژی‌های مورد استفاده',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'بخش', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'تکنولوژی و فریم‌ورک', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'ویژگی‌ها', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'فرانت‌اند (Frontend)', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'React 19 + TypeScript + Vite 8', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'فوق‌العاده سریع، واکنش‌گرا و مدرن با Tailwind CSS 4', bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'بک‌اند (Backend)', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Node.js + Express', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'پروتکل‌های بومی LDAPjs برای اکتیو دایرکتوری و mysql2', bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'پایگاه داده (Database)', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'MySQL 8.0+ / MariaDB', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'جداول ساخت‌یافته همراه با پشتیبانی از کش کلاینت آفلاین', bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'مسیردهی (Routing)', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ساب‌پت سازمانی /divar', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'سازگار با http://shahr.ir/divar روی Nginx و IIS', bidirectional: true })] }),
                ],
              }),
            ],
          }),

          // 5. نحوه استقرار و راه‌اندازی
          new Paragraph({
            text: '۵. راهنمای گام‌به‌گام نصب و راه‌اندازی روی سرور سازمان',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: 'مرحله ۱: پیش‌نیازهای سرور:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '۱. نصب Node.js نسخه ۱۸ یا بالاتر (LTS)\n' }),
              new TextRun({ text: '۲. پایگاه داده MySQL 8.0+ یا MariaDB فعال در شبکه سازمان\n' }),
              new TextRun({ text: '۳. دسترسی شبکه به Domain Controller اکتیو دایرکتوری روی پورت ۳۸۹ یا ۶۳۶\n' }),
            ],
          }),

          new Paragraph({
            text: 'مرحله ۲: نصب وابستگی‌ها و بیلد سورس‌کد:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'در ریشه پروژه دستورات زیر را اجرا نمایید:\n> npm install\n> npm run build',
                font: 'Courier New',
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            text: 'مرحله ۳: پیکربندی فایل محیطی (.env):',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: 'PORT=3000\nAPP_URL="http://shahr.ir/divar"\nDB_HOST="127.0.0.1"\nDB_PORT=3306\nDB_NAME="divar_org"\nDB_USER="root"\nDB_PASSWORD="your_password"\nAD_HOST="192.168.1.10"\nAD_PORT=389\nAD_DOMAIN="CORP"',
                font: 'Courier New',
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            text: 'مرحله ۴: اجرای دائم سرویس با PM2:',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '> npm install -g pm2\n> pm2 start "node server.ts" --name "divar-app"\n> pm2 startup && pm2 save',
                font: 'Courier New',
                size: 20,
              }),
            ],
          }),

          new Paragraph({
            text: 'مرحله ۵: تنظیم Reverse Proxy در Nginx (نمونه برای shahr.ir/divar):',
            heading: HeadingLevel.HEADING_2,
            bidirectional: true,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'location /divar/ {\n    proxy_pass http://127.0.0.1:3000/;\n    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection \'upgrade\';\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n}',
                font: 'Courier New',
                size: 19,
              }),
            ],
          }),

          // 6. مزایای رقابتی
          new Paragraph({
            text: '۶. جدول مقایسه و مزایای رقابتی این سامانه',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'معیار ارزیابی', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'روش‌های سنتی (گروه تلگرام/بورد)', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'سامانه بومی دیوار سازمانی', bold: true, bidirectional: true })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'امنیت و کنترل دسترسی', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'بسیار ضعیف، خروج اطلاعات از سازمان', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'عالی، احراز هویت متمرکز با اکتیو دایرکتوری ویندوز', bold: true, bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'سهمیه‌بندی و عدالت', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ناممکن، امکان اسپم و پیام رگباری', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'کاملاً خودکار با سهمیه ماهانه و فاصله ۱ تا ۱۴ روز', bold: true, bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'قابلیت جستجو و دسته‌بندی', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'پیچیده و گم شدن پیام‌ها در چت', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'جستجوی هوشمند در برند، متراژ، قیمت و فیلدها', bold: true, bidirectional: true })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'نظارت و مدیریت تخلفات', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'دشوار و زمان‌بر', bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'پنل مدیریت یکپارچه، رد/تایید و گزارشات جامع', bold: true, bidirectional: true })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // خاتمه
          new Paragraph({
            text: '۷. جمع‌بندی و نتیجه‌گیری',
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            bidirectional: true,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'این سامانه یک سرمایه‌گذاری نرم‌افزاری پایدار و امن برای ارتقای رفاه پرسنل، نظم‌بخشی به ارتباطات داخلی و حفظ حریم خصوصی سازمانی محسوب می‌شود. سازگاری کامل با زیرساخت‌های استاندارد دولتی و سازمانی کشور، عملکرد پرسرعت و بومی‌سازی کامل، استقرار آن را با کمترین زمان و بالاترین سطح رضایت تضمین می‌نماید.',
                size: 22,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPathPublic = path.resolve(publicDir, 'divar-proposal.docx');
  const outPathRoot = path.resolve(process.cwd(), 'divar-proposal.docx');
  fs.writeFileSync(outPathPublic, buffer);
  fs.writeFileSync(outPathRoot, buffer);
  console.log(`Word proposal file generated successfully at ${outPathPublic} and ${outPathRoot}`);
}

generateProposal().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
