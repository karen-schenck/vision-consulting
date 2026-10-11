import type { MetadataRoute } from 'next';
import { assetPath } from '@/lib/asset-path';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vision Human Consulting',
    short_name: 'VHC',
    description:
      'Conseil et formation à Antibes : audit stratégique, transformation ciblée et formations en performance commerciale. Méthode ODC : Observer, Décoder, Consolider.',
    start_url: assetPath('/'),
    display: 'standalone',
    background_color: '#0F1B33',
    theme_color: '#0F1B33',
    icons: [
      { src: assetPath('/icon-light-32x32.svg'), sizes: 'any', type: 'image/svg+xml' },
      { src: assetPath('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: assetPath('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  };
}
