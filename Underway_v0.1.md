# 共鳴箱庭（暫名）開發規格書

> 文件用途：交付 Codex 或其他程式代理，作為第一版純前端原型的完整開發依據。  
> 文件版本：v0.1  
> 核心限制：無後端、無雲端資料庫、無 API、無生成式 AI、無外部圖片素材；畫面以 HTML 元素與 CSS 渲染。  
> 建議技術：Vite + React + TypeScript + 原生 CSS。  
> 目標裝置：桌機與手機瀏覽器，優先支援直式手機與一般桌機視窗。

---

## 1. 產品概念

「共鳴箱庭」是一款以情緒、生活事件與陪伴為核心的微型養成遊戲。

玩家可在想到的任何時候進入箱庭，選擇一份食物，替它賦予當下的意義，再交給一隻或多隻養成物。養成物不以傳統的升級、進化或數值變強為目標，而是根據長期收到的食物、描述、玩家期待、個體相性與少量隨機變異，逐漸改變外觀、習慣、回應方式與生活環境。

可能的變化包括：

- 身體逐漸偏藍、偏暖或偏灰。
- 透明度、光澤、濕潤感、霧感改變。
- 長出觸手、薄膜、角、花、苔蘚或漂浮光點。
- 改變睡覺位置、收藏習慣、活動時間與互動距離。
- 逐漸記住玩家如何使用特定食物。
- 形成自己的消化偏好與回應風格。
- 在玩家離線期間移動物件、築巢、種植或留下觀察事件。

遊戲的核心不是把玩家的情緒分類正確，而是讓玩家感覺：

> 我把今天的一部分交給牠，而牠用自己的方式留下了痕跡。

---

## 2. 核心設計原則

### 2.1 變化，不是成長

- 不設等級、戰力、稀有度排行榜或最佳進化型。
- 不使用「餵對才漂亮」的正誤邏輯。
- 所有長期形態都應有自身美感。
- 負面或複雜情緒不導向醜化、病弱、死亡或退化。
- 玩家影響養成物，但不能完全控制養成物。

### 2.2 不懲罰離開

- 不設連續登入獎勵。
- 不設飢餓死亡、好感下降、退化或責備台詞。
- 長時間未登入，只生成少量有意義的離線事件。
- 養成物對久別的反應應偏生活感，不應情緒勒索。

### 2.3 玩家不必說清楚

- 允許「不知道」「不想說」「只是想餵牠」。
- 自由文字可保存到日記，但第一版不解析自然語言。
- 系統透過玩家選擇的描述與期待產生結構化訊號。
- 沉默本身也是有效互動。

### 2.4 每次互動都有效，但不鼓勵刷取

- 玩家一天可以餵食任意次數。
- 每次餵食都產生即時反應。
- 短時間重複相同輸入，長期沉積權重逐漸降低。
- 餵得多不等於比較高級或比較有利。

### 2.5 隨機不能推翻意義

- 玩家選擇決定方向。
- 養成物相性決定主要轉譯。
- 隨機只改變幅度、偏重、部位與低機率旁支。
- 不允許隨機把明確正向變成反向，或讓一次骰運壓過長期累積。

---

## 3. 核心遊戲循環

1. 玩家進入箱庭。
2. 看見目前光景、養成物狀態與可能的離線變化。
3. 玩家選擇一份食物。
4. 玩家選擇「今天這份食物嚐起來像什麼」。
5. 玩家選擇「希望牠怎麼處理」。
6. 玩家可選填一句自由文字。
7. 系統計算此次餵食訊號。
8. 養成物依相性、個體偏好與 seeded random 進行消化判定。
9. 立即播放動作、短句與短暫視覺效果。
10. 本次餵食進入待消化佇列。
11. 經過一段箱庭時間後，生成近期習性與小型外觀變化。
12. 真實日期更換時，整合當日紀錄，生成每日觀察日記與長期形態沉積。
13. 玩家可佈置、染色、觸摸、查看日記與觀察圖鑑。

---

## 4. 時間系統

遊戲同時存在三套時間。

### 4.1 真實日期

用途：

- 每日觀察日記分頁。
- 每日長期沉積結算。
- 玩家生活紀錄的主要時間軸。

規則：

- 一個現實日期對應一篇日記。
- 玩家一天餵十次，仍只產生一篇主日記。
- 每筆餵食保留實際時間，可在詳細紀錄展開查看。

### 4.2 箱庭時間

用途：

