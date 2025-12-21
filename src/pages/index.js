import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <iframe
          className="responsive-iframe"
          src="https://www.youtube.com/embed/msezCTCT2CQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </header>
  );
}

function QuoteSection() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;

  let quoteText;
  let authorText = '— BloggerMandolin';

  if (currentLocale === 'en') {
    quoteText = 'Conveying the warmth and passion of the mandolin, performing anime and video game music that touches the heart 🎶';
  } else if (currentLocale === 'ja') {
    quoteText = 'マンドリンの温かさと情熱を伝え、心に響くアニメとゲーム音楽を演奏する🎶';
  } else {
    quoteText = '「傳遞曼陀林的溫暖與激情，演奏動人心弦的動畫與遊戲音樂🎶」';
  }

  return (
    <div className={styles.quoteSection}>
      <blockquote>
        <p>{quoteText}</p>
        <footer>{authorText}</footer>
      </blockquote>
    </div>
  );
}

export default function Home() {
  const {siteConfig, i18n} = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;

  let title, description;

  if (currentLocale === 'en') {
    title = `Welcome to ${siteConfig.title} Blog Site`;
    description = 'Taiwan mandolin performer – playing anime and video game music';
  } else if (currentLocale === 'ja') {
    title = `${siteConfig.title} ブログサイトへようこそ`;
    description = '台湾マンドリン奏者 – アニメとゲーム音楽を演奏';
  } else {
    title = `歡迎造訪 ${siteConfig.title} 部落格網站`;
    description = '台灣曼陀林演奏家 – 演奏動畫、遊戲音樂';
  }

  return (
    <Layout
      title={title}
      description={description}
    >
      <HomepageHeader />
      <QuoteSection />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
