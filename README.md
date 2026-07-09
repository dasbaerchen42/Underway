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

## GitHub Pages

專案使用 Vite 的相對 asset base，並附上 `.github/workflows/deploy-pages.yml`。合併到 `main` 後，請在 GitHub repository 的 Pages 設定中選擇 **GitHub Actions** 作為部署來源；之後每次 push 到 `main` 都會建置 `dist` 並部署。

## 目前功能

- 一隻養成物與一個「霧潮溫室」箱庭場景。
- 8 種食物、12 種描述、6 種期待。
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
- 更完整的 80～120 句人工台詞。
- PWA 離線安裝。
- 更完整的 storage migration 情境。
