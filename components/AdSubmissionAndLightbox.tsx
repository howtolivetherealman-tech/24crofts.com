'use client';

import React, { useState } from 'react';
import { Film, Upload, X, Youtube } from 'lucide-react';
import { extractYoutubeEmbedUrl } from '@/lib/platform-logic';
import { usePlatform } from './PlatformProvider';
import type { AdCategoryType } from '@/lib/types';

export function AdSubmissionAndLightbox() {
  const {
    isUploadAdModalOpen,
    setIsUploadAdModalOpen,
    activeAdLightbox,
    setActiveAdLightbox,
    callApi,
    showToast,
    snapshot,
  } = usePlatform();

  const [type, setType] = useState<AdCategoryType>('movie_teaser');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bannerOrClientName, setBannerOrClientName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [mediaImageUrl, setMediaImageUrl] = useState('/images/teaser_poster_epic.jpg');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePosterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMediaImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !bannerOrClientName.trim()) {
      setError('Please enter both the Announcement/Ad Title and Production Banner/Client Name.');
      return;
    }
    if (!youtubeUrl.trim() && !uploadedFileName) {
      setError('Provide a YouTube link or upload a teaser/song poster file.');
      return;
    }

    setSubmitting(true);
    const res = await callApi('submit_ad', {
      payload: {
        type,
        title,
        subtitle,
        bannerOrClientName,
        youtubeUrl,
        contactPhone,
        mediaImageUrl,
        mediaType: youtubeUrl.trim() ? 'youtube' : 'video_upload',
      },
    });
    setSubmitting(false);

    if (!res.success) {
      setError(res.error || 'Could not submit advertisement.');
      return;
    }

    setTitle('');
    setSubtitle('');
    setBannerOrClientName('');
    setYoutubeUrl('');
    setContactPhone('');
    setUploadedFileName('');
    setIsUploadAdModalOpen(false);
    showToast(
      snapshot.viewer.role === 'admin'
        ? 'Ad published directly to Home Page!'
        : 'Submitted! Your Movie Teaser / Ad is queued for Website Admin Team approval & priority placement.'
    );
  };

  const embedUrl = activeAdLightbox ? extractYoutubeEmbedUrl(activeAdLightbox.youtubeUrl) : null;

  return (
    <>
      {/* Submit Movie Teaser / Song / Pvt Ad / Special Ad Modal */}
      {isUploadAdModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-ad-modal-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 flex items-center justify-center"
        >
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E6E4DD] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6E4DD]">
              <div>
                <h3 id="submit-ad-modal-title" className="font-display text-lg font-bold text-[#141413]">
                  Upload Movie Announcement, Teaser, Song or Ad
                </h3>
                <p className="text-xs text-[#6B6963] mt-0.5">
                  ఏ యాడ్ ప్లేస్‌మెంట్‌కైనా అడ్మిన్ టీమ్ ఆమోదం తప్పనిసరి · Every ad placement requires Admin Team approval and priority ordering.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close ad upload dialog"
                onClick={() => setIsUploadAdModalOpen(false)}
                className="p-1.5 text-[#52514E] hover:text-[#141413] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div role="alert" className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#BE123C] font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="ad-slot-type" className="block text-xs font-semibold text-[#141413] mb-1">
                  Placement Category *
                </label>
                <select
                  id="ad-slot-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as AdCategoryType)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                >
                  <option value="movie_teaser">Movie Teaser / Trailer / Song (Home Top 6)</option>
                  <option value="pvt_ad">Private Ad — Pvt Ads (Home 6 Slots)</option>
                  <option value="special_ad">Special Showcase Ad — Special Ads (Home 6 Slots)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ad-title" className="block text-xs font-semibold text-[#141413] mb-1">
                    Movie / Song / Ad Title *
                  </label>
                  <input
                    id="ad-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Devarakota Official Teaser"
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                  />
                </div>
                <div>
                  <label htmlFor="ad-banner" className="block text-xs font-semibold text-[#141413] mb-1">
                    Production House / Brand Name *
                  </label>
                  <input
                    id="ad-banner"
                    type="text"
                    value={bannerOrClientName}
                    onChange={(e) => setBannerOrClientName(e.target.value)}
                    placeholder="e.g. Suvarna Entertainments"
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ad-subtitle" className="block text-xs font-semibold text-[#141413] mb-1">
                  Credits / Tagline Description
                </label>
                <input
                  id="ad-subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Directed by · Music by · Release details"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                />
              </div>

              <div>
                <label htmlFor="ad-youtube" className="block text-xs font-semibold text-[#141413] mb-1">
                  YouTube Teaser / Song / Ad Link (యూట్యూబ్ లింక్)
                </label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-[#BE123C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="ad-youtube"
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ad-poster-upload" className="block text-xs font-semibold text-[#141413] mb-1">
                    Upload Poster / Video Thumbnail
                  </label>
                  <label
                    htmlFor="ad-poster-upload"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#FAF9F6] border border-dashed border-[#B8B4AA] rounded-lg text-[#3F3E3B] hover:bg-[#F1EFEA] cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#BE123C] shrink-0" />
                    <span className="truncate">
                      {uploadedFileName || 'Choose Image / Media File'}
                    </span>
                  </label>
                  <input
                    id="ad-poster-upload"
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handlePosterFile}
                    className="sr-only"
                  />
                </div>
                <div>
                  <label htmlFor="ad-phone" className="block text-xs font-semibold text-[#141413] mb-1">
                    Advertiser Contact Mobile
                  </label>
                  <input
                    id="ad-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="10-digit mobile for Admin verification"
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg text-[#141413]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadAdModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#52514E] hover:text-[#141413] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#BE123C] rounded-lg hover:bg-[#9F1239] disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Video Player for Movie Teasers / Songs / Ads */}
      {activeAdLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeAdLightbox.title}
          className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center"
        >
          <div className="w-full max-w-3xl bg-[#141413] text-white rounded-2xl overflow-hidden border border-[#2E2D2A]">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#2E2D2A]">
              <div>
                <p className="text-xs text-[#FDE68A] font-medium">
                  {activeAdLightbox.bannerOrClientName} · Priority Slot #{activeAdLightbox.priorityOrder}
                </p>
                <h3 className="font-display text-base font-bold text-white">
                  {activeAdLightbox.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close teaser video player"
                onClick={() => setActiveAdLightbox(null)}
                className="p-1.5 text-[#D6D3CD] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={activeAdLightbox.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeAdLightbox.mediaImageUrl}
                  alt={activeAdLightbox.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D6D3CD]">
              <span>{activeAdLightbox.subtitle}</span>
              {activeAdLightbox.youtubeUrl && (
                <a
                  href={activeAdLightbox.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FDE68A] hover:underline font-medium"
                >
                  Open on YouTube ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
