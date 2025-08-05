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
  return (
    <div className={styles.quoteSection}>
      <blockquote>
        <p>「傳遞曼陀林的溫暖與激情，演奏動人心弦的動畫與遊戲音樂🎶」</p>
        <footer>— BloggerMandolin</footer>
      </blockquote>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`歡迎造訪 ${siteConfig.title} 部落格網站`}
      description="台灣曼陀林演奏家 – 演奏動畫、遊戲音樂 <head />"
    >
      <HomepageHeader />
      <QuoteSection />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