- 晨、晝、暮、夜的視覺循環。
- 養成物活動階段。
- 消化節點。
- 箱庭生活感。

建議預設：

- 90 分鐘完成一輪「光巡」。
- 每輪分為晨光、日照、暮色、夜霧四階段。
- 不顯示傳統時鐘，可顯示「第幾次光巡」。
- 光巡只影響環境與近期狀態，不直接增加真實日記日期。

### 4.3 互動時間

用途：

- 每次餵食、觸摸與佈置後的即時反應。
- 短期冷卻。
- 防止重複台詞與重複事件。

### 4.4 建議預設參數

```ts
export const TIME_CONFIG = {
  worldCycleMinutes: 90,
  digestionIntervalMinutes: 30,
  realDaySettlement: true,
  maxOfflineEvents: 3,
  maxDetailedFeedingsShownPerDay: 50,
};
```

### 4.5 離線處理

頁面關閉時不執行背景程式。下次開啟時：

1. 讀取 `lastVisitAt`。
2. 計算離線時長。
3. 判定跨越多少消化節點與真實日期。
4. 合併處理，不逐分鐘模擬。
5. 最多生成三件離線事件。
6. 跨日則補做每日沉積與日記結算。

---

## 5. 餵食流程設計

### 5.1 步驟一：選擇食物

MVP 建議 8 種：

1. 草莓：甜、柔軟、微酸、明亮。
2. 藍莓：冷、濕潤、深色、安靜。
3. 吐司：樸素、乾燥、日常、安定。
4. 熱茶：溫暖、流動、緩慢、舒展。
5. 糖粒：輕、短暫、閃亮、快速。
6. 鹽晶：尖銳、乾淨、保存、收斂。
7. 露水：透明、冷、微弱、清晨感。
8. 種子：沉睡、等待、未知、可能性。

### 5.2 步驟二：選擇描述

MVP 建議 12 種：

- 很輕，想留久一點。
- 有點酸，但不是壞事。
- 悶悶的，不太想說。
- 很燙，現在還放不下。
- 很重，但說不清楚。
- 全部混在一起。
- 普普通通，只是想餵你。
- 很珍貴，希望你替我收好。
- 我有點生氣，但也有點委屈。
- 我想靠近一點。
- 我想自己待著。
- 我不知道這是什麼。

每個描述背後映射一組情緒訊號。

### 5.3 步驟三：選擇期待

MVP 建議 6 種：

- 陪我一起吃掉。
- 替我收起來。
- 幫我消化一點。
- 不要問，只要收下。
- 讓它在這裡待一晚。
- 今天不用做什麼。

### 5.4 步驟四：自由文字

- 選填。
- 僅保存，不做語意解析。
- 最多 500 字。
- 可選擇是否顯示於日記。
- 可留空。

---

## 6. 隱藏訊號模型

### 6.1 情緒訊號軸

```ts
export type EmotionalVector = {
  activation: number; // 安靜、麻木 <-> 激烈、翻湧
  warmth: number;     // 疏冷 <-> 溫暖、柔軟
  connection: number; // 想獨處 <-> 想靠近
  boundary: number;   // 開放 <-> 防衛、需要保護
  clarity: number;    // 模糊 <-> 清楚
  release: number;    // 想保存 <-> 想放下、消化
};
```

建議單次描述數值範圍：`-2 ~ +2`。

### 6.2 食物感官軸

```ts
export type SensoryVector = {
  sweetness: number;
  coolness: number;
  warmth: number;
  moisture: number;
  dryness: number;
  lightness: number;
  depth: number;
  sharpness: number;
  softness: number;
  dormancy: number;
};
```

建議單種食物數值範圍：`0 ~ 2`。

### 6.3 期待訊號

```ts
export type CareIntentVector = {
  closeness: number;
  silence: number;
  preservation: number;
  digestion: number;
  release: number;
  ritual: number;
};
```

### 6.4 一次餵食的基礎訊號

```ts
type FeedingSignal = {
  emotional: EmotionalVector;
  sensory: SensoryVector;
  careIntent: CareIntentVector;
};
```

概念式：

```ts
baseSignal =
  food.sensory
  + meaning.emotional
  + careIntent.vector;
```

不同向量不必硬合併為同一組欄位，可在 phenotype translator 中分別處理。

---

## 7. 養成物資料模型

### 7.1 基本資料

