'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AdPlacement,
  AppNotification,
  ContactInquiry,
  CraftCategory,
  FilmIndustry,
  HostingCostItem,
  Language,
  ProductionHouse,
  SessionViewer,
  SiteSettings,
  TalentProfile,
} from '@/lib/types';

export type ActiveSection = 'home' | 'crafts' | 'register' | 'contact' | 'account' | 'admin';

export interface PlatformSnapshot {
  viewer: SessionViewer;
  siteSettings: SiteSettings;
  adsenseScriptClient: string;
  crafts: CraftCategory[];
  profiles: TalentProfile[];
  productionHouses: ProductionHouse[];
  ads: AdPlacement[];
  notifications: AppNotification[];
  inquiries: ContactInquiry[];
  hostingEstimates: HostingCostItem[];
}

interface PlatformContextValue {
  snapshot: PlatformSnapshot;
  lang: Language;
  setLang: (l: Language) => void;
  activeSection: ActiveSection;
  setActiveSection: (s: ActiveSection) => void;
  selectedCraftId: string | null;
  setSelectedCraftId: (id: string | null) => void;
  selectedSubCategoryId: string;
  setSelectedSubCategoryId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterIndustry: FilmIndustry | 'all';
  setFilterIndustry: (ind: FilmIndustry | 'all') => void;
  filterLanguage: string;
  setFilterLanguage: (lang: string) => void;
  filterPaidOnly: boolean;
  setFilterPaidOnly: (paid: boolean) => void;
  activeProfileId: string | null;
  openProfile: (profileId: string) => void;
  closeProfile: () => void;
  isUploadAdModalOpen: boolean;
  setIsUploadAdModalOpen: (v: boolean) => void;
  activeAdLightbox: AdPlacement | null;
  setActiveAdLightbox: (ad: AdPlacement | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  callApi: (action: string, payload?: Record<string, unknown>) => Promise<{
    success: boolean;
    error?: string;
    data?: Record<string, unknown>;
  }>;
  logout: () => void;
}

const OFFLINE_STORAGE_KEY = '24crofts_offline_snapshot_v1';
const VIEWER_STORAGE_KEY = '24crofts_session_viewer_v1';

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({
  initialSnapshot,
  initialProfileId = null,
  children,
}: {
  initialSnapshot: PlatformSnapshot;
  initialProfileId?: string | null;
  children: React.ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<PlatformSnapshot>(initialSnapshot);
  const [lang, setLang] = useState<Language>('te');
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [selectedCraftId, setSelectedCraftId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterIndustry, setFilterIndustry] = useState<FilmIndustry | 'all'>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterPaidOnly, setFilterPaidOnly] = useState<boolean>(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(initialProfileId);
  const [isUploadAdModalOpen, setIsUploadAdModalOpen] = useState<boolean>(false);
  const [activeAdLightbox, setActiveAdLightbox] = useState<AdPlacement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Restore persisted viewer session or offline cache on mount, and support ?profile=24C-XXXX deep link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const deepProfile = params.get('profile');
      if (deepProfile) {
        setActiveProfileId(deepProfile.toUpperCase());
      }

      const savedViewerRaw = window.localStorage.getItem(VIEWER_STORAGE_KEY);
      if (savedViewerRaw) {
        const parsedViewer = JSON.parse(savedViewerRaw) as SessionViewer;
        if (parsedViewer && parsedViewer.role !== 'guest') {
          fetch('/api/platform', {
            headers: { 'x-24crofts-viewer': JSON.stringify(parsedViewer) },
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((fresh) => {
              if (fresh && fresh.profiles) {
                setSnapshot(fresh);
              }
            })
            .catch(() => {
              const cached = window.localStorage.getItem(OFFLINE_STORAGE_KEY);
              if (cached) {
                setSnapshot(JSON.parse(cached));
              }
            });
          return;
        }
      }
      // Save sanitized public snapshot for Offline Mode resilience
      window.localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(initialSnapshot));
    } catch {
      // Ignore storage access errors in private browsing
    }
  }, [initialSnapshot]);

  const callApi = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      try {
        const res = await fetch('/api/platform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-24crofts-viewer': JSON.stringify(snapshot.viewer),
          },
          body: JSON.stringify({ action, ...payload }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          return { success: false, error: json.error || 'Operation failed.' };
        }
        if (json.snapshot) {
          setSnapshot(json.snapshot);
          try {
            if (json.viewer) {
              window.localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(json.viewer));
            }
            if (json.snapshot.viewer?.role === 'guest') {
              window.localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(json.snapshot));
            }
          } catch {
            // Ignore localStorage quota
          }
        }
        return { success: true, data: json };
      } catch {
        return {
          success: false,
          error: 'Network offline — viewing cached 24crofts.com data. Reconnect to save changes.',
        };
      }
    },
    [snapshot.viewer]
  );

  const openProfile = useCallback(
    (profileId: string) => {
      setActiveProfileId(profileId);
      fetch('/api/platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-24crofts-viewer': JSON.stringify(snapshot.viewer),
        },
        body: JSON.stringify({ action: 'record_profile_view', profileId }),
      }).catch(() => undefined);
    },
    [snapshot.viewer]
  );

  const closeProfile = useCallback(() => {
    setActiveProfileId(null);
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(VIEWER_STORAGE_KEY);
    } catch {
      // Ignore
    }
    fetch('/api/platform', {
      headers: { 'x-24crofts-viewer': JSON.stringify({ role: 'guest' }) },
    })
      .then((r) => r.json())
      .then((fresh) => {
        setSnapshot(fresh);
        setActiveSection('home');
        showToast('Signed out safely.');
      })
      .catch(() => {
        setSnapshot((prev) => ({ ...prev, viewer: { role: 'guest' } }));
        setActiveSection('home');
      });
  }, [showToast]);

  const value = useMemo<PlatformContextValue>(
    () => ({
      snapshot,
      lang,
      setLang,
      activeSection,
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
      activeProfileId,
      openProfile,
      closeProfile,
      isUploadAdModalOpen,
      setIsUploadAdModalOpen,
      activeAdLightbox,
      setActiveAdLightbox,
      toastMessage,
      showToast,
      callApi,
      logout,
    }),
    [
      snapshot,
      lang,
      activeSection,
      selectedCraftId,
      selectedSubCategoryId,
      searchQuery,
      filterIndustry,
      filterLanguage,
      filterPaidOnly,
      activeProfileId,
      openProfile,
      closeProfile,
      isUploadAdModalOpen,
      activeAdLightbox,
      toastMessage,
      showToast,
      callApi,
      logout,
    ]
  );

  return (
    <PlatformContext.Provider value={value}>
      {snapshot.adsenseScriptClient ? (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
            snapshot.adsenseScriptClient
          )}`}
          crossOrigin="anonymous"
        />
      ) : null}
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used inside PlatformProvider');
  }
  return ctx;
}
