'use client';

import React from 'react';
import { PlatformProvider, type PlatformSnapshot } from './PlatformProvider';
import { PlatformShell } from './PlatformShell';

export function StandaloneProfileView({
  initialSnapshot,
  profileId,
}: {
  initialSnapshot: PlatformSnapshot;
  profileId: string;
}) {
  return (
    <PlatformProvider initialSnapshot={initialSnapshot} initialProfileId={profileId}>
      <PlatformShell />
    </PlatformProvider>
  );
}
