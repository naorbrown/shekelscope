import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/openshekel',
  }),
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