```ts
export type Creature = {
  id: string;
  name: string;
  bornAt: string;
  speciesSeed: string;
  individualSeed: string;

  genes: CreatureGenes;
  learnedAffinity: LearnedAffinity;
  appearance: AppearanceState;
  recentMemory: MemoryState;
  longTermMemory: MemoryState;
  foodMemory: Record<string, FoodMeaningMemory>;
  responsePreference: ResponsePreference;

  unlockedTraits: string[];
  activeTemporaryEffects: TemporaryEffect[];
  inventory: CreatureOwnedItem[];
  favoriteSpots: string[];

  lastInteractionAt: string | null;
  lastDigestionAt: string | null;
};
```

### 7.2 先天相性

```ts
export type CreatureGenes = {
  absorptionStability: number; // 0.75 ~ 1.0
  mutationChance: number;      // 0.01 ~ 0.08
  emotionalSensitivity: number;// 0.85 ~ 1.15
  sensorySensitivity: number;  // 0.85 ~ 1.15

  conversionWeights: {
    coolToBlue: number;
    warmthToAmber: number;
    confusionToTransparency: number;
    connectionToTendrils: number;
    boundaryToMembrane: number;
    releaseToGlow: number;
    preservationToCrystals: number;
    dormancyToFlora: number;
    depthToDarkCore: number;
    moistureToFluidMotion: number;
  };

  dominantBias: AppearanceTraitKey;
  secondaryBias: AppearanceTraitKey;
};
```

### 7.3 外觀狀態

```ts
export type AppearanceState = {
  hueBlue: number;
  hueAmber: number;
  transparency: number;
  glow: number;
  softness: number;
  wetness: number;
  darkCore: number;
  fluidMotion: number;

  tendrils: number;
  membrane: number;
  crystals: number;
  flora: number;
  horns: number;
  floatingMotes: number;
};
```

連續型外觀建議範圍：`0 ~ 100`。  
結構型特徵可先累積成長值，再於門檻解鎖實際 DOM 部件。

### 7.4 短期與長期記憶

```ts
export type MemoryState = {
  emotional: EmotionalVector;
  sensory: SensoryVector;
  careIntent: CareIntentVector;
};
```

- `recentMemory`：最近 7～14 次餵食的快速移動平均。
- `longTermMemory`：緩慢累積的永久傾向。

---

## 8. 隨機系統

### 8.1 設計目標

相同食物、描述與期待，不必得到完全相同的數值，但應保持方向一致。

一次餵食的最終結果：

```ts
finalChange =
  guaranteedBase
  + boundedVariance
  + affinityBias
  + rareSideEffect;
```

### 8.2 三層隨機

#### 吸收量

```ts
absorptionMultiplier = randomBetween(0.85, 1.15);
```

只改變幅度，不改變正負方向。

#### 屬性偏重

從本次相關屬性中選一項作為主吸收屬性，給予 `1.05 ~ 1.25` 額外倍率。

#### 罕見旁支

- 預設機率 `1% ~ 5%`。
- 只增加少量合理的相關屬性。
- 不直接解鎖大型結構。
- 不建立稀有度排行榜。

### 8.3 不同記憶層的亂數幅度

```ts
dailyVariance: [0.70, 1.30]
recentVariance: [0.85, 1.15]
longTermVariance: [0.95, 1.05]
```

### 8.4 Seeded random

結果一旦生成，重新整理不可重擲。

種子建議：

```ts
seedSource = [
  creature.id,
  feeding.id,
  feeding.timestamp,
  food.id,
  meaning.id,
  careIntent.id
].join("-");
```

使用簡單可重現 PRNG，例如 `xmur3 + mulberry32`。

### 8.5 偏差累積

若養成物多次以同一方式消化某種訊號，可緩慢提高該轉換權重。

```ts
learnedAffinity.confusionToTransparency = clamp(
  current + 0.01,
  0.8,
  1.3
);
```

如此養成物會形成自己的「消化習慣」。

---

## 9. 重複餵食與遞減權重

玩家可無限次餵食，但短時間重複相同訊號時，長期沉積降低。

```ts
longTermWeight = 1 / Math.sqrt(similarFeedingCountWithinWindow);
```

建議：

- 判定視窗：6 小時。
- 相似條件：同食物、同描述，或向量相似度高於 0.9。
- 即時反應始終為 100%。
- 近期記憶吸收 40%～70%。
- 長期記憶依遞減權重吸收 5%～20%。

敘事表現：

- 第一次：立即吃下。
- 第二次：慢慢吃。
- 第三次以上：排在一起、收藏、留到晚點。
- 不顯示「收益下降」或數值警告。

---

