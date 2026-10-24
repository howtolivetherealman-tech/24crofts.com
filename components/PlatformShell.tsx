'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderAndToolbar } from './HeaderAndToolbar';
import { HomeAndCraftsSection } from './HomeAndCraftsSection';
import { RegistrationPortal } from './RegistrationPortal';
import { ContactAndMapSection } from './ContactAndMapSection';
import { UserAccountPortal } from './UserAccountPortal';
import { AdminDashboard } from './AdminDashboard';
import { ProfileDetailModal } from './ProfileDetailModal';
import { AdSubmissionAndLightbox } from './AdSubmissionAndLightbox';
import { usePlatform } from './PlatformProvider';

export function PlatformShell() {
  const {
    snapshot,
    activeSection,
    setActiveSection,
    setSelectedCraftId,
    toastMessage,
  } = usePlatform();

  const s = snapshot.siteSettings;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141413]">
      <HeaderAndToolbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeSection === 'home' && <HomeAndCraftsSection mode="home" />}
            {activeSection === 'crafts' && <HomeAndCraftsSection mode="crafts" />}
            {activeSection === 'register' && <RegistrationPortal />}
            {activeSection === 'contact' && <ContactAndMapSection />}
            {activeSection === 'account' && <UserAccountPortal />}
            {activeSection === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <ProfileDetailModal />
      <AdSubmissionAndLightbox />

      {/* Accessible Non-Blocking Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#141413] text-white px-4 py-3 rounded-xl shadow-lg border border-[#2E2D2A] text-xs font-medium"
        >
          {toastMessage}
        </div>
      )}

      {/* Quiet Editorial Footer (No Fake Telemetry Tickers, No Public AdSense Link) */}
      <footer className="mt-16 bg-white border-t border-[#E6E4DD] px-4 sm:px-8 py-10">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#52514E]">
          <div className="space-y-1.5">
            <p className="font-display text-base font-bold text-[#141413]">
              24crofts.com — Cinema 24 Crafts Talent & Production Platform
            </p>
            <p>
              Email: <a href={`mailto:${s.contactEmail}`} className="font-mono hover:text-[#BE123C]">{s.contactEmail}</a>
              {' · '}
              Mobile: <a href={`tel:+91${s.contactPhone}`} className="font-mono hover:text-[#BE123C]">+91 {s.contactPhone}</a>
              {' · '}
              {s.contactLocation}
            </p>
            <p className="text-[#787671]">
              AES-256-GCM Encrypted Database · Contact Details Restricted Strictly to Admin-Approved Production Houses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium text-[#141413]">
            <button
              type="button"
              onClick={() => {
                setSelectedCraftId(null);
                setActiveSection('home');
              }}
              className="hover:text-[#BE123C] cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCraftId(null);
                setActiveSection('crafts');
              }}
              className="hover:text-[#BE123C] cursor-pointer"
            >
              24 Crafts
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="hover:text-[#BE123C] cursor-pointer"
            >
              Register Profile
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('contact')}
              className="hover:text-[#BE123C] cursor-pointer"
            >
              Hyderabad Map & Contact
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('admin')}
              className="hover:text-[#BE123C] cursor-pointer"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
