'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Film,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Unlock,
  X,
} from 'lucide-react';
import { extractYoutubeEmbedUrl } from '@/lib/platform-logic';
import { getCraftName } from '@/lib/crafts-data';
import type { CraftCategory, Language, SessionViewer, TalentProfile } from '@/lib/types';

interface ProfileDetailContentProps {
  profile: TalentProfile;
  craft?: CraftCategory;
  lang: Language;
  viewer: SessionViewer;
  onClose?: () => void;
  onRequestProductionAuth?: () => void;
  onCopySuccess?: (msg: string) => void;
  isStandalonePage?: boolean;
}

export function ProfileDetailContent({
  profile,
  craft,
  lang,
  viewer,
  onClose,
  onRequestProductionAuth,
  onCopySuccess,
  isStandalonePage = false,
}: ProfileDetailContentProps) {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const subCat = craft?.subCategories.find((s) => s.id === profile.subCategoryId);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/profile/${profile.id}`
      : `https://24crofts.com/profile/${profile.id}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    }
    onCopySuccess?.(`Copied profile link: ${shareUrl}`);
  };

  const activeYoutubeEmbed = profile.youtubeLinks[selectedVideoIdx]
    ? extractYoutubeEmbedUrl(profile.youtubeLinks[selectedVideoIdx])
    : null;

  const cd = profile.castingDetails;

  return (
    <div className="bg-white border border-[#E6E4DD] rounded-2xl overflow-hidden">
      {/* Top Bar of Profile View */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#FAF9F6] border-b border-[#E6E4DD]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#52514E]">
            <span className="font-mono font-bold text-[#BE123C] tabular-nums">
              UNIQUE ID: {profile.id}
            </span>
            <span aria-hidden="true">·</span>
            <span>{craft ? getCraftName(craft, lang) : profile.craftId}</span>
            {subCat && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#141413]">{subCat.nameTe} / {subCat.nameEn}</span>
              </>
            )}
          </div>
          <h2 className="font-display text-2xl font-bold text-[#141413] mt-1">
            {profile.fullName}{' '}
            {profile.screenName && profile.screenName !== profile.fullName ? (
              <span className="text-base font-normal text-[#6B6963]">
                (Screen Name: {profile.screenName})
              </span>
            ) : null}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#141413] bg-white border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#BE123C]" />
            Share Link ({profile.id})
          </button>

          {!isStandalonePage && (
            <a
              href={`/profile/${profile.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#52514E] hover:text-[#141413] border border-[#E6E4DD] rounded-lg bg-white whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Direct Page
            </a>
          )}

          {onClose && (
            <button
              type="button"
              aria-label="Close profile dialog"
              onClick={onClose}
              className="p-2 text-[#52514E] hover:text-[#141413] rounded-lg border border-[#E6E4DD] bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photo Gallery (Up to 25 Photos) + Matrimonial Contact Vault */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#141413] border border-[#E6E4DD]">
              <img
                src={profile.photos[selectedPhotoIdx] || profile.photos[0] || '/images/portrait_actor_lead.jpg'}
                alt={`${profile.fullName} portfolio frame ${selectedPhotoIdx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Thumbnail Strip (supports up to 25 gallery photos) */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#6B6963] mb-2 tabular-nums">
                <span>Portfolio Gallery ({profile.photos.length} / 25 Photos)</span>
                <span>Frame {selectedPhotoIdx + 1}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {profile.photos.map((photoUrl, idx) => (
                  <button
                    key={`${photoUrl}-${idx}`}
                    type="button"
                    aria-label={`View gallery photo ${idx + 1}`}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedPhotoIdx === idx
                        ? 'border-[#BE123C] opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MATRIMONIAL-STYLE ADMIN-GATED CONTACT VAULT */}
          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#DEDBD2]">
            <div className="flex items-center gap-2">
              {profile.unlockedPhone ? (
                <Unlock className="w-4 h-4 text-[#15803D]" />
              ) : (
                <Lock className="w-4 h-4 text-[#BE123C]" />
              )}
              <h3 className="font-display text-sm font-bold text-[#141413]">
                Matrimonial-Grade Contact Verification Vault
              </h3>
            </div>

            {profile.unlockedPhone ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-xs text-[#15803D] font-medium">
                  Authorized Access Active ({viewer.role === 'admin' ? 'Website Admin Team' : 'Admin-Approved Production House'})
                </p>
                <div className="pt-2 border-t border-[#E6E4DD] space-y-1.5 font-mono text-xs tabular-nums">
                  <p className="flex items-center justify-between">
                    <span className="text-[#6B6963] font-sans">Direct Mobile:</span>
                    <a href={`tel:${profile.unlockedPhone}`} className="font-bold text-[#141413] hover:text-[#BE123C] inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {profile.unlockedPhone}
                    </a>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-[#6B6963] font-sans">Direct Email:</span>
                    <span className="font-semibold text-[#141413]">{profile.unlockedEmail}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-[#6B6963] font-sans">Aadhaar Status:</span>
                    <span className="text-[#15803D] font-semibold">
                      {profile.unlockedAadhaar ? `Verified (${profile.unlockedAadhaar})` : `Verified (${profile.aadhaarMasked})`}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-[#52514E] leading-relaxed">
                  <strong>వెబ్‌సైట్ అడ్మిన్ ఆమోదం తప్పనిసరి:</strong> Contact numbers and personal details are encrypted with AES-256-GCM and strictly restricted. Only Production Houses verified & approved by the 24crofts.com Admin Team can view artist contact numbers.
                </p>
                <div className="text-xs font-mono text-[#6B6963] space-y-1 pt-2 border-t border-[#E6E4DD] tabular-nums">
                  <div>Mobile: {profile.phoneMasked}</div>
                  <div>Email: {profile.emailMasked}</div>
                  <div>Aadhaar KYC: {profile.aadhaarMasked} (Verified)</div>
                </div>
                {onRequestProductionAuth && (
                  <button
                    type="button"
                    onClick={onRequestProductionAuth}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#BE123C] rounded-lg hover:bg-[#9F1239] transition-colors cursor-pointer"
                  >
                    {viewer.role === 'production_house'
                      ? 'Pending Admin Approval — Check Studio Account'
                      : 'Sign In as Approved Production House to View Contact'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Core Identity, Industry, Languages & Address */}
          <div className="p-5 rounded-xl bg-white border border-[#E6E4DD] space-y-3 text-xs">
            <h3 className="font-display text-sm font-bold text-[#141413]">
              Industry, Languages & Location Details
            </h3>
            <div className="divide-y divide-[#F1EFEA]">
              <div className="py-2 flex justify-between gap-4">
                <span className="text-[#6B6963]">Primary Film Industry</span>
                <span className="font-semibold text-[#141413]">{profile.industry}</span>
              </div>
              <div className="py-2 flex justify-between gap-4">
                <span className="text-[#6B6963]">Languages Spoken ({profile.languagesCount})</span>
                <span className="font-medium text-[#141413] text-right">
                  {profile.languages.join(', ')}
                </span>
              </div>
              <div className="py-2 flex justify-between gap-4">
                <span className="text-[#6B6963]">Experience</span>
                <span className="font-medium text-[#141413] tabular-nums">
                  {profile.experienceYears} Years
                </span>
              </div>
              <div className="py-2 flex justify-between gap-4">
                <span className="text-[#6B6963]">Address / Base</span>
                <span className="font-medium text-[#141413] text-right inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#BE123C] shrink-0" />
                  {profile.address.area}, {profile.address.city}, {profile.address.state} - {profile.address.pinCode}
                </span>
              </div>
              <div className="py-2 flex justify-between gap-4">
                <span className="text-[#6B6963]">Membership Tier</span>
                <span className="font-semibold text-[#141413]">
                  {profile.isPaid ? 'Priority Paid Member' : 'Standard Verified Member'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Unlimited YouTube Showreels, & Full 28-Point Casting Portfolio */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="font-display text-base font-bold text-[#141413]">
              Professional Biography & Work Summary
            </h3>
            <p className="mt-2 text-sm text-[#3F3E3B] leading-relaxed">{profile.bio}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#6B6963] tabular-nums">
              <span className="inline-flex items-center gap-1 text-[#15803D] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Aadhaar KYC Verified
              </span>
              <span aria-hidden="true">·</span>
              <span>Profile Views: {profile.viewsCount}</span>
              <span aria-hidden="true">·</span>
              <span>Studio Contact Unlocks: {profile.contactUnlocksCount}</span>
            </div>
          </div>

          {/* Unlimited YouTube Showreel & Work Links */}
          <div className="pt-5 border-t border-[#E6E4DD]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-base font-bold text-[#141413] inline-flex items-center gap-2">
                <Film className="w-4 h-4 text-[#BE123C]" />
                YouTube Showreels & Work Links ({profile.youtubeLinks.length})
              </h3>
            </div>

            {activeYoutubeEmbed ? (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-[#E6E4DD]">
                <iframe
                  src={activeYoutubeEmbed}
                  title={`${profile.fullName} Showreel Video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-xs text-[#6B6963]">No YouTube video links attached yet.</p>
            )}

            {profile.youtubeLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.youtubeLinks.map((yt, idx) => (
                  <button
                    key={`${yt}-${idx}`}
                    type="button"
                    onClick={() => setSelectedVideoIdx(idx)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      selectedVideoIdx === idx
                        ? 'bg-[#141413] text-white border-[#141413]'
                        : 'bg-[#FAF9F6] text-[#141413] border-[#DEDBD2] hover:bg-[#F1EFEA]'
                    }`}
                  >
                    Showreel #{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COMPLETE CASTING PORTFOLIO SPECIFICATION (All Requested Fields) */}
          {cd && (
            <div className="pt-5 border-t border-[#E6E4DD] space-y-5">
              <div>
                <h3 className="font-display text-base font-bold text-[#141413]">
                  Complete Casting & Physical Portfolio Specification
                </h3>
                <p className="text-xs text-[#6B6963] mt-0.5">
                  Comprehensive casting attributes for Production Houses and Casting Directors.
                </p>
              </div>

              {/* 22 Core Physical & Professional Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] text-xs">
                <div>
                  <span className="text-[#6B6963] block">1. Full Name</span>
                  <span className="font-semibold text-[#141413]">{cd.fullName}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">2. Screen Name</span>
                  <span className="font-semibold text-[#141413]">{cd.screenName}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">3. Age</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.age} Years</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">4. City</span>
                  <span className="font-semibold text-[#141413]">{cd.city}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">5. Height</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.height}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">6. Weight</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.weight}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">7. Bust / Chest</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.bust}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">8. Waist</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.waist}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">9. Hip</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.hip}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">10. Skin Tone</span>
                  <span className="font-semibold text-[#141413]">{cd.skinTone}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">11. Eye Colour</span>
                  <span className="font-semibold text-[#141413]">{cd.eyeColour}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">12. Hair Colour</span>
                  <span className="font-semibold text-[#141413]">{cd.hairColour}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">13. Shoe Size</span>
                  <span className="font-semibold text-[#141413] tabular-nums">{cd.shoeSize}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">14. Marital Status</span>
                  <span className="font-semibold text-[#141413]">{cd.maritalStatus}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">15. Present Profession</span>
                  <span className="font-semibold text-[#141413]">{cd.presentProfession}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">16. Education</span>
                  <span className="font-semibold text-[#141413]">{cd.education}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">17. Dresses Comfortable</span>
                  <span className="font-semibold text-[#141413]">{cd.dressesComfortable}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">18. Open for Outstation Shoots</span>
                  <span className="font-semibold text-[#141413]">
                    {cd.openForOutstationShoots ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">19. Open for Out of Country Shoots</span>
                  <span className="font-semibold text-[#141413]">
                    {cd.openForOutOfCountryShoots ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">20. Passport</span>
                  <span className="font-semibold text-[#141413]">{cd.passport}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">21. Experience</span>
                  <span className="font-semibold text-[#141413]">{cd.experience}</span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">22. Comfortable with all Timings</span>
                  <span className="font-semibold text-[#141413]">
                    {cd.comfortableWithAllTimings ? 'Yes (Day & Night Shifts)' : 'Standard Shifts'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B6963] block">23. Instagram ID</span>
                  <span className="font-mono font-semibold text-[#141413]">
                    {profile.unlockedPhone ? cd.instagramId : '@protected_by_admin'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#6B6963] block">24. Allergies to Dust or Cosmetics</span>
                  <span className="font-semibold text-[#141413]">{cd.allergiesToDustOrCosmetics}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-[#6B6963] block">25. Career Aim</span>
                  <span className="font-semibold text-[#141413]">{cd.aim}</span>
                </div>
              </div>

              {/* INTERESTED IN (14 Categories) */}
              <div>
                <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-2">
                  Interested In ({cd.interestedIn.length} Selected)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#3F3E3B]">
                  {cd.interestedIn.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMFORTABLE WITH (On-Screen & Wardrobe Preferences) */}
              <div>
                <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider mb-2">
                  Comfortable With ({cd.comfortableWith.length} Selected)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#3F3E3B]">
                  {cd.comfortableWith.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#BE123C] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileDetailModal() {
  const {
    snapshot,
    lang,
    activeProfileId,
    closeProfile,
    setActiveSection,
    showToast,
  } = usePlatformForModal();

  if (!activeProfileId) return null;

  const profile = snapshot.profiles.find(
    (p) => p.id.toUpperCase() === activeProfileId.toUpperCase()
  );

  if (!profile) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4">
          <h3 className="font-display text-lg font-bold text-[#141413]">
            Profile ID {activeProfileId} Not Found
          </h3>
          <p className="text-xs text-[#6B6963]">
            Check the Unique ID number (for example: 24C-1001) and try again.
          </p>
          <button
            type="button"
            onClick={closeProfile}
            className="px-4 py-2 text-xs font-semibold bg-[#141413] text-white rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const craft = snapshot.crafts.find((c) => c.id === profile.craftId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Profile ${profile.id} — ${profile.fullName}`}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-6"
    >
      <div className="max-w-5xl mx-auto my-4">
        <ProfileDetailContent
          profile={profile}
          craft={craft}
          lang={lang}
          viewer={snapshot.viewer}
          onClose={closeProfile}
          onCopySuccess={(msg) => showToast(msg)}
          onRequestProductionAuth={() => {
            closeProfile();
            setActiveSection('account');
          }}
        />
      </div>
    </div>
  );
}

// Helper import wrapper to keep ProfileDetailContent decoupled for standalone /profile/[id] page
import { usePlatform as usePlatformForModal } from './PlatformProvider';
