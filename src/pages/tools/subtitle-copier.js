import React from 'react';
import Layout from '@theme/Layout';
import SubtitleCopier from '@site/src/components/SubtitleCopier';

export default function SubtitleCopierPage() {
  return (
    <Layout
      title="SRT 字幕翻譯複製工具"
      description="上傳 .srt 檔，將逐行翻譯文字自動對應到原始時間軸；支援預覽、下載與複製輸出（繁體/英/日），適合影片字幕翻譯與快速生成翻譯版 SRT。">
      <main>
        <SubtitleCopier />
      </main>
    </Layout>
  );
}