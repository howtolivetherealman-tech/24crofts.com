import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '24Crofts — Cinema 24 Crafts Talent & Production Platform',
    short_name: '24Crofts',
    description:
      'Matrimonial-style verified casting, talent directory, production house hub, and showreel platform for all 24 crafts of Indian cinema (24crofts.com).',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF9F6',
    theme_color: '#BE123C',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
