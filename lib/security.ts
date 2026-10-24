import crypto from 'crypto';
import type { SessionViewer, TalentProfile } from './types';

const SECRET_SEED =
  process.env.PLATFORM_ENCRYPTION_SECRET || '24crofts-aes256-production-cinema-vault-key';

function getKey(): Buffer {
  return crypto.createHash('sha256').update(SECRET_SEED).digest();
}

/**
 * Encrypts sensitive PII (Aadhaar, mobile contact numbers, emails, passwords, inquiry payloads)
 * using authenticated AES-256-GCM encryption at rest.
 */
export function encryptSensitiveField(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `enc:v1:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts AES-256-GCM ciphertext strictly for authorized viewers (Admin & Admin-Approved Production Houses).
 */
export function decryptSensitiveField(payload: string): string {
  if (!payload) return '';
  if (!payload.startsWith('enc:v1:')) return payload;
  const parts = payload.split(':');
  if (parts.length !== 5) return '';
  const [, , ivHex, tagHex, cipherHex] = parts;
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      getKey(),
      Buffer.from(ivHex, 'hex')
    );
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch {
    return '';
  }
}

export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length < 4) return 'XXXX-XXXX-XXXX';
  return `XXXX-XXXX-${digits.slice(-4)}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '+91 ••••• •••••';
  return `+91 ••••• ••${digits.slice(-2)}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '••••@••••.com';
  return `${local.slice(0, 2)}••••@${domain}`;
}

/**
 * Matrimonial-style contact privacy rule:
 * Contact details are ONLY visible to:
 * 1. Website Admin (`role === 'admin'`)
 * 2. Production Houses explicitly approved by the Admin Team (`role === 'production_house' && isApproved && canViewContacts`)
 * 3. The profile owner viewing/editing their own profile (`role === 'talent' && viewer.userId === profile.id`)
 */
export function canViewContactDetails(viewer: SessionViewer | null | undefined, profile?: TalentProfile): boolean {
  if (!viewer) return false;
  if (viewer.role === 'admin') return true;
  if (
    viewer.role === 'production_house' &&
    viewer.isApproved === true &&
    viewer.canViewContacts === true
  ) {
    return true;
  }
  if (profile && viewer.role === 'talent' && viewer.userId === profile.id) {
    return true;
  }
  return false;
}

/**
 * Strips encrypted secrets and raw credentials for non-authorized viewers.
 * Only Admin receives `passwordPlainForAdmin` and `unlockedAadhaar`.
 * Only Admin, Approved Production Houses, or the Profile Owner receive `unlockedPhone` & `unlockedEmail`.
 */
export function sanitizeProfileForViewer(
  profile: TalentProfile,
  viewer: SessionViewer | null | undefined
): TalentProfile {
  const isAdmin = viewer?.role === 'admin';
  const canSeeContact = canViewContactDetails(viewer, profile);

  const unlockedPhone = canSeeContact ? decryptSensitiveField(profile.phoneEncrypted) : undefined;
  const unlockedEmail = canSeeContact ? decryptSensitiveField(profile.emailEncrypted) : undefined;
  const unlockedAadhaar = isAdmin ? decryptSensitiveField(profile.aadhaarEncrypted) : undefined;
  const passwordPlainForAdmin = isAdmin
    ? decryptSensitiveField(profile.passwordEncrypted)
    : undefined;

  const safeCasting = profile.castingDetails
    ? {
        ...profile.castingDetails,
        contact: canSeeContact && unlockedPhone
          ? `${unlockedPhone} · ${unlockedEmail || ''}`
          : 'Protected by 24crofts Admin Approval',
      }
    : undefined;

  return {
    ...profile,
    phoneEncrypted: '[AES-256-GCM-PROTECTED]',
    emailEncrypted: '[AES-256-GCM-PROTECTED]',
    aadhaarEncrypted: '[AES-256-GCM-PROTECTED]',
    passwordEncrypted: '[AES-256-GCM-PROTECTED]',
    unlockedPhone,
    unlockedEmail,
    unlockedAadhaar,
    passwordPlainForAdmin,
    castingDetails: safeCasting,
  };
}

export function extractYoutubeEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embedMatch?.[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }
  return null;
}
