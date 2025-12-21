import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const FeatureListZhTw = [
  {
    title: '動畫主題曲',
    imgSrc: require('@site/static/img/anime_theme.webp').default,
    description: (
      <>
        經典或新番的 OP/ED 主題曲
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xqiv_Rtl_N8',
  },
  {
    title: '動畫配樂',
    imgSrc: require('@site/static/img/anime_soundtrack.webp').default,
    description: (
      <>
        感人或激昂，動畫劇情的推動者！
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xevMGbDe1Q4',
  },
  {
    title: '遊戲原聲帶',
    imgSrc: require('@site/static/img/game_soundtrack.webp').default,
    description: (
      <>
        夢回玩遊戲時的感動
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=AoZpyRON9OE',
  },
];

const FeatureListEn = [
  {
    title: 'Anime Themes',
    imgSrc: require('@site/static/img/anime_theme.webp').default,
    description: (
      <>
        Classic or new anime OP/ED opening and ending themes
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xqiv_Rtl_N8',
  },
  {
    title: 'Anime Soundtracks',
    imgSrc: require('@site/static/img/anime_soundtrack.webp').default,
    description: (
      <>
        Heartwarming or intense, the driving force behind anime storytelling!
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xevMGbDe1Q4',
  },
  {
    title: 'Game Soundtracks',
    imgSrc: require('@site/static/img/game_soundtrack.webp').default,
    description: (
      <>
        Relive the emotions from unforgettable gaming experiences
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=AoZpyRON9OE',
  },
];

const FeatureListJa = [
  {
    title: 'アニメ主題歌',
    imgSrc: require('@site/static/img/anime_theme.webp').default,
    description: (
      <>
        経典や新作アニメの OP/ED 主題歌
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xqiv_Rtl_N8',
  },
  {
    title: 'アニメ サウンドトラック',
    imgSrc: require('@site/static/img/anime_soundtrack.webp').default,
    description: (
      <>
        感動的または激しい、アニメストーリーの推進力！
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=xevMGbDe1Q4',
  },
  {
    title: 'ゲーム サウンドトラック',
    imgSrc: require('@site/static/img/game_soundtrack.webp').default,
    description: (
      <>
        忘れられないゲーム体験の感動をもう一度
      </>
    ),
    linkUrl: 'https://www.youtube.com/watch?v=AoZpyRON9OE',
  },
];

function Feature({imgSrc, title, description, linkUrl}) {
  return (
    <div className={clsx('col col--4', styles.featureItem)}>
      <div className="text--center">
        <a href={linkUrl}>
          <img src={imgSrc} className={styles.featureImg} alt={title} />
        </a>
      </div>
      <div className={clsx('text--center', styles.featureText)}>
        <Heading as="h3">
          <a href={linkUrl}>{title}</a>
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale;

  let FeatureList;
  if (currentLocale === 'en') {
    FeatureList = FeatureListEn;
  } else if (currentLocale === 'ja') {
    FeatureList = FeatureListJa;
  } else {
    FeatureList = FeatureListZhTw;
  }

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
