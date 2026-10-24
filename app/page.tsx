import React from 'react';
import { serializeSnapshotForViewer } from '@/lib/server-store';
import { PlatformProvider } from '@/components/PlatformProvider';
import { PlatformShell } from '@/components/PlatformShell';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const initialSnapshot = serializeSnapshotForViewer({ role: 'guest' });

  return (
    <PlatformProvider initialSnapshot={initialSnapshot}>
      <PlatformShell />
    </PlatformProvider>
  );
}