## 10. 外觀轉譯系統

### 10.1 連續型外觀

由 CSS 自訂屬性直接反映：

```css
.creature {
  --blue: 0;
  --amber: 0;
  --transparency: 0;
  --glow: 0;
  --softness: 0;
  --fluid-motion: 0;

  opacity: calc(1 - var(--transparency) * 0.004);
  border-radius: calc(30% + var(--softness) * 0.35%);
  filter:
    hue-rotate(calc(var(--blue) * 0.8deg))
    saturate(calc(0.85 + var(--blue) * 0.004))
    drop-shadow(
      0 0 calc(2px + var(--glow) * 0.12px)
      rgba(255, 255, 255, 0.55)
    );
}
```

### 10.2 結構型外觀

候選特徵：

- 軟觸手。
- 包覆薄膜。
- 小角。
- 結晶。
- 苔蘚或花芽。
- 漂浮光點。
- 身體內部深色核心。

解鎖條件範例：

```ts
if (
  appearance.tendrils >= 30 &&
  appearance.transparency >= 15
) {
  unlockTrait("soft_tendril_1");
}
```

規則：

- 解鎖後原則上不消失。
- 數值下降時只改變長短、顏色、顯眼度或使用頻率。
- 同一特徵可分 2～3 個階段。
- 第一版每類最多 3 個 DOM 子元素，避免效能問題。

### 10.3 身體部位偏移

每次消化可隨機選擇變化從哪裡開始：

- 頭部。
- 身體中心。
- 尾端。
- 左右側。
- 內部核心。
- 附肢末端。

此結果僅影響 CSS class 或局部變數。

---

## 11. 個人化學習

### 11.1 食物意義記憶

```ts
export type FoodMeaningMemory = {
  foodId: string;
  uses: number;
  meaningCounts: Record<string, number>;
  dominantMeaningId: string | null;
  confidence: number;
  confirmedByPlayer: boolean;
  customLabel?: string;
};
```

規則：

- 第一次不下結論。
- 使用 3～5 次後可試探。
- 玩家可選「是」「今天不一樣」「不用替它命名」。
- 玩家確認後才視為穩定記憶。
- 同一食物可保留多個常見意義。

範例對話：

> 今天的草莓，也要放進那個小盒子裡嗎？

### 11.2 回應偏好

```ts
export type ResponsePreference = {
  verbal: number;
  quiet: number;
  playful: number;
  collecting: number;
  physical: number;
  ritual: number;
};
```

玩家互動後可選：

- 這樣就好。
- 今天想安靜一點。
- 再陪我一下。
- 把它收進日記吧。

系統依選擇緩慢調整權重，不顯示數值。

---

## 12. 對話系統

### 12.1 不生成自然語言

第一版所有台詞人工撰寫，以條件式意圖選取。

```ts
export type DialogueEntry = {
  id: string;
  intent: DialogueIntent;
  conditions: DialogueCondition[];
  lines: string[];
  weight: number;
  cooldownInteractions: number;
  once?: boolean;
};
```

### 12.2 MVP 對話意圖

1. 初次收到食物。
2. 熟悉的食物與意義。
3. 食物意義改變。
4. 玩家沉默。
5. 感受強烈。
6. 平靜日常。
7. 想保存。
8. 想放下。
9. 想靠近。
10. 想獨處。
11. 久別回來。
12. 外觀發生變化。
13. 養成物主動送禮。
14. 養成物不理解但願意收下。
15. 飽和後仍接過食物。
16. 特殊消化旁支。

每個意圖建議 5～8 句。

### 12.3 台詞變數

可使用：

- `{creatureName}`
- `{foodName}`
- `{customFoodMeaning}`
- `{favoriteSpot}`
- `{timePhase}`
- `{traitName}`

### 12.4 防重複

- 保存最近 10 句台詞 ID。
- 相同台詞至少冷卻 8 次互動。
- 相同意圖連續出現時降低權重。
- 稀有台詞可設為每日最多一次。

---

## 13. 觸摸與互動

可互動區域：

- 頭部。
- 身體中心。
- 尾端或觸手。
- 手停在旁邊，不直接碰觸。
- 把物件移近牠。

養成物有邊界：

- 有時主動靠近。
- 有時躲開。
- 有時保持不動。
- 有時只用觸手碰一下玩家游標。
- 不保證每次都接受撫摸。

互動結果受以下因素影響：

- 當日狀態。
- `connection`。
- `boundary`。
- 玩家過往回應偏好。
- 養成物個體性格。
- 隨機微幅變動。

