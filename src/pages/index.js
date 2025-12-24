import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title" style={{ 
          fontSize: '3rem', 
          marginTop: '2rem', 
          marginBottom: '1.5rem',
          lineHeight: '1.2',
          paddingBottom: '15px' 
        }}>
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {siteConfig.tagline}
        </p>
        <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '2rem' }}>
          Mandolinist | Music Producer | Full-Stack Developer
        </p>
        
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/about"
            style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
            探索作品集
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/blog"
            style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
            閱讀部落格
          </Link>
        </div>

        <div className={styles.videoContainer}>
          <iframe
            className={styles.responsiveIframe}
            src="https://www.youtube.com/embed/msezCTCT2CQ"
            title="Featured Mandolin Performance"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
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
    <div className={styles.quoteSection} style={{ background: '#fff', padding: '4rem 0', margin: 0, position: 'relative', zIndex: 10 }}>
      <div className="container">
        <blockquote>
          <p>{quoteText}</p>
          <footer>{authorText}</footer>
        </blockquote>
      </div>
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
      <div className={styles.bgContainer}>
        <HomepageHeader />
      </div>

      <QuoteSection />

      <div className={styles.bgContainer}>
        <main>
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  );
}
