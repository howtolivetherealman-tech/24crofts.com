'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Film,
  Play,
  PlusCircle,
  SearchX,
  ShieldCheck,
} from 'lucide-react';
import {
  getApprovedAdsForHome,
  getCategorySortedProfiles,
  getHomePriorityProfiles,
  getHomeThreeProfilesPerCraft,
  searchAndFilterProfiles,
} from '@/lib/platform-logic';
import { getCraftName, getCraftTagline, UI_COPY } from '@/lib/crafts-data';
import { ProfileCard } from './ProfileCard';
import { usePlatform } from './PlatformProvider';
import type { AdPlacement } from '@/lib/types';

function AdGridBlock({
  title,
  kicker,
  ads,
  darkTheme = false,
  onSelectAd,
}: {
  title: string;
  kicker: string;
  ads: AdPlacement[];
  darkTheme?: boolean;
  onSelectAd: (ad: AdPlacement) => void;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border ${
        darkTheme
          ? 'bg-[#141413] text-[#FAF9F6] border-[#292826]'
          : 'bg-white text-[#141413] border-[#E6E4DD]'
      }`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <p
            className={`text-xs font-medium ${
              darkTheme ? 'text-[#FDE68A]' : 'text-[#BE123C]'
            }`}
          >
            {kicker}
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            {title}
          </h2>
        </div>
        <span
          className={`text-xs font-mono tabular-nums ${
            darkTheme ? 'text-[#A8A49C]' : 'text-[#6B6963]'
          }`}
        >
          {ads.length} / 6 Admin-Approved Priority Slots
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ads.map((ad, index) => (
          <button
            key={ad.id}
            type="button"
            onClick={() => onSelectAd(ad)}
            className={`group text-left rounded-xl overflow-hidden border transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer ${
              darkTheme
                ? 'bg-[#1D1C1A] border-[#33312E]'
                : 'bg-[#FAF9F6] border-[#E6E4DD]'
            }`}
          >
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <img
                src={ad.mediaImageUrl || '/images/teaser_poster_epic.jpg'}
                alt={ad.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end justify-between p-3">
                <span className="font-mono text-[11px] font-semibold text-[#FDE68A] tabular-nums">
                  Priority #{index + 1}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#BE123C] text-white text-xs font-semibold">
                  <Play className="w-3 h-3 fill-current" />
                  Play
                </span>
              </div>
            </div>
            <div className="p-3.5">
              <p
                className={`text-[11px] font-medium truncate ${
                  darkTheme ? 'text-[#D6D3CD]' : 'text-[#6B6963]'
                }`}
              >
                {ad.bannerOrClientName}
              </p>
              <h3 className="font-display text-sm font-bold mt-0.5 line-clamp-1">
                {ad.title}
              </h3>
              <p
                className={`text-xs mt-1 line-clamp-1 ${
                  darkTheme ? 'text-[#A8A49C]' : 'text-[#52514E]'
                }`}
              >
                {ad.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function HomeAndCraftsSection({ mode }: { mode: 'home' | 'crafts' }) {
  const {
    snapshot,
    lang,
    setActiveSection,
    selectedCraftId,
    setSelectedCraftId,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    searchQuery,
    setSearchQuery,
    filterIndustry,
    setFilterIndustry,
    filterLanguage,
    setFilterLanguage,
    filterPaidOnly,
    setFilterPaidOnly,
    openProfile,
    setIsUploadAdModalOpen,
    setActiveAdLightbox,
    showToast,
  } = usePlatform();

  const [showcaseCraftFilter, setShowcaseCraftFilter] = useState<string>('all');

  const copy = UI_COPY[lang];
  const s = snapshot.siteSettings;

  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    filterIndustry !== 'all' ||
    filterLanguage !== 'all' ||
    filterPaidOnly;

  const filteredResults = searchAndFilterProfiles(snapshot.profiles, {
    query: searchQuery,
    craftId: selectedCraftId || undefined,
    subCategoryId: selectedSubCategoryId,
    industry: filterIndustry,
    language: filterLanguage,
    paidOnly: filterPaidOnly,
  });

  // If a Craft Category is clicked -> Open Dedicated Category + Sub-Category View (Paid Profiles FIRST!)
  if (selectedCraftId) {
    const activeCraft = snapshot.crafts.find((c) => c.id === selectedCraftId);
    if (!activeCraft) {
      setSelectedCraftId(null);
      return null;
    }

    const sortedCategoryProfiles = isFilteringActive
      ? filteredResults
      : getCategorySortedProfiles(snapshot.profiles, activeCraft.id, selectedSubCategoryId);

    return (
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCraftId(null);
              setSelectedSubCategoryId('all');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#141413] hover:text-[#BE123C] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All 24 Cinema Categories
          </button>

          <p className="text-xs font-medium text-[#15803D] inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {copy.paidFirstNotice}
          </p>
        </div>

        {/* Category Header */}
        <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6">
          <p className="font-mono text-xs font-semibold text-[#BE123C] tabular-nums">
            CRAFT {String(activeCraft.number).padStart(2, '0')} OF 24
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            {getCraftName(activeCraft, lang)}
          </h1>
          <p className="text-sm text-[#52514E] mt-1.5 max-w-3xl">
            {getCraftTagline(activeCraft, lang)}
          </p>

          {/* SUB-CATEGORIES SELECTOR (Appears ONLY when Category is clicked!) */}
          <div className="mt-6 pt-5 border-t border-[#F1EFEA]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-[#141413] uppercase tracking-wider">
                Sub-Categories (ఉప-విభాగాలు) — Click to Filter
              </span>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#3F3E3B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterPaidOnly}
                  onChange={(e) => setFilterPaidOnly(e.target.checked)}
                  className="rounded border-[#DEDBD2] text-[#BE123C] focus:ring-[#BE123C]"
                />
                Show Paid Priority Profiles Only
              </label>
            </div>

            <div role="group" aria-label="Sub-category filters" className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubCategoryId('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSubCategoryId === 'all'
                    ? 'bg-[#141413] text-white'
                    : 'bg-[#FAF9F6] text-[#3F3E3B] border border-[#DEDBD2] hover:bg-[#F1EFEA]'
                }`}
              >
                All Sub-Categories ({activeCraft.subCategories.length})
              </button>
              {activeCraft.subCategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubCategoryId(sub.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedSubCategoryId === sub.id
                      ? 'bg-[#BE123C] text-white font-semibold'
                      : 'bg-[#FAF9F6] text-[#141413] border border-[#DEDBD2] hover:bg-[#F1EFEA]'
                  }`}
                >
                  {lang === 'te'
                    ? `${sub.nameTe} (${sub.nameEn})`
                    : lang === 'hi'
                    ? sub.nameHi
                    : sub.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paid-First Profile Grid */}
        {sortedCategoryProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCategoryProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                craft={activeCraft}
                lang={lang}
                onOpen={openProfile}
                onShare={(pid) => showToast(`Share link copied for ${pid}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E6E4DD] rounded-2xl p-10 text-center space-y-3">
            <SearchX className="w-8 h-8 text-[#787671] mx-auto" />
            <h3 className="font-display text-base font-bold text-[#141413]">
              No Profiles in This Sub-Category Yet
            </h3>
            <p className="text-xs text-[#6B6963]">
              Be the first verified professional to register in this sub-category.
            </p>
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#BE123C] rounded-lg cursor-pointer"
            >
              Register Profile Now
            </button>
          </div>
        )}
      </section>
    );
  }

  // Dedicated 24 Crafts Directory Page (Shows ONLY Categories initially — Sub-categories hidden until clicked!)
  if (mode === 'crafts') {
    return (
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#BE123C]">24CROFTS.COM DIRECTORY</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
              {copy.crafts24Title}
            </h1>
            <p className="text-sm text-[#52514E] mt-1">{copy.crafts24Sub}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('register')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#BE123C] rounded-lg hover:bg-[#9F1239] whitespace-nowrap cursor-pointer"
          >
            + Register in Any of 24 Crafts
          </button>
        </div>

        {/* Strictly ONLY the 24 Categories displayed — clicking opens Sub-Categories & Paid-First Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {snapshot.crafts.map((craft) => {
            const count = snapshot.profiles.filter(
              (p) => p.craftId === craft.id && p.status === 'active'
            ).length;
            return (
              <button
                key={craft.id}
                type="button"
                onClick={() => {
                  setSelectedSubCategoryId('all');
                  setSelectedCraftId(craft.id);
                }}
                className="group text-left p-5 bg-white border border-[#E6E4DD] rounded-2xl hover:border-[#BE123C] transition-colors flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B6963] font-mono tabular-nums">
                    <span className="font-bold text-[#BE123C]">
                      {String(craft.number).padStart(2, '0')}. CRAFT
                    </span>
                    <span>{count} Profiles</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#141413] mt-2 group-hover:text-[#BE123C] transition-colors">
                    {lang === 'te' ? craft.nameTe : lang === 'hi' ? craft.nameHi : craft.nameEn}
                  </h2>
                  {lang !== 'en' && (
                    <p className="text-xs font-medium text-[#52514E] mt-0.5">{craft.nameEn}</p>
                  )}
                  <p className="text-xs text-[#6B6963] mt-2 leading-relaxed line-clamp-2">
                    {getCraftTagline(craft, lang)}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs font-semibold text-[#141413] group-hover:text-[#BE123C]">
                  <span>Open Sub-Categories & Profiles</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // HOME PAGE VIEW
  const movieTeasers6 = getApprovedAdsForHome(snapshot.ads, 'movie_teaser', 6);
  const pvtAds6 = getApprovedAdsForHome(snapshot.ads, 'pvt_ad', 6);
  const specialAds6 = getApprovedAdsForHome(snapshot.ads, 'special_ad', 6);
  const todaysNewestProfiles = getHomePriorityProfiles(snapshot.profiles).slice(0, 6);
  const threePerCraftBuckets = getHomeThreeProfilesPerCraft(snapshot.profiles, snapshot.crafts, 3);
  const visibleCraftBuckets =
    showcaseCraftFilter === 'all'
      ? threePerCraftBuckets
      : threePerCraftBuckets.filter((b) => b.craft.id === showcaseCraftFilter);

  const heroKicker =
    lang === 'te' ? s.heroKickerTe : lang === 'hi' ? s.heroKickerHi : s.heroKickerEn;
  const heroHeadline =
    lang === 'te' ? s.heroHeadlineTe : lang === 'hi' ? s.heroHeadlineHi : s.heroHeadlineEn;
  const heroSub =
    lang === 'te'
      ? s.heroSubheadlineTe
      : lang === 'hi'
      ? s.heroSubheadlineHi
      : s.heroSubheadlineEn;
  const announcement =
    lang === 'te'
      ? s.announcementTe
      : lang === 'hi'
      ? s.announcementHi
      : s.announcementEn;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* Live Search & Filter Results (when user searches ID / Name / Industry / Language) */}
      {isFilteringActive && (
        <section className="bg-white border border-[#DEDBD2] rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#BE123C]">LIVE SEARCH & FILTER RESULTS</p>
              <h2 className="font-display text-xl font-bold text-[#141413] tabular-nums">
                Found {filteredResults.length} Matching Profile{filteredResults.length === 1 ? '' : 's'}
                {searchQuery ? ` for “${searchQuery}”` : ''}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterIndustry('all');
                setFilterLanguage('all');
                setFilterPaidOnly(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#141413] bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.slice(0, 12).map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  craft={snapshot.crafts.find((c) => c.id === profile.craftId)}
                  lang={lang}
                  onOpen={openProfile}
                  onShare={(pid) => showToast(`Share link copied for ${pid}`)}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-[#141413]">
                No profile matched your search criteria.
              </p>
              <p className="text-xs text-[#6B6963]">
                Try entering a valid Unique ID such as 24C-1001, 24C-1007, or clearing industry filters.
              </p>
            </div>
          )}
        </section>
      )}

      {/* SPLIT-SCREEN EDITORIAL CINEMA HERO */}
      <section aria-label="Platform Overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Typographic Column */}
          <div className="lg:col-span-7 bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-[#BE123C] tracking-wide">
                {heroKicker}
              </p>
              <h1
                className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#141413] tracking-tight leading-[1.15] mt-3 max-w-2xl"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                {heroHeadline}
              </h1>
              <p className="text-sm sm:text-base text-[#52514E] leading-relaxed mt-4 max-w-xl">
                {heroSub}
              </p>
              <p className="text-xs text-[#6B6963] mt-4 pt-4 border-t border-[#F1EFEA]">
                {announcement}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSection('register')}
                className="px-5 py-3 text-sm font-semibold text-white bg-[#BE123C] rounded-xl hover:bg-[#9F1239] transition-colors whitespace-nowrap cursor-pointer"
              >
                Register Artist / Production House
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('crafts')}
                className="px-5 py-3 text-sm font-semibold text-[#141413] bg-[#FAF9F6] border border-[#DEDBD2] rounded-xl hover:bg-[#F1EFEA] transition-colors whitespace-nowrap cursor-pointer"
              >
                Explore 24 Crafts Directory
              </button>
              <button
                type="button"
                onClick={() => setIsUploadAdModalOpen(true)}
                className="px-4 py-3 text-xs sm:text-sm font-medium text-[#3F3E3B] hover:text-[#BE123C] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#BE123C]" />
                Upload Movie Teaser / Song
              </button>
            </div>
          </div>

          {/* Right Cinema Soundstage Visual Column */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#E6E4DD] relative min-h-[280px] bg-[#141413]">
            <img
              src="/images/cinema_hero_set.jpg"
              alt="Indian cinema soundstage camera crew and director monitor on 24crofts.com"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 text-white">
              <p className="font-mono text-xs text-[#FDE68A] tabular-nums">
                24CROFTS.COM · MATRIMONIAL-GRADE CASTING PRIVACY
              </p>
              <p className="text-sm font-medium mt-1 leading-snug">
                Tollywood · Kollywood · Bollywood · Mollywood · Sandalwood · Pan-India
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width Key Proof Row Below Split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-[#E6E4DD] rounded-2xl p-5">
          <div>
            <div className="font-mono text-2xl font-bold text-[#141413] tabular-nums">24</div>
            <div className="text-xs text-[#6B6963] mt-0.5">
              Traditional Cinema Crafts & Sub-Categories
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
              {snapshot.profiles.length}
            </div>
            <div className="text-xs text-[#6B6963] mt-0.5">
              Aadhaar-Verified Talent Profiles with Shareable IDs
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#141413] tabular-nums">AES-256</div>
            <div className="text-xs text-[#6B6963] mt-0.5">
              Encrypted Contact Vault — Admin-Approved Studios Only
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-[#141413] tabular-nums">25 + ∞</div>
            <div className="text-xs text-[#6B6963] mt-0.5">
              Up to 25 Gallery Photos & Unlimited YouTube Showreels
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOME PAGE ADS SHOWCASE FIRST — 6 MOVIE TEASERS, 6 PVT ADS, 6 SPECIAL ADS */}
      <section aria-label="Cinema Announcements, Teasers and Advertisements" className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E6E4DD]">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#141413] inline-flex items-center gap-2">
              <Film className="w-5 h-5 text-[#BE123C]" />
              Cinema Announcements, Teasers, Songs & Ad Showcases
            </h2>
            <p className="text-xs text-[#6B6963] mt-0.5">
              Every placement and display order is verified and ranked by the 24crofts.com Admin Team.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUploadAdModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#141413] rounded-lg hover:bg-[#BE123C] transition-colors whitespace-nowrap cursor-pointer"
          >
            + Upload Teaser / Song / YouTube Ad
          </button>
        </div>

        {/* 1) 6 Movie Teasers / Trailers / Songs */}
        <AdGridBlock
          title={copy.movieTeasersTitle}
          kicker="THEATRICAL SHOWCASE · YOUTUBE & STUDIO REELS"
          ads={movieTeasers6}
          darkTheme
          onSelectAd={(ad) => setActiveAdLightbox(ad)}
        />

        {/* 2) 6 Pvt Ads */}
        <AdGridBlock
          title={copy.pvtAdsTitle}
          kicker="STUDIO EQUIPMENT, POST-PRODUCTION & UNIT SERVICES"
          ads={pvtAds6}
          onSelectAd={(ad) => setActiveAdLightbox(ad)}
        />

        {/* 3) 6 Special Ads */}
        <AdGridBlock
          title={copy.specialAdsTitle}
          kicker="CASTING CALLS, WORKSHOPS & PREMIER ANNOUNCEMENTS"
          ads={specialAds6}
          onSelectAd={(ad) => setActiveAdLightbox(ad)}
        />
      </section>

      {/* SECTION 2: TODAY'S NEW REGISTRATIONS / DAILY PRIORITY UPLOADS */}
      <section aria-labelledby="todays-uploads-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#BE123C]">DAILY PRIORITY #1 · NEWEST REGISTRATIONS FIRST</p>
            <h2 id="todays-uploads-heading" className="font-display text-2xl font-bold text-[#141413] mt-0.5">
              {copy.todaysUploadsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#52514E] mt-1">{copy.todaysUploadsSub}</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('register')}
            className="text-xs font-semibold text-[#BE123C] hover:underline whitespace-nowrap cursor-pointer"
          >
            Upload Your Profile Today →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysNewestProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              craft={snapshot.crafts.find((c) => c.id === profile.craftId)}
              lang={lang}
              onOpen={openProfile}
              onShare={(pid) => showToast(`Share link copied for ${pid}`)}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: 24 TRADITIONAL CRAFTS — ONLY MAIN CATEGORIES DISPLAYED UNTIL CLICKED */}
      <section aria-labelledby="crafts-24-home-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#BE123C]">24 CRAFTS TAXONOMY · CLICK CATEGORY FOR SUB-CATEGORIES</p>
            <h2 id="crafts-24-home-heading" className="font-display text-2xl font-bold text-[#141413] mt-0.5">
              {copy.crafts24Title}
            </h2>
            <p className="text-xs sm:text-sm text-[#52514E] mt-1">{copy.crafts24Sub}</p>
          </div>
        </div>

        {/* Clean 24 Category Cards (Strictly Main Category Only — No Sub-Categories Shown Here!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {snapshot.crafts.map((craft) => (
            <button
              key={craft.id}
              type="button"
              onClick={() => {
                setSelectedSubCategoryId('all');
                setSelectedCraftId(craft.id);
              }}
              className="group text-left p-4 bg-white border border-[#E6E4DD] rounded-xl hover:border-[#BE123C] transition-colors flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="min-w-0">
                <span className="font-mono text-[11px] font-bold text-[#BE123C] tabular-nums block">
                  CRAFT {String(craft.number).padStart(2, '0')}
                </span>
                <span className="font-display text-sm font-bold text-[#141413] group-hover:text-[#BE123C] block truncate mt-0.5">
                  {lang === 'te' ? craft.nameTe : lang === 'hi' ? craft.nameHi : craft.nameEn}
                </span>
                {lang !== 'en' && (
                  <span className="text-[11px] text-[#6B6963] block truncate">
                    {craft.nameEn}
                  </span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-[#787671] group-hover:text-[#BE123C] shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4: 3 PROFILES PER CATEGORY ACROSS ALL 24 CRAFTS */}
      <section aria-labelledby="three-per-craft-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#E6E4DD]">
          <div>
            <p className="text-xs font-semibold text-[#BE123C]">CATEGORY-WISE TALENT SHOWCASE (24 × 3)</p>
            <h2 id="three-per-craft-heading" className="font-display text-2xl font-bold text-[#141413] mt-0.5">
              {copy.categoryShowcaseTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#52514E] mt-1">{copy.categoryShowcaseSub}</p>
          </div>

          <div className="shrink-0">
            <label htmlFor="jump-craft-select" className="sr-only">
              Jump to specific craft showcase
            </label>
            <select
              id="jump-craft-select"
              value={showcaseCraftFilter}
              onChange={(e) => setShowcaseCraftFilter(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DEDBD2] rounded-lg text-[#141413] font-medium"
            >
              <option value="all">Showing All 24 Crafts (3 Profiles Each)</option>
              {snapshot.crafts.map((c) => (
                <option key={c.id} value={c.id}>
                  {String(c.number).padStart(2, '0')}. {c.nameTe} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-10">
          {visibleCraftBuckets.map(({ craft, profiles }) => (
            <div key={craft.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#141413]">
                    {String(craft.number).padStart(2, '0')}. {getCraftName(craft, lang)}
                  </h3>
                  <p className="text-xs text-[#6B6963]">{getCraftTagline(craft, lang)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubCategoryId('all');
                    setSelectedCraftId(craft.id);
                  }}
                  className="text-xs font-semibold text-[#BE123C] hover:underline whitespace-nowrap cursor-pointer"
                >
                  Open Sub-Categories & Paid Priority List →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    craft={craft}
                    lang={lang}
                    onOpen={openProfile}
                    onShare={(pid) => showToast(`Share link copied for ${pid}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