---

## 14. 箱庭佈置

### 14.1 玩家可控物件

MVP 建議：

- 地墊。
- 小桌。
- 矮櫃。
- 花盆。
- 瓶子。
- 小燈。
- 窗簾。
- 睡墊。
- 石頭。
- 紙片或標籤。

功能：

- 拖曳擺放。
- 前後層級調整。
- 旋轉 0 / 90 / 180 / 270 度。
- 3～5 種染色選項。
- 所有物件用 CSS 幾何圖形渲染。

### 14.2 養成物專屬物件

由養成物自行生成或改造：

- 果核盆栽。
- 收納罐。
- 觸手吊床。
- 透明薄膜小屋。
- 結晶收藏堆。
- 苔蘚睡窩。
- 兩隻養成物共用的椅子或毯子。

規則：

- 不直接讓玩家購買。
- 依近期記憶、長期形態、現有家具與離線事件生成。
- 玩家可移動，但不能刪除；可收進收藏箱。
- 每件物品有來源日記。

---

## 15. 離線事件

候選事件條件範例：

- 有空花盆 + 最近收到水果：把果核埋進花盆。
- 有瓶子 + 保存傾向高：把食物殘渣收進瓶子。
- 有兩隻養成物 + 一張毯子：把毯子拖到窗邊。
- 透明度高 + 夜間離線：留下霧痕或水滴。
- 觸手特徵已解鎖：把小燈纏到較高處。
- flora 高：花盆旁多出新芽。

事件資料：

```ts
export type WorldEvent = {
  id: string;
  type: string;
  creatureIds: string[];
  occurredAt: string;
  sourceConditions: string[];
  narrativeLine: string;
  visualChanges: WorldChange[];
  journalPriority: number;
};
```

---

## 16. 日記系統

### 16.1 每日主頁

包含：

- 真實日期。
- 今日餵食總數。
- 今日主要食物。
- 今日最明顯的情緒質地。
- 一至兩條重要觀察。
- 長期外觀變化。
- 箱庭事件。
- 可展開的完整餵食紀錄。

### 16.2 主日記生成

不使用生成式 AI，採規則模板組合。

模板結構：

```ts
summary =
  openingTemplate
  + dominantFeedingObservation
  + appearanceChangeObservation
  + optionalWorldEvent
  + closingTemplate;
```

範例：

> 今天共收到四份食物。牠對藍莓停留得最久。暮色降下來時，牠把兩顆果實放進同一只透明罐裡，尾端也比早上更透了一點。夜裡，牠把罐子移到睡墊旁邊。

### 16.3 詳細紀錄

```txt
11:23　藍莓｜很重，但說不清楚
14:08　草莓｜一件很小的好事
17:41　藍莓｜還沒有放下
23:12　熱茶｜只是來看看牠
```

### 16.4 匯出

- 匯出完整存檔 JSON。
- 匯入 JSON。
- 匯出日記為 Markdown。
- 匯出單日純文字。
- 顯示「清除瀏覽器資料可能遺失存檔」提示。

---

## 17. 預設主題與視覺方向

### 17.1 暫定主題：霧潮溫室

箱庭是一座漂浮在霧裡的小型透明溫室。世界由半透明玻璃、紙片、柔軟色塊與小型植物構成。養成物是一種尚未被命名的柔軟生命，外觀介於水滴、種子、軟體生物與玻璃玩具之間。

此主題適合 CSS 原因：

- 圓形、橢圓、膠囊形容易用 DOM 與 border-radius 建立。
- 透明、霧感、光暈可用 opacity、filter、gradient。
- 觸手可用細長 div 搭配 transform。
- 薄膜可用偽元素與 blur。
- 結晶可用 clip-path。
- 植物可用少量葉片元素重組。
- 不需要複雜線稿或圖片材質。

### 17.2 初始養成物外型

預設基礎：

- 一個略扁的圓潤身體。
- 無固定動物物種。
- 兩個極簡眼點，或完全無五官模式可切換。
- 一小段尾端或芽點。
- 身體內部有一個模糊核心。
- 可透過 CSS 變數調整色相、透明度、光澤與軟硬感。
- 後續所有器官均從基礎體延伸。

### 17.3 色彩

建議主色：

- 霧白 `#F3F4EF`
- 淺灰藍 `#C9D8DC`
- 玻璃藍 `#91B7C4`
- 暖米 `#E9DFCC`
- 淡苔綠 `#AEBEAA`
- 深墨藍 `#344A52`

