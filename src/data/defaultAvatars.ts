/**
 * Preset Default Profile Avatars - Faceless Male Vector Icons
 * "تصاویر پیش فرض پروفایل بدون چهره، فقط مرد در انواع سبک‌های آیکونی"
 * High quality vector SVG data URIs, completely faceless (no eyes/mouth),
 * masculine business/casual silhouettes with diverse color palettes and styles.
 */

function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const MALE_FACELESS_AVATARS: { id: string; label: string; url: string }[] = [
  // 1. Corporate Executive (Navy & Crimson Tie)
  {
    id: 'male-exec-navy',
    label: 'مدیر ارشد سازمانی',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="suit1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg1)"/>
  <!-- Broad Male Shoulders & Suit -->
  <path d="M12 120 C14 96 30 84 46 82 L74 82 C90 84 106 96 108 120 Z" fill="url(#suit1)"/>
  <!-- White Shirt Collar -->
  <polygon points="60,82 46,72 52,94 60,98 68,94 74,72" fill="#f8fafc"/>
  <!-- Red Corporate Tie -->
  <polygon points="57,84 63,84 65,108 60,118 55,108" fill="#e11d48"/>
  <polygon points="56,82 64,82 62,88 58,88" fill="#be123c"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#f1c27d"/>
  <!-- Faceless Head Silhouette -->
  <ellipse cx="60" cy="48" rx="17" ry="21" fill="#f1c27d"/>
  <!-- Neat Male Short Hair -->
  <path d="M41 46 C41 30 48 20 60 20 C72 20 79 30 79 46 C79 47 77 38 74 36 C70 33 64 34 60 32 C55 34 49 33 46 36 C43 38 41 47 41 46 Z" fill="#1e293b"/>
  <path d="M41 44 C42 40 44 32 49 28 C54 24 67 23 72 28 C76 32 78 40 79 44 C76 41 73 39 69 40 C63 41 57 37 51 40 C47 41 44 42 41 44 Z" fill="#0f172a"/>
</svg>`),
  },

  // 2. Business Professional (Royal Indigo & Lapel Suit)
  {
    id: 'male-business-indigo',
    label: 'کارشناس رسمی سرمه‌ای',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg2)"/>
  <!-- Shoulders & Coat -->
  <path d="M14 120 C18 96 32 85 48 83 L72 83 C88 85 102 96 106 120 Z" fill="#4338ca"/>
  <!-- Light Blue Shirt -->
  <polygon points="60,82 48,72 54,92 60,96 66,92 72,72" fill="#e0e7ff"/>
  <!-- Blue Tie -->
  <polygon points="58,84 62,84 64,106 60,116 56,106" fill="#1e1b4b"/>
  <!-- Lapels -->
  <path d="M48 83 L36 120 L48 120 L56 94 Z" fill="#3730a3"/>
  <path d="M72 83 L84 120 L72 120 L64 94 Z" fill="#3730a3"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#e0a96d"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16.5" ry="21" fill="#e0a96d"/>
  <!-- Side-parted Male Hair -->
  <path d="M42 45 C41 28 50 19 62 19 C73 19 79 27 79 45 C78 39 74 34 70 33 C64 32 58 35 52 31 C47 34 44 38 42 45 Z" fill="#27272a"/>
  <!-- Sideburns -->
  <path d="M42 43 L44 50 L46 47 Z" fill="#27272a"/>
  <path d="M78 43 L76 50 L74 47 Z" fill="#27272a"/>
</svg>`),
  },

  // 3. Tech & IT Specialist (Emerald & Modern Polo)
  {
    id: 'male-tech-emerald',
    label: 'متخصص فناوری اطلاعات',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg3)"/>
  <!-- Shoulders with Emerald Polo Shirt -->
  <path d="M14 120 C16 98 32 84 48 83 L72 83 C88 84 104 98 106 120 Z" fill="#059669"/>
  <!-- Polo Collar -->
  <path d="M48 82 L58 92 L60 86 L62 92 L72 82 L67 76 L60 80 L53 76 Z" fill="#10b981"/>
  <line x1="60" y1="86" x2="60" y2="104" stroke="#047857" stroke-width="2"/>
  <circle cx="60" cy="94" r="1.5" fill="#ecfdf5"/>
  <circle cx="60" cy="100" r="1.5" fill="#ecfdf5"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#f5d0a9"/>
  <!-- Faceless Head Silhouette -->
  <ellipse cx="60" cy="48" rx="16" ry="20" fill="#f5d0a9"/>
  <!-- Modern Spiky/Fade Male Haircut -->
  <path d="M42 44 C41 29 48 18 60 18 C71 18 78 28 78 44 C75 36 69 32 60 32 C51 32 45 36 42 44 Z" fill="#18181b"/>
  <path d="M52 18 L55 14 L60 17 L65 13 L68 18 Z" fill="#18181b"/>
