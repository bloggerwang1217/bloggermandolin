import React, { useState } from 'react';
import styles from './styles.module.css';

const SubtitleCopier = () => {
  const [srtFile, setSrtFile] = useState('');
  const [translations, setTranslations] = useState('');
  const [language, setLanguage] = useState('zh-Hant');
  const [processedContent, setProcessedContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // 處理 SRT 檔案內容，將翻譯文字替換到對應位置
  const processSrtContent = (srtContent, translationLines) => {
    const lines = srtContent.split('\n');
    const result = [];
    let translationIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      // SRT 格式：序號 -> 時間軸 -> 字幕內容 -> 空行
      if (i % 4 === 2 && translationIndex < translationLines.length) {
        // 這是字幕內容行，替換為翻譯
        result.push(translationLines[translationIndex].trim());
        translationIndex++;
      } else {
        // 保留原始行（序號、時間軸、空行）
        result.push(lines[i]);
      }
    }

    return result.join('\n');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.srt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrtFile(e.target.result);
      };
      reader.readAsText(file, 'utf-8');
    } else {
      alert('請上傳 .srt 格式的字幕檔');
    }
  };

  const handleProcess = () => {
    if (!srtFile) {
      alert('請先上傳 SRT 檔案');
      return;
    }

    if (!translations.trim()) {
      alert('請輸入翻譯文字');
      return;
    }

    const translationLines = translations.split('\n').filter(line => line.trim());
    const processed = processSrtContent(srtFile, translationLines);
    
    setProcessedContent(processed);
    setShowPreview(true);
  };

  const handleDownload = () => {
    const blob = new Blob([processedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${language}_subtitle.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(processedContent).then(() => {
      alert('已複製到剪貼簿！');
    }).catch(() => {
      alert('複製失敗，請手動選取文字複製');
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SRT 字幕翻譯工具</h1>
      
      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>上傳 SRT 檔案：</label>
            <input
              type="file"
              accept=".srt"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>輸入翻譯文字（每行一句）：</label>
            <textarea
              value={translations}
              onChange={(e) => setTranslations(e.target.value)}
              rows={10}
              className={styles.textarea}
              placeholder="請輸入翻譯文字，每行對應一句字幕..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>語言代碼：</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.select}
            >
              <option value="zh-Hant">繁體中文 (zh-Hant)</option>
              <option value="en">English (en)</option>
              <option value="ja">日本語 (ja)</option>
            </select>
          </div>

          <button onClick={handleProcess} className={styles.submitButton}>
            處理字幕
          </button>
        </div>

        {showPreview && (
          <div className={styles.previewSection}>
            <h2 className={styles.previewTitle}>預覽結果</h2>
            <pre className={styles.previewContent}>{processedContent}</pre>
            
            <div className={styles.buttonGroup}>
              <button onClick={handleDownload} className={styles.downloadButton}>
                下載 SRT 檔案
              </button>
              <button onClick={handleCopyToClipboard} className={styles.copyButton}>
                複製到剪貼簿
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p>
          Created by{' '}
          <a 
            href="https://www.youtube.com/@BloggerMandolin" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            BloggerMandolin
          </a>
          {' '}with ❤️
        </p>
      </div>
    </div>
  );
};

export default SubtitleCopier;