介面避免高飽和紅色警示。重要狀態以文字、形狀與亮度共同傳達。

### 17.4 動畫

- 呼吸：4～7 秒緩慢縮放。
- 漂浮：6～12 秒微幅上下位移。
- 觸手：錯開相位的 rotate / skew。
- 光暈：低頻 opacity 變化。
- 進食：局部壓縮、食物縮小、核心波紋。
- 避免高速彈跳與過多粒子。

支援 `prefers-reduced-motion`。

### 17.5 場景構圖

- 桌面式微縮箱庭。
- 優先 2.5D 正面偏俯視，不做真正 3D。
- 手機畫面上方為箱庭，下方為互動面板。
- 桌機為左側箱庭、右側日記與操作區。
- 家具採絕對定位於固定比例容器。

---

## 18. 介面頁面

### 18.1 首次進入

1. 專案標題。
2. 簡短說明。
3. 建立第一隻養成物。
4. 輸入名字。
5. 隨機生成個體 seed。
6. 選擇初始身體色調三選一。
7. 進入箱庭。

### 18.2 箱庭主畫面

包含：

- 箱庭舞台。
- 養成物。
- 當前光巡階段。
- 餵食按鈕。
- 觸摸模式。
- 佈置模式。
- 日記入口。
- 設定入口。

### 18.3 餵食抽屜

分步驟呈現：

1. 食物。
2. 描述。
3. 期待。
4. 自由文字。
5. 確認。

每一步最多顯示 6～8 個選項，避免一次塞滿畫面。

### 18.4 日記

- 月曆或日期列表。
- 每日摘要卡。
- 展開詳細餵食。
- 依養成物篩選。
- 搜尋自由文字。
- 匯出。

### 18.5 觀察圖鑑

顯示：

- 已出現外觀特徵。
- 第一次出現日期。
- 相關日記。
- 不顯示完整未解鎖清單。
- 不顯示稀有度。

### 18.6 設定

- 動畫強度。
- 音效開關；MVP 可先無音效。
- 字體大小。
- 高對比模式。
- 自動儲存狀態。
- 匯出 / 匯入。
- 清除存檔。

---

## 19. 技術架構

### 19.1 建議 Stack

- Vite
- React
- TypeScript
- 原生 CSS 或 CSS Modules
- 不使用 Canvas
- 不使用 SVG 當主要美術
- 不使用外部圖片
- 不依賴後端
- 第一版不使用 UI framework

### 19.2 儲存

MVP：

- `localStorage`
- 所有狀態序列化為 JSON
- 每次重要操作後 debounce 自動儲存
- 保留最近 3 份內部備份

後續：

- 若日記量增大，將 storage adapter 換成 IndexedDB。
- UI 與 domain logic 不直接呼叫 localStorage。

### 19.3 模組

```txt
src/
  app/
    App.tsx
    routes.ts
  components/
    creature/
      CreatureView.tsx
      CreatureBody.tsx
      Tendril.tsx
      Membrane.tsx
      Crystal.tsx
      Flora.tsx
    habitat/
      HabitatStage.tsx
      FurnitureItem.tsx
      LightingLayer.tsx
    feeding/
      FeedingFlow.tsx
      FoodPicker.tsx
      MeaningPicker.tsx
      CareIntentPicker.tsx
    journal/
      JournalPage.tsx
      DailyEntry.tsx
    common/
  data/
    foods.ts
    meanings.ts
    careIntents.ts
    dialogues.ts
    traits.ts
    worldEvents.ts
  domain/
    feeding/
      calculateFeedingSignal.ts
      digestFeeding.ts
      diminishingReturns.ts
    creature/
      createCreature.ts
      translateToAppearance.ts
      unlockTraits.ts
      updateLearnedAffinity.ts
    dialogue/
      selectDialogue.ts
    journal/
      settleRealDay.ts
      buildJournalEntry.ts
    time/
      calculateWorldPhase.ts
      processOfflineTime.ts
    random/
      seededRandom.ts
  state/
    gameStore.ts
    selectors.ts
  storage/
    storageAdapter.ts
    localStorageAdapter.ts
    migration.ts
  styles/
    tokens.css
    global.css
    creature.css
    habitat.css
  types/
    index.ts
```

### 19.4 狀態管理

第一版可用 React Context + reducer，或自寫單一 store。避免過早引入大型狀態函式庫。

核心狀態：

