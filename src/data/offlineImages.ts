/**
 * Self-Contained Offline Vector Images (SVG Data URIs)
 * Designed for 100% offline air-gapped intranet operation with zero internet dependency.
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim().replace(/\s+/g, ' '))}`;
}

// 1. Vehicles & Fleet (وسایل نقلیه و خودرو)
export const OFFLINE_IMG_VEHICLE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_veh" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="car_body" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_veh)"/>
  <circle cx="400" cy="250" r="180" fill="#3b82f6" opacity="0.1"/>
  <!-- Road Grid -->
  <line x1="100" y1="380" x2="700" y2="380" stroke="#334155" stroke-width="4"/>
  <line x1="160" y1="380" x2="240" y2="380" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
  <line x1="360" y1="380" x2="440" y2="380" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
  <line x1="560" y1="380" x2="640" y2="380" stroke="#60a5fa" stroke-width="6" stroke-linecap="round"/>
  <!-- Car Silhouette -->
  <g transform="translate(160, 160)">
    <path d="M40,150 Q100,150 140,110 L200,60 Q240,40 320,40 L350,40 Q400,40 440,90 L460,150 Z" fill="url(#car_body)"/>
    <!-- Windows -->
    <path d="M190,65 L145,105 L240,105 L240,65 Z" fill="#e0f2fe" opacity="0.85"/>
    <path d="M260,65 L260,105 L350,105 L330,65 Z" fill="#e0f2fe" opacity="0.85"/>
    <!-- Headlight & Tail light -->
    <path d="M455,115 L465,125 L450,135 Z" fill="#fef08a"/>
    <path d="M40,115 L32,125 L40,135 Z" fill="#ef4444"/>
    <!-- Wheels -->
    <circle cx="120" cy="155" r="42" fill="#0f172a" stroke="#64748b" stroke-width="8"/>
    <circle cx="120" cy="155" r="20" fill="#94a3b8"/>
    <circle cx="370" cy="155" r="42" fill="#0f172a" stroke="#64748b" stroke-width="8"/>
    <circle cx="370" cy="155" r="20" fill="#94a3b8"/>
  </g>
  <text x="400" y="440" fill="#93c5fd" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">وسایل نقلیه و ترابری سازمانی</text>
</svg>
`);

// 2. Real Estate & Office Locations (املاک و مستغلات اداری)
export const OFFLINE_IMG_REAL_ESTATE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_re" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_re)"/>
  <!-- Buildings -->
  <g transform="translate(180, 80)">
    <!-- Back towers -->
    <rect x="40" y="80" width="100" height="280" rx="4" fill="#047857" opacity="0.5"/>
    <rect x="300" y="50" width="110" height="310" rx="4" fill="#047857" opacity="0.5"/>
    <!-- Center Main Tower -->
    <rect x="130" y="20" width="180" height="340" rx="8" fill="#10b981" stroke="#34d399" stroke-width="3"/>
    <!-- Windows Matrix -->
    <g fill="#ecfdf5" opacity="0.8">
      <rect x="155" y="50" width="25" height="20" rx="2"/><rect x="195" y="50" width="25" height="20" rx="2"/><rect x="235" y="50" width="25" height="20" rx="2"/>
      <rect x="155" y="90" width="25" height="20" rx="2"/><rect x="195" y="90" width="25" height="20" rx="2"/><rect x="235" y="90" width="25" height="20" rx="2"/>
      <rect x="155" y="130" width="25" height="20" rx="2"/><rect x="195" y="130" width="25" height="20" rx="2"/><rect x="235" y="130" width="25" height="20" rx="2"/>
      <rect x="155" y="170" width="25" height="20" rx="2"/><rect x="195" y="170" width="25" height="20" rx="2"/><rect x="235" y="170" width="25" height="20" rx="2"/>
      <rect x="155" y="210" width="25" height="20" rx="2"/><rect x="195" y="210" width="25" height="20" rx="2"/><rect x="235" y="210" width="25" height="20" rx="2"/>
      <rect x="155" y="250" width="25" height="20" rx="2"/><rect x="195" y="250" width="25" height="20" rx="2"/><rect x="235" y="250" width="25" height="20" rx="2"/>
      <!-- Entrance Door -->
      <rect x="190" y="310" width="60" height="50" rx="4" fill="#064e3b"/>
    </g>
  </g>
  <text x="400" y="450" fill="#a7f3d0" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">املاک، مستغلات و فضاهای اداری</text>
</svg>
`);

// 3. Digital & IT Equipment (کالای دیجیتال و IT)
export const OFFLINE_IMG_DIGITAL = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_it" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#311042"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_it)"/>
  <!-- Laptop Vector -->
  <g transform="translate(200, 110)">
    <!-- Screen -->
    <rect x="50" y="20" width="300" height="190" rx="12" fill="#1e1b4b" stroke="#818cf8" stroke-width="4"/>
    <rect x="65" y="35" width="270" height="160" rx="4" fill="#0f172a"/>
    <!-- Code / Dashboard Graphics -->
    <rect x="80" y="55" width="110" height="10" rx="3" fill="#38bdf8"/>
    <rect x="80" y="75" width="160" height="8" rx="3" fill="#c084fc"/>
    <rect x="80" y="93" width="90" height="8" rx="3" fill="#4ade80"/>
    <rect x="80" y="111" width="130" height="8" rx="3" fill="#cbd5e1"/>
    <!-- Mini charts -->
    <circle cx="280" cy="110" r="30" fill="none" stroke="#a855f7" stroke-width="8" stroke-dasharray="120 40"/>
    <!-- Keyboard Base -->
    <path d="M10,210 L390,210 L410,235 L0,235 Z" fill="#334155"/>
    <rect x="150" y="215" width="100" height="12" rx="4" fill="#64748b"/>
  </g>
  <text x="400" y="420" fill="#e9d5ff" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">کالای دیجیتال، IT و تجهیزات شبکه</text>
</svg>
`);

// 4. Office Equipment & Furniture (لوازم و مبلمان اداری)
export const OFFLINE_IMG_OFFICE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_off" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_off)"/>
  <!-- Ergonomic Chair -->
  <g transform="translate(320, 90)">
    <!-- Backrest -->
    <rect x="40" y="30" width="80" height="110" rx="16" fill="#f59e0b"/>
    <rect x="55" y="45" width="50" height="80" rx="8" fill="#d97706"/>
    <!-- Seat -->
    <rect x="25" y="145" width="110" height="30" rx="10" fill="#f59e0b"/>
    <!-- Armrests -->
    <path d="M20,110 L20,150" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    <path d="M140,110 L140,150" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
    <!-- Piston & Star Base -->
    <rect x="74" y="175" width="12" height="60" fill="#94a3b8"/>
    <line x1="20" y1="250" x2="140" y2="250" stroke="#475569" stroke-width="10" stroke-linecap="round"/>
    <circle cx="25" cy="260" r="10" fill="#0f172a"/>
    <circle cx="80" cy="260" r="10" fill="#0f172a"/>
    <circle cx="135" cy="260" r="10" fill="#0f172a"/>
  </g>
  <text x="400" y="420" fill="#fde68a" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">لوازم و مبلمان اداری ارگونومیک</text>
</svg>
`);

// 5. Corporate Services & Logistics (خدمات سازمانی و ترابری)
export const OFFLINE_IMG_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_srv" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_srv)"/>
  <g transform="translate(280, 100)">
    <!-- Handshake / Gear Icon -->
    <circle cx="120" cy="120" r="90" fill="#059669" opacity="0.3"/>
    <circle cx="120" cy="120" r="65" fill="#10b981" stroke="#6ee7b7" stroke-width="6"/>
    <!-- Inner Checkmark & Shield -->
    <path d="M95,120 L115,140 L150,100" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="400" y="410" fill="#bbf7d0" font-size="22" font-family="sans-serif" font-weight="bold" text-anchor="middle">خدمات، آموزش و ترابری سازمانی</text>
</svg>
`);

// 6. Generic Default Fallback Image
export const OFFLINE_IMG_DEFAULT = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg_def" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg_def)"/>
  <rect x="250" y="110" width="300" height="200" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
  <circle cx="340" cy="180" r="30" fill="#e2e8f0" opacity="0.6"/>
  <polygon points="270,290 380,200 450,260 530,180 530,290" fill="#0284c7" opacity="0.7"/>
  <text x="400" y="380" fill="#cbd5e1" font-size="20" font-family="sans-serif" font-weight="bold" text-anchor="middle">تصویر آگهی سازمانی</text>
</svg>
`);

// Preset Library for Quick Selection in Post Ad Modal and Admin Panel
export const OFFLINE_PRESET_IMAGES = [
  { label: 'خودرو و وسایل نقلیه سازمانی', categoryTag: 'وسایل نقلیه', url: OFFLINE_IMG_VEHICLE },
  { label: 'املاک، دفاتر و سالن جلسات', categoryTag: 'املاک', url: OFFLINE_IMG_REAL_ESTATE },
  { label: 'لپ‌تاپ و تجهیزات IT', categoryTag: 'دیجیتال', url: OFFLINE_IMG_DIGITAL },
  { label: 'مبلمان و تجهیزات اداری', categoryTag: 'اداری', url: OFFLINE_IMG_OFFICE },
  { label: 'خدمات، ترابری و آموزش', categoryTag: 'خدمات', url: OFFLINE_IMG_SERVICES },
  { label: 'نشان سازمانی عمومی', categoryTag: 'عمومی', url: OFFLINE_IMG_DEFAULT },
];
