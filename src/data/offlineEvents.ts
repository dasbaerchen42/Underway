import type { AppearanceState, AppearanceTraitKey } from "../types";

// 離線事件目錄(規格 §15):條件式生成,和箱庭家具實際連動。
// move 會真的改變該家具的位置,narrativeLine 進入日記。

export type OfflineEventDef = {
  id: string;
  narrativeLine: string;
  visualChange: string;
  priority: number;
  /** 箱庭必須存在這些家具 kind */
  requiredItems?: string[];
  /** 至少離線這麼多小時 */
  minHours?: number;
  /** 需要跨過一段夜 */
  nightCross?: boolean;
  /** 需要已解鎖的特徵 */
  requiresTrait?: AppearanceTraitKey;
  /** 外觀數值門檻 */
  minAppearance?: Partial<Record<keyof AppearanceState, number>>;
  /** 長期期待:保存傾向門檻 */
  minPreservation?: number;
  /** 長期情緒:靠近傾向門檻 */
  minConnection?: number;
  /** 最近餵過水果類 */
  recentFruit?: boolean;
  /** 把 itemKind 移到 nearKind 旁邊 */
  move?: { itemKind: string; nearKind: string; offsetY?: number };
};

export const FRUIT_FOOD_IDS = ["strawberry", "blueberry"];

export const offlineEventDefs: OfflineEventDef[] = [
  {
    id: "tendril_lamp",
    priority: 3,
    requiredItems: ["lamp", "bed"],
    requiresTrait: "tendrils",
    narrativeLine: "牠用觸手把小燈拖到睡墊旁邊,像替夜留了一個位置。",
    visualChange: "小燈移到了睡墊旁",
    move: { itemKind: "lamp", nearKind: "bed", offsetY: -10 },
  },
  {
    id: "fruit_core_pot",
    priority: 3,
    requiredItems: ["pot"],
    recentFruit: true,
    narrativeLine: "花盆的土被翻動過,中央埋著一顆小小的果核。",
    visualChange: "花盆的土面多了翻動的痕跡",
  },
  {
    id: "bottle_keep",
    priority: 2,
    requiredItems: ["bottle", "cabinet"],
    minPreservation: 0.5,
    narrativeLine: "瓶子被挪到矮櫃上,裡面多了一點說不出名字的碎屑,收得很整齊。",
    visualChange: "瓶子移到了矮櫃旁",
    move: { itemKind: "bottle", nearKind: "cabinet", offsetY: -12 },
  },
  {
    id: "bed_to_curtain",
    priority: 2,
    requiredItems: ["bed", "curtain"],
    minConnection: 0.4,
    narrativeLine: "睡墊被拖向窗簾那一側,朝著玻璃外的霧。",
    visualChange: "睡墊移向了窗邊",
    move: { itemKind: "bed", nearKind: "curtain", offsetY: 20 },
  },
  {
    id: "flora_nest",
    priority: 2,
    requiredItems: ["mat"],
    minAppearance: { flora: 22 },
    narrativeLine: "地墊中央被整理出一個淺淺的圓窩,邊緣繞著一點綠意。",
    visualChange: "地墊上多了一個小窩的形狀",
  },
  {
    id: "mist_trace",
    priority: 1,
    nightCross: true,
    minAppearance: { transparency: 12 },
    narrativeLine: "玻璃內側留下一道霧痕,高度剛好是牠身體的高度。",
    visualChange: "玻璃上多了一道霧痕",
  },
  {
    id: "stone_to_mat",
    priority: 1,
    requiredItems: ["stone", "mat"],
    minHours: 12,
    narrativeLine: "石頭被推到地墊邊,像多了一個可以靠著的東西。",
    visualChange: "石頭移到了地墊旁",
    move: { itemKind: "stone", nearKind: "mat", offsetY: -4 },
  },
  {
    id: "tag_label",
    priority: 1,
    requiredItems: ["tag", "bottle"],
    minHours: 24,
    narrativeLine: "紙片被移到瓶子旁邊,壓得很平,像一張還沒寫字的標籤。",
    visualChange: "紙片移到了瓶子旁",
    move: { itemKind: "tag", nearKind: "bottle", offsetY: 8 },
  },
  {
    id: "quiet_trace",
    priority: 0,
    narrativeLine: "霧從玻璃縫隙進來又退去,箱庭裡的東西都還記得自己的位置。",
    visualChange: "沒有明顯變動",
  },
];
