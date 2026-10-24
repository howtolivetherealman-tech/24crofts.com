'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ExternalLink,
  Film,
  KeyRound,
  Lock,
  Save,
  Server,
  Settings,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { triggerBrowserPushNotification } from '@/hooks/usePWA';
import { usePlatform } from './PlatformProvider';
import type { SiteSettings } from '@/lib/types';

type AdminTab =
  | 'analytics'
  | 'profiles'
  | 'studios'
  | 'ads'
  | 'cms'
  | 'adsense'
  | 'hosting_alerts';

export function AdminDashboard() {
  const { snapshot, callApi, showToast, openProfile } = usePlatform();
  const viewer = snapshot.viewer;

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile Credential Editor State
  const [profileFilter, setProfileFilter] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credFullName, setCredFullName] = useState('');
  const [credPhone, setCredPhone] = useState('');
  const [credIsPaid, setCredIsPaid] = useState(false);

  // Ad Filter State
  const [adTypeFilter, setAdTypeFilter] = useState<string>('all');

  // Site CMS Form State
  const [cmsSettings, setCmsSettings] = useState<SiteSettings>(snapshot.siteSettings);
  const [selectedCraftEditIdx, setSelectedCraftEditIdx] = useState(0);
  const [newSubCatTe, setNewSubCatTe] = useState('');
  const [newSubCatEn, setNewSubCatEn] = useState('');

  // Push Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifAudience, setNotifAudience] = useState<'all' | 'artists' | 'production_houses'>('all');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await callApi('login', {
      username: adminUser,
      password: adminPass,
      expectedRole: 'admin',
    });
    if (!res.success) {
      setAuthError(res.error || 'Invalid Admin credentials.');
      return;
    }
    const role = (res.data?.viewer as { role?: string } | undefined)?.role;
    if (role !== 'admin') {
      setAuthError('This account does not have Website Admin Team permissions.');
      return;
    }
    if (res.data?.snapshot) {
      const snap = res.data.snapshot as { siteSettings: SiteSettings };
      setCmsSettings(snap.siteSettings);
    }
    showToast('Authenticated into 24crofts.com Admin Command Center.');
  };

  if (viewer.role !== 'admin') {
    return (
      <section className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#BE123C]" />
            <h1 className="font-display text-xl font-bold text-[#141413]">
              Website Admin Team Login
            </h1>
          </div>
          <p className="text-xs text-[#6B6963]">
            Authorized 24crofts.com administrators only. Manage profiles, credentials, ad priority, Production House contact access, Google AdSense, and site content without code changes.
          </p>
          {authError && (
            <div role="alert" className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs font-semibold text-[#BE123C]">
              {authError}
            </div>
          )}
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div>
              <label htmlFor="adm-id" className="block text-xs font-semibold mb-1">
                Admin User ID
              </label>
              <input
                id="adm-id"
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Enter Admin User ID"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="adm-pw" className="block text-xs font-semibold mb-1">
                Admin Password
              </label>
              <input
                id="adm-pw"
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter Admin password"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 text-sm font-bold text-white bg-[#141413] rounded-xl hover:bg-[#BE123C] transition-colors cursor-pointer"
            >
              Sign In to Admin Panel
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Computed Reporting Metrics
  const totalProfiles = snapshot.profiles.length;
  const paidProfilesCount = snapshot.profiles.filter((p) => p.isPaid).length;
  const totalViews = snapshot.profiles.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalContactUnlocks = snapshot.profiles.reduce((acc, p) => acc + p.contactUnlocksCount, 0);
  const approvedStudios = snapshot.productionHouses.filter((p) => p.isApproved).length;
  const pendingAdsCount = snapshot.ads.filter((a) => a.status === 'pending').length;

  const totalMonthlyHosting = snapshot.hostingEstimates.reduce((acc, i) => acc + i.monthlyInr, 0);
  const totalAnnualHosting = snapshot.hostingEstimates.reduce((acc, i) => acc + i.annualInr, 0);

  const filteredProfiles = snapshot.profiles.filter((p) => {
    const q = profileFilter.trim().toLowerCase();
    if (!q) return true;
    return (
      p.id.toLowerCase().includes(q) ||
      p.fullName.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.industry.toLowerCase().includes(q)
    );
  });

  const filteredAds = snapshot.ads
    .filter((a) => {
      if (adTypeFilter === 'all') return true;
      if (adTypeFilter === 'pending') return a.status === 'pending';
      return a.type === adTypeFilter;
    })
    .slice()
    .sort((a, b) => a.priorityOrder - b.priorityOrder);

  const startEditingProfile = (p: (typeof snapshot.profiles)[number]) => {
    setEditingProfileId(p.id);
    setCredUsername(p.username);
    setCredPassword(p.passwordPlainForAdmin || '');
    setCredFullName(p.fullName);
    setCredPhone(p.unlockedPhone || '');
    setCredIsPaid(p.isPaid);
  };

  const handleSaveProfileCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileId) return;
    const res = await callApi('update_profile', {
      profileId: editingProfileId,
      updates: {
        username: credUsername,
        newPassword: credPassword,
        fullName: credFullName,
        phone: credPhone,
        isPaid: credIsPaid,
      },
    });
    if (res.success) {
      showToast(`Updated account credentials & status for ${editingProfileId}.`);
      setEditingProfileId(null);
    } else {
      showToast(res.error || 'Failed to update profile.');
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await callApi('admin_update_site_settings', { settings: cmsSettings });
    if (res.success) {
      showToast('Site content & configuration updated live across 24crofts.com!');
    }
  };

  const handleAddSubCategory = async () => {
    if (!newSubCatTe.trim() || !newSubCatEn.trim()) return;
    const updatedCrafts = structuredClone(snapshot.crafts);
    const targetCraft = updatedCrafts[selectedCraftEditIdx];
    if (!targetCraft) return;
    targetCraft.subCategories.push({
      id: newSubCatEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      nameTe: newSubCatTe.trim(),
      nameEn: newSubCatEn.trim(),
      nameHi: newSubCatEn.trim(),
    });
    const res = await callApi('admin_update_crafts', { crafts: updatedCrafts });
    if (res.success) {
      setNewSubCatTe('');
      setNewSubCatEn('');
      showToast(`Added new sub-category to ${targetCraft.nameEn}.`);
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMsg.trim()) return;
    const res = await callApi('admin_send_notification', {
      title: notifTitle,
      message: notifMsg,
      audience: notifAudience,
    });
    if (res.success) {
      await triggerBrowserPushNotification(notifTitle, notifMsg);
      setNotifTitle('');
      setNotifMsg('');
      showToast('Mobile & Web Push Notification broadcasted to users!');
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Navigation (SaaS Workspace Architecture) */}
        <aside className="lg:col-span-3 bg-white border border-[#E6E4DD] rounded-2xl p-4 space-y-1.5">
          <div className="px-3 py-2 border-b border-[#F1EFEA] mb-2">
            <p className="font-mono text-[11px] font-bold text-[#BE123C]">24CROFTS NO-CODE CMS</p>
            <h2 className="font-display text-base font-bold text-[#141413]">
              Admin Command Center
            </h2>
          </div>

          {(
            [
              ['analytics', 'Reporting & Analytics', BarChart3],
              ['profiles', 'All Profiles & Credentials', Users],
              ['studios', 'Production House Approvals', Building2],
              ['ads', `Ads & Priority (${pendingAdsCount} Pending)`, Film],
              ['cms', 'No-Code Site & 24 Crafts CMS', Settings],
              ['adsense', 'Google AdSense Console', ExternalLink],
              ['hosting_alerts', 'Push Alerts & Hosting Cost', Server],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                activeTab === id
                  ? 'bg-[#141413] text-white'
                  : 'text-[#3F3E3B] hover:bg-[#FAF9F6]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </aside>

        {/* Main Admin Viewport */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: REPORTING & USER PERFORMANCE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6">
                <h1 className="font-display text-xl font-bold text-[#141413]">
                  User Performance & Platform Reporting Dashboard
                </h1>
                <p className="text-xs text-[#6B6963] mt-0.5">
                  Real-time metrics across all 24 crafts, paid conversions, studio contact unlocks, and ad performance.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#F1EFEA] tabular-nums">
                  <div>
                    <span className="text-xs text-[#6B6963] block">Verified Talent Profiles</span>
                    <span className="font-mono text-2xl font-bold text-[#141413]">{totalProfiles}</span>
                    <span className="text-[11px] text-[#15803D] block">{paidProfilesCount} Paid Priority</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6963] block">Approved Studios</span>
                    <span className="font-mono text-2xl font-bold text-[#141413]">
                      {approvedStudios} / {snapshot.productionHouses.length}
                    </span>
                    <span className="text-[11px] text-[#6B6963] block">Contact Vault Enabled</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6963] block">Total Profile Views</span>
                    <span className="font-mono text-2xl font-bold text-[#141413]">
                      {totalViews.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#6B6963] block">Across 6 Industries</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6963] block">Authorized Contact Unlocks</span>
                    <span className="font-mono text-2xl font-bold text-[#BE123C]">
                      {totalContactUnlocks}
                    </span>
                    <span className="text-[11px] text-[#6B6963] block">AES-256 Audited</span>
                  </div>
                </div>
              </div>

              {/* Top Performing User Profiles Table */}
              <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-[#141413] mb-4">
                  Top-Performing Artist & Technician Profiles (Engagement Analysis)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse tabular-nums">
                    <thead>
                      <tr className="border-b border-[#E6E4DD] text-[#6B6963]">
                        <th className="py-2.5 pr-4">Unique ID</th>
                        <th className="py-2.5 pr-4">Artist / Technician</th>
                        <th className="py-2.5 pr-4">Industry</th>
                        <th className="py-2.5 pr-4">Tier</th>
                        <th className="py-2.5 pr-4 text-right">Views</th>
                        <th className="py-2.5 text-right">Contact Unlocks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFEA]">
                      {snapshot.profiles
                        .slice()
                        .sort((a, b) => b.viewsCount - a.viewsCount)
                        .slice(0, 8)
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF9F6]">
                            <td className="py-2.5 pr-4 font-mono font-bold text-[#BE123C]">{p.id}</td>
                            <td className="py-2.5 pr-4 font-semibold text-[#141413]">{p.fullName}</td>
                            <td className="py-2.5 pr-4">{p.industry}</td>
                            <td className="py-2.5 pr-4">
                              {p.isPaid ? 'Paid Priority' : 'Standard'}
                            </td>
                            <td className="py-2.5 pr-4 text-right font-mono">{p.viewsCount}</td>
                            <td className="py-2.5 text-right font-mono font-semibold text-[#15803D]">
                              {p.contactUnlocksCount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL PROFILES USERNAME, PASSWORD & ACCOUNT MANAGEMENT */}
          {activeTab === 'profiles' && (
            <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#141413]">
                    All Profiles Credential & Account Control
                  </h2>
                  <p className="text-xs text-[#6B6963]">
                    View and edit any user’s Username, Password, Paid Priority status, and decrypted contact details.
                  </p>
                </div>
                <input
                  type="search"
                  aria-label="Filter profiles in Admin"
                  value={profileFilter}
                  onChange={(e) => setProfileFilter(e.target.value)}
                  placeholder="Search ID (24C-1001), Username, or Name..."
                  className="px-3.5 py-2 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg w-64"
                />
              </div>

              {editingProfileId && (
                <form
                  onSubmit={handleSaveProfileCreds}
                  className="p-5 rounded-xl bg-[#FAF9F6] border border-[#DEDBD2] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-[#141413] inline-flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#BE123C]" />
                      Editing Account Credentials for {editingProfileId}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProfileId(null)}
                      className="text-xs text-[#6B6963] hover:text-[#141413] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label htmlFor="adm-edit-user" className="block font-semibold mb-1">Username (User ID)</label>
                      <input id="adm-edit-user" type="text" value={credUsername} onChange={(e) => setCredUsername(e.target.value)} className="w-full px-3 py-2 bg-white border border-[#DEDBD2] rounded-lg font-mono" />
                    </div>
                    <div>
                      <label htmlFor="adm-edit-pass" className="block font-semibold mb-1">Password</label>
                      <input id="adm-edit-pass" type="text" value={credPassword} onChange={(e) => setCredPassword(e.target.value)} className="w-full px-3 py-2 bg-white border border-[#DEDBD2] rounded-lg font-mono" />
                    </div>
                    <div>
                      <label htmlFor="adm-edit-name" className="block font-semibold mb-1">Full Name</label>
                      <input id="adm-edit-name" type="text" value={credFullName} onChange={(e) => setCredFullName(e.target.value)} className="w-full px-3 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                    </div>
                    <div>
                      <label htmlFor="adm-edit-phone" className="block font-semibold mb-1">Mobile Contact</label>
                      <input id="adm-edit-phone" type="text" value={credPhone} onChange={(e) => setCredPhone(e.target.value)} className="w-full px-3 py-2 bg-white border border-[#DEDBD2] rounded-lg font-mono" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input type="checkbox" checked={credIsPaid} onChange={(e) => setCredIsPaid(e.target.checked)} className="rounded border-[#DEDBD2] text-[#BE123C]" />
                      Priority Paid Member (Appears First in Craft Sub-Category)
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-[#BE123C] text-white rounded-lg cursor-pointer"
                    >
                      Save User Credentials & Status
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#E6E4DD] text-[#6B6963]">
                      <th className="py-2.5 pr-3">ID</th>
                      <th className="py-2.5 pr-3">Full Name</th>
                      <th className="py-2.5 pr-3">Username</th>
                      <th className="py-2.5 pr-3">Current Password</th>
                      <th className="py-2.5 pr-3">Mobile</th>
                      <th className="py-2.5 pr-3">Tier</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EFEA]">
                    {filteredProfiles.slice(0, 24).map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF9F6]">
                        <td className="py-2.5 pr-3 font-mono font-bold text-[#BE123C]">{p.id}</td>
                        <td className="py-2.5 pr-3 font-semibold text-[#141413]">{p.fullName}</td>
                        <td className="py-2.5 pr-3 font-mono">{p.username}</td>
                        <td className="py-2.5 pr-3 font-mono text-[#52514E]">{p.passwordPlainForAdmin}</td>
                        <td className="py-2.5 pr-3 font-mono">{p.unlockedPhone}</td>
                        <td className="py-2.5 pr-3">
                          <span className={p.isPaid ? 'font-semibold text-[#15803D]' : 'text-[#6B6963]'}>
                            {p.isPaid ? 'Paid' : 'Free'}
                          </span>
                        </td>
                        <td className="py-2.5 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => startEditingProfile(p)}
                            className="px-2.5 py-1 text-xs font-semibold bg-[#141413] text-white rounded-md cursor-pointer"
                          >
                            Edit Login/Tier
                          </button>
                          <button
                            type="button"
                            onClick={() => openProfile(p.id)}
                            className="px-2.5 py-1 text-xs font-medium border border-[#DEDBD2] rounded-md cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTION HOUSE APPROVAL & CONTACT NUMBER PERMISSIONS */}
          {activeTab === 'studios' && (
            <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-[#141413]">
                  Production House Verification & Contact Access Authorization
                </h2>
                <p className="text-xs text-[#6B6963]">
                  Only Production Houses approved here can view artist and technician phone numbers across 24crofts.com.
                </p>
              </div>

              <div className="space-y-4">
                {snapshot.productionHouses.map((ph) => (
                  <div
                    key={ph.id}
                    className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-[#BE123C]">{ph.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-display text-base font-bold text-[#141413]">
                          {ph.bannerName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{ph.industry}</span>
                      </div>
                      <p className="text-[#3F3E3B]">
                        Producer/Head: <strong>{ph.producerOrManagerName}</strong> · Reg No: {ph.registrationNumber}
                      </p>
                      <p className="font-mono text-[#52514E] tabular-nums">
                        Login: {ph.username} / {ph.passwordPlainForAdmin} · Mobile: {ph.phone} · Aadhaar: {ph.aadhaarMasked}
                      </p>
                      <p className="text-[#15803D] font-medium">
                        Movie Registration Form Uploaded: {ph.movieRegistrationFormName}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      {ph.isApproved && ph.canViewContacts ? (
                        <>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D]">
                            <CheckCircle2 className="w-4 h-4" />
                            Authorized to View Contacts
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              await callApi('admin_manage_production_house', {
                                productionHouseId: ph.id,
                                isApproved: false,
                              });
                              showToast(`Revoked contact access for ${ph.bannerName}.`);
                            }}
                            className="px-3.5 py-2 text-xs font-semibold text-[#BE123C] bg-white border border-[#FECDD3] rounded-lg hover:bg-[#FFF1F2] cursor-pointer"
                          >
                            Revoke Contact Access
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B45309]">
                            <XCircle className="w-4 h-4" />
                            Pending Admin Approval
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              await callApi('admin_manage_production_house', {
                                productionHouseId: ph.id,
                                isApproved: true,
                              });
                              showToast(`Approved ${ph.bannerName} — Contact viewing enabled!`);
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#15803D] rounded-lg hover:bg-[#166534] cursor-pointer"
                          >
                            Approve & Grant Contact Access
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADS, MOVIE TEASERS & DISPLAY PRIORITY MANAGER */}
          {activeTab === 'ads' && (
            <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#141413]">
                    Movie Teasers, Songs, Pvt Ads & Special Ads Approval + Priority Order
                  </h2>
                  <p className="text-xs text-[#6B6963]">
                    Approve pending submissions and set Priority Rank (#1 appears first on the Home Page).
                  </p>
                </div>

                <select
                  aria-label="Filter advertisements by category"
                  value={adTypeFilter}
                  onChange={(e) => setAdTypeFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-medium"
                >
                  <option value="all">All Ad Categories ({snapshot.ads.length})</option>
                  <option value="pending">Pending Approval ({pendingAdsCount})</option>
                  <option value="movie_teaser">Movie Teasers / Songs</option>
                  <option value="pvt_ad">Pvt Ads</option>
                  <option value="special_ad">Special Ads</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className="font-bold text-[#BE123C]">
                          RANK #{ad.priorityOrder}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase">{ad.type.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            ad.status === 'approved'
                              ? 'text-[#15803D] font-bold'
                              : 'text-[#B45309] font-bold'
                          }
                        >
                          {ad.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-display text-sm font-bold text-[#141413] truncate">
                        {ad.title}
                      </p>
                      <p className="text-[#6B6963] truncate">
                        {ad.bannerOrClientName} · YouTube: {ad.youtubeUrl || 'Uploaded Media'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        aria-label={`Move ${ad.title} higher in priority`}
                        onClick={async () => {
                          await callApi('admin_manage_ad', {
                            adId: ad.id,
                            priorityOrder: Math.max(1, ad.priorityOrder - 1),
                          });
                          showToast(`Moved "${ad.title}" up to Priority #${Math.max(1, ad.priorityOrder - 1)}`);
                        }}
                        className="p-2 bg-white border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${ad.title} lower in priority`}
                        onClick={async () => {
                          await callApi('admin_manage_ad', {
                            adId: ad.id,
                            priorityOrder: ad.priorityOrder + 1,
                          });
                          showToast(`Updated priority rank for "${ad.title}"`);
                        }}
                        className="p-2 bg-white border border-[#DEDBD2] rounded-lg hover:bg-[#F1EFEA] cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {ad.status !== 'approved' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await callApi('admin_manage_ad', {
                              adId: ad.id,
                              status: 'approved',
                              priorityOrder: 1,
                            });
                            showToast(`Approved "${ad.title}" at Priority #1 on Home Page!`);
                          }}
                          className="px-3 py-1.5 font-bold text-white bg-[#15803D] rounded-lg cursor-pointer"
                        >
                          Approve (#1 First)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            await callApi('admin_manage_ad', {
                              adId: ad.id,
                              status: 'pending',
                            });
                            showToast(`Paused "${ad.title}" from Home Page.`);
                          }}
                          className="px-3 py-1.5 font-medium text-[#BE123C] bg-white border border-[#FECDD3] rounded-lg cursor-pointer"
                        >
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NO-CODE SITE SETTINGS & 24 CRAFTS EDITOR */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSiteSettings} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#141413]">
                  No-Code Website Content & Contact Editor
                </h2>
                <p className="text-xs text-[#6B6963]">
                  Update headlines, announcements, pricing, email, phone, and Hyderabad map address anytime without touching code.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label htmlFor="cms-head-te" className="block font-semibold mb-1">Hero Headline (Telugu)</label>
                    <input
                      id="cms-head-te"
                      type="text"
                      value={cmsSettings.heroHeadlineTe}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroHeadlineTe: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cms-head-en" className="block font-semibold mb-1">Hero Headline (English)</label>
                    <input
                      id="cms-head-en"
                      type="text"
                      value={cmsSettings.heroHeadlineEn}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroHeadlineEn: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-email" className="block font-semibold mb-1">Official Contact Email</label>
                    <input
                      id="cms-email"
                      type="email"
                      value={cmsSettings.contactEmail}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-phone" className="block font-semibold mb-1">Official Contact Mobile</label>
                    <input
                      id="cms-phone"
                      type="text"
                      value={cmsSettings.contactPhone}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-fee" className="block font-semibold mb-1">Priority Paid Profile Fee (INR)</label>
                    <input
                      id="cms-fee"
                      type="number"
                      value={cmsSettings.paidProfileAnnualFeeInr}
                      onChange={(e) =>
                        setCmsSettings({ ...cmsSettings, paidProfileAnnualFeeInr: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="cms-loc" className="block font-semibold mb-1">Office City / Country</label>
                    <input
                      id="cms-loc"
                      type="text"
                      value={cmsSettings.contactLocation}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, contactLocation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold bg-[#BE123C] text-white rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Publish Site Changes
                  </button>
                </div>
              </form>

              {/* Dynamic 24 Crafts Sub-Category Editor */}
              <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-[#141413]">
                  24 Crafts & Sub-Categories Manager (Add Sub-Categories Without Code)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <select
                    aria-label="Select Craft to edit"
                    value={selectedCraftEditIdx}
                    onChange={(e) => setSelectedCraftEditIdx(Number(e.target.value))}
                    className="px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  >
                    {snapshot.crafts.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.number}. {c.nameTe} ({c.subCategories.length} sub-crafts)
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newSubCatTe}
                    onChange={(e) => setNewSubCatTe(e.target.value)}
                    placeholder="New Sub-Category (Telugu)"
                    className="px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubCatEn}
                      onChange={(e) => setNewSubCatEn(e.target.value)}
                      placeholder="English Name"
                      className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubCategory}
                      className="px-4 py-2 font-bold bg-[#141413] text-white rounded-lg cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE ADSENSE CONSOLE (STRICTLY VISIBLE IN ADMIN ONLY — HIDDEN ON HOME PAGE!) */}
          {activeTab === 'adsense' && (
            <form onSubmit={handleSaveSiteSettings} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#F1EFEA]">
                <div>
                  <span className="text-xs font-bold text-[#15803D] inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    ADMIN-EXCLUSIVE MONETIZATION PANEL (Hidden from Public Home Page)
                  </span>
                  <h2 className="font-display text-xl font-bold text-[#141413] mt-1">
                    Google AdSense Integration & Console Link
                  </h2>
                  <p className="text-xs text-[#6B6963] mt-0.5">
                    As requested, the Google AdSense Console link and Publisher configuration appear strictly inside the Admin Panel and never clutter the public Home Page.
                  </p>
                </div>

                <a
                  href={cmsSettings.adsenseConsoleUrl || 'https://www.google.com/adsense'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#141413] rounded-xl hover:bg-[#BE123C] transition-colors whitespace-nowrap"
                >
                  Open Google AdSense Dashboard
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label htmlFor="adsense-pub" className="block font-semibold mb-1">
                    Google AdSense Publisher ID
                  </label>
                  <input
                    id="adsense-pub"
                    type="text"
                    value={cmsSettings.adsensePublisherId}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, adsensePublisherId: e.target.value })}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="adsense-url" className="block font-semibold mb-1">
                    Google AdSense Console URL (Admin Link)
                  </label>
                  <input
                    id="adsense-url"
                    type="url"
                    value={cmsSettings.adsenseConsoleUrl}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, adsenseConsoleUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="adsense-slot1" className="block font-semibold mb-1">
                    Directory Ad Unit Slot ID
                  </label>
                  <input
                    id="adsense-slot1"
                    type="text"
                    value={cmsSettings.adsenseDirectorySlotId}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, adsenseDirectorySlotId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cmsSettings.adsenseAutoAdsEnabled}
                      onChange={(e) =>
                        setCmsSettings({ ...cmsSettings, adsenseAutoAdsEnabled: e.target.checked })
                      }
                      className="rounded border-[#DEDBD2] text-[#BE123C]"
                    />
                    Inject Sitewide AdSense Auto-Ads Script Tag
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-[#BE123C] text-white rounded-xl cursor-pointer"
                >
                  Save AdSense Configuration
                </button>
              </div>
            </form>
          )}

          {/* TAB 7: MOBILE PUSH NOTIFICATIONS, ENCRYPTED INBOX & SERVER HOSTING COST ESTIMATE */}
          {activeTab === 'hosting_alerts' && (
            <div className="space-y-6">
              {/* Mobile Push Notification Broadcaster */}
              <form onSubmit={handleSendPush} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#141413] inline-flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#BE123C]" />
                  Mobile & Web Push Notification Broadcaster
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="Notification Title (e.g. Urgent Casting Call)"
                    className="sm:col-span-2 px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  />
                  <select
                    aria-label="Target Notification Audience"
                    value={notifAudience}
                    onChange={(e) =>
                      setNotifAudience(e.target.value as 'all' | 'artists' | 'production_houses')
                    }
                    className="px-3 py-2 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  >
                    <option value="all">All App Users (iOS, Android & Web)</option>
                    <option value="artists">24 Crafts Artists Only</option>
                    <option value="production_houses">Approved Studios Only</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  placeholder="Write casting or platform alert message..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#141413] text-white rounded-lg cursor-pointer"
                  >
                    Send Mobile Push Alert
                  </button>
                </div>
              </form>

              {/* Server Hosting, iOS/Android App & Database Security Maintenance Estimate */}
              <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#141413]">
                    Server Hosting, Database Security & Mobile App Maintenance Cost Estimate (24crofts.com)
                  </h2>
                  <p className="text-xs text-[#6B6963] mt-0.5">
                    Production infrastructure budget for Web + iOS + Android with AES-256-GCM encryption, CDN media storage (25 photos/profile), and 24/7 maintenance.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse tabular-nums">
                    <thead>
                      <tr className="border-b border-[#E6E4DD] text-[#6B6963]">
                        <th className="py-2.5 pr-4">Infrastructure Component</th>
                        <th className="py-2.5 pr-4">Specification & Security</th>
                        <th className="py-2.5 pr-4 text-right">Monthly (INR)</th>
                        <th className="py-2.5 text-right">Annual (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFEA]">
                      {snapshot.hostingEstimates.map((item) => (
                        <tr key={item.component}>
                          <td className="py-3 pr-4 font-semibold text-[#141413]">{item.component}</td>
                          <td className="py-3 pr-4 text-[#52514E]">
                            <div>{item.specification}</div>
                            <div className="text-[11px] text-[#15803D] mt-0.5">{item.securityNotes}</div>
                          </td>
                          <td className="py-3 pr-4 text-right font-mono font-semibold">
                            ₹{item.monthlyInr.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 text-right font-mono font-semibold">
                            ₹{item.annualInr.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#141413] font-bold text-[#141413]">
                        <td colSpan={2} className="py-3 pr-4">
                          Total Estimated Hosting, Security & Maintenance (Web + iOS + Android)
                        </td>
                        <td className="py-3 pr-4 text-right font-mono text-[#BE123C]">
                          ₹{totalMonthlyHosting.toLocaleString('en-IN')} / mo
                        </td>
                        <td className="py-3 text-right font-mono text-[#BE123C]">
                          ₹{totalAnnualHosting.toLocaleString('en-IN')} / yr
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Decrypted E2EE Contact Form Inquiries */}
              <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-[#141413]">
                  Decrypted Contact Form Inbox ({snapshot.inquiries.length})
                </h3>
                <div className="divide-y divide-[#F1EFEA] text-xs">
                  {snapshot.inquiries.map((inq) => (
                    <div key={inq.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between font-semibold text-[#141413]">
                        <span>
                          {inq.senderName} ({inq.senderPhone} · {inq.senderEmail})
                        </span>
                        <span className="font-mono text-[#6B6963]">{inq.id}</span>
                      </div>
                      <p className="text-[#BE123C] font-medium mt-0.5">{inq.subject}</p>
                      <p className="text-[#3F3E3B] mt-1">{inq.decryptedMessageForAdmin}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hostinger (24crofts.com) Production Files & One-Click Database Backup Export */}
              <div className="bg-white border-2 border-[#141413] rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#BE123C]">
                      HOSTINGER HOSTING READY · 24CROFTS.COM
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#141413] mt-0.5">
                      Hostinger Deployment Package & Live Database Backup Export
                    </h3>
                    <p className="text-xs text-[#6B6963] mt-0.5">
                      All Hostinger production files (`server.js`, `ecosystem.config.cjs`, `public/.htaccess`, `public/ads.txt`, `public/robots.txt`, `app/sitemap.ts`, and `data/24crofts-db.json` auto-persistence) are pre-configured.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `24crofts-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('Downloaded 24crofts.com complete database backup (.json)!');
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-[#BE123C] rounded-xl hover:bg-[#9F1239] transition-colors cursor-pointer shrink-0"
                  >
                    Download Full Database Backup (.json)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#FAF9F6] p-4 rounded-xl border border-[#E6E4DD]">
                  <div>
                    <p className="font-bold text-[#141413]">1. Hostinger hPanel Node.js</p>
                    <p className="text-[#52514E] mt-0.5">
                      Startup File: <code className="font-mono font-bold text-[#BE123C]">server.js</code> · Node 20.x/22.x · Run <code className="font-mono">npm install && npm run build</code>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#141413]">2. SSL, SEO & AdSense</p>
                    <p className="text-[#52514E] mt-0.5">
                      Includes <code className="font-mono">public/.htaccess</code> (HTTPS), <code className="font-mono">public/ads.txt</code>, <code className="font-mono">robots.txt</code> & <code className="font-mono">sitemap.xml</code>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#141413]">3. Persistent Disk Database</p>
                    <p className="text-[#52514E] mt-0.5">
                      Auto-saves every registration, approval & ad priority to <code className="font-mono">data/24crofts-db.json</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
