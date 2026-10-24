import React from 'react';
import { serializeSnapshotForViewer } from '@/lib/server-store';
import { StandaloneProfileView } from '@/components/StandaloneProfileView';

export const dynamic = 'force-dynamic';

export default async function SharedProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  const rawId = decodeURIComponent(resolved.id || '').toUpperCase();
  const normalizedId = rawId.startsWith('24C-') ? rawId : `24C-${rawId}`;
  const initialSnapshot = serializeSnapshotForViewer({ role: 'guest' });

  return <StandaloneProfileView initialSnapshot={initialSnapshot} profileId={normalizedId} />;
}
