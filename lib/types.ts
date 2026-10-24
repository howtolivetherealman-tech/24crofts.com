export type Language = 'te' | 'en' | 'hi';

export type FilmIndustry =
  | 'Tollywood'
  | 'Kollywood'
  | 'Bollywood'
  | 'Mollywood'
  | 'Sandalwood'
  | 'Pan-India';

export type UserRole = 'guest' | 'talent' | 'production_house' | 'admin';

export interface SessionViewer {
  role: UserRole;
  userId?: string;
  username?: string;
  displayName?: string;
  isApproved?: boolean;
  canViewContacts?: boolean;
}

export interface CraftSubCategory {
  id: string;
  nameTe: string;
  nameEn: string;
  nameHi: string;
}

export interface CraftCategory {
  id: string;
  number: number;
  nameTe: string;
  nameEn: string;
  nameHi: string;
  taglineTe: string;
  taglineEn: string;
  taglineHi: string;
  isCastingFocused?: boolean;
  subCategories: CraftSubCategory[];
}

export interface AddressDetails {
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export const CASTING_INTERESTED_IN_OPTIONS = [
  '1. Acting',
  '2. Print shoots',
  '3. Ramp shows',
  '4. Designer shoots',
  '5. Ethnic wears',
  '6. Western wears',
  '7. Bikini shoots',
  '8. Lingerie shoots',
  '9. Swim suit',
  '10. Calendar shoots',
  '11. Music Albums',
  '12. Seminude',
  '13. Nude shoots',
  '14. Body paint shoots',
] as const;

export const CASTING_COMFORTABLE_WITH_OPTIONS = [
  'A) On screen Kiss',
  'B) Love making',
  'C) Hug scenes',
  'D) Lip lock scenes',
  'Indian wears',
  'Western wears',
  'Skirts',
  'Bikini',
  'Shorts',
  'Bold Scenes',
  'Smoking scenes on screen',
  'Drinking scenes on screen',
  'Driving scenes',
  'Able to work Indoor & Outdoor',
] as const;

export interface CastingDetails {
  fullName: string;
  screenName: string;
  age: number;
  city: string;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  skinTone: string;
  eyeColour: string;
  hairColour: string;
  shoeSize: string;
  maritalStatus: string;
  presentProfession: string;
  education: string;
  dressesComfortable: string;
  openForOutstationShoots: boolean;
  openForOutOfCountryShoots: boolean;
  passport: 'Yes' | 'Applied' | 'No';
  experience: string;
  comfortableWithAllTimings: boolean;
  languages: string[];
  interestedIn: string[];
  contact: string; // Stored encrypted at rest; masked unless viewer is authorized
  aim: string;
  comfortableWith: string[];
  allergiesToDustOrCosmetics: string;
  instagramId: string;
}

export interface TalentProfile {
  id: string; // Unique ID e.g. "24C-1001"
  username: string;
  passwordPlainForAdmin?: string; // Exposed ONLY to Admin for seamless profile credential management
  passwordEncrypted: string;
  fullName: string;
  screenName: string;
  craftId: string;
  subCategoryId: string;
  industry: FilmIndustry;
  otherIndustries?: FilmIndustry[];
  languagesCount: number;
  languages: string[];
  address: AddressDetails;
  aadhaarMasked: string;
  aadhaarEncrypted: string;
  aadhaarDocumentName: string;
  phoneMasked: string;
  phoneEncrypted: string;
  emailMasked: string;
  emailEncrypted: string;
  // Populated ONLY when viewer has Admin or Approved Production House contact permission
  unlockedPhone?: string;
  unlockedEmail?: string;
  unlockedAadhaar?: string;
  bio: string;
  experienceYears: number;
  NotableCredits?: string;
  isPaid: boolean;
  isVerified: boolean;
  uploadedToday: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  photos: string[]; // Up to 25 photos from gallery/system
  youtubeLinks: string[]; // Unlimited YouTube showreel/work links
  castingDetails?: CastingDetails;
  viewsCount: number;
  contactUnlocksCount: number;
  shortlistCount: number;
  status: 'active' | 'pending' | 'suspended';
}

export interface ProductionHouse {
  id: string; // e.g. "PH-501"
  bannerName: string;
  registrationNumber: string;
  producerOrManagerName: string;
  username: string;
  passwordEncrypted: string;
  passwordPlainForAdmin?: string;
  industry: FilmIndustry;
  languagesCount: number;
  languages: string[];
  address: AddressDetails;
  aadhaarMasked: string;
  aadhaarEncrypted: string;
  movieRegistrationFormName: string;
  movieRegistrationFormDataUrl?: string;
  phone: string;
  email: string;
  website?: string;
  isApproved: boolean;
  canViewContacts: boolean;
  unlockedProfileIds: string[];
  createdAt: string;
}

export type AdCategoryType = 'movie_teaser' | 'pvt_ad' | 'special_ad';

export interface AdPlacement {
  id: string;
  type: AdCategoryType;
  title: string;
  subtitle: string;
  bannerOrClientName: string;
  youtubeUrl: string;
  mediaImageUrl: string;
  mediaType: 'youtube' | 'video_upload' | 'poster_song';
  priorityOrder: number; // Lower number = displayed first (1, 2, 3...)
  status: 'approved' | 'pending' | 'rejected';
  submittedBy: string;
  contactPhone: string;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface SiteSettings {
  domain: string;
  siteTitle: string;
  heroKickerTe: string;
  heroKickerEn: string;
  heroKickerHi: string;
  heroHeadlineTe: string;
  heroHeadlineEn: string;
  heroHeadlineHi: string;
  heroSubheadlineTe: string;
  heroSubheadlineEn: string;
  heroSubheadlineHi: string;
  announcementTe: string;
  announcementEn: string;
  announcementHi: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  contactAddressFull: string;
  mapEmbedUrl: string;
  adsensePublisherId: string;
  adsenseConsoleUrl: string;
  adsenseAutoAdsEnabled: boolean;
  adsenseHeaderSlotId: string;
  adsenseDirectorySlotId: string;
  paidProfileAnnualFeeInr: number;
  productionHouseAnnualFeeInr: number;
}

export interface ContactInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  encryptedMessagePayload: string;
  decryptedMessageForAdmin?: string;
  createdAt: string;
  status: 'new' | 'resolved';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  audience: 'all' | 'artists' | 'production_houses';
  createdAt: string;
}

export interface HostingCostItem {
  component: string;
  specification: string;
  monthlyInr: number;
  annualInr: number;
  securityNotes: string;
}
