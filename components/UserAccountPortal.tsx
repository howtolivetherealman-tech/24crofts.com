'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Film,
  ImagePlus,
  KeyRound,
  Lock,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Youtube,
} from 'lucide-react';
import { FILM_INDUSTRIES, INDIAN_LANGUAGES } from '@/lib/crafts-data';
import { usePlatform } from './PlatformProvider';
import type { FilmIndustry } from '@/lib/types';

type LoginPortalFilter = 'all' | 'talent' | 'production_house' | 'admin';

export function UserAccountPortal() {
  const { snapshot, lang, callApi, showToast, setActiveSection, openProfile, logout } =
    usePlatform();
  const viewer = snapshot.viewer;

  const [portalFilter, setPortalFilter] = useState<LoginPortalFilter>('all');

  // 1. Separate State for 24 Crafts Category Login
  const [selectedCraftCategory, setSelectedCraftCategory] = useState<string>('all');
  const [categoryUsername, setCategoryUsername] = useState('');
  const [categoryPassword, setCategoryPassword] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // 2. Separate State for Production House Login
  const [studioUsername, setStudioUsername] = useState('');
  const [studioPassword, setStudioPassword] = useState('');
  const [studioError, setStudioError] = useState('');
  const [studioLoading, setStudioLoading] = useState(false);

  // 3. Separate State for Website Admin Login
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  // Talent Self-Edit Form State
  const myProfile =
    viewer.role === 'talent'
      ? snapshot.profiles.find((p) => p.id === viewer.userId)
      : undefined;

  const [editFullName, setEditFullName] = useState('');
  const [editScreenName, setEditScreenName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editIndustry, setEditIndustry] = useState<FilmIndustry>('Tollywood');
  const [editCity, setEditCity] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [editYoutube, setEditYoutube] = useState<string[]>([]);
  const [editLangs, setEditLangs] = useState<string[]>([]);

  useEffect(() => {
    if (!myProfile) return;
    setEditFullName(myProfile.fullName);
    setEditScreenName(myProfile.screenName);
    setEditBio(myProfile.bio);
    setEditIndustry(myProfile.industry);
    setEditCity(myProfile.address.city);
    setEditArea(myProfile.address.area);
    setEditPhone(myProfile.unlockedPhone || '');
    setEditPhotos(myProfile.photos);
    setEditYoutube(myProfile.youtubeLinks.length ? myProfile.youtubeLinks : ['']);
    setEditLangs(myProfile.languages);
  }, [myProfile?.id]);

  const handleCategoryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    if (!categoryUsername.trim() || !categoryPassword) {
      setCategoryError('Please enter your 24 Crafts Category User ID and Password.');
      return;
    }
    setCategoryLoading(true);
    const res = await callApi('login', {
      username: categoryUsername,
      password: categoryPassword,
      expectedRole: 'talent',
    });
    setCategoryLoading(false);

    if (!res.success) {
      setCategoryError(res.error || 'Invalid 24 Crafts Category User ID or Password.');
      return;
    }

    const loggedInViewer = res.data?.viewer as { displayName?: string } | undefined;
    showToast(`Signed in to 24 Crafts Category Portal: ${loggedInViewer?.displayName || ''}`);
  };

  const handleStudioLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudioError('');
    if (!studioUsername.trim() || !studioPassword) {
      setStudioError('Please enter your Production House User ID and Password.');
      return;
    }
    setStudioLoading(true);
    const res = await callApi('login', {
      username: studioUsername,
      password: studioPassword,
      expectedRole: 'production_house',
    });
    setStudioLoading(false);

    if (!res.success) {
      setStudioError(res.error || 'Invalid Production House User ID or Password.');
      return;
    }

    const loggedInViewer = res.data?.viewer as { displayName?: string } | undefined;
    showToast(`Signed in to Production House Portal: ${loggedInViewer?.displayName || ''}`);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminUsername.trim() || !adminPassword) {
      setAdminError('Please enter Website Admin User ID and Password.');
      return;
    }
    setAdminLoading(true);
    const res = await callApi('login', {
      username: adminUsername,
      password: adminPassword,
      expectedRole: 'admin',
    });
    setAdminLoading(false);

    if (!res.success) {
      setAdminError(res.error || 'Invalid Website Admin User ID or Password.');
      return;
    }

    showToast('Signed in to Website Admin Command Center.');
    setActiveSection('admin');
  };

  const handleSaveMyProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProfile) return;
    setLoading(true);
    const res = await callApi('update_profile', {
      profileId: myProfile.id,
      updates: {
        fullName: editFullName,
        screenName: editScreenName,
        bio: editBio,
        industry: editIndustry,
        languages: editLangs,
        address: {
          ...myProfile.address,
          city: editCity,
          area: editArea,
        },
        phone: editPhone,
        photos: editPhotos.slice(0, 25),
        youtubeLinks: editYoutube.filter((u) => u.trim().length > 0),
      },
    });
    setLoading(false);
    if (res.success) {
      showToast('Your profile, gallery photos, and YouTube showreel links have been updated!');
    } else {
      showToast(res.error || 'Could not update profile.');
    }
  };

  const handleAddGalleryPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 25 - editPhotos.length;
    files.slice(0, Math.max(0, remaining)).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditPhotos((prev) => (prev.length < 25 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 1. GUEST LOGIN SCREEN — 3 STRICTLY SEPARATE LOGIN PORTALS (NO CREDENTIALS SHOWN ANYWHERE)
  if (viewer.role === 'guest') {
    const showCategoryPortal = portalFilter === 'all' || portalFilter === 'talent';
    const showStudioPortal = portalFilter === 'all' || portalFilter === 'production_house';
    const showAdminPortal = portalFilter === 'all' || portalFilter === 'admin';

    return (
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Header & Separate Role Filter Bar */}
        <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#BE123C] tracking-wider uppercase">
              24CROFTS.COM · SEPARATE ROLE-BASED SECURE LOGIN PORTALS
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
              24 విభాగాల కేటగిరీ · ప్రొడక్షన్ హౌస్ · అడ్మిన్ ప్రత్యేక లాగిన్ పేజీ
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6963]">
              మీ విభాగానికి సంబంధించిన ప్రత్యేక లాగిన్ బాక్స్‌లో మీ User ID మరియు Password ఎంటర్ చేసి లాగిన్ అవ్వండి.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Select Separate Login Portal"
            className="flex flex-wrap items-center gap-2 bg-[#FAF9F6] p-1.5 rounded-xl border border-[#E6E4DD]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={portalFilter === 'all'}
              onClick={() => setPortalFilter('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                portalFilter === 'all'
                  ? 'bg-[#141413] text-white'
                  : 'text-[#52514E] hover:text-[#141413]'
              }`}
            >
              అన్ని లాగిన్లు (All 3 Portals)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={portalFilter === 'talent'}
              onClick={() => setPortalFilter('talent')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                portalFilter === 'talent'
                  ? 'bg-[#BE123C] text-white'
                  : 'text-[#52514E] hover:text-[#141413]'
              }`}
            >
              1. 24 Crafts కేటగిరీ లాగిన్
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={portalFilter === 'production_house'}
              onClick={() => setPortalFilter('production_house')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                portalFilter === 'production_house'
                  ? 'bg-[#D97706] text-white'
                  : 'text-[#52514E] hover:text-[#141413]'
              }`}
            >
              2. ప్రొడక్షన్ హౌస్ లాగిన్
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={portalFilter === 'admin'}
              onClick={() => setPortalFilter('admin')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                portalFilter === 'admin'
                  ? 'bg-[#15803D] text-white'
                  : 'text-[#52514E] hover:text-[#141413]'
              }`}
            >
              3. అడ్మిన్ లాగిన్
            </button>
          </div>
        </div>

        {/* 3 Separate Login Portals Grid */}
        <div
          className={`grid grid-cols-1 ${
            portalFilter === 'all' ? 'lg:grid-cols-3' : 'max-w-xl mx-auto'
          } gap-6 items-stretch`}
        >
          {/* PORTAL 1: 24 CRAFTS CATEGORY / ARTIST LOGIN */}
          {showCategoryPortal && (
            <div className="bg-white border-2 border-[#E6E4DD] hover:border-[#BE123C]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-[#F1EFEA] pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#BE123C]">
                      <Film className="w-3.5 h-3.5" />
                      PORTAL 1 · CATEGORY LOGIN
                    </span>
                    <h2 className="font-display text-xl font-bold text-[#141413]">
                      24 విభాగాల కేటగిరీ లాగిన్
                    </h2>
                    <p className="text-xs text-[#6B6963]">
                      24 Crafts Artists & Technicians Separate Login
                    </p>
                  </div>
                </div>

                {categoryError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs font-semibold text-[#BE123C]"
                  >
                    {categoryError}
                  </div>
                )}

                <form onSubmit={handleCategoryLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-category-select"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      24 Crafts విభాగం (Select Craft Category)
                    </label>
                    <select
                      id="login-category-select"
                      value={selectedCraftCategory}
                      onChange={(e) => setSelectedCraftCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                    >
                      <option value="all">అన్ని 24 విభాగాలు (All 24 Cinema Crafts)</option>
                      {snapshot.crafts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.number}. {lang === 'te' ? c.nameTe : lang === 'hi' ? c.nameHi : c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="login-category-userid"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Category User ID / Profile ID *
                    </label>
                    <input
                      id="login-category-userid"
                      type="text"
                      autoComplete="username"
                      value={categoryUsername}
                      onChange={(e) => setCategoryUsername(e.target.value)}
                      placeholder="Enter your Category User ID or Profile ID"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-category-password"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Category Password *
                    </label>
                    <input
                      id="login-category-password"
                      type="password"
                      autoComplete="current-password"
                      value={categoryPassword}
                      onChange={(e) => setCategoryPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={categoryLoading}
                    className="w-full py-3 text-sm font-bold text-white bg-[#BE123C] rounded-xl hover:bg-[#9F1239] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    {categoryLoading
                      ? 'Verifying Category Login...'
                      : 'Sign In — 24 Crafts Category'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#6B6963]">
                <span>కొత్త కళాకారులు / టెక్నీషియన్లు?</span>
                <button
                  type="button"
                  onClick={() => setActiveSection('register')}
                  className="font-semibold text-[#BE123C] hover:underline cursor-pointer"
                >
                  24 Crafts రిజిస్ట్రేషన్ →
                </button>
              </div>
            </div>
          )}

          {/* PORTAL 2: PRODUCTION HOUSE SEPARATE LOGIN */}
          {showStudioPortal && (
            <div className="bg-white border-2 border-[#E6E4DD] hover:border-[#D97706]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-[#F1EFEA] pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                      <Building2 className="w-3.5 h-3.5" />
                      PORTAL 2 · PRODUCTION HOUSE LOGIN
                    </span>
                    <h2 className="font-display text-xl font-bold text-[#141413]">
                      ప్రొడక్షన్ హౌస్ లాగిన్
                    </h2>
                    <p className="text-xs text-[#6B6963]">
                      Film Banners, Studios & Casting Houses Separate Login
                    </p>
                  </div>
                </div>

                {studioError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs font-semibold text-[#BE123C]"
                  >
                    {studioError}
                  </div>
                )}

                <form onSubmit={handleStudioLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-studio-userid"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Production House User ID *
                    </label>
                    <input
                      id="login-studio-userid"
                      type="text"
                      autoComplete="username"
                      value={studioUsername}
                      onChange={(e) => setStudioUsername(e.target.value)}
                      placeholder="Enter your Production House User ID"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-studio-password"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Production House Password *
                    </label>
                    <input
                      id="login-studio-password"
                      type="password"
                      autoComplete="current-password"
                      value={studioPassword}
                      onChange={(e) => setStudioPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={studioLoading}
                    className="w-full py-3 text-sm font-bold text-white bg-[#B45309] rounded-xl hover:bg-[#92400E] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    {studioLoading
                      ? 'Verifying Studio Login...'
                      : 'Sign In — Production House'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#6B6963]">
                <span>కొత్త ప్రొడక్షన్ హౌస్ నమోదు?</span>
                <button
                  type="button"
                  onClick={() => setActiveSection('register')}
                  className="font-semibold text-[#B45309] hover:underline cursor-pointer"
                >
                  ప్రొడక్షన్ హౌస్ రిజిస్ట్రేషన్ →
                </button>
              </div>
            </div>
          )}

          {/* PORTAL 3: WEBSITE ADMIN SEPARATE LOGIN */}
          {showAdminPortal && (
            <div className="bg-white border-2 border-[#E6E4DD] hover:border-[#141413]/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xs transition-colors">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-[#F1EFEA] pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#15803D]">
                      <Lock className="w-3.5 h-3.5" />
                      PORTAL 3 · ADMIN TEAM LOGIN
                    </span>
                    <h2 className="font-display text-xl font-bold text-[#141413]">
                      వెబ్‌సైట్ అడ్మిన్ లాగిన్
                    </h2>
                    <p className="text-xs text-[#6B6963]">
                      Authorized 24crofts.com Website Admin Team Only
                    </p>
                  </div>
                </div>

                {adminError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs font-semibold text-[#BE123C]"
                  >
                    {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-admin-userid"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Admin User ID *
                    </label>
                    <input
                      id="login-admin-userid"
                      type="text"
                      autoComplete="username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter Admin User ID"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-admin-password"
                      className="block text-xs font-semibold text-[#141413] mb-1"
                    >
                      Admin Password *
                    </label>
                    <input
                      id="login-admin-password"
                      type="password"
                      autoComplete="current-password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter Admin password"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="w-full py-3 text-sm font-bold text-white bg-[#141413] rounded-xl hover:bg-[#15803D] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {adminLoading ? 'Verifying Admin...' : 'Sign In — Website Admin'}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-[#F1EFEA] text-xs text-[#6B6963]">
                <span>AES-256-GCM Encrypted Admin Command Center</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // 2. ADMIN REDIRECT NOTICE
  if (viewer.role === 'admin') {
    return (
      <section className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="bg-white border border-[#E6E4DD] rounded-2xl p-8 space-y-4">
          <ShieldCheck className="w-10 h-10 text-[#15803D] mx-auto" />
          <h2 className="font-display text-2xl font-bold text-[#141413]">
            Signed In as Website Admin
          </h2>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSection('admin')}
              className="px-5 py-2.5 text-sm font-semibold bg-[#141413] text-white rounded-xl cursor-pointer"
            >
              Open Full Admin CMS & Reporting Dashboard
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 text-sm font-medium border border-[#DEDBD2] rounded-xl cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. PRODUCTION HOUSE PORTAL
  if (viewer.role === 'production_house') {
    const myPh = snapshot.productionHouses.find((p) => p.id === viewer.userId);
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#BE123C]">
              <Building2 className="w-4 h-4" />
              <span>PRODUCTION HOUSE ID: {viewer.userId}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-[#141413]">
              {viewer.displayName}
            </h1>
            {viewer.isApproved && viewer.canViewContacts ? (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                <CheckCircle2 className="w-4 h-4" />
                Approved by 24crofts.com Admin Team — Direct Talent Contact Numbers Unlocked!
              </p>
            ) : (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B45309]">
                <Clock className="w-4 h-4" />
                Pending Website Admin Team Approval — Talent Contact Numbers Remain Locked Until Verified.
              </p>
            )}
            {myPh && (
              <p className="text-xs text-[#6B6963]">
                Uploaded Movie Registration Form: <strong>{myPh.movieRegistrationFormName}</strong> · Aadhaar: {myPh.aadhaarMasked}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveSection('crafts')}
              className="px-4 py-2.5 text-xs font-semibold bg-[#BE123C] text-white rounded-lg cursor-pointer"
            >
              Browse 24 Crafts Talent
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 text-xs font-medium bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 4. TALENT SELF-SERVICE PROFILE EDIT PORTAL
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold text-[#BE123C] tabular-nums">
            MY UNIQUE PROFILE ID: {myProfile?.id}
          </p>
          <h1 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
            Edit My Profile, 25 Photos & Showreel Links
          </h1>
          <p className="text-xs text-[#6B6963] mt-1 tabular-nums">
            Profile Views: {myProfile?.viewsCount || 0} · Studio Contact Unlocks: {myProfile?.contactUnlocksCount || 0}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {myProfile && (
            <>
              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/profile/${myProfile.id}`;
                  navigator.clipboard?.writeText(url).catch(() => undefined);
                  showToast(`Shareable link copied: ${url}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#BE123C]" />
                Copy My ID Link
              </button>
              <button
                type="button"
                onClick={() => openProfile(myProfile.id)}
                className="px-3.5 py-2 text-xs font-semibold bg-[#141413] text-white rounded-lg cursor-pointer"
              >
                Preview Public Profile
              </button>
            </>
          )}
          <button
            type="button"
            onClick={logout}
            className="px-3 py-2 text-xs font-medium text-[#52514E] hover:text-[#BE123C] cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {myProfile && (
        <form onSubmit={handleSaveMyProfile} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-fullname" className="block text-xs font-semibold mb-1">Full Name</label>
              <input id="edit-fullname" type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
            </div>
            <div>
              <label htmlFor="edit-screenname" className="block text-xs font-semibold mb-1">Screen Name</label>
              <input id="edit-screenname" type="text" value={editScreenName} onChange={(e) => setEditScreenName(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
            </div>
            <div>
              <label htmlFor="edit-industry" className="block text-xs font-semibold mb-1">Film Industry</label>
              <select id="edit-industry" value={editIndustry} onChange={(e) => setEditIndustry(e.target.value as FilmIndustry)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg">
                {FILM_INDUSTRIES.map((i) => (
                  <option key={i.id} value={i.id}>{i.labelEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-city" className="block text-xs font-semibold mb-1">City</label>
              <input id="edit-city" type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
            </div>
            <div>
              <label htmlFor="edit-area" className="block text-xs font-semibold mb-1">Area / Locality</label>
              <input id="edit-area" type="text" value={editArea} onChange={(e) => setEditArea(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
            </div>
            <div>
              <label htmlFor="edit-phone" className="block text-xs font-semibold mb-1">Encrypted Mobile Contact</label>
              <input id="edit-phone" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-3 py-2 text-sm font-mono bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold mb-1">Spoken Languages ({editLangs.length})</span>
            <div className="flex flex-wrap gap-2.5 p-3 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg">
              {INDIAN_LANGUAGES.map((l) => (
                <label key={l} className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editLangs.includes(l)}
                    onChange={() =>
                      setEditLangs((prev) =>
                        prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
                      )
                    }
                    className="rounded border-[#DEDBD2] text-[#BE123C]"
                  />
                  <span>{l.split(' ')[0]}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="edit-bio" className="block text-xs font-semibold mb-1">Biography & Credits</label>
            <textarea id="edit-bio" rows={3} value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg" />
          </div>

          {/* Gallery Up to 25 Photos + Unlimited YouTube Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#F1EFEA]">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Portfolio Photos ({editPhotos.length} / 25 Max)</span>
                <label htmlFor="account-photo-add" className="text-[#BE123C] hover:underline cursor-pointer inline-flex items-center gap-1">
                  <ImagePlus className="w-3.5 h-3.5" />
                  Add Photos
                </label>
                <input id="account-photo-add" type="file" accept="image/*" multiple onChange={handleAddGalleryPhotos} className="sr-only" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {editPhotos.map((src, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#E6E4DD]">
                    <img src={src} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    {editPhotos.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove portfolio photo ${idx + 1}`}
                        onClick={() => setEditPhotos((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Unlimited YouTube Links ({editYoutube.length})</span>
                <button
                  type="button"
                  onClick={() => setEditYoutube((prev) => [...prev, ''])}
                  className="text-[#BE123C] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add YouTube Link
                </button>
              </div>
              <div className="space-y-2">
                {editYoutube.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-[#BE123C] shrink-0" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const copy = [...editYoutube];
                        copy[idx] = e.target.value;
                        setEditYoutube(copy);
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                    {editYoutube.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setEditYoutube((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-[#6B6963] hover:text-[#BE123C] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E4DD] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold bg-[#BE123C] text-white rounded-xl hover:bg-[#9F1239] inline-flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Profile Updates'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
