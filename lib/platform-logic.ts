import type {
  AdCategoryType,
  AdPlacement,
  CraftCategory,
  FilmIndustry,
  TalentProfile,
} from './types';

export interface ProfileFilterOptions {
  query?: string;
  craftId?: string;
  subCategoryId?: string;
  industry?: FilmIndustry | 'all';
  language?: string;
  city?: string;
  paidOnly?: boolean;
}

/**
 * Normalizes a profile ID search string so both "24C-1001", "24c1001", and "1001" match "24C-1001".
 */
export function matchesProfileId(profileId: string, rawQuery: string): boolean {
  const q = rawQuery.trim().toUpperCase();
  if (!q) return false;
  const pid = profileId.toUpperCase();
  if (pid === q) return true;
  const compactPid = pid.replace(/[^A-Z0-9]/g, '');
  const compactQ = q.replace(/[^A-Z0-9]/g, '');
  if (compactPid === compactQ) return true;
  const numericSuffix = pid.split('-')[1];
  if (numericSuffix && numericSuffix === q) return true;
  return pid.includes(q);
}

/**
 * Home Page Daily Uploads Priority:
 * Newest registrations (`uploadedToday: true`, then `createdAt` descending) appear FIRST.
 */
export function getHomePriorityProfiles(profiles: TalentProfile[]): TalentProfile[] {
  return profiles
    .filter((p) => p.status === 'active')
    .slice()
    .sort((a, b) => {
      if (a.uploadedToday !== b.uploadedToday) {
        return a.uploadedToday ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Category / Sub-Category Drilldown Ordering:
 * When clicking a Category or Sub-category, PAID profiles (`isPaid: true`) MUST appear FIRST,
 * followed by newest daily uploads (`createdAt` descending).
 */
export function getCategorySortedProfiles(
  profiles: TalentProfile[],
  craftId: string,
  subCategoryId?: string
): TalentProfile[] {
  return profiles
    .filter(
      (p) =>
        p.status === 'active' &&
        p.craftId === craftId &&
        (!subCategoryId || subCategoryId === 'all' || p.subCategoryId === subCategoryId)
    )
    .slice()
    .sort((a, b) => {
      if (a.isPaid !== b.isPaid) {
        return a.isPaid ? -1 : 1;
      }
      if (a.uploadedToday !== b.uploadedToday) {
        return a.uploadedToday ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Home Page Category Showcase:
 * Returns exactly up to `limitPerCraft` (default 3) profiles for every one of the 24 crafts,
 * prioritizing newest daily registrations first.
 */
export function getHomeThreeProfilesPerCraft(
  profiles: TalentProfile[],
  crafts: CraftCategory[],
  limitPerCraft = 3
): { craft: CraftCategory; profiles: TalentProfile[]; totalInCraft: number }[] {
  return crafts.map((craft) => {
    const matching = profiles
      .filter((p) => p.status === 'active' && p.craftId === craft.id)
      .sort((a, b) => {
        if (a.uploadedToday !== b.uploadedToday) {
          return a.uploadedToday ? -1 : 1;
        }
        const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.isPaid === b.isPaid ? 0 : a.isPaid ? -1 : 1;
      });
    return {
      craft,
      profiles: matching.slice(0, limitPerCraft),
      totalInCraft: matching.length,
    };
  });
}

/**
 * Search & Multi-Facet Filter Engine:
 * Supports exact/partial Profile ID lookup ("24C-1001" or "1001"), name, screenName, city,
 * craft, subCategory, film industry (Tollywood, Kollywood, Bollywood...), and language.
 */
export function searchAndFilterProfiles(
  profiles: TalentProfile[],
  options: ProfileFilterOptions
): TalentProfile[] {
  const query = (options.query || '').trim();
  const qLower = query.toLowerCase();

  const filtered = profiles.filter((p) => {
    if (p.status !== 'active') return false;
    if (options.craftId && options.craftId !== 'all' && p.craftId !== options.craftId) {
      return false;
    }
    if (
      options.subCategoryId &&
      options.subCategoryId !== 'all' &&
      p.subCategoryId !== options.subCategoryId
    ) {
      return false;
    }
    if (options.industry && options.industry !== 'all') {
      const inPrimary = p.industry === options.industry;
      const inOther = p.otherIndustries?.includes(options.industry) ?? false;
      if (!inPrimary && !inOther) return false;
    }
    if (options.language && options.language !== 'all') {
      const hasLang = p.languages.some((l) =>
        l.toLowerCase().includes(options.language!.toLowerCase())
      );
      if (!hasLang) return false;
    }
    if (options.city && options.city.trim()) {
      const cityQuery = options.city.trim().toLowerCase();
      if (!p.address.city.toLowerCase().includes(cityQuery)) return false;
    }
    if (options.paidOnly && !p.isPaid) {
      return false;
    }

    if (!query) return true;

    if (matchesProfileId(p.id, query)) return true;
    if (p.fullName.toLowerCase().includes(qLower)) return true;
    if (p.screenName.toLowerCase().includes(qLower)) return true;
    if (p.address.city.toLowerCase().includes(qLower)) return true;
    if (p.industry.toLowerCase().includes(qLower)) return true;
    if (p.bio.toLowerCase().includes(qLower)) return true;
    return false;
  });

  // If exact ID match exists, surface exact ID match at index 0; otherwise sort paid/newest appropriately
  return filtered.sort((a, b) => {
    if (query) {
      const aExact = a.id.toUpperCase() === query.toUpperCase() || a.id.endsWith(`-${query}`);
      const bExact = b.id.toUpperCase() === query.toUpperCase() || b.id.endsWith(`-${query}`);
      if (aExact !== bExact) return aExact ? -1 : 1;
    }
    if (options.craftId && options.craftId !== 'all') {
      if (a.isPaid !== b.isPaid) return a.isPaid ? -1 : 1;
    }
    if (a.uploadedToday !== b.uploadedToday) return a.uploadedToday ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Approved Home Page Ads & Teasers Selector:
 * Any ad placement requires Admin approval (`status === 'approved'`).
 * Admin decides which ad displays first via `priorityOrder` ascending (1, 2, 3...).
 * Home page displays 6 Movie Teasers, 6 Pvt Ads, and 6 Special Ads.
 */
export function getApprovedAdsForHome(
  ads: AdPlacement[],
  type: AdCategoryType,
  limit = 6
): AdPlacement[] {
  return ads
    .filter((ad) => ad.type === type && ad.status === 'approved')
    .slice()
    .sort((a, b) => {
      if (a.priorityOrder !== b.priorityOrder) {
        return a.priorityOrder - b.priorityOrder;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTalentRegistrationInput(input: {
  fullName: string;
  username: string;
  password: string;
  craftId: string;
  subCategoryId: string;
  aadhaarNumber: string;
  phone: string;
  city: string;
  street: string;
  languages: string[];
  photosCount: number;
}): ValidationResult {
  const errors: string[] = [];
  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.push('Full Name is required.');
  }
  if (!input.username || input.username.trim().length < 3) {
    errors.push('User ID must be at least 3 characters.');
  }
  if (!input.password || input.password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }
  if (!input.craftId || !input.subCategoryId) {
    errors.push('Please select both a Craft Category and Sub-Category.');
  }
  const aadhaarDigits = (input.aadhaarNumber || '').replace(/\D/g, '');
  if (aadhaarDigits.length !== 12) {
    errors.push('Valid 12-digit Aadhaar number is mandatory.');
  }
  const phoneDigits = (input.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.push('Valid 10-digit mobile contact number is required.');
  }
  if (!input.street?.trim() || !input.city?.trim()) {
    errors.push('Complete street and city address details are required.');
  }
  if (!input.languages || input.languages.length === 0) {
    errors.push('Select at least one spoken language.');
  }
  if (input.photosCount > 25) {
    errors.push('Maximum 25 gallery photos can be uploaded per profile.');
  }
  return { valid: errors.length === 0, errors };
}

export function validateProductionHouseInput(input: {
  bannerName: string;
  producerOrManagerName: string;
  username: string;
  password: string;
  aadhaarNumber: string;
  movieRegistrationFormName: string;
  phone: string;
  city: string;
}): ValidationResult {
  const errors: string[] = [];
  if (!input.bannerName || input.bannerName.trim().length < 2) {
    errors.push('Production House Banner Name is required.');
  }
  if (!input.producerOrManagerName || input.producerOrManagerName.trim().length < 2) {
    errors.push('Producer or Casting Head Name is required.');
  }
  if (!input.username || input.username.trim().length < 3) {
    errors.push('User ID must be at least 3 characters.');
  }
  if (!input.password || input.password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }
  const aadhaarDigits = (input.aadhaarNumber || '').replace(/\D/g, '');
  if (aadhaarDigits.length !== 12) {
    errors.push('Valid 12-digit Aadhaar number is mandatory for Production House registration.');
  }
  if (!input.movieRegistrationFormName || !input.movieRegistrationFormName.trim()) {
    errors.push('Uploading the Movie Registration Form / Chamber Certificate is mandatory.');
  }
  const phoneDigits = (input.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.push('Valid 10-digit official phone number is required.');
  }
  if (!input.city?.trim()) {
    errors.push('Office city and address details are required.');
  }
  return { valid: errors.length === 0, errors };
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
