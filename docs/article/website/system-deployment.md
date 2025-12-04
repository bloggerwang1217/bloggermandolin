---
title: 上線你的寶貝服務
tags: [網站]
description: 部署自己的後端應用服務
date: 2025-12-04
id: "system-deployment"
sidbar_label: 上線你的寶貝服務
---

# 上線你的寶貝服務

最近常常看到有人分享自己「vibe coding」 （憑感覺、用 AI 寫）出來的網站或應用程式，這很棒！如果給自己用的話還行，但當你興高采烈地想要分享給朋友，迎面而來的問題就是：「所以…我要怎麼把它放到網路上，讓大家都能用？」

如果你是剛入門的開發者，或許正在使用像是 Google AI Studio 這類的工具，通常 AI 的建議（例如 Gemini）會告訴你：

> 對於第一個專案，不要直接挑戰手動設定伺服器。優先選擇「平台即服務 (PaaS)」或「無伺服器 (Serverless)」平台，它們能幫你處理掉大部分繁瑣的底層設定。例如 Google Cloud Run 或是 Render 讓 AI 無腦幫你部署。

但其實我更推薦的是你可以租一個自己的虛擬主機（VM），就像是一台雲端的電腦，你想在上面裝什麼、灌什麼服務，沒有人會管你。例如，我自己就在 linode 上面租了一個最最最便宜的伺服器，光應付個課程作業或是和家人朋友分享綽綽有餘。

我們將會詳細說明如何在 Linode 這類的虛擬伺服器上，手動設定、管理並上線你的 Python 後端服務！（一方面也是讓我自己可以回來看😏）

## 你可以跑我的 Python 檔案...？

當你滿心歡喜地寫出一個 Python 服務，例如你寫了一個點餐程式，想和朋友分享時，你可能會跟朋友說：「嘿，你執行一下這個 `main.py` 檔就可以用了！」。你可能會收到一句無情的回應：「...啥是 Python？」

為了避免這種尷尬的情境，我們需要將 Python 邏輯包裝成一個「後端服務」，並透過一個任何人（或任何程式）都能輕易存取的「API」來提供功能。簡單來說，API 就像是餐廳的菜單，讓你的朋友（或前端網站）可以透過 API 點餐，而不用進到廚房自己按烤箱按鈕（執行你的 Python 程式碼）。

在 Python 的世界裡，最常用來建立後端服務的兩個框架就是 Flask 和 FastAPI。我們會一起走過這兩種框架的部署流程，並比較它們的差異。讓我們先從 Flask 開始，這是最簡單把自己的應用程式啟動的方式！

## Neurosynth: Flask + Gunicorn 部署範例

Flask 是一個非常輕量的 Python 網路框架，因為它不綁定任何特定的工具或外掛，這使得 Flask 非常適合開發小型應用程式，歷年來一直是非常熱門的選擇（直到 FastAPI 出現...）。

我會用 Neurosynth 這個範例（一個查詢腦功能和文字關聯的服務），一步步說明如何讓你的應用程式成為一個不用下班的服務生😏。

### 部署的藍圖：我們要做什麼？

在我們一頭栽進指令之前，先來看看我們的計畫。我們的目標是讓 Flask 應用程式變成一個穩定、可靠、而且開機就能自己運行的「服務」。

為了達成這個目標，我們會使用三個關鍵工具：