```ts
export type GameState = {
  schemaVersion: number;
  playerSettings: PlayerSettings;
  creatures: Creature[];
  feedings: FeedingRecord[];
  journalEntries: JournalEntry[];
  habitat: HabitatState;
  worldEvents: WorldEvent[];
  lastVisitAt: string;
  lastSettlementDate: string;
};
```

---

## 20. 核心事件流程

### 20.1 完成一次餵食

```ts
function completeFeeding(input: FeedingInput): FeedingResult {
  const creature = getCreature(input.creatureId);
  const feedingId = crypto.randomUUID();

  const baseSignal = calculateFeedingSignal(input);
  const repeatWeight = calculateDiminishingReturn(input);
  const rng = createSeededRandom(buildFeedingSeed(feedingId, input));

  const digestion = digestFeeding({
    creature,
    baseSignal,
    repeatWeight,
    rng,
  });

  applyImmediateState(creature, digestion.immediate);
  enqueueRecentDigestion(creature, digestion.recent);
  applyLongTermDeposit(creature, digestion.longTerm);
  updateFoodMeaningMemory(creature, input);
  updateLearnedAffinity(creature, digestion);
  unlockEligibleTraits(creature);
  const dialogue = selectDialogue(creature, input, digestion, rng);

  saveFeedingRecord(...);
  persistGameState();

  return { digestion, dialogue };
}
```

### 20.2 每日結算

```ts
function settleDay(date: string) {
  const feedings = getFeedingsForDate(date);
  const events = getWorldEventsForDate(date);

  for (const creature of creatures) {
    const dailyProfile = combineDailyFeedings(creature, feedings);
    const longTermChange = digestDailyProfile(creature, dailyProfile);
    applyAppearanceChange(creature, longTermChange);
    unlockEligibleTraits(creature);
  }

  const journalEntry = buildJournalEntry(date, feedings, events, creatures);
  saveJournalEntry(journalEntry);
  persistGameState();
}
```

---

## 21. MVP 內容量

### 系統

- 1 隻養成物。
- 8 種食物。
- 12 種描述。
- 6 種期待。
- 6 條情緒軸。
- 10 條感官軸。
- 7～12 種外觀傾向。
- 16 種對話意圖。
- 80～120 句人工台詞。
- 12 種離線事件。
- 10 種家具。
- 5 種家具染色。
- 1 個箱庭場景。
- 4 個光巡階段。
- 每日日記。
- JSON 匯出與匯入。

### 不列入 MVP

- 多隻養成物同時互動。
- 帳號與跨裝置同步。
- 雲端備份。
- 自然語言理解。
- 聲音與音樂。
- 商店與貨幣。
- 成就、稀有度與排行榜。
- 多個箱庭場景。
- 真正 3D。
- 分享連結。

---

## 22. 驗收條件

### 餵食

- 玩家可在同一天完成多次餵食。
- 相同輸入可產生幅度略有不同但方向一致的結果。
- 重新整理後同一筆餵食結果不變。
- 重複餵食不會造成線性長期增長。
- 每次餵食都有即時動畫與一句回應。

### 養成物

- 顏色、透明度與光澤可連續變化。
- 至少三種結構型特徵可解鎖。
- 特徵解鎖後不會因數值下降直接消失。
- 玩家離開後再回來，最多出現三件合理事件。
- 不登入不會造成負面懲罰。

### 日記

- 每個現實日期最多一篇主日記。
- 每篇日記可展開查看當日所有餵食。
- 主日記不只是流水帳，至少包含一條觀察性描述。
- 可匯出 Markdown。
- 可從 JSON 還原完整狀態。

### 介面

- 手機寬度 375px 可完整操作。
- 桌機寬度 1280px 有雙欄布局。
- 支援鍵盤操作。
- 支援 reduced motion。
- 不載入任何外部圖片。
- 斷網後仍可使用已載入的頁面；正式版可再加 PWA。

---

## 23. 測試清單

### 單元測試

- `calculateFeedingSignal`
- `calculateDiminishingReturn`
- seeded PRNG 可重現
- 外觀轉譯方向不反轉
- trait unlock 門檻
- dialogue cooldown
- food meaning confidence
- 每日結算
- 離線事件上限
- storage migration

### 情境測試

1. 同日餵食 1 次。
2. 同日餵食 20 次。
3. 連續餵相同組合。
4. 相同食物但不同描述。
5. 三天未登入。
6. 三個月未登入。
7. 跨午夜保持頁面開啟。
8. 清除部分異常資料。
9. 匯出後重新匯入。
10. 低動態模式。
11. 空白自由文字。
12. 極長自由文字。
13. 儲存空間不足時顯示錯誤。
14. localStorage 資料版本升級。

