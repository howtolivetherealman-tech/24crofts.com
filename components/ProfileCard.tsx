'use client';

import React, { useState } from 'react';
import { Lock, Share2, Unlock } from 'lucide-react';
import type { CraftCategory, Language, TalentProfile } from '@/lib/types';

interface ProfileCardProps {
  profile: TalentProfile;
  craft?: CraftCategory;
  lang: Language;
  onOpen: (id: string) => void;
  onShare?: (id: string) => void;
}

export function ProfileCard({ profile, craft, lang, onOpen, onShare }: ProfileCardProps) {
  const [imgError, setImgError] = useState(false);

  const subCat = craft?.subCategories.find((s) => s.id === profile.subCategoryId);
  const subName =
    lang === 'te'
      ? subCat?.nameTe || profile.subCategoryId
      : lang === 'hi'
      ? subCat?.nameHi || profile.subCategoryId
      : subCat?.nameEn || profile.subCategoryId;

  const primaryImage = profile.photos[0] || '/images/portrait_actor_lead.jpg';

  const handleCopyShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/profile/${profile.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => undefined);
    }
    onShare?.(profile.id);
  };

  return (
    <article className="group bg-white border border-[#E6E4DD] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        {/* Portrait Media Container with Resilient Fallback */}
        <div className="relative aspect-[4/3] w-full bg-[#1C1B19] overflow-hidden">
          {!imgError ? (
            <img
              src={primaryImage}
              alt={`${profile.fullName} — ${profile.id}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#262522] to-[#141413] text-[#FAF9F6] p-4 text-center">
              <span className="font-display text-2xl font-bold tracking-tight">
                {profile.fullName
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span className="font-mono text-xs text-[#D6D3CD] mt-1">{profile.id}</span>
            </div>
          )}

          {/* Measured Dark Gradient Scrim for Legible Overlay Kicker */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pt-8 pb-3 flex items-end justify-between gap-2">
            <span className="font-mono text-xs font-semibold tracking-wide text-white tabular-nums">
              ID: {profile.id}
            </span>
            <span className="text-[11px] font-medium text-[#FDE68A] whitespace-nowrap">
              {profile.isPaid
                ? 'Priority Verified'
                : profile.uploadedToday
                ? 'Uploaded Today'
                : 'Aadhaar Verified'}
            </span>
          </div>
        </div>

        {/* Clean Zero-Pill Editorial Body */}
        <div className="p-4">
          {/* Quiet Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6963]">
            <span className="font-medium text-[#BE123C]">{profile.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.address.city}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{profile.experienceYears} yrs exp</span>
          </div>

          <h3 className="mt-1.5 font-display text-base font-bold text-[#141413] leading-snug">
            {profile.fullName}
          </h3>
          <p className="text-xs font-medium text-[#3F3E3B] mt-0.5 truncate">{subName}</p>

          <p className="mt-2 text-xs text-[#6B6963] line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>

          {/* Languages & Media Counts as Quiet Inline Text */}
          <div className="mt-3 pt-2.5 border-t border-[#F1EFEA] flex items-center justify-between text-[11px] text-[#6B6963] tabular-nums">
            <span className="truncate max-w-[65%]">
              {profile.languagesCount} Languages ({profile.languages.map((l) => l.split(' ')[0]).join(', ')})
            </span>
            <span className="shrink-0">
              {profile.photos.length} Photos · {profile.youtubeLinks.length} Videos
            </span>
          </div>

          {/* Matrimonial Contact Privacy Status */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {profile.unlockedPhone ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                <span className="font-mono font-semibold text-[#15803D] tabular-nums">
                  {profile.unlockedPhone}
                </span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#787671] shrink-0" />
                <span className="text-[#6B6963] truncate">
                  {profile.phoneMasked} (Admin Approval Only)
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpen(profile.id)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-[#141413] rounded-lg hover:bg-[#BE123C] transition-colors whitespace-nowrap cursor-pointer"
        >
          View Full Profile
        </button>
        <button
          type="button"
          aria-label={`Copy shareable link for ${profile.id}`}
          onClick={handleCopyShare}
          className="py-2 px-3 text-xs font-medium text-[#141413] bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </article>
  );
}
