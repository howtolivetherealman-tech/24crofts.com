'use client';

import React, { useState } from 'react';
import {
  Bell,
  Download,
  Film,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Smartphone,
  WifiOff,
  X,
} from 'lucide-react';
import { FILM_INDUSTRIES, INDIAN_LANGUAGES, UI_COPY } from '@/lib/crafts-data';
import { triggerBrowserPushNotification, useOnlineStatus, usePWAInstall } from '@/hooks/usePWA';
import { usePlatform } from './PlatformProvider';
import type { FilmIndustry, Language } from '@/lib/types';

export function HeaderAndToolbar() {
  const {
    snapshot,
    lang,
    setLang,
    activeSection,
    setActiveSection,
    setSelectedCraftId,
    searchQuery,
    setSearchQuery,
    filterIndustry,
    setFilterIndustry,
    filterLanguage,
    setFilterLanguage,
    setIsUploadAdModalOpen,
    openProfile,
    showToast,
    logout,
  } = usePlatform();

  const copy = UI_COPY[lang];
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [appGuideOpen, setAppGuideOpen] = useState(false);

  const viewer = snapshot.viewer;

  const handleQuickIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // If user entered a direct ID like "24C-1001" or "1001", open it immediately if exact match!
    const exact = snapshot.profiles.find(
      (p) =>
        p.id.toUpperCase() === q.toUpperCase() ||
        p.id.toUpperCase() === `24C-${q.toUpperCase()}`
    );
    if (exact) {
      openProfile(exact.id);
      return;
    }
    if (activeSection !== 'home' && activeSection !== 'crafts') {
      setActiveSection('home');
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) showToast('24crofts.com installed to your device home screen!');
    } else {
      setAppGuideOpen(true);
    }
  };

  return (
    <>
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 bg-[#FAF9F6]/95 backdrop-blur border-b border-[#E6E4DD] px-4 sm:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => {
            setSelectedCraftId(null);
            setActiveSection('home');
          }}
          className="font-display text-xl font-bold tracking-tight text-[#141413] hover:text-[#BE123C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          24crofts.com
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52514E]">
          <button
            type="button"
            onClick={() => {
              setSelectedCraftId(null);
              setActiveSection('home');
            }}
            className={`hover:text-[#141413] py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'home' ? 'border-[#BE123C] text-[#141413] font-semibold' : 'border-transparent'
            }`}
          >
            {copy.navHome}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCraftId(null);
              setActiveSection('crafts');
            }}
            className={`hover:text-[#141413] py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'crafts' ? 'border-[#BE123C] text-[#141413] font-semibold' : 'border-transparent'
            }`}
          >
            {copy.navCrafts}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('register')}
            className={`hover:text-[#141413] py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'register' ? 'border-[#BE123C] text-[#141413] font-semibold' : 'border-transparent'
            }`}
          >
            {copy.navRegister}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('contact')}
            className={`hover:text-[#141413] py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'contact' ? 'border-[#BE123C] text-[#141413] font-semibold' : 'border-transparent'
            }`}
          >
            {copy.navContact}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection(viewer.role === 'admin' ? 'admin' : 'account')}
            className={`hover:text-[#141413] py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'account' || activeSection === 'admin'
                ? 'border-[#BE123C] text-[#141413] font-semibold'
                : 'border-transparent'
            }`}
          >
            {viewer.role === 'admin' ? 'Admin CMS' : copy.navAccount}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (plus mobile menu button on narrow screens) */}
        <div className="flex items-center gap-3 shrink-0">
          {viewer.role === 'admin' ? (
            <button
              type="button"
              onClick={() => setActiveSection('admin')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#141413] rounded-lg hover:bg-[#292826] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin Dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#BE123C] rounded-lg hover:bg-[#9F1239] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copy.ctaRegister}
            </button>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-[#E6E4DD] text-[#141413] hover:bg-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E4DD] px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['home', copy.navHome],
                ['crafts', copy.navCrafts],
                ['register', copy.navRegister],
                ['contact', copy.navContact],
                [viewer.role === 'admin' ? 'admin' : 'account', viewer.role === 'admin' ? 'Admin CMS' : copy.navAccount],
              ] as const
            ).map(([sec, label]) => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  if (sec === 'home' || sec === 'crafts') setSelectedCraftId(null);
                  setActiveSection(sec);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 text-left text-sm font-medium rounded-lg whitespace-nowrap ${
                  activeSection === sec
                    ? 'bg-[#141413] text-white'
                    : 'bg-[#FAF9F6] text-[#141413] hover:bg-[#F1EFEA]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE UTILITY & SEARCH TOOLBAR (Below Top Bar) */}
      <div className="bg-white border-b border-[#E6E4DD] px-4 sm:px-8 py-3">
        <div className="max-w-[1360px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search by Unique Profile ID, Name, Craft, Industry, Language */}
          <form onSubmit={handleQuickIdSubmit} className="flex flex-1 flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex flex-1 items-center gap-2 min-w-0 w-full sm:w-auto">
              <div className="relative flex-1 min-w-0">
                <label htmlFor="global-profile-search" className="sr-only">
                  Search Profiles by Unique ID or Name
                </label>
                <Search className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="global-profile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413] placeholder:text-[#787671] focus:outline-none focus:ring-2 focus:ring-[#BE123C]/30 focus:border-[#BE123C]"
                />
              </div>

              <button
                type="submit"
                className="sm:hidden px-3.5 py-2 text-xs font-semibold bg-[#141413] text-white rounded-lg hover:bg-[#2C2B29] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Search ID
              </button>
            </div>

            <label htmlFor="industry-filter-select" className="sr-only">
              Filter by Film Industry
            </label>
            <select
              id="industry-filter-select"
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value as FilmIndustry | 'all')}
              className="hidden sm:block px-3 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413] focus:outline-none focus:border-[#BE123C]"
            >
              <option value="all">{copy.allIndustries}</option>
              {FILM_INDUSTRIES.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.id}
                </option>
              ))}
            </select>

            <label htmlFor="language-filter-select" className="sr-only">
              Filter by Spoken Language
            </label>
            <select
              id="language-filter-select"
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="hidden md:block px-3 py-2 text-xs sm:text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413] focus:outline-none focus:border-[#BE123C]"
            >
              <option value="all">{copy.allLanguages}</option>
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l} value={l.split(' ')[0]}>
                  {l}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-medium bg-[#141413] text-white rounded-lg hover:bg-[#2C2B29] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search ID
            </button>
          </form>

          {/* Right Workspace Controls: Submit Ad, Single-File HTML Download, Multi-Language, PWA Install, Notifications, Active User */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/24crofts-hostinger-index.html"
              download="index.html"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#15803D] rounded-lg hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Download Complete Single-File HTML (HTML + CSS + JS) for Hostinger"
            >
              <Download className="w-3.5 h-3.5" />
              Single-File index.html
            </a>

            <button
              type="button"
              onClick={() => setIsUploadAdModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#141413] bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-[#BE123C]" />
              {copy.uploadAdBtn}
            </button>

            {/* Trilingual Switcher */}
            <div role="group" aria-label="Language Switcher" className="inline-flex items-center p-0.5 bg-[#F1EFEA] rounded-lg">
              {(
                [
                  ['te', 'తెలుగు'],
                  ['en', 'EN'],
                  ['hi', 'हिन्दी'],
                ] as [Language, string][]
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    lang === code ? 'bg-white text-[#141413] shadow-xs' : 'text-[#52514E] hover:text-[#141413]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* In-App PWA Install Button (Android / Desktop / iOS) */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#BE123C] bg-[#FFF1F2] border border-[#FECDD3] rounded-lg hover:bg-[#FFE4E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isIOS ? 'iOS App' : 'Install App'}
              </button>
            )}

            {/* Mobile Notifications Button */}
            <div className="relative">
              <button
                type="button"
                aria-label="Open platform notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#141413] bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">{snapshot.notifications.length}</span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#DEDBD2] rounded-xl shadow-lg p-4 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E6E4DD]">
                    <span className="text-sm font-semibold text-[#141413]">
                      Mobile & Casting Alerts
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const granted = await triggerBrowserPushNotification(
                          '24crofts.com Push Active',
                          'You will receive instant casting and approval alerts on your device.'
                        );
                        showToast(
                          granted
                            ? 'Browser & Mobile Push Notifications enabled!'
                            : 'In-app alerts are active for your session.'
                        );
                      }}
                      className="text-xs font-medium text-[#BE123C] hover:underline cursor-pointer"
                    >
                      Enable Device Push
                    </button>
                  </div>
                  <div className="mt-3 max-h-64 overflow-y-auto divide-y divide-[#F1EFEA]">
                    {snapshot.notifications.map((n) => (
                      <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                        <p className="text-xs font-semibold text-[#141413]">{n.title}</p>
                        <p className="text-xs text-[#52514E] mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Session Status & Logout */}
            {viewer.role !== 'guest' && (
              <div className="inline-flex items-center gap-2 pl-2 border-l border-[#E6E4DD]">
                <button
                  type="button"
                  onClick={() => setActiveSection(viewer.role === 'admin' ? 'admin' : 'account')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#141413] hover:text-[#BE123C] max-w-[140px] truncate cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                  <span className="truncate">{viewer.displayName || viewer.username}</span>
                </button>
                <button
                  type="button"
                  aria-label="Sign out"
                  onClick={logout}
                  className="p-1.5 text-[#52514E] hover:text-[#BE123C] rounded-md cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline Mode Resilience Banner */}
      {!isOnline && (
        <div role="status" className="bg-[#FEF3C7] border-b border-[#FDE68A] px-4 sm:px-8 py-2 text-xs text-[#92400E] flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            Offline Mode Active — Browsing encrypted local cache of 24crofts.com profiles and 24 crafts directory.
          </span>
        </div>
      )}

      {/* Guided iOS & Android PWA Installation Modal */}
      {appGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#BE123C]" />
                <h3 id="pwa-guide-title" className="font-display text-lg font-bold text-[#141413]">
                  Install 24Crofts on iOS & Android
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close app install guide"
                onClick={() => setAppGuideOpen(false)}
                className="p-1 text-[#52514E] hover:text-[#141413] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#3F3E3B]">
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                <p className="font-semibold text-[#141413]">iPhone / iPad (iOS Safari)</p>
                <p className="text-xs text-[#52514E] mt-1 leading-relaxed">
                  1. Tap the <strong>Share</strong> icon in the bottom Safari toolbar.
                  <br />
                  2. Scroll down and select <strong>Add to Home Screen</strong> to launch 24Crofts in full-screen standalone mode with offline access.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                <p className="font-semibold text-[#141413]">Android (Chrome / Edge)</p>
                <p className="text-xs text-[#52514E] mt-1 leading-relaxed">
                  1. Tap the browser menu (<strong>⋮</strong>) in the top right corner.
                  <br />
                  2. Tap <strong>Install App</strong> or <strong>Add to Home screen</strong> for native APK-grade launch and push notifications.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAppGuideOpen(false)}
              className="mt-5 w-full py-2.5 text-sm font-semibold text-white bg-[#141413] rounded-lg hover:bg-[#2C2B29] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