---

## 24. 建議開發階段

### Phase 1：靜態視覺原型

- 建立箱庭舞台。
- 用 CSS 畫出基礎養成物。
- 實作顏色、透明度、光暈、呼吸。
- 實作 3 種結構特徵。
- 完成桌機與手機布局。

### Phase 2：餵食與狀態

- 建立食物、描述、期待資料。
- 完成餵食流程。
- 完成向量計算。
- 完成 seeded random。
- 完成即時反應與暫時效果。

### Phase 3：長期變化

- recent / long-term memory。
- 遞減權重。
- learned affinity。
- trait unlock。
- 每日結算。

### Phase 4：日記與離線

- 日記模板。
- 詳細餵食紀錄。
- 離線事件。
- 光巡時間。
- 匯出 / 匯入。

### Phase 5：打磨

- 台詞擴充。
- 無障礙。
- 動畫與效能。
- 儲存錯誤處理。
- PWA 選配。

---

## 25. 尚未完全定案，但不阻礙開工的項目

以下項目可先使用本文件預設值，之後再替換資料與 CSS。

### 25.1 正式名稱

目前暫名「共鳴箱庭」。  
不影響架構，可最後替換。

### 25.2 養成物基礎外型

目前預設為「無固定物種的柔軟半透明生命」。  
仍需後續決定：

- 是否有眼睛。
- 是否有嘴。
- 是否要更接近水滴、種子、軟體動物或玩偶。
- 是否允許完全無五官。
- 初始色是否固定或三選一。

### 25.3 主題世界觀

目前預設為「霧潮溫室」。  
仍可替換成：

- 紙片立體書。
- 漂浮研究箱。
- 月光水族箱。
- 微型廢墟花園。
- 夢境標本室。

### 25.4 文案語氣

目前建議：

- 短句。
- 含蓄。
- 不替玩家定義情緒。
- 不過度心理諮商化。
- 不責備、不說教。
- 行動描述多於安慰語。

後續仍需建立正式語氣指南與禁用詞。

### 25.5 玩家與養成物關係

目前預設為陪伴與觀察，不明確定義為寵物、朋友或孩子。  
可保留模糊性，讓玩家自行投射。

### 25.6 多養成物

資料模型預留陣列，但 MVP 只做一隻。  
第二階段再加入彼此互動、共享家具與關係變化。

---

## 26. 給 Codex 的執行指令

請依照以下原則建立可執行的第一版：

1. 使用 Vite、React、TypeScript。
2. 不建立後端。
3. 不呼叫任何 API。
4. 不載入外部圖片。
5. 不使用 Canvas 作為主要渲染。
6. 養成物、食物、家具與場景均使用 HTML 元素及 CSS。
7. 先完成 MVP，不自行加入貨幣、商城、成就、等級、飢餓或死亡。
8. 將所有數值與文案放在獨立資料檔，避免硬編碼於元件。
9. domain logic 必須與 UI 分離。
10. 所有隨機結果使用可重現 seed。
11. 每次重要操作後自動保存。
12. 實作 JSON 匯出與匯入。
13. 提供清楚的 README，包含啟動方式、資料模型、目前功能與未完成項目。
14. 為核心運算撰寫測試。
15. 第一階段先以一隻養成物、一個箱庭場景完成完整循環。

### 第一版完成定義

使用者能夠：

- 建立一隻養成物。
- 在箱庭看見牠呼吸與活動。
- 任意次數餵食。
- 為食物選擇描述與期待。
- 看見每次略有差異的即時反應。
- 經過多次餵食後，看見顏色、透明度與至少一種結構特徵改變。
- 關閉並重新開啟頁面後保留進度。
- 跨日後看見一篇每日觀察日記。
- 匯出與匯入存檔。
- 在手機與桌機上操作。

---

## 27. 最重要的產品判準

若一項功能會讓玩家產生以下感覺，應重新評估：

- 「我今天沒來，害牠受苦了。」
- 「我餵錯了，所以牠變醜了。」
- 「我要一直刷，才能得到最稀有的樣子。」
- 「遊戲替我判斷了我真正的情緒。」
- 「牠只是把我的選項換算成固定造型。」

理想體驗應接近：

> 我可以隨時來，把一點今天交給牠。牠會記得一些，也會誤解一些，然後慢慢長成只有我們之間才會出現的樣子。
