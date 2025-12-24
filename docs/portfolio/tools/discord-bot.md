---
id: discord-bot
title: Discord 訊息推播機器人
sidebar_position: 1
---

# Discord 訊息推播機器人

這是我大一時期的小專案！

- **GitHub:** https://github.com/bloggerwang1217/DiscordNewsFeedAssistant
- **開發時間:** 2022 年 2 月
- **狀態:** 已完成（不再維護）

由於我不太喜歡打開社群媒體的通知系統（會跳出廣告資訊或無關的訊息），但仍有一些資訊是我想立即知道的，因此我製作了一個簡單的訊息推播機器人。我找到了許多好用的套件，包含抓取Email、用 RSS 抓部落格的文章、用 requests（爬蟲）和 BeautifulSoup（處理 html 的資料）以獲得YouTube貼文的資訊。如此便可以集中管理個人社群媒體的資訊，統一發送到 Discord（社交軟體）的私人伺服器上，減少社群使用時間並提高效率。

為了可以長期運作這個程式，我找到有提供部分免費的伺服器網站 Replit 執行程式，讓它實際運用在生活中。使用的過程中，我也發現由於每次爬蟲抓訊息的情況不盡相同，即使大部分時間可以成功，也仍會遇到出現 bug 的時候。不過這個專案已經完成了它的使命，現在不再維護。

![Replit 維護 YouTube 爬蟲](/img/portfolio/tools/dc-feed-bot.webp)

> 透過將爬下來的資料轉換為 dictionary 型態再找尋 YouTube 社群貼文的文字和圖片。

## 技術細節速查

| 技術 | 用途 | 為什麼選它 |
|------|------|----------|
| **requests + BeautifulSoup** | 爬蟲、HTML 解析 | 輕量級，適合簡單爬取 |
| **feedparser** | 解析 RSS Feed | 標準庫，支援各種 RSS 格式 |
| **Gmail API** | 讀取郵件 | 官方支援，安全可靠 |
| **Discord Webhook** | 推播訊息到 Discord | 簡單易用，不用複雜的 Bot 邏輯 |
| **APScheduler** | 定時排程任務 | 支援複雜的時間配置 |
| **replit** | 伺服器託管 | 免費方案足夠，自動重啟 |

### 核心功能

- **Watch Later：** 保存內容連結供稍後查看
- **YouTube 監控：** 抓取頻道新發佈的影片和社群貼文
- **Twitch 監控：** 追蹤實況主的開播通知
- **Email 聚合：** 定時檢查郵件並推播重要訊息
- **RSS 推播整合：** 訂閱部落格和新聞來源，自動推播更新
- **加密貨幣追蹤：** 定時推播 ETH 價格

### 遇到的挑戰

爬蟲最大的問題是網站結構變動。YouTube、Twitch 這些平台經常更新 HTML 結構，導致原本能用的選擇器失效。當時有一次 YouTube 改了社群貼文的格式，機器人就開始抓不到資料。最後的解決辦法就是定期檢查 log，找出問題再修改選擇器。
