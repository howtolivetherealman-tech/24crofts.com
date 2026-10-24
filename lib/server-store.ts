import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_CRAFTS_24 } from './crafts-data';
import {
  decryptSensitiveField,
  encryptSensitiveField,
  maskAadhaar,
  maskEmail,
  maskPhone,
  sanitizeProfileForViewer,
} from './security';
import {
  ADMIN_DEFAULT_CREDENTIALS,
  buildInitialAds,
  buildInitialInquiries,
  buildInitialNotifications,
  buildInitialProductionHouses,
  buildInitialTalentProfiles,
  HOSTING_COST_ESTIMATES,
  INITIAL_SITE_SETTINGS,
} from './seed-data';
import type {
  AdPlacement,
  AppNotification,
  ContactInquiry,
  CraftCategory,
  ProductionHouse,
  SessionViewer,
  SiteSettings,
  TalentProfile,
} from './types';

interface PlatformDatabase {
  adminCredentials: {
    username: string;
    passwordEncrypted: string;
  };
  siteSettings: SiteSettings;
  crafts: CraftCategory[];
  profiles: TalentProfile[];
  productionHouses: ProductionHouse[];
  ads: AdPlacement[];
  notifications: AppNotification[];
  inquiries: ContactInquiry[];
  nextProfileNumber: number;
  nextProductionHouseNumber: number;
}

declare global {
  var __24croftsDb: PlatformDatabase | undefined;
}

const DB_FILE_PRIMARY = path.join(process.cwd(), 'data', '24crofts-db.json');
const DB_FILE_FALLBACK = '/tmp/24crofts-db.json';

function loadPersistedDb(): PlatformDatabase | null {
  for (const candidate of [DB_FILE_PRIMARY, DB_FILE_FALLBACK]) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw) as PlatformDatabase;
        if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore read errors and fall back to seed initialization
    }
  }
  return null;
}

export function saveDbToDisk(): void {
  if (!globalThis.__24croftsDb) return;
  const serialized = JSON.stringify(globalThis.__24croftsDb, null, 2);
  try {
    fs.mkdirSync(path.dirname(DB_FILE_PRIMARY), { recursive: true });
    fs.writeFileSync(DB_FILE_PRIMARY, serialized, 'utf8');
    return;
  } catch {
    try {
      fs.writeFileSync(DB_FILE_FALLBACK, serialized, 'utf8');
    } catch {
      // Ignore read-only filesystem errors
    }
  }
}

export function getDb(): PlatformDatabase {
  if (!globalThis.__24croftsDb) {
    const persisted = loadPersistedDb();
    if (persisted) {
      globalThis.__24croftsDb = persisted;
    } else {
      const initialProfiles = buildInitialTalentProfiles();
      globalThis.__24croftsDb = {
        adminCredentials: {
          username: ADMIN_DEFAULT_CREDENTIALS.username,
          passwordEncrypted: encryptSensitiveField(ADMIN_DEFAULT_CREDENTIALS.password),
        },
        siteSettings: structuredClone(INITIAL_SITE_SETTINGS),
        crafts: structuredClone(INITIAL_CRAFTS_24),
        profiles: initialProfiles,
        productionHouses: buildInitialProductionHouses(),
        ads: buildInitialAds(),
        notifications: buildInitialNotifications(),
        inquiries: buildInitialInquiries(),
        nextProfileNumber: 1001 + initialProfiles.length,
        nextProductionHouseNumber: 503,
      };
      saveDbToDisk();
    }
  }
  return globalThis.__24croftsDb;
}

