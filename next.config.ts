import type { NextConfig } from 'next';

const pages = process.env.GITHUB_PAGES === 'true';
const basePath = pages ? '/wedding_invitation' : '';

const config: NextConfig = {
  poweredByHeader: false,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { formats: ['image/avif', 'image/webp'], qualities: [75, 90], unoptimized: pages },
  ...(pages && {
    output: 'export',
    trailingSlash: true,
    // UI pages use .tsx. The .ts request handlers need a Node server.
    pageExtensions: ['tsx'],
  }),
};

export default config;
