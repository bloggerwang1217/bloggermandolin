# 自動化翻譯指南

這個翻譯系統使用 Ollama 和 GPT-OSS 20B 模型自動翻譯你的 Docusaurus cover 頁面到英文和日文。

## 快速開始（推薦方式）

針對 cover 文章的翻譯：

```bash
# 翻譯到英文
npm run translate:cover en docs/cover/DANDADAN/otonoke.md

# 翻譯到日文
npm run translate:cover ja docs/cover/DANDADAN/otonoke.md
```

這個方式會：
- ✅ 只翻譯「影片介紹」部分
- ✅ 保留日文歌詞和其他內容不動
- ✅ 自動生成到 i18n 對應的語言資料夾

## 前置要求

### 1. 安裝 Ollama
- 訪問 [ollama.ai](https://ollama.ai) 下載並安裝 Ollama
- 或通過 Homebrew 安裝：`brew install ollama`

### 2. 啟動 Ollama 服務
```bash
ollama serve
```

### 3. 拉取模型
選擇一個適合翻譯的模型。建議使用：

```bash
# 推薦：神經聊天模型（速度快，翻譯品質好）
ollama pull neural-chat

# 或使用：
ollama pull mistral
ollama pull llama2
```

## 設定

### 修改模型設定
編輯 `scripts/config.js`，預設使用 `gpt-oss:20b`。如果要換模型：

```javascript
ollama: {
  host: 'localhost',
  port: 11434,
  model: 'gpt-oss:20b', // 預設（推薦）
  // model: 'neural-chat', // 或其他模型
  temperature: 0.3,
  numCtx: 4096
}
```

### 拉取 GPT-OSS 20B 模型
```bash
ollama pull gpt-oss:20b
```

### 性能調整

- **temperature**（0.1-1.0）：
  - 更低 = 翻譯更一致、更保守
  - 更高 = 翻譯更有創意、可能更多變化
  - 推薦：0.2-0.3

- **numCtx**：
  - 增加可處理更長的文檔
  - 但會增加記憶體使用
  - 推薦：2048-4096

- **delayBetweenRequests**：
  - 請求之間的延遲（毫秒）
  - 防止 Ollama 過載
  - 推薦：1000ms

## 使用方式

### Cover 頁面翻譯（主要使用）

```bash
# 翻譯單個 cover 檔案到英文
npm run translate:cover en docs/cover/DANDADAN/otonoke.md

# 翻譯單個 cover 檔案到日文
npm run translate:cover ja docs/cover/DANDADAN/otonoke.md
```

**優點：**
- 只翻譯「影片介紹」部分
- 日文歌詞保持不動
- 快速針對新增的 cover 文章

### 全量翻譯（不推薦用於 cover）
```bash
# 翻譯所有檔案到所有語言
npm run translate

# 只翻譯到英文
npm run translate:en

# 只翻譯到日文
npm run translate:ja
```

## 工作流程

### 新增 Cover 文章時
1. 在 `docs/cover/` 下建立新檔案（中文介紹 + 日文歌詞）
2. 啟動 Ollama：`ollama serve`
3. 翻譯影片介紹部分：
   ```bash
   npm run translate:cover en docs/cover/[category]/[name].md
   npm run translate:cover ja docs/cover/[category]/[name].md
   ```
4. 檢查生成的翻譯檔案（`i18n/en/` 和 `i18n/ja/`）
5. 如果翻譯不夠好，可手動編輯或重新執行翻譯

### 文章結構範例
```markdown
---
author: Blogger Wang
date: 2024-11-16
id: song-name
sidebar_label: Song Title / Artist
---

# 歌曲名 / Title

## Mandolin Inst Ver.
<video>...</video>

## 中文

### 影片介紹
[你的介紹文字 - 會被翻譯]

### 歌詞翻譯
[日文歌詞或你的翻譯 - 保持不動]

## 日本語
[日文歌詞或原曲資訊 - 保持不動]

## English
[如已有英文版本內容]

## 樂譜/伴奏參考來源
[參考資料連結]
```

### 手動編輯翻譯
如果翻譯不理想，可以手動編輯：
- `i18n/en/docusaurus-plugin-content-docs/current/docs/cover/...`
- `i18n/ja/docusaurus-plugin-content-docs/current/docs/cover/...`

## 故障排除

### Ollama 連接失敗
```
Error: Cannot connect to Ollama at localhost:11434
```
**解決方案**：
1. 確認 Ollama 已啟動：`ollama serve`
2. 檢查設定中的 `host` 和 `port` 是否正確
3. 如果使用遠端 Ollama，更改 `host` 為伺服器 IP

### 翻譯品質不佳
- 嘗試不同的模型：`neural-chat` 通常效果最好
- 降低 `temperature` 以獲得更一致的翻譯
- 檢查原始內容是否清晰

### 記憶體不足
- 減少 `numCtx` 的值
- 使用更小的模型（如 `neural-chat` 而不是 `llama2`）

### 翻譯非常慢
- 降低 `numCtx` 的值
- 使用更快的模型（如 `neural-chat`）
- 增加 `delayBetweenRequests`

## 最佳實踐

1. **備份你的翻譯**
   - 在執行大規模翻譯前，備份 `i18n/` 目錄
   ```bash
   cp -r i18n i18n.backup
   ```

2. **逐步翻譯**
   - 先翻譯一個檔案測試品質
   - 調整設定和模型
   - 再翻譯所有檔案

3. **審查翻譯**
   - 執行翻譯後，手動審查幾個檔案
   - 修正任何不當的翻譯
   - 記下常用術語的正確翻譯

4. **版本控制**
   - 在 git 中提交翻譯檔案
   - 這樣可以追蹤翻譯更新

## 檔案結構

```
scripts/
├── translate.js              # 主翻譯腳本（翻譯所有語言）
├── translate-single.js       # 單語言翻譯腳本
├── llm-provider.js          # Ollama 連接邏輯
├── config.js                # 設定檔
└── TRANSLATE_GUIDE.md       # 此文件

i18n/
├── en/                      # 英文翻譯
│   └── docusaurus-plugin-content-docs/
│       └── current/
│           └── docs/
├── ja/                      # 日文翻譯
│   └── docusaurus-plugin-content-docs/
│       └── current/
│           └── docs/
└── zh-TW/                   # 繁體中文翻譯（UI 元素）
    ├── docusaurus-plugin-content-docs/
    ├── docusaurus-theme-classic/
    └── docusaurus-plugin-content-blog/
```

## 下一步

### 改進翻譯品質
- 為重要術語建立術語表
- 在 prompt 中加入特定領域的指示
- 考慮使用自訂翻譯記憶庫

### 自動化工作流程
- 設定 GitHub Actions 自動翻譯新文章
- 定期執行翻譯檢查

### 集成其他 LLM
- 修改 `llm-provider.js` 以支援 OpenAI API
- 新增 Claude API 支援
- 支援多個 LLM 服務的後備方案

## 許可證

此翻譯工具是 BloggerMandolin 專案的一部分。
