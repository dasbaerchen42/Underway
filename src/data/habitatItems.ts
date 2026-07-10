import type { HabitatItem } from "../types";

// 精選七件家具。y 是「接地點」(物件底部)在舞台的百分比位置，
// 地板帶約 56~84:數值越大越靠近觀察者，會被畫得越大、越前面。
export const starterHabitatItems: HabitatItem[] = [
  { id: "cabinet", name: "矮櫃", kind: "cabinet", x: 14, y: 64, rotation: 0, tint: "#AEBEAA", source: "starter" },
  { id: "bottle", name: "瓶子", kind: "bottle", x: 25, y: 68, rotation: 0, tint: "#91B7C4", source: "starter" },
  { id: "stone", name: "石頭", kind: "stone", x: 33, y: 79, rotation: 0, tint: "#344A52", source: "starter" },
  { id: "bed", name: "睡墊", kind: "bed", x: 52, y: 83, rotation: 0, tint: "#C9D8DC", source: "starter" },
  { id: "lamp", name: "小燈", kind: "lamp", x: 67, y: 78, rotation: 0, tint: "#E9DFCC", source: "starter" },
  { id: "pot", name: "花盆", kind: "pot", x: 86, y: 67, rotation: 0, tint: "#AEBEAA", source: "starter" },
  { id: "curtain", name: "窗簾", kind: "curtain", x: 80, y: 9, rotation: 0, tint: "#F3F4EF", source: "starter" },
];