export function authenticateUser(
  usernameInput: string,
  passwordInput: string,
  expectedRole?: 'talent' | 'production_house' | 'admin'
): { success: boolean; viewer?: SessionViewer; error?: string } {
  const db = getDb();
  const uTrim = usernameInput.trim();

  // 1. Check Admin (when expectedRole is 'admin' or unspecified)
  if (!expectedRole || expectedRole === 'admin') {
    const adminPlainPass = decryptSensitiveField(db.adminCredentials.passwordEncrypted);
    if (
      uTrim.toLowerCase() === db.adminCredentials.username.toLowerCase() &&
      passwordInput === adminPlainPass
    ) {
      return {
        success: true,
        viewer: {
          role: 'admin',
          userId: 'ADMIN-ROOT',
          username: db.adminCredentials.username,
          displayName: '24crofts Website Admin Team',
          isApproved: true,
          canViewContacts: true,
        },
      };
    }
    if (expectedRole === 'admin') {
      return {
        success: false,
        error: 'Invalid Website Admin User ID or Password.',
      };
    }
  }

  // 2. Check Production Houses (when expectedRole is 'production_house' or unspecified)
  if (!expectedRole || expectedRole === 'production_house') {
    const ph = db.productionHouses.find(
      (item) =>
        item.username.toLowerCase() === uTrim.toLowerCase() ||
        item.id.toLowerCase() === uTrim.toLowerCase()
    );
    if (ph) {
      const phPass = decryptSensitiveField(ph.passwordEncrypted);
      if (passwordInput === phPass) {
        return {
          success: true,
          viewer: {
            role: 'production_house',
            userId: ph.id,
            username: ph.username,
            displayName: ph.bannerName,
            isApproved: ph.isApproved,
            canViewContacts: ph.isApproved && ph.canViewContacts,
          },
        };
      }
      return { success: false, error: 'Incorrect password for Production House account.' };
    }
    if (expectedRole === 'production_house') {
      return {
        success: false,
        error: 'Production House account not found. Please use the Production House User ID.',
      };
    }
  }

  // 3. Check 24 Crafts Talent Profiles (when expectedRole is 'talent' or unspecified)
  if (!expectedRole || expectedRole === 'talent') {
    const talent = db.profiles.find(
      (item) =>
        item.username.toLowerCase() === uTrim.toLowerCase() ||
        item.id.toLowerCase() === uTrim.toLowerCase()
    );
    if (talent) {
      const tPass = decryptSensitiveField(talent.passwordEncrypted);
      if (passwordInput === tPass) {
        return {
          success: true,
          viewer: {
            role: 'talent',
            userId: talent.id,
            username: talent.username,
            displayName: `${talent.fullName} (${talent.id})`,
            isApproved: talent.status === 'active',
            canViewContacts: false,
          },
        };
      }
      return { success: false, error: 'Incorrect password for 24 Crafts Category Profile.' };
    }
    if (expectedRole === 'talent') {
      return {
        success: false,
        error: '24 Crafts Category profile not found. Please check your User ID or Profile ID.',
      };
    }
  }

  return { success: false, error: 'Account not found. Check your User ID or register a new profile.' };
}

export function serializeSnapshotForViewer(viewer: SessionViewer | null | undefined) {
  const db = getDb();
  const isAdmin = viewer?.role === 'admin';

  // Refresh viewer approval flags from live DB if production_house
  let effectiveViewer = viewer || { role: 'guest' as const };
  if (viewer?.role === 'production_house' && viewer.userId) {
    const livePh = db.productionHouses.find((p) => p.id === viewer.userId);
    if (livePh) {
      effectiveViewer = {
        ...viewer,
        isApproved: livePh.isApproved,
        canViewContacts: livePh.isApproved && livePh.canViewContacts,
      };
    }
  }

  const profiles = db.profiles.map((p) => sanitizeProfileForViewer(p, effectiveViewer));

  const productionHouses = db.productionHouses.map((ph) => ({
    ...ph,
    aadhaarEncrypted: '[AES-256-GCM-PROTECTED]',
    passwordEncrypted: '[AES-256-GCM-PROTECTED]',
    passwordPlainForAdmin: isAdmin ? decryptSensitiveField(ph.passwordEncrypted) : undefined,
    phone:
      isAdmin || (effectiveViewer.role === 'production_house' && effectiveViewer.userId === ph.id)
        ? ph.phone
        : maskPhone(ph.phone),
    email:
      isAdmin || (effectiveViewer.role === 'production_house' && effectiveViewer.userId === ph.id)
        ? ph.email
        : maskEmail(ph.email),
  }));

  // Public site settings hide Google AdSense Console link & raw publisher slots on the Home Page
  // unless viewed by Admin! (AdSense script publisher ID is still available for <head> auto-ads tag)
  const publicSettings: SiteSettings = isAdmin
    ? db.siteSettings
    : {
        ...db.siteSettings,
        adsenseConsoleUrl: '',
        adsenseHeaderSlotId: '',
        adsenseDirectorySlotId: '',
      };

  const inquiries = isAdmin
    ? db.inquiries.map((inq) => ({
        ...inq,
        decryptedMessageForAdmin: decryptSensitiveField(inq.encryptedMessagePayload),
      }))
    : [];

  return {
    viewer: effectiveViewer,
    siteSettings: publicSettings,
    adsenseScriptClient: db.siteSettings.adsenseAutoAdsEnabled
      ? db.siteSettings.adsensePublisherId
      : '',
    crafts: db.crafts,
    profiles,
    productionHouses: isAdmin || effectiveViewer.role === 'production_house' ? productionHouses : [],
    ads: isAdmin ? db.ads : db.ads.filter((a) => a.status === 'approved'),
    notifications: db.notifications,
    inquiries,
    hostingEstimates: HOSTING_COST_ESTIMATES,
  };
}

