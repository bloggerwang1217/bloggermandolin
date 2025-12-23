// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BloggerMandolin',
  tagline: '台灣曼陀林演奏家🎵',
  favicon: 'img/BloggerMandolin.ico',

  // Set the production url of your site here
  url: 'https://bloggermandolin.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['en','zh-TW','ja'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',

          blogTitle: '部落客小王的部落格!',
          blogDescription: '沒錯，部落客小王會寫部落格!這裡分享跟我有關的大小事',
          postsPerPage: 'ALL',
          blogSidebarTitle: '所有貼文',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // Add the Lunr local search plugin here
  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en', 'zh', 'ja'], // Optional: Specify which languages to index
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/Banner.webp',
      navbar: {
        title: 'BloggerMandolin',
        logo: {
          alt: 'BloggerMandolin Logo',
          src: 'img/BloggerMandolin.webp',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'portfolioSidebar',
            position: 'left',
            label: '作品集',
          },
          {
            type: 'docSidebar',
            sidebarId: 'coverSidebar',
            position: 'left',
            label: '曼陀林cover',
          },
          {
            type: 'docSidebar',
            sidebarId: 'articleSidebar',
            position: 'left',
            label: '綜合文章',
          },
          {
            to: '/blog',
            label: '部落格',
            position: 'left',
          },
          {
            to: '/tools',
            label: '小工具',
            position: 'left',
          },
          {
            href: 'https://www.youtube.com/@BloggerMandolin',
            label: 'YouTube頻道',
            position: 'right',
          },
          {
            type: 'search',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '站內連結',
            items: [
              {
                label: '綜合文章',
                to: '/docs/article',
              },
              {
                label: '曼陀林cover',
                to: '/docs/cover',
              },
            ],
          },
          {
            title: '我的蹤跡',
            items: [
              {
                label: 'YouTube頻道',
                href: 'https://www.youtube.com/@BloggerMandolin',
              },
              {
                label: '串流平台',
                href: 'https://ffm.bio/bloggermandolin',
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/bloggermandolin/',
              },
              {
                label: 'X / Twitter',
                href: 'https://x.com/BloggerMandolin',
              },
              {
                label: '巴哈小屋',
                href: 'https://home.gamer.com.tw/creation.php?owner=m28341812',
              },
            ],
          },
          {
            title: '樂譜',
            items: [
              {
                label: 'Musescore',
                to: 'https://musescore.com/user/29701571',
              },
              {
                label: 'Gumroad',
                href: 'https://bloggermandolin.gumroad.com/',
              },
              {
                label: 'Patreon',
                href: 'https://www.patreon.com/BloggerMandolin',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BloggerMandolin. All right reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

};

export default config;