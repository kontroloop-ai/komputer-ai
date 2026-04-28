import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

const ASSET_PREFIX = '/komputer-ai';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSET_PREFIX}/logo-no-bg.png`}
          alt=""
          style={{ height: 26, width: 'auto' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSET_PREFIX}/logo-text-no-subtext-no-bg.png`}
          alt="Komputer.AI"
          style={{ height: 14, width: 'auto' }}
        />
      </span>
    ),
  },
  links: [
    { text: 'Docs', url: '/docs' },
    { text: 'GitHub', url: 'https://github.com/komputer-ai/komputer-ai', external: true },
  ],
  githubUrl: 'https://github.com/komputer-ai/komputer-ai',
};
