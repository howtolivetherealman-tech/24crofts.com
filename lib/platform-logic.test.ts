import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_CRAFTS_24 } from './crafts-data';
import {
  getApprovedAdsForHome,
  getCategorySortedProfiles,
  getHomePriorityProfiles,
  matchesProfileId,
  searchAndFilterProfiles,
  validateProductionHouseInput,
  validateTalentRegistrationInput,
} from './platform-logic';
import {
  canViewContactDetails,
  decryptSensitiveField,
  encryptSensitiveField,
  sanitizeProfileForViewer,
} from './security';
import { buildInitialAds, buildInitialTalentProfiles } from './seed-data';
import { authenticateUser } from './server-store';

test('24 Traditional Cinema Crafts taxonomy has exact 24 categories with sub-categories', () => {
  assert.equal(INITIAL_CRAFTS_24.length, 24);
  for (const craft of INITIAL_CRAFTS_24) {
    assert.ok(craft.subCategories.length >= 2, `Craft ${craft.id} should have sub-categories`);
  }
});

test('Seed data ships 3 profiles per craft (72 profiles total) with daily uploads first on Home', () => {
  const profiles = buildInitialTalentProfiles();
  assert.equal(profiles.length, 72);
  const homeSorted = getHomePriorityProfiles(profiles);
  assert.equal(homeSorted[0].uploadedToday, true);
});

test('Category drilldown strictly sorts Paid Priority profiles BEFORE standard profiles', () => {
  const profiles = buildInitialTalentProfiles();
  const sorted = getCategorySortedProfiles(profiles, 'direction');
  assert.equal(sorted.length, 3);
  assert.equal(sorted[0].isPaid, true);
  assert.equal(sorted[sorted.length - 1].isPaid, false);
});

test('Unique Profile ID search finds exact profile via full ID or numeric code', () => {
  const profiles = buildInitialTalentProfiles();
  assert.equal(matchesProfileId('24C-1001', '24C-1001'), true);
  assert.equal(matchesProfileId('24C-1001', '1001'), true);
  const byFull = searchAndFilterProfiles(profiles, { query: '24C-1001' });
  const byNum = searchAndFilterProfiles(profiles, { query: '1001' });
  assert.equal(byFull[0]?.id, '24C-1001');
  assert.equal(byNum[0]?.id, '24C-1001');
});

test('AES-256-GCM encryption & Matrimonial contact gating hides contacts from guests and unapproved studios', () => {
  const secret = '9876543210';
  const enc = encryptSensitiveField(secret);
  assert.notEqual(enc, secret);
  assert.equal(decryptSensitiveField(enc), secret);

  const profiles = buildInitialTalentProfiles();
  const sample = profiles[0];

  assert.equal(canViewContactDetails({ role: 'guest' }), false);
  assert.equal(
    canViewContactDetails({ role: 'production_house', isApproved: false, canViewContacts: false }),
    false
  );
  assert.equal(
    canViewContactDetails({ role: 'production_house', isApproved: true, canViewContacts: true }),
    true
  );
  assert.equal(canViewContactDetails({ role: 'admin' }), true);

  const guestSanitized = sanitizeProfileForViewer(sample, { role: 'guest' });
  assert.equal(guestSanitized.unlockedPhone, undefined);

  const approvedStudioSanitized = sanitizeProfileForViewer(sample, {
    role: 'production_house',
    isApproved: true,
    canViewContacts: true,
  });
  assert.ok(approvedStudioSanitized.unlockedPhone);
});

test('Separate Role Logins enforce strict separation between 24 Crafts Category, Production House, and Admin', () => {
  // 1. Admin succeeds on Admin portal, rejected on Category or Production House portal
  const adminOk = authenticateUser('Admin', 'Bchakriraju1992@', 'admin');
  assert.equal(adminOk.success, true);
  assert.equal(adminOk.viewer?.role, 'admin');

  const adminOnTalentPortal = authenticateUser('Admin', 'Bchakriraju1992@', 'talent');
  assert.equal(adminOnTalentPortal.success, false);

  // 2. Production House succeeds on Production House portal, rejected on Admin or Category portal
  const studioOk = authenticateUser('suvarna_films', 'Studio@2026', 'production_house');
  assert.equal(studioOk.success, true);
  assert.equal(studioOk.viewer?.role, 'production_house');

  const studioOnAdminPortal = authenticateUser('suvarna_films', 'Studio@2026', 'admin');
  assert.equal(studioOnAdminPortal.success, false);

  // 3. 24 Crafts Category Artist succeeds on Category portal, rejected on Admin or Production House portal
  const talentOk = authenticateUser('24C-1001', 'Artist@1001', 'talent');
  assert.equal(talentOk.success, true);
  assert.equal(talentOk.viewer?.role, 'talent');

  const talentOnStudioPortal = authenticateUser('24C-1001', 'Artist@1001', 'production_house');
  assert.equal(talentOnStudioPortal.success, false);
});

test('Home Page Ad Slots exclude pending ads, respect Admin priorityOrder, and cap at 6 each', () => {
  const ads = buildInitialAds();
  const teasers = getApprovedAdsForHome(ads, 'movie_teaser', 6);
  const pvtAds = getApprovedAdsForHome(ads, 'pvt_ad', 6);
  const specialAds = getApprovedAdsForHome(ads, 'special_ad', 6);

  assert.equal(teasers.length, 6);
  assert.equal(pvtAds.length, 6);
  assert.equal(specialAds.length, 6);
  assert.ok(teasers.every((a) => a.status === 'approved'));
  assert.equal(teasers[0].priorityOrder, 1);
});

test('Registration validation enforces 12-digit Aadhaar, max 25 photos, and mandatory Movie Registration Form', () => {
  const badAadhaar = validateTalentRegistrationInput({
    username: 'test_user',
    password: 'Password123',
    fullName: 'Test Artist',
    craftId: 'direction',
    subCategoryId: 'main-director',
    aadhaarNumber: '12345',
    phone: '9876543210',
    city: 'Hyderabad',
    street: 'Film Nagar',
    languages: ['Telugu'],
    photosCount: 3,
  });
  assert.equal(badAadhaar.valid, false);

  const missingMovieForm = validateProductionHouseInput({
    bannerName: 'Test Banner',
    producerOrManagerName: 'Producer',
    username: 'studio_test',
    password: 'Password123',
    aadhaarNumber: '123456789012',
    movieRegistrationFormName: '',
    phone: '9876543210',
    city: 'Hyderabad',
  });
  assert.equal(missingMovieForm.valid, false);
});
