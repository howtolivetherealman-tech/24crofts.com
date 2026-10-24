'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  FileCheck2,
  ImagePlus,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  Youtube,
} from 'lucide-react';
import { FILM_INDUSTRIES, INDIAN_LANGUAGES } from '@/lib/crafts-data';
import {
  CASTING_COMFORTABLE_WITH_OPTIONS,
  CASTING_INTERESTED_IN_OPTIONS,
  type CastingDetails,
  type FilmIndustry,
} from '@/lib/types';
import { usePlatform } from './PlatformProvider';

export function RegistrationPortal() {
  const { snapshot, callApi, showToast, setActiveSection, openProfile } = usePlatform();

  const [tab, setTab] = useState<'talent' | 'production_house'>('talent');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Talent Form State
  const [craftId, setCraftId] = useState(snapshot.crafts[2]?.id || 'cine-artists');
  const activeCraft = snapshot.crafts.find((c) => c.id === craftId) || snapshot.crafts[0];
  const [subCategoryId, setSubCategoryId] = useState(activeCraft.subCategories[0]?.id || '');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarDocName, setAadhaarDocName] = useState('');
  const [industry, setIndustry] = useState<FilmIndustry>('Tollywood');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['Telugu (తెలుగు)', 'English']);
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [stateName, setStateName] = useState('Telangana');
  const [pinCode, setPinCode] = useState('500033');
  const [experienceYears, setExperienceYears] = useState('3');
  const [bio, setBio] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  // Up to 25 Gallery Photos
  const [photos, setPhotos] = useState<string[]>(['/images/portrait_actor_lead.jpg']);
  // Unlimited YouTube Links
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>(['']);

  // Casting Category Detailed Fields
  const [includeCastingPortfolio, setIncludeCastingPortfolio] = useState(true);
  const [age, setAge] = useState('24');
  const [height, setHeight] = useState(`5'8"`);
  const [weight, setWeight] = useState('62 kg');
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('28 in');
  const [hip, setHip] = useState('36 in');
  const [skinTone, setSkinTone] = useState('Wheatish');
  const [eyeColour, setEyeColour] = useState('Dark Brown');
  const [hairColour, setHairColour] = useState('Black');
  const [shoeSize, setShoeSize] = useState('UK 8');
  const [maritalStatus, setMaritalStatus] = useState('Unmarried');
  const [presentProfession, setPresentProfession] = useState('Actor / Performer');
  const [education, setEducation] = useState('Graduate');
  const [dressesComfortable, setDressesComfortable] = useState('Traditional & Contemporary Western');
  const [openForOutstation, setOpenForOutstation] = useState(true);
  const [openForOutOfCountry, setOpenForOutOfCountry] = useState(true);
  const [passport, setPassport] = useState<'Yes' | 'Applied' | 'No'>('Yes');
  const [comfortableAllTimings, setComfortableAllTimings] = useState(true);
  const [interestedIn, setInterestedIn] = useState<string[]>(['1. Acting', '5. Ethnic wears', '6. Western wears']);
  const [comfortableWith, setComfortableWith] = useState<string[]>([
    'C) Hug scenes',
    'Indian wears',
    'Western wears',
    'Able to work Indoor & Outdoor',
  ]);
  const [aim, setAim] = useState('Lead & Author-Backed Roles in Feature Films');
  const [allergies, setAllergies] = useState('None');
  const [instagramId, setInstagramId] = useState('');

  // Production House Form State
  const [phBannerName, setPhBannerName] = useState('');
  const [phRegNumber, setPhRegNumber] = useState('');
  const [phProducerName, setPhProducerName] = useState('');
  const [phUsername, setPhUsername] = useState('');
  const [phPassword, setPhPassword] = useState('');
  const [phAadhaar, setPhAadhaar] = useState('');
  const [phMovieFormName, setPhMovieFormName] = useState('');
  const [phMovieFormDataUrl, setPhMovieFormDataUrl] = useState('');
  const [phIndustry, setPhIndustry] = useState<FilmIndustry>('Tollywood');
  const [phLangs, setPhLangs] = useState<string[]>(['Telugu (తెలుగు)', 'English']);
  const [phPhone, setPhPhone] = useState('');
  const [phEmail, setPhEmail] = useState('');
  const [phStreet, setPhStreet] = useState('');
  const [phArea, setPhArea] = useState('Film Nagar, Jubilee Hills');
  const [phCity, setPhCity] = useState('Hyderabad');
  const [phState, setPhState] = useState('Telangana');
  const [phPin, setPhPin] = useState('500096');

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remainingSlots = 25 - photos.length;
    if (remainingSlots <= 0) {
      setError('Maximum 25 photos reached. Remove an existing photo to add a new one.');
      return;
    }
    const toProcess = files.slice(0, remainingSlots);
    toProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => (prev.length < 25 ? [...prev, reader.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhMovieFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhMovieFormName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhMovieFormDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTalentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const showCasting =
      includeCastingPortfolio ||
      Boolean(activeCraft.isCastingFocused) ||
      craftId === 'cine-artists';

    const castingDetails: CastingDetails | undefined = showCasting
      ? {
          fullName: fullName.trim(),
          screenName: (screenName || fullName).trim(),
          age: Number(age) || 24,
          city: city.trim(),
          height,
          weight,
          bust,
          waist,
          hip,
          skinTone,
          eyeColour,
          hairColour,
          shoeSize,
          maritalStatus,
          presentProfession,
          education,
          dressesComfortable,
          openForOutstationShoots: openForOutstation,
          openForOutOfCountryShoots: openForOutOfCountry,
          passport,
          experience: `${experienceYears} Years`,
          comfortableWithAllTimings: comfortableAllTimings,
          languages: selectedLangs,
          interestedIn,
          contact: phone,
          aim,
          comfortableWith,
          allergiesToDustOrCosmetics: allergies,
          instagramId: instagramId || `@${username.trim()}`,
        }
      : undefined;

    const res = await callApi('register_talent', {
      payload: {
        username,
        password,
        fullName,
        screenName: screenName || fullName,
        craftId,
        subCategoryId,
        industry,
        languages: selectedLangs,
        address: {
          street,
          area,
          city,
          state: stateName,
          pinCode,
          country: 'India',
        },
        aadhaarNumber,
        aadhaarDocumentName: aadhaarDocName || 'aadhaar_kyc_uploaded.pdf',
        phone,
        email,
        bio:
          bio.trim() ||
          `${fullName} — Verified professional in ${activeCraft.nameEn} (${industry}).`,
        experienceYears: Number(experienceYears) || 0,
        isPaid,
        photos,
        youtubeLinks: youtubeLinks.filter((u) => u.trim().length > 0),
        castingDetails,
      },
    });

    setSubmitting(false);
    if (!res.success) {
      setError(res.error || 'Registration failed. Please check all mandatory fields.');
      return;
    }

    const newId = String(res.data?.profileId || '');
    showToast(`Profile ${newId} registered! Your profile now appears first on the Home Page.`);
    setActiveSection('home');
    if (newId) openProfile(newId);
  };

  const handleProductionHouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await callApi('register_production_house', {
      payload: {
        bannerName: phBannerName,
        registrationNumber: phRegNumber,
        producerOrManagerName: phProducerName,
        username: phUsername,
        password: phPassword,
        industry: phIndustry,
        languages: phLangs,
        address: {
          street: phStreet || 'Plot 1, Studio Complex',
          area: phArea,
          city: phCity,
          state: phState,
          pinCode: phPin,
          country: 'India',
        },
        aadhaarNumber: phAadhaar,
        movieRegistrationFormName: phMovieFormName,
        movieRegistrationFormDataUrl: phMovieFormDataUrl,
        phone: phPhone,
        email: phEmail,
      },
    });

    setSubmitting(false);
    if (!res.success) {
      setError(res.error || 'Production House registration failed.');
      return;
    }

    showToast(
      'Production House registered! Admin Team will verify your Movie Registration Form to unlock talent contact numbers.'
    );
    setActiveSection('account');
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      <div>
        <p className="text-xs font-semibold text-[#BE123C]">SEPARATE VERIFIED ONBOARDING PORTALS</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
          24 Crafts Artist & Production House Registration
        </h1>
        <p className="text-sm text-[#52514E] mt-1">
          Aadhaar KYC is mandatory for every member. Contact details are encrypted with AES-256-GCM and protected by Admin approval.
        </p>
      </div>

      {/* Separate Registration Form Selector Tabs */}
      <div role="tablist" className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-2 rounded-2xl border border-[#E6E4DD]">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'talent'}
          onClick={() => {
            setError('');
            setTab('talent');
          }}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            tab === 'talent'
              ? 'bg-[#141413] text-white'
              : 'text-[#52514E] hover:bg-[#FAF9F6]'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          24 Crafts Category & Sub-Category Form
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'production_house'}
          onClick={() => {
            setError('');
            setTab('production_house');
          }}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            tab === 'production_house'
              ? 'bg-[#BE123C] text-white'
              : 'text-[#52514E] hover:bg-[#FAF9F6]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Production House Registration Form
        </button>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs sm:text-sm font-semibold text-[#BE123C]">
          {error}
        </div>
      )}

      {tab === 'talent' ? (
        <form onSubmit={handleTalentSubmit} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Step 1: Account Credentials & Craft Selection */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#141413] pb-2 border-b border-[#F1EFEA]">
              01. Account Login Credentials & 24 Crafts Department
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="t-username" className="block text-xs font-semibold text-[#141413] mb-1">
                  Create User ID (Username) *
                </label>
                <input
                  id="t-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. charan_actor24"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-password" className="block text-xs font-semibold text-[#141413] mb-1">
                  Create Password (min 6 chars) *
                </label>
                <input
                  id="t-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="t-craft" className="block text-xs font-semibold text-[#141413] mb-1">
                  Select Craft Category (24 విభాగాలు) *
                </label>
                <select
                  id="t-craft"
                  value={craftId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setCraftId(nextId);
                    const found = snapshot.crafts.find((c) => c.id === nextId);
                    if (found?.subCategories[0]) {
                      setSubCategoryId(found.subCategories[0].id);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                >
                  {snapshot.crafts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {String(c.number).padStart(2, '0')}. {c.nameTe} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="t-subcraft" className="block text-xs font-semibold text-[#141413] mb-1">
                  Select Sub-Category (ఉప-విభాగం) *
                </label>
                <select
                  id="t-subcraft"
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                >
                  {activeCraft.subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nameTe} ({sub.nameEn})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Identity, Mandatory Aadhaar & Contact Vault */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#141413] pb-2 border-b border-[#F1EFEA]">
              02. Personal Identity, Mandatory Aadhaar KYC & Encrypted Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="t-fullname" className="block text-xs font-semibold text-[#141413] mb-1">
                  Full Name *
                </label>
                <input
                  id="t-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full legal name"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-screenname" className="block text-xs font-semibold text-[#141413] mb-1">
                  Screen Name
                </label>
                <input
                  id="t-screenname"
                  type="text"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  placeholder="Stage / credit name"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-exp" className="block text-xs font-semibold text-[#141413] mb-1">
                  Experience (Years)
                </label>
                <input
                  id="t-exp"
                  type="number"
                  min={0}
                  max={60}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-phone" className="block text-xs font-semibold text-[#141413] mb-1">
                  Mobile Number (Hidden Until Admin Approves Studio) *
                </label>
                <input
                  id="t-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-email" className="block text-xs font-semibold text-[#141413] mb-1">
                  Email Address
                </label>
                <input
                  id="t-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-aadhaar" className="block text-xs font-semibold text-[#141413] mb-1">
                  Mandatory 12-Digit Aadhaar Number (ఆధార్ తప్పనిసరి) *
                </label>
                <input
                  id="t-aadhaar"
                  type="text"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label htmlFor="t-aadhaar-file" className="block text-xs font-semibold text-[#141413] mb-1">
                  Upload Aadhaar Card Copy (Encrypted Verification)
                </label>
                <label
                  htmlFor="t-aadhaar-file"
                  className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium bg-[#FAF9F6] border border-dashed border-[#B8B4AA] rounded-lg cursor-pointer hover:bg-[#F1EFEA]"
                >
                  <Upload className="w-4 h-4 text-[#BE123C]" />
                  <span>{aadhaarDocName || 'Select Aadhaar PDF / Image'}</span>
                </label>
                <input
                  id="t-aadhaar-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setAadhaarDocName(e.target.files?.[0]?.name || '')}
                  className="sr-only"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="mt-0.5 rounded border-[#DEDBD2] text-[#BE123C]"
                  />
                  <span className="text-xs text-[#141413]">
                    <strong>Enable Priority Paid Profile (₹{snapshot.siteSettings.paidProfileAnnualFeeInr}/yr):</strong>{' '}
                    Displays your profile FIRST when Production Houses open your Craft Category & Sub-Category.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Film Industry Origin, Languages Known & Full Address */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#141413] pb-2 border-b border-[#F1EFEA]">
              03. Film Industry Base (ఎక్కడివారు), Spoken Languages & Clear Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="t-industry" className="block text-xs font-semibold text-[#141413] mb-1">
                  Primary Cinema Industry (Tollywood / Kollywood / Bollywood...) *
                </label>
                <select
                  id="t-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as FilmIndustry)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                >
                  {FILM_INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.labelTe}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#141413] mb-1">
                  How Many Languages Spoken: <strong className="text-[#BE123C] tabular-nums">{selectedLangs.length} Selected</strong>
                </span>
                <div className="flex flex-wrap gap-2 p-2.5 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg">
                  {INDIAN_LANGUAGES.map((l) => (
                    <label key={l} className="inline-flex items-center gap-1.5 text-xs text-[#141413] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLangs.includes(l)}
                        onChange={() => toggleItem(selectedLangs, l, setSelectedLangs)}
                        className="rounded border-[#DEDBD2] text-[#BE123C]"
                      />
                      <span>{l.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label htmlFor="t-street" className="block text-xs font-semibold text-[#141413] mb-1">
                  House / Flat No. & Street *
                </label>
                <input
                  id="t-street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="H.No. 8-2-293, Road No. 14"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-area" className="block text-xs font-semibold text-[#141413] mb-1">
                  Area / Locality
                </label>
                <input
                  id="t-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Krishna Nagar"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-city" className="block text-xs font-semibold text-[#141413] mb-1">
                  City *
                </label>
                <input
                  id="t-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="t-pin" className="block text-xs font-semibold text-[#141413] mb-1">
                  State & PIN
                </label>
                <div className="flex gap-1.5">
                  <input
                    id="t-pin"
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-1/2 px-2.5 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  />
                  <input
                    type="text"
                    aria-label="PIN Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="PIN"
                    className="w-1/2 px-2.5 py-2 text-sm font-mono bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="t-bio" className="block text-xs font-semibold text-[#141413] mb-1">
                Work Summary / Filmography Highlights
              </label>
              <textarea
                id="t-bio"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Mention past feature films, short films, union membership, or technical specialization..."
                className="w-full px-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
          </div>

          {/* Step 4: Up to 25 Gallery Photos & Unlimited YouTube Showreel Links */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#141413] pb-2 border-b border-[#F1EFEA]">
              04. Gallery Photos ({photos.length} / 25 Max) & Unlimited YouTube Links
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Up to 25 Photos Uploader */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#141413]">
                    Upload Up to 25 Photos from Phone Gallery / Computer
                  </span>
                  <span className="font-mono text-xs text-[#6B6963] tabular-nums">
                    {photos.length} / 25
                  </span>
                </div>
                <label
                  htmlFor="gallery-25-input"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF9F6] border border-dashed border-[#B8B4AA] rounded-xl text-xs font-semibold text-[#141413] hover:bg-[#F1EFEA] cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4 text-[#BE123C]" />
                  Select Photos from Gallery (Multiple Allowed, Up to 25)
                </label>
                <input
                  id="gallery-25-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />

                <div className="grid grid-cols-5 gap-2">
                  {photos.map((src, idx) => (
                    <div key={`${idx}-${src.slice(0, 24)}`} className="relative aspect-square rounded-lg overflow-hidden border border-[#E6E4DD]">
                      <img src={src} alt={`Preview ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      {photos.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove photo ${idx + 1}`}
                          onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white hover:bg-[#BE123C] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlimited YouTube Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#141413]">
                    Unlimited YouTube Showreel / Audition / Work Links
                  </span>
                  <button
                    type="button"
                    onClick={() => setYoutubeLinks((prev) => [...prev, ''])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#BE123C] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another YouTube Link
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {youtubeLinks.map((yt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-[#BE123C] shrink-0" />
                      <input
                        type="url"
                        aria-label={`YouTube link ${idx + 1}`}
                        value={yt}
                        onChange={(e) => {
                          const next = [...youtubeLinks];
                          next[idx] = e.target.value;
                          setYoutubeLinks(next);
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                      />
                      {youtubeLinks.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Delete YouTube link ${idx + 1}`}
                          onClick={() => setYoutubeLinks((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-[#6B6963] hover:text-[#BE123C] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Complete Casting Category Specification (All 28+ Requested Fields) */}
          <div className="space-y-5 pt-2 border-t border-[#E6E4DD]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-[#141413]">
                  05. Casting Category Detailed Profile Options
                </h2>
                <p className="text-xs text-[#6B6963]">
                  Physical stats, shoot preferences, Interested In (1–14), and Comfortable With (A–D) options for Casting Directors.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#141413] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCastingPortfolio}
                  onChange={(e) => setIncludeCastingPortfolio(e.target.checked)}
                  className="rounded border-[#DEDBD2] text-[#BE123C]"
                />
                Include Full Casting Portfolio Details
              </label>
            </div>

            {includeCastingPortfolio && (
              <div className="space-y-6 p-5 rounded-xl bg-[#FAF9F6] border border-[#E6E4DD]">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label htmlFor="c-age" className="block font-semibold mb-1">Age</label>
                    <input id="c-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-height" className="block font-semibold mb-1">Height</label>
                    <input id="c-height" type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-weight" className="block font-semibold mb-1">Weight</label>
                    <input id="c-weight" type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-bust" className="block font-semibold mb-1">Bust / Chest</label>
                    <input id="c-bust" type="text" value={bust} onChange={(e) => setBust(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-waist" className="block font-semibold mb-1">Waist</label>
                    <input id="c-waist" type="text" value={waist} onChange={(e) => setWaist(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-hip" className="block font-semibold mb-1">Hip</label>
                    <input id="c-hip" type="text" value={hip} onChange={(e) => setHip(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-skin" className="block font-semibold mb-1">Skin Tone</label>
                    <input id="c-skin" type="text" value={skinTone} onChange={(e) => setSkinTone(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-eye" className="block font-semibold mb-1">Eye Colour</label>
                    <input id="c-eye" type="text" value={eyeColour} onChange={(e) => setEyeColour(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-hair" className="block font-semibold mb-1">Hair Colour</label>
                    <input id="c-hair" type="text" value={hairColour} onChange={(e) => setHairColour(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-shoe" className="block font-semibold mb-1">Shoe Size</label>
                    <input id="c-shoe" type="text" value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="c-marital" className="block font-semibold mb-1">Marital Status</label>
                    <select id="c-marital" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg">
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-passport" className="block font-semibold mb-1">20. Passport</label>
                    <select id="c-passport" value={passport} onChange={(e) => setPassport(e.target.value as 'Yes' | 'Applied' | 'No')} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg">
                      <option value="Yes">Yes (Available)</option>
                      <option value="Applied">Applied</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-prof" className="block font-semibold mb-1">Present Profession</label>
                    <input id="c-prof" type="text" value={presentProfession} onChange={(e) => setPresentProfession(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-edu" className="block font-semibold mb-1">Education</label>
                    <input id="c-edu" type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-dress" className="block font-semibold mb-1">Dresses Comfortable</label>
                    <input id="c-dress" type="text" value={dressesComfortable} onChange={(e) => setDressesComfortable(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-insta" className="block font-semibold mb-1">Instagram ID</label>
                    <input id="c-insta" type="text" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="@your_instagram" className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-aim" className="block font-semibold mb-1">Aim</label>
                    <input id="c-aim" type="text" value={aim} onChange={(e) => setAim(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="c-allergy" className="block font-semibold mb-1">Any Allergies to Dust or Cosmetics</label>
                    <input id="c-allergy" type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-[#DEDBD2] rounded-lg" />
                  </div>
                </div>

                {/* Shoot Travel & Timing Toggles */}
                <div className="flex flex-wrap gap-5 text-xs font-medium text-[#141413]">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={openForOutstation} onChange={(e) => setOpenForOutstation(e.target.checked)} className="rounded border-[#DEDBD2] text-[#BE123C]" />
                    Open for Outstation Shoots
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={openForOutOfCountry} onChange={(e) => setOpenForOutOfCountry(e.target.checked)} className="rounded border-[#DEDBD2] text-[#BE123C]" />
                    19. Open for Out of Country Shoots
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={comfortableAllTimings} onChange={(e) => setComfortableAllTimings(e.target.checked)} className="rounded border-[#DEDBD2] text-[#BE123C]" />
                    Comfortable with all Timings
                  </label>
                </div>

                {/* INTERESTED IN (1 to 14) */}
                <div>
                  <span className="block text-xs font-bold text-[#141413] uppercase tracking-wider mb-2">
                    INTERESTED IN (Select All Applicable)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                    {CASTING_INTERESTED_IN_OPTIONS.map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer text-[#3F3E3B]">
                        <input
                          type="checkbox"
                          checked={interestedIn.includes(opt)}
                          onChange={() => toggleItem(interestedIn, opt, setInterestedIn)}
                          className="rounded border-[#DEDBD2] text-[#BE123C]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* COMFORTABLE WITH (A-D + Wardrobe & Scene Comforts) */}
                <div>
                  <span className="block text-xs font-bold text-[#141413] uppercase tracking-wider mb-2">
                    COMFORTABLE WITH (A–D & On-Screen Preferences)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                    {CASTING_COMFORTABLE_WITH_OPTIONS.map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer text-[#3F3E3B]">
                        <input
                          type="checkbox"
                          checked={comfortableWith.includes(opt)}
                          onChange={() => toggleItem(comfortableWith, opt, setComfortableWith)}
                          className="rounded border-[#DEDBD2] text-[#BE123C]"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#E6E4DD]">
            <p className="text-xs text-[#6B6963] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              Aadhaar & Contact Numbers are encrypted with AES-256-GCM.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-sm font-bold text-white bg-[#BE123C] rounded-xl hover:bg-[#9F1239] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating Unique Profile ID...' : 'Complete 24Crofts Profile Registration'}
            </button>
          </div>
        </form>
      ) : (
        /* PRODUCTION HOUSE DEDICATED REGISTRATION FORM */
        <form onSubmit={handleProductionHouseSubmit} className="bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-[#141413]">
              Production House & Studio Verification Form
            </h2>
            <p className="text-xs text-[#6B6963] mt-1">
              Uploading your official <strong>Movie Registration Form / Chamber Certificate</strong> and <strong>12-digit Aadhaar</strong> is mandatory. Once approved by the 24crofts.com Admin Team, your account can unlock artist contact numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ph-banner" className="block text-xs font-semibold text-[#141413] mb-1">
                Production House / Banner Name *
              </label>
              <input
                id="ph-banner"
                type="text"
                value={phBannerName}
                onChange={(e) => setPhBannerName(e.target.value)}
                placeholder="e.g. Sri Venkateswara Cine Chitra"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-regno" className="block text-xs font-semibold text-[#141413] mb-1">
                Film Chamber / Banner Registration No.
              </label>
              <input
                id="ph-regno"
                type="text"
                value={phRegNumber}
                onChange={(e) => setPhRegNumber(e.target.value)}
                placeholder="e.g. TFCC-HYD-2026-109"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-producer" className="block text-xs font-semibold text-[#141413] mb-1">
                Producer / Executive / Casting Head Name *
              </label>
              <input
                id="ph-producer"
                type="text"
                value={phProducerName}
                onChange={(e) => setPhProducerName(e.target.value)}
                placeholder="Authorized signatory full name"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-aadhaar" className="block text-xs font-semibold text-[#141413] mb-1">
                Mandatory 12-Digit Aadhaar Number *
              </label>
              <input
                id="ph-aadhaar"
                type="text"
                maxLength={14}
                value={phAadhaar}
                onChange={(e) => setPhAadhaar(e.target.value)}
                placeholder="12-digit Aadhaar of Producer/Authorized Signatory"
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-user" className="block text-xs font-semibold text-[#141413] mb-1">
                Create Production House User ID *
              </label>
              <input
                id="ph-user"
                type="text"
                value={phUsername}
                onChange={(e) => setPhUsername(e.target.value)}
                placeholder="e.g. svcc_casting"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-pass" className="block text-xs font-semibold text-[#141413] mb-1">
                Create Password *
              </label>
              <input
                id="ph-pass"
                type="password"
                value={phPassword}
                onChange={(e) => setPhPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-phone" className="block text-xs font-semibold text-[#141413] mb-1">
                Official Contact Mobile *
              </label>
              <input
                id="ph-phone"
                type="tel"
                value={phPhone}
                onChange={(e) => setPhPhone(e.target.value)}
                placeholder="10-digit office mobile"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-email" className="block text-xs font-semibold text-[#141413] mb-1">
                Official Studio Email *
              </label>
              <input
                id="ph-email"
                type="email"
                value={phEmail}
                onChange={(e) => setPhEmail(e.target.value)}
                placeholder="casting@productionhouse.in"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
          </div>

          {/* MANDATORY MOVIE REGISTRATION FORM UPLOAD */}
          <div className="p-5 rounded-xl bg-[#FFF1F2]/60 border border-[#FECDD3] space-y-2">
            <label htmlFor="ph-movie-form" className="block text-xs font-bold text-[#9F1239]">
              Mandatory Movie Registration Form Upload (ప్రొడక్షన్ హౌస్ మూవీ రిజిస్ట్రేషన్ ఫారం తప్పనిసరి) *
            </label>
            <label
              htmlFor="ph-movie-form"
              className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-dashed border-[#BE123C] rounded-xl text-xs font-semibold text-[#141413] hover:bg-[#FFF1F2] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#BE123C]" />
                {phMovieFormName
                  ? `Uploaded: ${phMovieFormName}`
                  : 'Upload Chamber Movie Registration Form (PDF / Image) *'}
              </span>
              <span className="text-[#BE123C]">Browse File</span>
            </label>
            <input
              id="ph-movie-form"
              type="file"
              accept=".pdf,image/*"
              onChange={handlePhMovieFormUpload}
              className="sr-only"
            />
          </div>

          {/* Industry, Languages & Studio Office Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ph-industry" className="block text-xs font-semibold text-[#141413] mb-1">
                Film Industry Origin
              </label>
              <select
                id="ph-industry"
                value={phIndustry}
                onChange={(e) => setPhIndustry(e.target.value as FilmIndustry)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              >
                {FILM_INDUSTRIES.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.labelTe}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#141413] mb-1">
                Production Languages ({phLangs.length})
              </span>
              <div className="flex flex-wrap gap-2 p-2.5 bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg">
                {INDIAN_LANGUAGES.slice(0, 6).map((l) => (
                  <label key={l} className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phLangs.includes(l)}
                      onChange={() => toggleItem(phLangs, l, setPhLangs)}
                      className="rounded border-[#DEDBD2] text-[#BE123C]"
                    />
                    <span>{l.split(' ')[0]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="ph-street" className="block text-xs font-semibold text-[#141413] mb-1">
                Office Plot / Street Address *
              </label>
              <input
                id="ph-street"
                type="text"
                value={phStreet}
                onChange={(e) => setPhStreet(e.target.value)}
                placeholder="Plot 45, Road No. 72, Film Nagar"
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-city" className="block text-xs font-semibold text-[#141413] mb-1">
                City *
              </label>
              <input
                id="ph-city"
                type="text"
                value={phCity}
                onChange={(e) => setPhCity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="ph-state" className="block text-xs font-semibold text-[#141413] mb-1">
                State & PIN
              </label>
              <div className="flex gap-1.5">
                <input
                  id="ph-state"
                  type="text"
                  value={phState}
                  onChange={(e) => setPhState(e.target.value)}
                  className="w-1/2 px-2 py-2 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
                <input
                  type="text"
                  aria-label="Production House PIN"
                  value={phPin}
                  onChange={(e) => setPhPin(e.target.value)}
                  className="w-1/2 px-2 py-2 text-sm font-mono bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E4DD] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#6B6963] inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              Subject to Website Admin Team Verification before unlocking contact details.
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-sm font-bold text-white bg-[#141413] rounded-xl hover:bg-[#BE123C] transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting Verification...' : 'Submit Production House for Admin Approval'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
