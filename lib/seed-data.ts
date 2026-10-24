import { INITIAL_CRAFTS_24 } from './crafts-data';
import {
  encryptSensitiveField,
  maskAadhaar,
  maskEmail,
  maskPhone,
} from './security';
import type {
  AdPlacement,
  AppNotification,
  ContactInquiry,
  FilmIndustry,
  HostingCostItem,
  ProductionHouse,
  SiteSettings,
  TalentProfile,
} from './types';

export const ADMIN_DEFAULT_CREDENTIALS = {
  username: 'Admin',
  password: 'Bchakriraju1992@',
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  domain: '24crofts.com',
  siteTitle: '24crofts.com — Cinema 24 Crafts Talent & Production Platform',
  heroKickerTe: 'భారతీయ సినిమా 24 విభాగాల అధికారిక టాలెంట్ & ప్రొడక్షన్ వేదిక',
  heroKickerEn: 'Verified Matrimonial-Style Casting & 24 Crafts Directory',
  heroKickerHi: 'भारतीय सिनेमा के 24 विभागों का सत्यापित कास्टिंग मंच',
  heroHeadlineTe: '24 విభాగాల సినీ ప్రతిభను, ప్రొడక్షన్ హౌస్‌లతో సురక్షితంగా కలిపే వేదిక.',
  heroHeadlineEn: 'Connecting Verified Cinema Talent Across All 24 Crafts With Approved Studios.',
  heroHeadlineHi: 'सिनेमा के सभी 24 विभागों की प्रतिभा को अधिकृत स्टूडियो से जोड़ने वाला सुरक्षित मंच।',
  heroSubheadlineTe:
    'ప్రతి ప్రొఫైల్‌కు ప్రత్యేక ID, ఆధార్ ధృవీకరణ మరియు అడ్మిన్ ఆమోదించిన ప్రొడక్షన్ హౌస్‌లకు మాత్రమే కనిపించే ఎన్‌క్రిప్టెడ్ కాంటాక్ట్ భద్రత.',
  heroSubheadlineEn:
    'Every artist and technician receives a unique shareable ID with AES-256 encrypted contact privacy—unlocked strictly for Admin-approved Production Houses.',
  heroSubheadlineHi:
    'प्रत्येक कलाकार को विशिष्ट ID और एन्क्रिप्टेड संपर्क सुरक्षा — केवल एडमिन द्वारा स्वीकृत प्रोडक्शन हाउस के लिए उपलब्ध।',
  announcementTe:
    'కొత్త రిజిస్ట్రేషన్లు హోమ్ పేజీలో మొదట కనిపిస్తాయి · ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ ఫారం తప్పనిసరి.',
  announcementEn:
    'Daily new registrations appear first on the Home Page · Movie Registration Form mandatory for Production Houses.',
  announcementHi:
    'नए पंजीकरण होम पेज पर सबसे पहले दिखते हैं · प्रोडक्शन हाउस के लिए मूवी रजिस्ट्रेशन फॉर्म अनिवार्य है।',
  contactEmail: '24croftsindia@gmail.com',
  contactPhone: '7989144860',
  contactLocation: 'Hyderabad, India',
  contactAddressFull: 'Plot 24, Road No. 78, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500096, India',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Film+Nagar+Jubilee+Hills+Hyderabad+India&t=&z=14&ie=UTF8&iwloc=&output=embed',
  adsensePublisherId: process.env.NEXT_PUBLIC_DEFAULT_ADSENSE_CLIENT || 'ca-pub-2489144860241992',
  adsenseConsoleUrl: 'https://www.google.com/adsense',
  adsenseAutoAdsEnabled: true,
  adsenseHeaderSlotId: '2400100192',
  adsenseDirectorySlotId: '2400200292',
  paidProfileAnnualFeeInr: 1499,
  productionHouseAnnualFeeInr: 4999,
};

