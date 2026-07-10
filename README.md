# 共鳴箱庭

以 `Underway_v0.1.md` 規格實作的純前端 MVP。這一版使用 Vite、React、TypeScript 與原生 CSS，沒有後端、API、Canvas 或外部圖片素材。

## 啟動

```bash
npm install
npm run dev
```

建置與測試：

```bash
npm run build
npm test
```

## 部署

推送到 `main` 會自動觸發 GitHub Actions(`.github/workflows/deploy.yml`):跑測試、建置,並把 `dist/` 發佈到 GitHub Pages。線上網址:<https://dasbaerchen42.github.io/Underway/>。

Repo 的 Pages 來源需設定為「GitHub Actions」(Settings → Pages → Build and deployment → Source)。

## 目前功能

- 一隻養成物與一個「霧潮溫室」箱庭場景,整體為暗色夜霧主題。
- 8 種食物、12 種描述、6 種期待。
- 意圖式對話系統:14 種對話意圖、約 100 句人工台詞,依餵食訊號選取,含冷卻防重複。
- 水母式觸手:圓滑單根、尖端淡出,柔和鐘擺擺動。
- 家具為純 CSS 具體小物(燈罩燈桿、瓶塞液體、盆栽葉片等),色調由染色 tint 衍生。
- 條件式離線事件:依家具、已解鎖特徵、長期記憶與近期食物生成,並實際移動箱庭家具。
- 夜霧單一主題,日系字感(圓體、小字級、寬字距、鬆行距)。
- 表情系統:眨眼、視線游移、進食瞇眼、觸碰挑眉;光點與觸手數量隨外觀值成長。
- 生物會在觀測區內緩慢遊走;觸手從體內下緣長出、柔和擺動。
- 觀測區有後牆與地板的空間感,家具底部接地、近大遠小做深度排序。
- 強化存檔:載入時全欄位正規化、損壞時自動回退備份、儲存失敗顯示訊息、可改名。
- 30 秒對時:光巡即時前進、暫時效果過期、跨午夜自動換日記。
- 每次餵食產生 seeded random 結果，重新整理不會重擲既有紀錄。
- 重複相同食物與描述時套用遞減權重，不鼓勵刷取。
- 外觀會依長期訊號改變顏色、透明度、光澤、濕潤感與結構特徵。
- localStorage 自動儲存，並保留最近 3 份內部備份。
- 每日觀察日記、餵食詳細紀錄、Markdown 複製。
- JSON 存檔匯出與匯入。
- 手機單欄與桌機雙欄布局，支援 reduced motion 與高對比設定。

## 架構

- `src/data`：食物、描述、期待、台詞與家具資料。
- `src/domain`：餵食訊號、seeded random、遞減權重、外觀轉譯、特徵解鎖、日記與離線事件。
- `src/state`：React Context + reducer 單一 store。
- `src/storage`：localStorage adapter 與 migration。
- `src/components`：箱庭、養成物、餵食、日記與設定 UI。
- `src/styles`：設計 token、布局、箱庭與養成物純 CSS。

## 尚未完成

- 多隻養成物互動。
- 家具拖曳、旋轉與染色操作。
- 食物意義記憶的試探確認對話。
- PWA 離線安裝。
- 更完整的 storage migration 情境。