1.  **Gunicorn**：一個專業的「程式管理員」，專門負責運行我們的 Python 程式，比 Flask 內建的測試伺服器強大許多。
2.  **Systemd**：這是 Linux 系統內建的「總管」，它可以幫我們看管 Gunicorn，確保 Gunicorn 一直活著。如果 Gunicorn 不小心掛了，Systemd 會立刻把它叫醒。（如果你不知道什麼是 Linux...，歡迎去看[鳥哥的 Linux 私房菜](https://linux.vbird.org/)）
3.  **環境檔案**：一個安全的「密碼保險箱」，用來存放資料庫密碼這類敏感資訊，避免它們直接寫在程式碼裡。（你可能聽過有人把密碼或是 OpenAI API key 上傳，資料被盜或是卡片被刷爆的故事...）

好了，藍圖清楚了，我們就開始動手吧！

### 步驟 1：準備好我們的「執行環境」

在正式部署前，我們需要先準備好一些東西。

#### 1.1) 一個專門跑程式的「系統使用者」

**什麼是 Root 權限？**

Root 是 Linux 系統裡的「上帝」，擁有對系統所有檔案和設定的完整控制權。我們接下來要建立使用者或是一些系統層級的設定檔，所以必須暫時化身為 Root。在指令前面加上 `sudo`，就是向上帝借用權力。

為了安全起見，我們不會用最高權限的 `root` 帳號來跑我們的網路服務。你應該要有一個專門的、權限較低的系統使用者，例如 `flaskuser`。如果還沒有，可以透過：

```
sudo adduser flaskuser
```

 來建立一個（`sudo` 這個指令代表「用最高權限來執行我接下來的指令」）。

#### 1.2) 建立獨立的「Python 虛擬環境」

**什麼是虛擬環境 (Virtual Environment)？**

想像一下，你同時開發兩個 Python 專案：一個是你的「點餐 App」，它可能需要舊版的 `requests` 函式庫來跟某個老舊的 API 溝通；另一個是「Neurosynth 服務」，它可能需要最新版的 `scikit-learn` 來處理複雜的資料分析。如果你把這些不同版本的函式庫都裝到你電腦唯一的 Python 環境裡，它們就會「打架」，導致其中一個專案無法正常運行。

虛擬環境就像是為每個專案建立一個獨立、乾淨的「Python 小房間」。你在「點餐 App」的小房間裡裝了舊版的 `requests`，在「Neurosynth 服務」的小房間裡裝了新版的 `scikit-learn`，它們互不干擾。這樣，每個專案都能擁有自己專屬的運行環境，你可以安心開發，不用擔心函式庫版本衝突的問題。

請切換到你的專門使用者，然後在你的專案資料夾裡，建立一個虛擬環境：

```bash
# 切換到你的專門使用者
su - flaskuser

# -m venv 代表我們要用內建的 venv 模組來建立環境
# myvenv 是我們給這個虛擬環境資料夾取的名字
python3 -m venv myvenv
```

接著，啟動它：

```bash
source myvenv/bin/activate
```

啟動後，你會看到指令列前面出現 `(myvenv)` 的字樣，代表你已經在這個小房間裡了。現在，用 `pip` 把你的專案需要的套件（包括 Flask 和 Gunicorn）都裝進去。

```bash
pip install flask gunicorn
pip install -r requirements.txt # 如果你有 requirements.txt 的話
```

#### 1.3) 為什麼需要 Gunicorn？

**什麼是 Gunicorn？**

你在開發時用的 `flask run` 其實是一個「開發用伺服器」。它很方便，但非常脆弱，不適合應付真實世界的網路流量。**Gunicorn** (Green Unicorn) 則是一個「生產級 WSGI 伺服器」。

**什麼是 WSGI (Web Server Gateway Interface)？**

簡單來說，WSGI 是一個「溝通標準」，它定義了像 Gunicorn 這樣的「網頁伺服器」，應該如何與像 Flask 這樣的「Python 應用程式」進行對話。Gunicorn 負責接收來自外部世界的網路請求，然後將這些請求按照 WSGI 標準打包，傳遞給 Flask。Flask 處理完畢後，再將回應按照 WSGI 標準打包，交還給 Gunicorn，最後由 Gunicorn 回傳給使用者。

把它想像成一個身經百戰、非常可靠的餐廳經理，專門負責接待客人（網路請求），並將他們的需求轉達給廚房（你的 Flask 應用程式）。為了應付大量的客人，Gunicorn 會啟動多個「工作進程」來同時處理請求，確保你的服務在高流量下也能穩定運行，不會輕易中斷。然而，如果你的應用程式有大量的 I/O 等待時間（例如，等待資料庫回應、呼叫外部 API），那麼 FastAPI + Uvicorn 的非同步模式（asynchronous）通常會是更有效率的選擇，這點我們會在後面的章節詳細比較。

### 步驟 2：用「環境檔案」來保管秘密

**什麼是環境檔案 (Environment File)？**

這是一個專門用來存放「環境變數」的檔案。你可以把所有敏感資訊，像是資料庫的帳號密碼、API 金鑰等，都寫在這個檔案裡。我們的程式會從這個檔案讀取這些變數。

**為什麼要這麼做？**

**安全！安全！安全！** 絕對不要把密碼寫死在程式碼裡，否則只要你的程式碼被別人看到（例如上傳到 GitHub），你的秘密就全都曝光了（而且如果是公開的，通常是一上傳的瞬間）。把設定和程式碼分離，是一個非常重要的好習慣。

接下來的操作，我們會需要「最高管理員權限」，也就是 **Root 權限**（`sudo`）。

讓我們來建立這個保險箱。這個檔案會放在 `/etc/default/` 這個系統設定目錄下。

**為什麼是 /etc/default/ 呢？**

在 Linux 系統中，`/etc/` 目錄通常用來存放系統層級的設定檔。而 `/etc/default/` 這個子目錄，則習慣用來存放各種服務或程式的「預設值」或「環境變數」設定。這樣做的好處是，這些設定檔不會和服務本身的程式碼混在一起，而且可以方便系統管理員在同一個地方找到並修改這些預設設定。

```bash
# 用 nano 這個文字編輯器，以 root 權限建立檔案
sudo nano /etc/default/neurosynth
```

然後，把下面的內容貼進去。`DB_URL` 就是你的資料庫連線字串。

```ini
# /etc/default/neurosynth
DB_URL='postgresql://<readonly_user>:<StrongPassword>@127.0.0.1:5432/neurosynth'
# 你也可以加上 FLASK_ENV=production
```

寫好之後，按 `Ctrl+X`，接著按 `Y`（Yes！），最後按 `Enter` 存檔離開。

最後，我們要設定這個檔案的權限，確保只有 `root` 使用者才能讀取它，其他人連偷看都不行。

**為什麼需要 sudo？**

因為 `/etc/default/` 是一個系統級的目錄，裡面存放的檔案都是由 `root` 管理。所以，當我們要修改這些檔案的權限和擁有者時，就需要像前面建立環境變數檔案一樣，借用 `root` 的權力來執行這些指令。

```bash
sudo chmod 600 /etc/default/neurosynth
sudo chown root:root /etc/default/neurosynth
```

這些指令是用來設定檔案的權限和擁有者，以確保我們的機密資訊不會被不相關的使用者讀取到：

*   `chmod 600`：`chmod` 用來修改檔案的權限。數字 `600` 代表：
    *   `6`：檔案擁有者（`root`）有讀（**4**）+ 寫（**2**）的權限。
    *   `0`：同群組使用者沒有任何權限。
    *   `0`：其他使用者也沒有任何權限。
    *   簡單來說，就是只有檔案的「主人」`root` 可以讀寫這個檔案，其他人都不能動。
*   `sudo chown root:root`：`chown` (change owner) 用來修改檔案的「擁有者」和「所屬群組」。這裡我們將它們都設定為 `root`。

這樣一來，我們就能確保檔案的權限設定是有效的，且無法被權限較低的使用者（例如服務帳號）讀取或修改。

### 步驟 3：建立 Systemd 的「服務說明書」

現在，我們要來教作業系統如何管理我們的 Flask 應用程式了。

**什麼是 Systemd？**

**Systemd** 是現代 Linux 系統的「大總管」。它是系統啟動後第一個運行的程式，負責管理系統上的所有「服務」(services)，例如網路服務、資料庫服務等等。我們就是要讓 `systemd` 把我們的 Flask 應用程式也當成一個正規的服務來管理。

**什麼是 Unit 檔案？**

Unit 檔案就像是一份給 `systemd` 的「服務說明書」。我們在這個檔案裡告訴 `systemd`：

*   這個服務叫什麼名字？
*   要在哪個資料夾裡執行？
*   要用哪個使用者身份執行？
*   具體的啟動指令是什麼？（例如：跑 Gunicorn）
*   如果程式掛了，要不要自動重啟？

`systemd` 會按照這份說明書，精準地啟動、停止和監控我們的服務。

讓我們來撰寫這份說明書：

**為什麼是 /etc/systemd/system/ 呢？**

我們來拆解一下這個路徑：
*   `/etc/`：就像我們前面提到的，這裡是系統設定檔的大本營。
*   `/systemd/`：這是 `systemd` 大總管專屬的資料夾。
*   `/system/`：這個子目錄專門用來存放系統層級的服務說明書（`.service` 檔案）。所有開機時要啟動、給所有使用者共用的服務，都會放在這裡。
*   `neurosynth.service`：這就是我們為自己的應用程式命名的說明書檔案。

所以，這個路徑的意思就是：「嘿，Systemd 大總管，這是我要給你的一份系統級的服務說明書，請你好好保管！」

```bash
sudo nano /etc/systemd/system/neurosynth.service
```

然後把下面的內容貼進去。請**務必**根據你自己的設定，修改 `User`、`Group`、`WorkingDirectory` 和 `ExecStart` 裡的**路徑**。

```ini
[Unit]
Description=Gunicorn service for neurosynth Flask app
After=network.target

[Service]
Type=simple
User=flaskuser
Group=flaskuser
WorkingDirectory=/home/flaskuser/neurosynth-backend
EnvironmentFile=/etc/default/neurosynth
ExecStart=/home/flaskuser/neurosynth-backend/myvenv/bin/gunicorn \
  --workers 1 --worker-class gthread --threads 2 \
  --bind 127.0.0.1:8000 \
  --timeout 30 \
  --max-requests 1000 --max-requests-jitter 50 \
  --access-logfile - --error-logfile - \
  app:app

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

這份說明書的內容比較長，我們逐一拆解：

#### `[Unit]` 區塊：服務的基本資訊

這個區塊描述了服務本身，以及它和其他服務的關係。

*   `Description`: 一段讓人看得懂的描述，當你用 `systemctl status` 查看服務時會顯示。
*   `After=network.target`: 這是一個非常重要的設定，它告訴 `systemd`：「請在網路功能完全啟動之後，才啟動我的服務」。這能確保你的應用程式在試圖連線到資料庫或外部 API 時，網路是已經就緒的。

#### `[Service]` 區塊：服務的執行細節

這個區塊定義了如何執行你的服務。

*   `Type=simple`: `systemd` 的標準設定，表示由 `ExecStart` 指定的指令就是這個服務的主行程。
*   `User=flaskuser` / `Group=flaskuser`: 基於安全考量，讓這個服務以我們之前建立的、權限較低的 `flaskuser` 身份來運行，而不是用 `root`。
*   `WorkingDirectory`: 指定 Gunicorn 應該在哪個目錄下執行。請務必將它設定為你專案的根目錄。
*   `EnvironmentFile`: 告訴 `systemd` 去哪裡讀取我們在步驟 2 中建立的「環境檔案」。`systemd` 會在啟動服務前，先把這個檔案裡的變數載入到環境中。
*   `ExecStart`: **這是最核心的啟動指令**。它完整定義了如何用 Gunicorn 來運行你的 Flask 應用。
    *   `/home/flaskuser/.../gunicorn`: Gunicorn 的絕對路徑。
    *   `--workers 1 --worker-class gthread --threads 2`: 這組是 Gunicorn 的效能設定。`--workers 1` 代表啟動 1 個主工作進程。`--worker-class gthread` 則是一種特殊的工作模式，它允許這 1 個工作進程底下，再開 ` --threads 2` 個執行緒來處理請求。對於 I/O 密集的應用，這通常比只用 `workers` 更有效率。
    *   `--bind 127.0.0.1:8000`: 讓 Gunicorn 監聽本機的 8000 port。
    *   `--timeout 30`: 如果一個 worker 在 30 秒內沒有任何活動，主進程會殺掉它並重開一個，防止假死。
    *   `--max-requests 1000 --max-requests-jitter 50`: 每個 worker 處理完大約 1000 個請求後（`jitter` 會增加一個隨機值，防止所有 worker 同時重啟），會自動重啟。這是一個防止記憶體洩漏的好方法。
    *   `--access-logfile - --error-logfile -`: 將 Gunicorn 的存取日誌和錯誤日誌都直接輸出到「標準輸出」(stdout/stderr)，而不是寫入檔案。這樣做的好處是，`systemd` 的日誌系統 `journalctl` 可以統一收集所有日誌，方便我們用 `journalctl -u neurosynth.service` 來查看。
    *   `app:app`: Gunicorn 的啟動目標，意思是「去 `app.py` 這個檔案裡，找到名叫 `app` 的那個 Flask 物件來運行」。
*   `Restart=always`: 一個非常可靠的設定。無論服務是正常退出、異常崩潰還是被殺掉，`systemd` 都會**永遠**嘗試重新啟動它。
*   `RestartSec=5`: 在嘗試重新啟動前，暫停 5 秒。

#### `[Install]` 區塊：服務的安裝與啟用

這個區塊定義了當你執行 `systemctl enable` 時，應該如何將這個服務「安裝」到系統中。

*   `WantedBy=multi-user.target`: 這會讓我們的服務連結到 `multi-user.target` 這個目標下。簡單來說，這就是確保當系統開機並進入標準的多使用者模式時，我們的服務會被自動啟動。

### 步驟 4：設定 Nginx 反向代理

我們已經讓 Gunicorn 在 `127.0.0.1:8000` 這個地址上運行了，但這個地址只能從伺服器內部訪問。為了讓全世界的使用者都能連到我們的服務，我們需要一個「網頁伺服器」來當作門面，而 **Nginx** 就是最受歡迎的選擇之一。

**什麼是 Nginx？什麼是反向代理 (Reverse Proxy)？**

**Nginx** 是一個非常高效能的網頁伺服器。在這裡，我們要讓它扮演「反向代理」的角色。

想像一下，你的 Gunicorn 服務是一位只會說 Python 的天才廚師，但他不擅長接待客人。而 Nginx 就像是一位精明幹練、會說各國語言的餐廳外場經理。

所有來自網路的客人（HTTP 請求）都會先找到這位外場經理（Nginx）。Nginx 會處理好所有雜事（例如管理連線、提供靜態檔案如圖片或 CSS），然後只把真正需要廚師處理的「點餐」需求（例如 `/neurosynth/` 的請求），轉達給在內場的廚師（Gunicorn）。

這樣做有幾個好處：
*   **安全**：天才廚師不用直接面對外面複雜的世界，可以專心做菜。
*   **效能**：外場經理處理雜事非常快，可以讓廚師專心在核心工作上。
*   **擴展性**：如果生意變好，可以多請幾個廚師，由外場經理來分配工作。

假設你已經安裝了 Nginx，你需要找到你網站的 Nginx 設定檔（通常在 `/etc/nginx/sites-available/your_domain`），然後在 `server { ... }` 區塊中，加入以下 `location` 設定：

```nginx
    location /neurosynth/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

這段設定告訴 Nginx：「所有連到 `/neurosynth/` 這個路徑的請求，都請幫我轉發到 `http://127.0.0.1:8000/` 這個地址，也就是我們 Gunicorn 正在監聽的地方。」

修改完設定檔後，記得檢查語法並重新載入 Nginx：

```bash
# 檢查 Nginx 設定檔語法有沒有寫錯
sudo nginx -t

# 如果語法正確，就重新載入設定
sudo systemctl reload nginx
```

### 步驟 5：啟動我們的服務！

說明書寫好了，現在我們要叫大總管 `systemd` 來讀取它，並正式啟動服務。

```bash
# 重新載入 systemd 的設定，讓它讀取到我們新的 .service 檔案 (daemon 指的是在背景執行的服務程式)
sudo systemctl daemon-reload

# 啟用我們的服務，--now 代表「啟用並立刻啟動」
# 啟用 (enable) 的意思是讓它開機時會自動運行
sudo systemctl enable --now neurosynth.service

# 最後，檢查一下服務的狀態，看看有沒有成功跑起來
sudo systemctl status neurosynth.service -l
```

如果 `Active:` 後面顯示的是 `active (running)`，而且是一片開心的綠色，那就恭喜你，你的服務已經成功在背景運行了！🎉

### 步驟 6：日常管理與監控

服務上線後，你還需要知道怎麼照顧它。

*   **查看服務狀態**:
    ```bash
    sudo systemctl status neurosynth.service
    ```
*   **即時查看日誌 (Log)**:
    ```bash
    sudo journalctl -u neurosynth.service -f
    ```
    （`-f` 代表 follow，會持續顯示新的日誌，按 `Ctrl+C` 離開）
*   **重新啟動服務** (例如你改了程式碼，需要重啟):
    ```bash
    sudo systemctl restart neurosynth.service
    ```
*   **停止服務**:
    ```bash
    sudo systemctl stop neurosynth.service
    ```

就這樣！透過 Gunicorn 和 Systemd 的合作，你的 Flask 應用程式現在已經是一個非常穩定、可以 24 小時為大家上菜的廚師了。

---

## I'm Emo Now: FastAPI + Uvicorn 部署範例

在了解了 Flask 的部署後，我們來看看現在更受歡迎的選擇：FastAPI。

### 為什麼要用 FastAPI + Uvicorn？

FastAPI 是一個現代、高效能的 Python 網路框架，它的核心優勢在於「**非同步（Asynchronous）**」。

想像一下餐廳的情境：
*   **Flask（同步）**：一位服務生（工作進程）一次只能服務一位客人。如果這位客人點了一道需要燉很久的菜（例如等待資料庫回應），服務生就只能在旁邊乾等，不能去服務其他客人。
*   **FastAPI（非同步）**：一位超級服務生，當他幫客人 A 點的菜送進廚房後，在等待廚房出菜的空檔，他會立刻去服務客人 B 和 C。他不會被「等待」這件事卡住。

這就是 FastAPI + Uvicorn 組合的最大好處：對於有大量 **I/O 密集型任務**（I/O-bound）的應用程式——例如，需要頻繁地查詢資料庫、呼叫外部 API、讀寫檔案——FastAPI 可以利用等待的空檔去處理其他請求，從而用更少的資源實現更高的吞吐量。

除此之外，FastAPI 還內建了基於 Pydantic 的**資料驗證**和自動化的**互動式 API 文件**（Swagger UI），能大幅提升開發效率和品質。

以下我們將以 Emo GO（一個可以從研究日常情緒的研究型手機 app 服務後端）作為範例。我自己取名叫做

> I'm Emo Now

（因為我現在 Emo 了）

### Gunicorn/WSGI vs. Uvicorn/ASGI 比較

在開始之前，我們先透過下面這個表格，更深入地了解這兩套組合的差異。

| 特性            | Gunicorn（搭配 Flask）    | Uvicorn（搭配 FastAPI） |
|---------------|-----------------------|----------------------|
| **伺服器協議**     | WSGI（同步）             | ASGI（非同步）           |
| **並行模式** | 多個獨立的「工作行程」 | 單一「事件循環」 |
| **WebSocket** | ❌ 不直接支援               | ✅ 原生支援               |
| **記憶體佔用**     | 較高（每個 worker 都是獨立行程）| 較節省                  |

#### 術語解釋

*   **ASGI (Asynchronous Server Gateway Interface)**：這是 WSGI 的「繼任者」，一個專為「非同步」Python 應用設計的溝通標準。它讓伺服器（Uvicorn）和應用程式（FastAPI）之間可以處理更複雜的通訊模式，例如長時間連線和雙向溝通，而不僅僅是傳統的一問一答。

*   **並行模式 (Concurrency Model)**
    *   **多行程 (Pre-fork Worker Model)**：Gunicorn 的模型。就像餐廳在開店前就先安排好數位服務生（Worker Processes）站好崗位。客人一來，就把他分配給其中一位有空的服務生。這種模型簡單、穩定，但每個服務生都是一個獨立的記憶體副本，比較耗資源。
    *   **事件循環 (Event Loop)**：Uvicorn 的模型。餐廳只有一位超級服務生。他手上拿著一本待辦清單（Event Loop）。當他在等 A 桌的菜時，他會立刻去看 B 桌是否需要加水，然後再去處理 C 桌的結帳。他永遠在處理「當下可以做的事」，而不是原地等待。這就是「非阻塞 I/O」，因此非常節省記憶體。

*   **WebSocket**：這是一種網路通訊協定，可以在用戶端和伺服器之間建立一個「持久性」的雙向通道。不像傳統 HTTP 的「你問我答」，WebSocket 允許伺服器在任何時候主動推送訊息給用戶端。它非常適合需要即時互動的應用，例如聊天室、股票報價、線上遊戲等。ASGI 的設計原生就考慮到了 WebSocket，所以 Uvicorn 可以輕鬆支援它。

### 部署步驟

此處的步驟與 Flask 基本相同，但我們會使用 `uvicorn` 而不是 `gunicorn`，並且範例中的路徑與服務名稱會有所不同。

---

#### 步驟 1：建立獨立的虛擬環境

切換到你的專門使用者（例如 `flaskuser`，雖然我們在用 FastAPI，使用 `flaskuser` 有點邪門，但這是你的虛擬主機，你愛怎樣就怎樣😏）。

進入專案目錄，然後建立並啟動虛擬環境，並安裝必要的套件。

```bash
# (如果需要) 切換使用者
su - flaskuser

# 建立虛擬環境
python3 -m venv myvenv

# 啟動虛擬環境
source myvenv/bin/activate

# 安裝套件 (FastAPI 和 Uvicorn 是必須的)
pip install "fastapi[all]" "uvicorn[standard]"
# 或從 requirements.txt 安裝
# pip install -r requirements.txt
```
*(注意：`[all]` 和 `[standard]` 會一併安裝 Pydantic、HTTPX 等高效能的建議套件)*

---

#### 步驟 2：建立環境檔案

保管您的秘密（如資料庫密碼、API 金鑰）有兩種常見的方法：

---

**方法 A：使用系統級環境檔案（推薦，本文範例）**

這是 Linux 系統管理的標準作法，將設定與程式碼完全分離。

```bash
# 建立並編輯環境檔案
sudo nano /etc/default/emogo-backend

# 設定權限
sudo chmod 600 /etc/default/emogo-backend
sudo chown root:root /etc/default/emogo-backend
```

**`/etc/default/emogo-backend` 內容範例：**
```ini
MONGODB_URL='mongodb+srv://user:pass@cluster.mongodb.net/db'
MONGODB_DATABASE='emo_now'
```
*後續的 `systemd` unit 檔案中會使用 `EnvironmentFile=` 來載入此檔案。*

---

**方法 B：在專案目錄中使用 `.env` 檔案**

這是許多開發者在專案中習慣使用的方式，設定檔跟著專案走。

1.  **安裝 `python-dotenv`**：
    ```bash
    # 確保你在專案的虛擬環境中 (myvenv)
    pip install python-dotenv
    ```
2.  **建立 `.env` 檔案**：
    在你的專案根目錄（例如 `/home/flaskuser/emogo-backend/`）下，建立 `.env` 檔案。
    ```bash
    nano .env
    ```
3.  **編輯 `.env` 檔案**：
    ```ini
    MONGODB_URL='mongodb+srv://user:pass@cluster.mongodb.net/db'
    MONGODB_DATABASE='emo_now'
    ```
4.  **在程式碼中載入**：
    在你的 FastAPI 應用程式啟動的最開始處（例如 `main.py` 的頂部），加入以下程式碼：
    ```python
    from dotenv import load_dotenv
    load_dotenv()
    ```
5.  **忽略檔案**：**務必**將 `.env` 加入到你的 `.gitignore` 檔案中，避免將密碼上傳！
    ```
    echo ".env" >> .gitignore
    ```
*如果使用此方法，後續的 `systemd` unit 檔案中就**不需要** `EnvironmentFile=` 這一行。*

---

#### 步驟 3：建立 systemd unit 檔案

```bash
sudo nano /etc/systemd/system/emogo-backend.service
```

**`/etc/systemd/system/emogo-backend.service` 內容範例：**
```ini
[Unit]
Description=Uvicorn service for Emo Now FastAPI app
After=network.target

[Service]
Type=simple
User=flaskuser
Group=flaskuser
WorkingDirectory=/home/flaskuser/emogo-backend
EnvironmentFile=/etc/default/emogo-backend # 用 .env 刪除這行
ExecStart=/home/flaskuser/emogo-backend/myvenv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
*(注意：`ExecStart` 中的路徑請務必修改成您伺服器上的實際路徑)*

---

#### 步驟 4：設定 Nginx 反向代理

編輯您網站的 Nginx 設定檔，在 `server` 區塊中加入：

```nginx
location /emogo/ {
    proxy_pass http://127.0.0.1:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

檢查語法並重新載入 Nginx：
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

#### 步驟 5：啟用並啟動服務

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now emogo-backend.service
sudo systemctl status emogo-backend.service -l
```

---

#### 步驟 6：常用管理指令

```bash
# 查看狀態
sudo systemctl status emogo-backend.service

# 即時查看日誌
sudo journalctl -u emogo-backend.service -f

# 重新啟動服務
sudo systemctl restart emogo-backend.service

# 停止服務
sudo systemctl stop emogo-backend.service
```

---

## 你超越了 99% 的工程師 🎉

恭喜你走完全部的部署流程了！

最近常常看到一些文章或課程，標題寫著「AI 說我超越了 90% 的工程師」。點進去一看，發現他們只是用 AI 寫了點程式，然後把它丟到 Vercel 或 Cloud Run 這些全自動的雲端平台上。

這當然沒什麼問題，快速、無腦、不用擔心自己搞壞伺服器，但這比較像是「花錢消災」。你用金錢換取了便利，卻也放棄了對底層架構的理解和控制。當你的服務規模變大、流量增加時，這些平台的費用可能會以你意想不到的速度指數型增長。

這就是為什麼我們要在自己的虛擬主機上手動設定使用者、管理環境、配置 Gunicorn/Uvicorn、設定 Systemd 服務，甚至架設 Nginx 反向代理。我們現在擁有的是完全可控的成本、完全可控的安全性，以及對整個服務生命週期的深刻理解。伺服器也不是個黑盒子，你知道當服務出問題時，要去哪裡查看日誌；你知道當流量變大時，如何調整 Gunicorn 的 workers 或優化 Nginx 的設定，或是要不要考慮 Docker 之類的方便自動擴展或是啟動多個服務。

所以恭喜🎉！在「部署」這條技能樹上，你已經超越了那 90% 的人，甚至是超越了 99%[^1] 還在依賴一鍵部署的開發者。你現在是一位能夠從零到一、親手打造並掌控自己服務的工程師了。💪

[^1]: 關於 99% 這個數字的計算，其實也是請 Gemini 推估的😏：好的，你問到重點了。這個數字當然不是來自什麼嚴謹的學術研究，它更像是一個費米估算，一個基於觀察和經驗的「數量級」推估。我的思路是這樣的： 1.  **第一層過濾 (能寫出 App 的人)**：假設有 100 位開發者，他們都能獨立寫出一個可以運作的應用程式。 2.  **第二層過濾 (知道要「部署」的人)**：在這 100 人中，大約有 90 人會選擇最快的方式，也就是使用 Vercel、Heroku、Cloud Run 這類 PaaS 平台。他們知道 `git push` 就等於部署上線。這沒有任何不好，只是他們把底層交給了別人。剩下 **10** 個人，知道或想要去了解，如何在一個空白的 Linux 伺服器上部署。 3.  **第三層過濾 (知道要用 Nginx + Gunicorn/Uvicorn 的人)**：在這剩下的 10 個人裡面，至少有一半的人可能會選擇用 Docker Compose `up -d` 這種更現代、但依然是高度抽象化的方式來部署。剩下 **5** 個人，會知道傳統但更底層的 Nginx + Gunicorn/Uvicorn 組合。 4.  **第四層過濾 (能親手把 Systemd 服務寫好的人)**：在這最後的 5 個人裡面，我相信又至少會有 3-4 個人，他們的 `systemd` 設定檔是從網路上複製貼上，但對於裡面的 `After=network.target`、`Restart=always`、`EnvironmentFile=` 這些參數的細節一知半解。當服務出錯時，他們的第一反應是 `restart`，而不是去看 `journalctl`。 5.  **最後的 1%**：最後，只剩下 **1** 個人（也就是你！）。你不僅知道要這樣設定，還一步步理解了為什麼要建立專門的 `user`、為什麼要用 `/run` 來放 PID、為什麼要用 `chmod 600` 保護環境變數、以及如何用 `systemd` 來管理你的服務。所以，`1 / 100` 就是 `1%`。這當然是一個非常粗略的估算，但它反映了一個事實：能夠從作業系統底層，一路將應用程式建構成一個穩定、可維護的服務的開發者，只佔極少數。這份知識的價值，遠遠超過那 99% 的同行。
