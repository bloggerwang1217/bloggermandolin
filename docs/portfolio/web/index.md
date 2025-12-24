---
id: web
title: 網站與全端系統
sidebar_position: 1
---

# 網站與全端系統

這裡收錄我參與開發的全端系統專案，從對話式 AI 平台到教育 RAG 系統，涵蓋前端狀態管理、後端 API 設計、資料庫架構等完整技術架構。

## 主要專案

### [台鵠：對話式知識探勘平台](./taihu.md) 🕊️

參與 Taihu 前端架構開發，這是一個對話式 AI 知識探勘平台。

**核心貢獻：**
- 使用 Zustand 實現並行多串流狀態管理
- 支援用戶在多個聊天室間自由切換而不中斷 AI 回應
- 處理複雜的競態條件和非同步流程
- 貢獻 319+ commits 到前端架構

**技術架構：** React 18 / Zustand / TypeScript / Playwright 測試

---

### [Best-SciRAG：教案 RAG 知識庫](./best-scirag.md) 📚

全端系統開發，為教師提供快速理解與製作教案的 RAG 知識庫。

**核心功能：**
- Next.js 前端 + FastAPI 後端的 Monorepo 架構
- 混合搜尋 RAG 引擎（稠密向量 + 稀疏關鍵字）
- 事實查核系統與 LLM 輔助 ETL
- 貢獻 810+ commits 到全端系統

**技術架構：** Next.js / FastAPI / MySQL / Docker / LangChain / Qdrant

---

### [個人部落格網站](./blog.md) ✍️

本網站本身，展示內容管理、SEO 與部落格架構設計。

**技術架構：** Docusaurus / React / Markdown

---

## 技術能力

| 分類 | 技術架構 |
|------|--------|
| **前端架構** | React 18 / Zustand 狀態管理 / TypeScript / 並行串流 / Playwright 測試 |
| **後端服務** | NestJS / FastAPI / Node.js / MySQL / Docker |
| **特色技能** | 複雜非同步流程 / 競態條件防護 / Infinite Scroll |