export function createNewTalentProfile(payload: {
  username: string;
  password: string;
  fullName: string;
  screenName: string;
  craftId: string;
  subCategoryId: string;
  industry: TalentProfile['industry'];
  otherIndustries?: TalentProfile['industry'][];
  languages: string[];
  address: TalentProfile['address'];
  aadhaarNumber: string;
  aadhaarDocumentName: string;
  phone: string;
  email: string;
  bio: string;
  experienceYears: number;
  isPaid: boolean;
  photos: string[];
  youtubeLinks: string[];
  castingDetails?: TalentProfile['castingDetails'];
}): { success: boolean; profile?: TalentProfile; error?: string } {
  const db = getDb();
  const exists = db.profiles.some(
    (p) => p.username.toLowerCase() === payload.username.trim().toLowerCase()
  );
  if (exists) {
    return { success: false, error: 'This User ID is already taken. Please choose another User ID.' };
  }

  const id = `24C-${db.nextProfileNumber++}`;
  const now = new Date().toISOString();
  const cappedPhotos = (payload.photos || []).slice(0, 25);
  if (cappedPhotos.length === 0) {
    cappedPhotos.push('/images/portrait_actor_lead.jpg');
  }

  const newProfile: TalentProfile = {
    id,
    username: payload.username.trim(),
    passwordEncrypted: encryptSensitiveField(payload.password),
    fullName: payload.fullName.trim(),
    screenName: (payload.screenName || payload.fullName).trim(),
    craftId: payload.craftId,
    subCategoryId: payload.subCategoryId,
    industry: payload.industry,
    otherIndustries: payload.otherIndustries || [],
    languagesCount: payload.languages.length,
    languages: payload.languages,
    address: payload.address,
    aadhaarMasked: maskAadhaar(payload.aadhaarNumber),
    aadhaarEncrypted: encryptSensitiveField(payload.aadhaarNumber),
    aadhaarDocumentName: payload.aadhaarDocumentName || `aadhaar_${id}.pdf`,
    phoneMasked: maskPhone(payload.phone),
    phoneEncrypted: encryptSensitiveField(payload.phone),
    emailMasked: maskEmail(payload.email || `${payload.username}@24crofts.com`),
    emailEncrypted: encryptSensitiveField(payload.email || `${payload.username}@24crofts.com`),
    bio: payload.bio || `${payload.fullName} — Verified 24Crofts member.`,
    experienceYears: Number(payload.experienceYears) || 0,
    isPaid: Boolean(payload.isPaid),
    isVerified: true,
    uploadedToday: true,
    createdAt: now,
    updatedAt: now,
    photos: cappedPhotos,
    youtubeLinks: (payload.youtubeLinks || []).filter((u) => u.trim().length > 0),
    castingDetails: payload.castingDetails,
    viewsCount: 1,
    contactUnlocksCount: 0,
    shortlistCount: 0,
    status: 'active',
  };

  db.profiles.unshift(newProfile);
  saveDbToDisk();
  return { success: true, profile: newProfile };
}

export function createNewProductionHouse(payload: {
  bannerName: string;
  registrationNumber: string;
  producerOrManagerName: string;
  username: string;
  password: string;
  industry: ProductionHouse['industry'];
  languages: string[];
  address: ProductionHouse['address'];
  aadhaarNumber: string;
  movieRegistrationFormName: string;
  movieRegistrationFormDataUrl?: string;
  phone: string;
  email: string;
}): { success: boolean; productionHouse?: ProductionHouse; error?: string } {
  const db = getDb();
  const exists =
    db.productionHouses.some(
      (p) => p.username.toLowerCase() === payload.username.trim().toLowerCase()
    ) ||
    db.profiles.some(
      (p) => p.username.toLowerCase() === payload.username.trim().toLowerCase()
    );
  if (exists) {
    return { success: false, error: 'User ID already exists. Please choose a unique User ID.' };
  }

  const id = `PH-${db.nextProductionHouseNumber++}`;
  const ph: ProductionHouse = {
    id,
    bannerName: payload.bannerName.trim(),
    registrationNumber: payload.registrationNumber.trim() || 'PENDING-CHAMBER-VERIFY',
    producerOrManagerName: payload.producerOrManagerName.trim(),
    username: payload.username.trim(),
    passwordEncrypted: encryptSensitiveField(payload.password),
    industry: payload.industry,
    languagesCount: payload.languages.length,
    languages: payload.languages,
    address: payload.address,
    aadhaarMasked: maskAadhaar(payload.aadhaarNumber),
    aadhaarEncrypted: encryptSensitiveField(payload.aadhaarNumber),
    movieRegistrationFormName: payload.movieRegistrationFormName,
    movieRegistrationFormDataUrl: payload.movieRegistrationFormDataUrl,
    phone: payload.phone,
    email: payload.email,
    isApproved: false, // Requires Admin Team approval before viewing talent contacts!
    canViewContacts: false,
    unlockedProfileIds: [],
    createdAt: new Date().toISOString(),
  };

  db.productionHouses.unshift(ph);
  saveDbToDisk();
  return { success: true, productionHouse: ph };
}
