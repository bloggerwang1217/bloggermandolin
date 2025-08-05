/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  coverSidebar: [
    {
      type: 'doc',
      label: 'Cover首頁',
      id: 'cover',
      translatable: true,
    },
    {
      type: 'category',
      label: '👽膽大黨',
      items: [
        {
          type: 'doc',
          id: "cover/DANDADAN/otonoke"
        },
      ],
    },
  ],
  articleSidebar: [
    {
      type: 'doc',
      label: '文章首頁',
      id: 'article',
      translatable: true,
    },
    {
      type: 'category',
      label: '🧠心理學',
      items: [
      {
          type: 'doc',
          id: "article/psychology/tests/walk_into_the_woods"
        },
        {
          type: 'doc',
          id: "article/psychology/well-being/eudaimonism-hedonism"
        },
        {
          type: 'doc',
          id: "article/psychology/self-efficacy/about-love-and-self-efficacy"
        },
      ],
    },
    {
      type: 'category',
      label: '📊統計學',
      items: [
        {
          type: 'doc',
          id: "article/statistics/stat_interview_114"
        },
      ],
    },
    {
      type: 'category',
      label: '🏦經濟學',
      items: [
        {
          type: 'doc',
          id: "article/economics/game_theory/median-voter-theorem"
        },
      ],
    },
  ],
};

export default sidebars;