export const HOSTING_COST_ESTIMATES: HostingCostItem[] = [
  {
    component: 'Cloud Application Server (Next.js SSR + API Auto-Scaling)',
    specification: '4 vCPU, 8 GB RAM, Cloud Run / AWS ECS Mumbai Region (ap-south-1) with Load Balancer',
    monthlyInr: 4200,
    annualInr: 50400,
    securityNotes: 'TLS 1.3 HTTPS termination, DDoS shield, isolated VPC subnet',
  },
  {
    component: 'Encrypted Primary Database & Automated Daily Backups',
    specification: 'Managed PostgreSQL / Cloud SQL (100 GB SSD, Point-in-Time Recovery, Multi-AZ)',
    monthlyInr: 3500,
    annualInr: 42000,
    securityNotes: 'AES-256 encryption at rest + field-level AES-256-GCM for Aadhaar & Contact Numbers',
  },
  {
    component: 'Media Object Storage & Global CDN (Up to 25 Photos/Profile + Posters)',
    specification: '500 GB S3/Cloud Storage + Cloudflare/Cloud CDN edge caching for fast mobile loading',
    monthlyInr: 1800,
    annualInr: 21600,
    securityNotes: 'Signed upload URLs, malware/MIME validation, hotlink protection',
  },
  {
    component: 'Domain (24crofts.com), WAF Firewall, OTP & Push Notification Gateway',
    specification: 'Annual .com renewal, OWASP WAF rules, Web Push / FCM mobile alerts',
    monthlyInr: 950,
    annualInr: 11400,
    securityNotes: 'Rate limiting on login & ID lookup, E2EE contact form payloads',
  },
  {
    component: 'iOS App Store & Google Play Store Developer Accounts (Mobile Apps)',
    specification: 'Apple Developer Program ($99/yr) + Google Play Console ($25 one-time) + Capacitor/PWA Wrapper',
    monthlyInr: 850,
    annualInr: 10200,
    securityNotes: 'App Store & Play Store signed builds compatible with iOS & Android devices',
  },
  {
    component: 'Server Maintenance, Security Audits & Admin Technical Support (AMC)',
    specification: '24/7 uptime monitoring, OS security patching, monthly DB audit & backup drills',
    monthlyInr: 4500,
    annualInr: 54000,
    securityNotes: 'Zero-downtime deployments, quarterly penetration & privacy audit',
  },
];

const TELUGU_FIRST_NAMES = [
  'Karthikeya', 'Ananya', 'Raghavendra', 'Keerthana', 'Harshavardhan', 'Sreeleela',
  'Vishwak', 'Meenakshi', 'Siddharth', 'Vaishnavi', 'Nikhil', 'Pranitha',
  'Chaitanya', 'Niharika', 'Adivi', 'Chandini', 'Naveen', 'Samyuktha',
  'Satyadev', 'Ritu', 'Sharwanand', 'Lavanya', 'Sundeep', 'Eesha',
];

const SURNAMES = [
  'Rao', 'Reddy', 'Varma', 'Naidu', 'Goud', 'Sastry', 'Chowdary', 'Krishnan',
  'Menon', 'Iyer', 'Sharma', 'Raju', 'Murthy', 'Kulkarni', 'Nair', 'Prasad',
];

