import { NextRequest, NextResponse } from 'next/server';
import {
  validateProductionHouseInput,
  validateTalentRegistrationInput,
} from '@/lib/platform-logic';
import {
  encryptSensitiveField,
  maskEmail,
  maskPhone,
} from '@/lib/security';
import {
  authenticateUser,
  createNewProductionHouse,
  createNewTalentProfile,
  getDb,
  saveDbToDisk,
  serializeSnapshotForViewer,
} from '@/lib/server-store';
import type {
  AdCategoryType,
  AdPlacement,
  CraftCategory,
  SessionViewer,
  SiteSettings,
} from '@/lib/types';

function parseViewerHeader(req: NextRequest): SessionViewer {
  const raw = req.headers.get('x-24crofts-viewer');
  if (!raw) return { role: 'guest' };
  try {
    const parsed = JSON.parse(raw) as SessionViewer;
    if (parsed && parsed.role) return parsed;
  } catch {
    // Ignore invalid header
  }
  return { role: 'guest' };
}

export async function GET(req: NextRequest) {
  const viewer = parseViewerHeader(req);
  const snapshot = serializeSnapshotForViewer(viewer);
  return NextResponse.json(snapshot);
}

export async function POST(req: NextRequest) {
  const currentViewer = parseViewerHeader(req);
  const db = getDb();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const action = String(body.action || '');
  const payload =
    body.payload && typeof body.payload === 'object'
      ? (body.payload as Record<string, unknown>)
      : body;

  // 1. Role-Separated or Unified Login (24 Crafts Category / Production House / Admin)
  if (action === 'login') {
    const username = String(payload.username || '');
    const password = String(payload.password || '');
    const expectedRoleRaw = payload.expectedRole ? String(payload.expectedRole) : undefined;
    const expectedRole =
      expectedRoleRaw === 'talent' ||
      expectedRoleRaw === 'production_house' ||
      expectedRoleRaw === 'admin'
        ? expectedRoleRaw
        : undefined;

    const auth = authenticateUser(username, password, expectedRole);
    if (!auth.success || !auth.viewer) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Authentication failed.' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      success: true,
      viewer: auth.viewer,
      snapshot: serializeSnapshotForViewer(auth.viewer),
    });
  }

  // 2. Register 24 Crafts Artist / Technician Profile
  if (action === 'register_talent') {
    const address = (payload.address || {}) as Record<string, unknown>;
    const languages = Array.isArray(payload.languages) ? payload.languages.map(String) : ['Telugu'];
    const photos = Array.isArray(payload.photos) ? payload.photos.map(String) : [];

    const validation = validateTalentRegistrationInput({
      username: String(payload.username || ''),
      password: String(payload.password || ''),
      fullName: String(payload.fullName || ''),
      craftId: String(payload.craftId || ''),
      subCategoryId: String(payload.subCategoryId || ''),
      aadhaarNumber: String(payload.aadhaarNumber || ''),
      phone: String(payload.phone || ''),
      city: String(address.city || ''),
      street: String(address.street || 'Studio Road'),
      languages,
      photosCount: photos.length,
    });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] || 'Invalid registration data.' },
        { status: 400 }
      );
    }

    const created = createNewTalentProfile(
      payload as unknown as Parameters<typeof createNewTalentProfile>[0]
    );
    if (!created.success || !created.profile) {
      return NextResponse.json({ success: false, error: created.error }, { status: 400 });
    }

    const newViewer: SessionViewer = {
      role: 'talent',
      userId: created.profile.id,
      username: created.profile.username,
      displayName: `${created.profile.fullName} (${created.profile.id})`,
      isApproved: true,
      canViewContacts: false,
    };

    return NextResponse.json({
      success: true,
      profileId: created.profile.id,
      viewer: newViewer,
      snapshot: serializeSnapshotForViewer(newViewer),
    });
  }

  // 3. Register Production House (with mandatory Movie Registration Form)
  if (action === 'register_production_house') {
    const address = (payload.address || {}) as Record<string, unknown>;
    const validation = validateProductionHouseInput({
      bannerName: String(payload.bannerName || ''),
      producerOrManagerName: String(payload.producerOrManagerName || ''),
      username: String(payload.username || ''),
      password: String(payload.password || ''),
      aadhaarNumber: String(payload.aadhaarNumber || ''),
      movieRegistrationFormName: String(payload.movieRegistrationFormName || ''),
      phone: String(payload.phone || ''),
      city: String(address.city || 'Hyderabad'),
    });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] || 'Invalid Production House details.' },
        { status: 400 }
      );
    }

    const created = createNewProductionHouse(
      payload as unknown as Parameters<typeof createNewProductionHouse>[0]
    );
    if (!created.success || !created.productionHouse) {
      return NextResponse.json({ success: false, error: created.error }, { status: 400 });
    }

    const newViewer: SessionViewer = {
      role: 'production_house',
      userId: created.productionHouse.id,
      username: created.productionHouse.username,
      displayName: created.productionHouse.bannerName,
      isApproved: false,
      canViewContacts: false,
    };

    return NextResponse.json({
      success: true,
      productionHouseId: created.productionHouse.id,
      viewer: newViewer,
      snapshot: serializeSnapshotForViewer(newViewer),
    });
  }

  // 4. Update Talent Profile (Self-Edit or Admin Credential/Status Edit)
  if (action === 'update_profile') {
    const profileId = String(body.profileId || payload.profileId || '');
    const updates = (body.updates || payload.updates || {}) as Record<string, unknown>;
    const target = db.profiles.find((p) => p.id === profileId);
    if (!target) {
      return NextResponse.json({ success: false, error: 'Profile not found.' }, { status: 404 });
    }

    const isOwner = currentViewer.role === 'talent' && currentViewer.userId === target.id;
    const isAdmin = currentViewer.role === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to edit this profile.' },
        { status: 403 }
      );
    }

    if (typeof updates.fullName === 'string' && updates.fullName.trim()) {
      target.fullName = updates.fullName.trim();
    }
    if (typeof updates.screenName === 'string' && updates.screenName.trim()) {
      target.screenName = updates.screenName.trim();
    }
    if (typeof updates.bio === 'string') {
      target.bio = updates.bio;
    }
    if (typeof updates.industry === 'string') {
      target.industry = updates.industry as typeof target.industry;
    }
    if (Array.isArray(updates.languages) && updates.languages.length > 0) {
      target.languages = updates.languages.map(String);
      target.languagesCount = target.languages.length;
    }
    if (updates.address && typeof updates.address === 'object') {
      target.address = {
        ...target.address,
        ...(updates.address as typeof target.address),
      };
    }
    if (typeof updates.phone === 'string' && updates.phone.replace(/\D/g, '').length >= 10) {
      target.phoneMasked = maskPhone(updates.phone);
      target.phoneEncrypted = encryptSensitiveField(updates.phone);
    }
    if (Array.isArray(updates.photos)) {
      target.photos = updates.photos.map(String).slice(0, 25);
    }
    if (Array.isArray(updates.youtubeLinks)) {
      target.youtubeLinks = updates.youtubeLinks.map(String).filter((u) => u.trim().length > 0);
    }
    if (isAdmin) {
      if (typeof updates.username === 'string' && updates.username.trim()) {
        target.username = updates.username.trim();
      }
      if (typeof updates.newPassword === 'string' && updates.newPassword.trim()) {
        target.passwordEncrypted = encryptSensitiveField(updates.newPassword.trim());
      }
      if (typeof updates.isPaid === 'boolean') {
        target.isPaid = updates.isPaid;
      }
    }
    target.updatedAt = new Date().toISOString();
    saveDbToDisk();

    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  // 5. Submit Movie Teaser / Song / Pvt Ad / Special Ad (Queued for Admin Approval)
  if (action === 'submit_ad') {
    const title = String(payload.title || '').trim();
    const bannerOrClientName = String(
      payload.bannerOrClientName || payload.bannerOrSponsor || ''
    ).trim();
    const type = String(payload.type || payload.slotType || 'movie_teaser') as AdCategoryType;

    if (!title || !bannerOrClientName) {
      return NextResponse.json(
        { success: false, error: 'Ad title and banner/sponsor name are required.' },
        { status: 400 }
      );
    }

    const isAdmin = currentViewer.role === 'admin';
    const newAd: AdPlacement = {
      id: `AD-${Date.now()}`,
      type,
      title,
      subtitle: String(payload.subtitle || bannerOrClientName).trim(),
      bannerOrClientName,
      youtubeUrl: String(payload.youtubeUrl || '').trim(),
      mediaImageUrl:
        String(payload.mediaImageUrl || payload.mediaPosterUrl || '').trim() ||
        '/images/teaser_poster_epic.jpg',
      mediaType:
        payload.mediaType === 'video_upload' || payload.mediaType === 'poster_song'
          ? payload.mediaType
          : 'youtube',
      priorityOrder: isAdmin ? 1 : 99,
      status: isAdmin ? 'approved' : 'pending',
      submittedBy: currentViewer.displayName || bannerOrClientName,
      contactPhone: String(payload.contactPhone || ''),
      impressions: 1,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    db.ads.unshift(newAd);
    saveDbToDisk();
    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  // 6. Record Profile View / Contact Inquiry
  if (action === 'record_profile_view') {
    const profileId = String(body.profileId || payload.profileId || '');
    const p = db.profiles.find((item) => item.id === profileId);
    if (p) {
      p.viewsCount += 1;
      if (currentViewer.canViewContacts) {
        p.contactUnlocksCount += 1;
      }
      saveDbToDisk();
    }
    return NextResponse.json({ success: true });
  }

  if (action === 'submit_contact_inquiry') {
    const senderName = String(payload.senderName || '').trim();
    const senderEmail = String(payload.senderEmail || payload.email || '').trim();
    const senderPhone = String(payload.senderPhone || payload.phone || '').trim();
    const subject = String(payload.subject || 'General Platform Inquiry').trim();
    const message = String(payload.message || '').trim();

    if (!senderName || !senderPhone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, Mobile Number, and Message are required.' },
        { status: 400 }
      );
    }

    db.inquiries.unshift({
      id: `INQ-${Date.now()}`,
      senderName,
      senderEmail: senderEmail ? maskEmail(senderEmail) : 'N/A',
      senderPhone,
      subject,
      encryptedMessagePayload: encryptSensitiveField(message),
      createdAt: new Date().toISOString(),
      status: 'new',
    });
    saveDbToDisk();

    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  // ============================================================================
  // ADMIN-ONLY ACTIONS
  // ============================================================================
  if (currentViewer.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Website Admin Team authorization required.' },
      { status: 403 }
    );
  }

  if (
    action === 'admin_manage_production_house' ||
    action === 'admin_toggle_production_house'
  ) {
    const phId = String(body.productionHouseId || payload.productionHouseId || '');
    const ph = db.productionHouses.find((item) => item.id === phId);
    if (!ph) {
      return NextResponse.json(
        { success: false, error: 'Production House not found.' },
        { status: 404 }
      );
    }
    const nextApproved =
      typeof body.isApproved === 'boolean'
        ? body.isApproved
        : typeof payload.isApproved === 'boolean'
          ? payload.isApproved
          : !ph.isApproved;
    ph.isApproved = nextApproved;
    ph.canViewContacts =
      typeof body.canViewContacts === 'boolean'
        ? body.canViewContacts
        : nextApproved;
    saveDbToDisk();

    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  if (action === 'admin_manage_ad' || action === 'admin_update_ad') {
    const adId = String(body.adId || payload.adId || '');
    const ad = db.ads.find((item) => item.id === adId);
    if (!ad) {
      return NextResponse.json({ success: false, error: 'Ad not found.' }, { status: 404 });
    }
    const nextStatus = body.status || payload.status;
    if (nextStatus === 'approved' || nextStatus === 'pending' || nextStatus === 'rejected') {
      ad.status = nextStatus;
    }
    const nextPriority =
      typeof body.priorityOrder === 'number'
        ? body.priorityOrder
        : typeof payload.priorityOrder === 'number'
          ? payload.priorityOrder
          : undefined;
    if (typeof nextPriority === 'number') {
      ad.priorityOrder = Math.max(1, nextPriority);
    }
    saveDbToDisk();
    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  if (action === 'admin_update_site_settings') {
    const nextSettings = (body.settings ||
      body.siteSettings ||
      payload.settings ||
      payload.siteSettings) as Partial<SiteSettings> | undefined;
    if (nextSettings) {
      db.siteSettings = {
        ...db.siteSettings,
        ...nextSettings,
      };
      saveDbToDisk();
    }
    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  if (action === 'admin_update_crafts') {
    const crafts = (body.crafts || payload.crafts) as CraftCategory[] | undefined;
    if (Array.isArray(crafts) && crafts.length === 24) {
      db.crafts = crafts;
      saveDbToDisk();
    }
    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  if (action === 'admin_send_notification') {
    const title = String(body.title || payload.title || '').trim();
    const message = String(body.message || payload.message || '').trim();
    const audience = ((body.audience ||
      body.targetAudience ||
      payload.audience ||
      'all') as 'all' | 'artists' | 'production_houses');
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message required.' },
        { status: 400 }
      );
    }
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      audience,
      createdAt: new Date().toISOString(),
    });
    saveDbToDisk();
    return NextResponse.json({
      success: true,
      snapshot: serializeSnapshotForViewer(currentViewer),
    });
  }

  return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
}