</svg>`),
  },

  // 4. Modern Slate Minimalist Male
  {
    id: 'male-minimal-slate',
    label: 'کارشناس رسمی تیتانیوم',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg4)"/>
  <!-- Shoulders Dark Charcoal Jacket -->
  <path d="M12 120 C16 97 30 85 48 83 L72 83 C90 85 104 97 108 120 Z" fill="#0f172a"/>
  <!-- Inner Sweater / Crew Neck -->
  <path d="M48 83 Q60 98 72 83 Z" fill="#334155"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#f3c59a"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16.5" ry="21" fill="#f3c59a"/>
  <!-- Classic Tapered Male Haircut -->
  <path d="M41 45 C41 27 50 20 60 20 C70 20 79 27 79 45 C77 39 72 35 60 35 C48 35 43 39 41 45 Z" fill="#3f3f46"/>
</svg>`),
  },

  // 5. Senior Director (Crimson & Formal Suit)
  {
    id: 'male-director-crimson',
    label: 'مدیر دپارتمان زرشکی',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg5)"/>
  <!-- Dark Suit -->
  <path d="M14 120 C18 96 32 84 48 83 L72 83 C88 84 102 96 106 120 Z" fill="#18181b"/>
  <!-- White Collar -->
  <polygon points="60,82 48,73 54,93 60,97 66,93 72,73" fill="#ffffff"/>
  <!-- Gold/Amber Tie -->
  <polygon points="58,84 62,84 64,106 60,116 56,106" fill="#f59e0b"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#deb887"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16.5" ry="20.5" fill="#deb887"/>
  <!-- Salt & Pepper / Distinguished Executive Hair -->
  <path d="M41 45 C41 28 50 20 60 20 C70 20 79 28 79 45 C76 38 70 33 60 34 C50 33 44 38 41 45 Z" fill="#52525b"/>
  <path d="M44 38 C49 34 56 35 60 35 C64 35 71 34 76 38 C74 32 68 28 60 28 C52 28 46 32 44 38 Z" fill="#71717a"/>
</svg>`),
  },

  // 6. Cyan Tech Lead (Modern Startup / Agile Vibe)
  {
    id: 'male-lead-cyan',
    label: 'سرپرست تیم مهندسی',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e7490"/>
      <stop offset="100%" stop-color="#155e75"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg6)"/>
  <!-- Modern Hoodie / Bomber Jacket -->
  <path d="M14 120 C18 97 32 84 48 83 L72 83 C88 84 102 97 106 120 Z" fill="#0369a1"/>
  <!-- Zipper & Inner Shirt -->
  <path d="M48 83 Q60 96 72 83 Z" fill="#0284c7"/>
  <line x1="60" y1="89" x2="60" y2="120" stroke="#bae6fd" stroke-width="2"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#eed2b2"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16" ry="20" fill="#eed2b2"/>
  <!-- Textured Modern Crop Hair -->
  <path d="M42 45 C41 29 49 19 60 19 C71 19 78 29 78 45 C75 38 69 33 60 33 C51 33 45 38 42 45 Z" fill="#1c1917"/>
  <circle cx="50" cy="24" r="3" fill="#1c1917"/>
  <circle cx="58" cy="22" r="3.5" fill="#1c1917"/>
  <circle cx="66" cy="23" r="3" fill="#1c1917"/>
</svg>`),
  },

  // 7. Security & Operations (Dark Cobalt & Badge Silhouette)
  {
    id: 'male-ops-cobalt',
    label: 'کارشناس نظارت و حراست',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg7)"/>
  <!-- Uniform / Structured Shirt -->
  <path d="M12 120 C16 96 32 84 48 82 L72 82 C88 84 104 96 108 120 Z" fill="#1e40af"/>
  <!-- Epaulettes & Collar -->
  <polygon points="60,82 48,74 54,92 60,96 66,92 72,74" fill="#3b82f6"/>
  <polygon points="57,84 63,84 64,104 60,112 56,104" fill="#1d4ed8"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#e7bc91"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16.5" ry="21" fill="#e7bc91"/>
  <!-- Military / Buzz Cut Sharp Male Hair -->
  <path d="M43 45 C43 30 50 21 60 21 C70 21 77 30 77 45 C75 39 71 35 60 35 C49 35 45 39 43 45 Z" fill="#292524"/>
</svg>`),
  },

  // 8. Finance & Commerce (Amber / Charcoal Classic)
  {
    id: 'male-finance-amber',
    label: 'کارشناس مالی و حسابداری',
    url: createSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg8)"/>
  <!-- Formal Charcoal Suit -->
  <path d="M14 120 C18 96 32 84 48 82 L72 82 C88 84 102 96 106 120 Z" fill="#27272a"/>
  <!-- White Crisp Collar -->
  <polygon points="60,82 48,72 54,92 60,96 66,92 72,72" fill="#fafafa"/>
  <!-- Gold Striped Tie -->
  <polygon points="57,84 63,84 65,108 60,118 55,108" fill="#d97706"/>
  <line x1="56" y1="92" x2="64" y2="90" stroke="#fef3c7" stroke-width="1.5"/>
  <line x1="57" y1="100" x2="63" y2="98" stroke="#fef3c7" stroke-width="1.5"/>
  <!-- Neck -->
  <rect x="52" y="60" width="16" height="18" rx="4" fill="#dfad7a"/>
  <!-- Faceless Head -->
  <ellipse cx="60" cy="48" rx="16" ry="20.5" fill="#dfad7a"/>
  <!-- Neat Parted Male Hair -->
  <path d="M42 44 C41 28 50 19 62 19 C73 19 78 28 78 44 C76 38 71 33 62 33 C53 33 45 37 42 44 Z" fill="#1c1917"/>
</svg>`),
  },
];

export const DEFAULT_MALE_AVATAR = MALE_FACELESS_AVATARS[0].url;
