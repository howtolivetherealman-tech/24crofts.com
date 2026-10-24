# 24crofts.com — Hostinger Hosting Deployment Guide (తెలుగు & English)

ఈ ప్రాజెక్ట్ **Hostinger (Web / Cloud / Node.js / VPS Hosting)** లో `24crofts.com` డొమైన్‌తో నేరుగా అప్‌లోడ్ చేయడానికి పూర్తిగా సిద్ధం చేయబడింది.

---

## 1. ప్రాజెక్ట్‌లో సిద్ధంగా ఉన్న ముఖ్యమైన ఫైల్స్ (Included Production Files)

1. **`server.js`** — Hostinger Node.js Startup File (hPanel లో `Application startup file` గా ఇవ్వడానికి).
2. **`package.json`** — `npm run build` మరియు `npm run start` స్క్రిప్ట్‌లతో పూర్తి డిపెండెన్సీలు.
3. **`next.config.ts`** — `output: 'standalone'` మరియు ఇమేజ్ ఆప్టిమైజేషన్ కాన్ఫిగరేషన్.
4. **`public/.htaccess`** — Hostinger LiteSpeed / Apache సర్వర్ కోసం HTTPS రీడైరెక్ట్, సెక్యూరిటీ హెడర్లు & క్యాషింగ్.
5. **`public/ads.txt`** — Google AdSense ఆమోదం కోసం `https://24crofts.com/ads.txt` ఫైల్.
6. **`public/robots.txt` & `app/sitemap.ts`** — Google Search Console SEO కోసం Sitemap (`https://24crofts.com/sitemap.xml`).
7. **`data/24crofts-db.json` (ఆటోమేటిక్ డేటాబేస్ ఫైల్)** — కొత్తగా రిజిస్టర్ అయ్యే ప్రొఫైల్స్, ప్రొడక్షన్ హౌస్ ఆమోదాలు, యాడ్స్ మరియు అడ్మిన్ మార్పులు సర్వర్ రీస్టార్ట్ అయినా పోకుండా డిస్క్‌లో భద్రపరచబడతాయి.

---

## 2. Hostinger లో అప్‌లోడ్ చేసే విధానం (Step-by-Step Upload Instructions)

### విధానం A: Hostinger hPanel (Node.js Web App / Cloud Hosting)
1. **ZIP డౌన్‌లోడ్**: AI Studio లోని **Download / Export ZIP** ఆప్షన్ ద్వారా ప్రాజెక్ట్ మొత్తాన్ని మీ కంప్యూటర్‌లోకి డౌన్‌లోడ్ చేసుకోండి.
2. **Hostinger hPanel ఓపెన్ చేయండి**:
   - `Websites` → `24crofts.com` → **File Manager** లోకి వెళ్లి `public_html` ఫోల్డర్‌లో ZIP ఫైల్‌ను అప్‌లోడ్ చేసి **Extract** చేయండి (లేదా GitHub రిపోజిటరీ ద్వారా కనెక్ట్ చేయండి).
3. **Node.js సెట్టింగ్స్**:
   - hPanel లో `Advanced` → **Node.js** పై క్లిక్ చేయండి.
   - **Node.js Version**: `20.x` లేదా `22.x` ఎంచుకోండి.
   - **Application Mode**: `Production`
   - **Application Startup File**: `server.js`
   - **Environment Variables** లో `.env.example` లో ఉన్న విధంగా `TWENTYFOUR_CROFTS_ENCRYPTION_SECRET` సెట్ చేయండి.
4. **NPM Install & Build**:
   - `NPM Install` బటన్ నొక్కండి, ఆపై `Run Script` లో `build` రన్ చేసి, **Restart App** క్లిక్ చేయండి.

### విధానం B: Hostinger VPS / Cloud SSH
```bash
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

---

## 3. అడ్మిన్ లాగిన్ వివరాలు (Website Admin Credentials)
- **URL**: `https://24crofts.com` → **లాగిన్ / ఖాతా** → **3. అడ్మిన్ లాగిన్**
- **Admin User ID**: `Admin`
- **Admin Password**: `Bchakriraju1992@`
*(లాగిన్ పేజీలో భద్రత కోసం ఈ వివరాలు ఎక్కడా కనిపించవు)*
