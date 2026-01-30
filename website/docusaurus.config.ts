import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import { getLocaleURL, navbarLocalePlugin } from './plugins/locale.js';

const config: Config = {
  title: 'CL ORM',
  url: 'https://wellwelwel.github.io/',
  baseUrl: '/cl-orm/',
  organizationName: 'wellwelwel',
  projectName: 'cl-orm',
  trailingSlash: false,
  favicon: 'img/favicon.svg',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wellwelwel/cl-orm/tree/main/website/',
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // image: 'img/cl-orm-social-card.jpg',
    navbar: {
      // logo: {
      //   alt: 'CL ORM Logo',
      //   src: 'img/favicon.svg',
      // },
      items: [
        {
          to: getLocaleURL(),
          label: 'CL ORM',
          position: 'left',
          className: 'navbar__brand navbar__manual--title text--truncate',
          activeBaseRegex: `^/$`,
        },
        {
          to: '/docs/category/documentation',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/wellwelwel/cl-orm',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub Repository',
        },
        { type: 'search', position: 'right' },
      ],
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'sql'],
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    'docusaurus-plugin-sass',
    '@easyops-cn/docusaurus-search-local',
    navbarLocalePlugin,
  ],
};

export default config;
