---
id: time-tracker
title: GoodTime 番茄鐘記錄分析工具
sidebar_position: 2
---

# GoodTime 番茄鐘記錄分析工具

- **GitHub:** https://github.com/bloggerwang1217/TimeTracker
- **開發時間:** 2022 年 2 月
- **狀態:** 已完成（不再維護）

Malcolm Gladwell 在《異類》裡說，要成為某個領域的專家，需要花 10000 小時練習[^1]。

但如果你不記得自己練習多久，怎麼知道到幾個小時？

## 我做了什麼

我從高中開始就使用番茄鐘軟體記錄時間履歷，而我使用的這款 app（Goodtime Productivity）可以將 csv 檔案下載下來，於是我利用 python 的 Matplotlib 和 Tkinter 製作一個小工具，簡單的分析工作效率與每日工作狀況，作為定期檢視自身時間規劃的用途。

![freshman-pie-chart](/img/portfolio/tools/freshman-pie-chart.webp)

![time-tracker](/img/portfolio/tools/time-tracker.webp)

> 此段程式即計算不同工作項目的累積時間、算出平均後，再生成出最後的圖片

## 技術細節速查

| 技術 | 用途 | 為什麼選它 |
|------|------|----------|
| **Goodtime Productivity** | 番茄鐘計時 app | 使用者友善，支援 CSV 匯出 |
| **Python** | 後端邏輯 | 簡單易學，適合資料處理 |
| **Matplotlib** | 資料視覺化 | 成熟穩定，圖表豐富 |
| **Tkinter** | GUI 介面 | Python 內建，跨平台 |
| **CSV 解析** | 讀取原始資料 | 格式簡單，易於處理 |

### 核心功能

- **CSV 讀取：** 解析 Goodtime 匯出的時間記錄
- **資料整合：** 統計工作項目的累積時間和平均值
- **視覺化：** 用 Matplotlib 生成圖表，呈現工作模式
- **UI 介面：** tkinter 提供簡單的操作視窗

### 設計哲學

簡單是特意的。不用複雜的資料庫，不用高深的統計。就是把 CSV 變成圖表，讓自己看見平時看不見的模式。最有價值的地方，往往是最簡單的地方。

[^1]: 現代科學研究指出，這個說法其實被誤解了。原始研究來自 K. Anders Ericsson 於 1993 年發表的「The Role of Deliberate Practice in the Acquisition of Expert Performance」，但 10000 小時只是樣本平均值，並非必需。更重要的是，Josh Kaufman 在其著作「The First 20 Hours」中指出，透過有策略的學習，約 20 小時的專注練習就足以達到基本能力（competency），而不需要 10000 小時。關鍵在於「刻意練習」的品質，而非單純的時數累積。