const CITIES: { city: string; state: string; industry: FilmIndustry; langs: string[] }[] = [
  { city: 'Hyderabad', state: 'Telangana', industry: 'Tollywood', langs: ['Telugu (తెలుగు)', 'English', 'Hindi (हिन्दी)'] },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', industry: 'Tollywood', langs: ['Telugu (తెలుగు)', 'English'] },
  { city: 'Chennai', state: 'Tamil Nadu', industry: 'Kollywood', langs: ['Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'English'] },
  { city: 'Mumbai', state: 'Maharashtra', industry: 'Bollywood', langs: ['Hindi (हिन्दी)', 'English', 'Marathi (मराठी)'] },
  { city: 'Kochi', state: 'Kerala', industry: 'Mollywood', langs: ['Malayalam (മലയാളം)', 'Tamil (தமிழ்)', 'English'] },
  { city: 'Bengaluru', state: 'Karnataka', industry: 'Sandalwood', langs: ['Kannada (ಕನ್ನಡ)', 'Telugu (తెలుగు)', 'English'] },
];

const SAMPLE_YOUTUBE_REELS = [
  'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
  'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'https://www.youtube.com/watch?v=ScMzIvxBSi4',
];

export function buildInitialTalentProfiles(): TalentProfile[] {
  const profiles: TalentProfile[] = [];
  let seq = 1001;

  // Base date: 2026-10-23T07:30:00Z
  const baseTimestamp = new Date('2026-10-23T07:30:00.000Z').getTime();

  for (let cIdx = 0; cIdx < INITIAL_CRAFTS_24.length; cIdx++) {
    const craft = INITIAL_CRAFTS_24[cIdx];

    for (let itemIdx = 0; itemIdx < 3; itemIdx++) {
      const idNum = seq++;
      const profileId = `24C-${idNum}`;
      const subCat = craft.subCategories[itemIdx % craft.subCategories.length];
      const loc = CITIES[(cIdx + itemIdx) % CITIES.length];
      const nameIndex = (cIdx * 3 + itemIdx) % TELUGU_FIRST_NAMES.length;
      const isFemale = nameIndex % 2 === 1;
      const cleanFirst = TELUGU_FIRST_NAMES[nameIndex];
      const lastName = SURNAMES[(cIdx + itemIdx * 2) % SURNAMES.length];
      const fullName = `${cleanFirst} ${lastName}`;
      const screenName = `${cleanFirst} ${lastName.charAt(0)}.`;

      const rawPhone = `98480${String(10000 + idNum).slice(-5)}`;
      const rawEmail = `${cleanFirst.toLowerCase()}.${idNum}@24crofts-talent.in`;
      const rawAadhaar = `48926103${String(idNum)}`;
      const rawPass = `Artist@${idNum}`;

      const uploadedToday = itemIdx === 0 && cIdx < 8;
      const isPaid = cIdx % 2 === 0 ? itemIdx !== 2 : itemIdx === 1;

      const createdAt = new Date(
        baseTimestamp - (uploadedToday ? cIdx * 12 * 60_000 : (cIdx * 3 + itemIdx + 10) * 3600_000)
      ).toISOString();

      let primaryPhoto = isFemale
        ? '/images/portrait_actress_lead.jpg'
        : cIdx % 3 === 1
        ? '/images/portrait_cinematographer.jpg'
        : '/images/portrait_actor_lead.jpg';
      if (craft.id === 'cinematography' && !isFemale) {
        primaryPhoto = '/images/portrait_cinematographer.jpg';
      }

      const includeCasting =
        Boolean(craft.isCastingFocused) || craft.id === 'cine-artists' || craft.id === 'junior-artists';

      profiles.push({
        id: profileId,
        username: `${cleanFirst.toLowerCase()}_${idNum}`,
        passwordEncrypted: encryptSensitiveField(rawPass),
        fullName,
        screenName,
        craftId: craft.id,
        subCategoryId: subCat.id,
        industry: loc.industry,
        otherIndustries: ['Pan-India'],
        languagesCount: loc.langs.length,
        languages: loc.langs,
        address: {
          street: `H.No. ${12 + itemIdx}-${40 + cIdx}, Studio Colony`,
          area: loc.city === 'Hyderabad' ? 'Jubilee Hills / Krishna Nagar' : 'Film Studio Zone',
          city: loc.city,
          state: loc.state,
          pinCode: loc.city === 'Hyderabad' ? '500033' : '600026',
          country: 'India',
        },
        aadhaarMasked: maskAadhaar(rawAadhaar),
        aadhaarEncrypted: encryptSensitiveField(rawAadhaar),
        aadhaarDocumentName: `aadhaar_verified_${profileId}.pdf`,
        phoneMasked: maskPhone(rawPhone),
        phoneEncrypted: encryptSensitiveField(rawPhone),
        emailMasked: maskEmail(rawEmail),
        emailEncrypted: encryptSensitiveField(rawEmail),
        bio: `Experienced ${subCat.nameEn} in ${craft.nameEn} (${loc.industry}) with ${3 + ((cIdx + itemIdx) % 9)} years of feature film, OTT, and studio production experience.`,
        experienceYears: 3 + ((cIdx + itemIdx) % 9),
        NotableCredits: `${loc.industry} Feature Productions, Theatrical & OTT Originals`,
        isPaid,
        isVerified: true,
        uploadedToday,
        createdAt,
        updatedAt: createdAt,
        photos: [
          primaryPhoto,
          '/images/cinema_hero_set.jpg',
          '/images/teaser_poster_epic.jpg',
        ],
        youtubeLinks: [
          SAMPLE_YOUTUBE_REELS[itemIdx % SAMPLE_YOUTUBE_REELS.length],
          SAMPLE_YOUTUBE_REELS[(itemIdx + 1) % SAMPLE_YOUTUBE_REELS.length],
        ],
        castingDetails: includeCasting
          ? {
              fullName,
              screenName,
              age: 22 + ((cIdx + itemIdx) % 12),
              city: loc.city,
              height: itemIdx === 1 ? `5'6" (168 cm)` : `5'11" (180 cm)`,
              weight: itemIdx === 1 ? '54 kg' : '74 kg',
              bust: itemIdx === 1 ? '34 in' : '40 in (Chest)',
              waist: itemIdx === 1 ? '27 in' : '31 in',
              hip: itemIdx === 1 ? '36 in' : '37 in',
              skinTone: itemIdx === 1 ? 'Warm Wheatish' : 'Dusky / Olive',
              eyeColour: 'Dark Brown',
              hairColour: 'Natural Black',
              shoeSize: itemIdx === 1 ? 'UK 6' : 'UK 9',
              maritalStatus: 'Unmarried',
              presentProfession: 'Full-Time Film & Theatre Actor',
              education: 'B.F.A. Acting & Performing Arts',
              dressesComfortable: 'Traditional Ethnic, Contemporary Western, Period Drama Costumes',
              openForOutstationShoots: true,
              openForOutOfCountryShoots: true,
              passport: 'Yes',
              experience: `${3 + itemIdx} Years in Feature Films, Commercials & Web Series`,
              comfortableWithAllTimings: true,
              languages: loc.langs,
              interestedIn: [
                '1. Acting',
                '2. Print shoots',
                '3. Ramp shows',
                '4. Designer shoots',
                '5. Ethnic wears',
                '6. Western wears',
                '10. Calendar shoots',
                '11. Music Albums',
              ],
              contact: rawPhone,
              aim: 'To portray memorable, director-driven lead and character roles across Pan-India cinema.',
              comfortableWith: [
                'C) Hug scenes',
                'Indian wears',
                'Western wears',
                'Shorts',
                'Driving scenes',
                'Able to work Indoor & Outdoor',
              ],
              allergiesToDustOrCosmetics: 'None — comfortable with SFX makeup and outdoor dust locations',
              instagramId: `@${cleanFirst.toLowerCase()}_${idNum}_official`,
            }
          : undefined,
        viewsCount: 180 + cIdx * 17 + itemIdx * 43,
        contactUnlocksCount: 4 + (cIdx % 7) + itemIdx * 2,
        shortlistCount: 9 + (cIdx % 11),
        status: 'active',
      });
    }
  }

  return profiles;
}

export function buildInitialProductionHouses(): ProductionHouse[] {
  return [
    {
      id: 'PH-501',
      bannerName: 'Suvarna Chakram Entertainments',
      registrationNumber: 'TFCC-HYD-2024-889',
      producerOrManagerName: 'D. Venkata Subba Rao',
      username: 'suvarna_films',
      passwordEncrypted: encryptSensitiveField('Studio@2026'),
      industry: 'Tollywood',
      languagesCount: 4,
      languages: ['Telugu (తెలుగు)', 'Tamil (தமிழ்)', 'Hindi (हिन्दी)', 'English'],
      address: {
        street: 'Plot 108, Road No. 45',
        area: 'Jubilee Hills, Film Nagar',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500033',
        country: 'India',
      },
      aadhaarMasked: maskAadhaar('671289345512'),
      aadhaarEncrypted: encryptSensitiveField('671289345512'),
      movieRegistrationFormName: 'TFCC_Movie_Registration_ProductionNo4.pdf',
      phone: '9849024501',
      email: 'casting@suvarnachakram.in',
      website: 'https://24crofts.com',
      isApproved: true,
      canViewContacts: true,
      unlockedProfileIds: ['24C-1001', '24C-1007', '24C-1016'],
      createdAt: '2026-10-18T10:00:00.000Z',
    },
    {
      id: 'PH-502',
      bannerName: 'Dakshinaveri Frame Works',
      registrationNumber: 'SIFCC-CHN-2025-314',
      producerOrManagerName: 'Aravindhan Swamy',
      username: 'dakshina_studio',
      passwordEncrypted: encryptSensitiveField('Frame@2026'),
      industry: 'Kollywood',
      languagesCount: 3,
      languages: ['Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'English'],
      address: {
        street: 'No. 19, Arcot Road',
        area: 'Kodambakkam',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pinCode: '600024',
        country: 'India',
      },
      aadhaarMasked: maskAadhaar('782341098823'),
      aadhaarEncrypted: encryptSensitiveField('782341098823'),
      movieRegistrationFormName: 'Chamber_Movie_Title_Registration_2026.pdf',
      phone: '9444188202',
      email: 'office@dakshinaveri.in',
      isApproved: false,
      canViewContacts: false,
      unlockedProfileIds: [],
      createdAt: '2026-10-23T05:15:00.000Z',
    },
  ];
}

export function buildInitialAds(): AdPlacement[] {
  return [
    // 6 Approved Movie Teasers / Songs
    {
      id: 'AD-T1',
      type: 'movie_teaser',
      title: 'Devarakota — Official Theatrical Teaser (4K)',
      subtitle: 'Pan-India Historical Action Drama · Directed by K. Raghavendra',
      bannerOrClientName: 'Suvarna Chakram Entertainments',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/teaser_poster_epic.jpg',
      mediaType: 'youtube',
      priorityOrder: 1,
      status: 'approved',
      submittedBy: 'Suvarna Chakram Entertainments',
      contactPhone: '9849024501',
      impressions: 18420,
      clicks: 2410,
      createdAt: '2026-10-23T06:00:00.000Z',
    },
    {
      id: 'AD-T2',
      type: 'movie_teaser',
      title: 'Nallamala Ratri — First Single Lyrical Song',
      subtitle: 'Composed by M. Harishankar · Sung by Keerthana Iyer',
      bannerOrClientName: 'Godavari Talkies',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/cinema_hero_set.jpg',
      mediaType: 'poster_song',
      priorityOrder: 2,
      status: 'approved',
      submittedBy: 'Godavari Talkies',
      contactPhone: '9848112233',
      impressions: 14200,
      clicks: 1890,
      createdAt: '2026-10-22T18:00:00.000Z',
    },
    {
      id: 'AD-T3',
      type: 'movie_teaser',
      title: 'Soundstage 9 — Mystery Thriller Glimpse',
      subtitle: 'Shot on ARRI Alexa 35 · Releasing Sankranti',
      bannerOrClientName: 'Annapurna Cine Frames',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/portrait_cinematographer.jpg',
      mediaType: 'youtube',
      priorityOrder: 3,
      status: 'approved',
      submittedBy: 'Annapurna Cine Frames',
      contactPhone: '9848223344',
      impressions: 11850,
      clicks: 1320,
      createdAt: '2026-10-22T12:00:00.000Z',
    },
    {
      id: 'AD-T4',
      type: 'movie_teaser',
      title: 'Vennela Theeram — Romantic Musical Promo',
      subtitle: 'Starring Karthikeya & Ananya · Tollywood Musical',
      bannerOrClientName: 'konaseema Creations',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/portrait_actress_lead.jpg',
      mediaType: 'poster_song',
      priorityOrder: 4,
      status: 'approved',
      submittedBy: 'Konaseema Creations',
      contactPhone: '9848334455',
      impressions: 9640,
      clicks: 1105,
      createdAt: '2026-10-21T16:00:00.000Z',
    },
    {
      id: 'AD-T5',
      type: 'movie_teaser',
      title: 'Rudra Veena — Title Announcement Teaser',
      subtitle: 'Dolby Atmos Soundscape Preview · Bilingual Telugu & Tamil',
      bannerOrClientName: 'Chola Mandala Pictures',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/teaser_poster_epic.jpg',
      mediaType: 'youtube',
      priorityOrder: 5,
      status: 'approved',
      submittedBy: 'Chola Mandala Pictures',
      contactPhone: '9848445566',
      impressions: 8910,
      clicks: 940,
      createdAt: '2026-10-21T09:00:00.000Z',
    },
    {
      id: 'AD-T6',
      type: 'movie_teaser',
      title: 'Pranamam — Classical Dance Anthem Video',
      subtitle: 'Choreographed by Master Siddharth · 200+ Dancers',
      bannerOrClientName: 'Navarang Studios',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/portrait_actor_lead.jpg',
      mediaType: 'poster_song',
      priorityOrder: 6,
      status: 'approved',
      submittedBy: 'Navarang Studios',
      contactPhone: '9848556677',
      impressions: 7430,
      clicks: 820,
      createdAt: '2026-10-20T14:00:00.000Z',
    },
    // 1 Pending Movie Teaser (demonstrates Admin approval requirement)
    {
      id: 'AD-T7',
      type: 'movie_teaser',
      title: 'Agni Patham — Unreleased Action Teaser (Pending Admin)',
      subtitle: 'Awaiting Admin Team Verification & Priority Slot Assignment',
      bannerOrClientName: 'Dakshinaveri Frame Works',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/cinema_hero_set.jpg',
      mediaType: 'youtube',
      priorityOrder: 7,
      status: 'pending',
      submittedBy: 'Dakshinaveri Frame Works',
      contactPhone: '9444188202',
      impressions: 0,
      clicks: 0,
      createdAt: '2026-10-23T07:10:00.000Z',
    },

    // 6 Approved Pvt Ads
    {
      id: 'AD-P1',
      type: 'pvt_ad',
      title: 'Ramoji & Jubilee Camera Rentals — ARRI Alexa 35 & Cooke Anamorphic',
      subtitle: '24/7 Outdoor Unit Packages with Focus Puller Crew in Hyderabad',
      bannerOrClientName: 'CineLens Pro Rentals Pvt Ltd',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/portrait_cinematographer.jpg',
      mediaType: 'youtube',
      priorityOrder: 1,
      status: 'approved',
      submittedBy: 'CineLens Pro',
      contactPhone: '7989144860',
      impressions: 6200,
      clicks: 540,
      createdAt: '2026-10-22T10:00:00.000Z',
    },
    {
      id: 'AD-P2',
      type: 'pvt_ad',
      title: 'Luxury Triple-Door Vanity Caravans for Lead Cast',
      subtitle: 'Available Across Telangana, AP, Chennai & Mumbai Outdoor Schedules',
      bannerOrClientName: 'Royal Star Caravans',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/cinema_hero_set.jpg',
      mediaType: 'youtube',
      priorityOrder: 2,
      status: 'approved',
      submittedBy: 'Royal Star Caravans',
      contactPhone: '9849011223',
      impressions: 5410,
      clicks: 430,
      createdAt: '2026-10-22T09:00:00.000Z',
    },
    {
      id: 'AD-P3',
      type: 'pvt_ad',
      title: 'Dolby Atmos 9.1.4 Dubbing & DI Color Grading Suite',
      subtitle: 'Special Package Rates for Independent Feature Films — Banjara Hills',
      bannerOrClientName: 'Swaraa Post Studios',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/teaser_poster_epic.jpg',
      mediaType: 'youtube',
      priorityOrder: 3,
      status: 'approved',
      submittedBy: 'Swaraa Post Studios',
      contactPhone: '9849022334',
      impressions: 4890,
      clicks: 390,
      createdAt: '2026-10-21T15:00:00.000Z',
    },
    {
      id: 'AD-P4',
      type: 'pvt_ad',
      title: 'Period Drama Armoury, Jewellery & Set Props Warehouse',
      subtitle: '10,000+ Authentic Art Department Props Ready for Lease',
      bannerOrClientName: 'Kakatiya Art Props',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/teaser_poster_epic.jpg',
      mediaType: 'youtube',
      priorityOrder: 4,
      status: 'approved',
      submittedBy: 'Kakatiya Art Props',
      contactPhone: '9849033445',
      impressions: 4120,
      clicks: 310,
      createdAt: '2026-10-21T11:00:00.000Z',
    },
    {
      id: 'AD-P5',
      type: 'pvt_ad',
      title: 'Film Unit Hygienic Outdoor Catering (50 to 600 Crew)',
      subtitle: 'South & North Indian Live Kitchen Vans for Studio & Forest Shoots',
      bannerOrClientName: 'Annapoorna Set Hospitality',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/cinema_hero_set.jpg',
      mediaType: 'youtube',
      priorityOrder: 5,
      status: 'approved',
      submittedBy: 'Annapoorna Hospitality',
      contactPhone: '9849044556',
      impressions: 3890,
      clicks: 280,
      createdAt: '2026-10-20T17:00:00.000Z',
    },
    {
      id: 'AD-P6',
      type: 'pvt_ad',
      title: 'Professional Casting Portfolio & Showreel Shoot Studio',
      subtitle: '25-Photo High-Resolution Lookbook + Monologue Reel in 1 Day',
      bannerOrClientName: 'Krishna Nagar Frame Lab',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/portrait_actress_lead.jpg',
      mediaType: 'youtube',
      priorityOrder: 6,
      status: 'approved',
      submittedBy: 'Krishna Nagar Frame Lab',
      contactPhone: '9849055667',
      impressions: 3650,
      clicks: 295,
      createdAt: '2026-10-20T12:00:00.000Z',
    },

    // 6 Approved Special Ads
    {
      id: 'AD-S1',
      type: 'special_ad',
      title: 'Pan-India Casting Call — Historical Bilingual Feature Film',
      subtitle: 'Seeking Lead Heroine, Antagonist & 40 Theatre Character Artists',
      bannerOrClientName: 'Suvarna Chakram Entertainments',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/portrait_actress_lead.jpg',
      mediaType: 'youtube',
      priorityOrder: 1,
      status: 'approved',
      submittedBy: 'Suvarna Chakram Entertainments',
      contactPhone: '9849024501',
      impressions: 15200,
      clicks: 2150,
      createdAt: '2026-10-23T04:00:00.000Z',
    },
    {
      id: 'AD-S2',
      type: 'special_ad',
      title: '24Crofts Priority Verified Badge — Annual Artist Pass',
      subtitle: 'Appear #1 Inside Your Craft Sub-Category for Approved Studios',
      bannerOrClientName: '24crofts.com Official',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/portrait_actor_lead.jpg',
      mediaType: 'youtube',
      priorityOrder: 2,
      status: 'approved',
      submittedBy: '24crofts Admin Team',
      contactPhone: '7989144860',
      impressions: 12900,
      clicks: 1640,
      createdAt: '2026-10-22T20:00:00.000Z',
    },
    {
      id: 'AD-S3',
      type: 'special_ad',
      title: 'OTT Web Series Writers Room — Story & Dialogue Pitch Open',
      subtitle: 'Registered Scripts Accepted from 24Crofts Verified Writers',
      bannerOrClientName: 'Deccan Stream Originals',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/cinema_hero_set.jpg',
      mediaType: 'youtube',
      priorityOrder: 3,
      status: 'approved',
      submittedBy: 'Deccan Stream Originals',
      contactPhone: '9849077889',
      impressions: 9800,
      clicks: 1120,
      createdAt: '2026-10-22T14:00:00.000Z',
    },
    {
      id: 'AD-S4',
      type: 'special_ad',
      title: 'International Shoot Schedule — Dubai & Georgia Line Production',
      subtitle: 'Visa, Location Permits & Local Grip/Light Crew Coordination',
      bannerOrClientName: 'Global Frame Line Producers',
      youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      mediaImageUrl: '/images/teaser_poster_epic.jpg',
      mediaType: 'youtube',
      priorityOrder: 4,
      status: 'approved',
      submittedBy: 'Global Frame',
      contactPhone: '9849088990',
      impressions: 8400,
      clicks: 780,
      createdAt: '2026-10-21T19:00:00.000Z',
    },
    {
      id: 'AD-S5',
      type: 'special_ad',
      title: 'Action & Wire-Stunt Safety Workshop — Jubilee Hills Arena',
      subtitle: 'Certified Riggers & Stunt Coordinators Training Batch',
      bannerOrClientName: 'South Stunt Masters Guild',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      mediaImageUrl: '/images/portrait_cinematographer.jpg',
      mediaType: 'youtube',
      priorityOrder: 5,
      status: 'approved',
      submittedBy: 'Stunt Guild',
      contactPhone: '9849099001',
      impressions: 7100,
      clicks: 690,
      createdAt: '2026-10-21T08:00:00.000Z',
    },
    {
      id: 'AD-S6',
      type: 'special_ad',
      title: 'Annual South Cinema Publicity & Trailer Editors Showcase',
      subtitle: 'Connect Directly With Production Executives Before Theatrical Lock',
      bannerOrClientName: 'Film Nagar Publicity Forum',
      youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      mediaImageUrl: '/images/portrait_actor_lead.jpg',
      mediaType: 'youtube',
      priorityOrder: 6,
      status: 'approved',
      submittedBy: 'Publicity Forum',
      contactPhone: '9849099112',
      impressions: 6500,
      clicks: 610,
      createdAt: '2026-10-20T10:00:00.000Z',
    },
  ];
}

export function buildInitialNotifications(): AppNotification[] {
  return [
    {
      id: 'NOTIF-1',
      title: 'Welcome to 24crofts.com Official App',
      message:
        'All 24 cinema crafts are live. Contact numbers remain strictly encrypted and visible only to Admin-approved Production Houses.',
      audience: 'all',
      createdAt: '2026-10-23T07:00:00.000Z',
    },
    {
      id: 'NOTIF-2',
      title: 'New Casting Call: Suvarna Chakram Entertainments',
      message:
        'Approved Production House PH-501 is reviewing Lead Actress, Character Artist, and Cinematography profiles today.',
      audience: 'artists',
      createdAt: '2026-10-23T06:30:00.000Z',
    },
  ];
}

export function buildInitialInquiries(): ContactInquiry[] {
  return [
    {
      id: 'INQ-101',
      senderName: 'Ramesh Babu (Line Producer)',
      senderEmail: 'ramesh.lineproducer@example.com',
      senderPhone: '9848099887',
      subject: 'Production House Verification & Bulk Crew Onboarding',
      encryptedMessagePayload: encryptSensitiveField(
        'We have uploaded our TFCC Movie Registration Form and would like urgent contact unlock verification for our November schedule in Hyderabad.'
      ),
      createdAt: '2026-10-23T05:45:00.000Z',
      status: 'new',
    },
  ];
}
