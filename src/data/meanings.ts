import type { Meaning } from "../types";

export const meanings: Meaning[] = [
  { id: "light", label: "很輕，想留久一點。", emotional: { activation: -0.2, warmth: 0.5, connection: 0.4, boundary: 0, clarity: 0.8, release: -0.2 } },
  { id: "sour_ok", label: "有點酸，但不是壞事。", emotional: { activation: 0.4, warmth: 0.1, connection: 0.1, boundary: 0.2, clarity: 0.6, release: 0.3 } },
  { id: "quiet_heavy", label: "悶悶的，不太想說。", emotional: { activation: -0.8, warmth: -0.3, connection: -0.5, boundary: 0.8, clarity: -0.6, release: -0.4 } },
  { id: "too_hot", label: "很燙，現在還放不下。", emotional: { activation: 1.6, warmth: 0.8, connection: -0.2, boundary: 0.7, clarity: -0.8, release: -0.7 } },
  { id: "unclear_weight", label: "很重，但說不清楚。", emotional: { activation: -0.6, warmth: -0.1, connection: -0.2, boundary: 0.3, clarity: -1.5, release: -0.8 } },
  { id: "mixed", label: "全部混在一起。", emotional: { activation: 0.7, warmth: 0.1, connection: 0, boundary: 0.2, clarity: -1.2, release: 0.2 } },
  { id: "ordinary", label: "普普通通，只是想餵你。", emotional: { activation: 0, warmth: 0.5, connection: 0.5, boundary: 0, clarity: 0.4, release: 0 } },
  { id: "precious", label: "很珍貴，希望你替我收好。", emotional: { activation: 0.2, warmth: 1.1, connection: 0.8, boundary: 0.4, clarity: 0.5, release: -0.3 } },
  { id: "angry_sad", label: "我有點生氣，但也有點委屈。", emotional: { activation: 1.4, warmth: -0.5, connection: -0.1, boundary: 0.9, clarity: -0.4, release: 0.6 } },
  { id: "closer", label: "我想靠近一點。", emotional: { activation: 0.3, warmth: 0.9, connection: 1.5, boundary: -0.6, clarity: 0.3, release: 0.1 } },
  { id: "alone", label: "我想自己待著。", emotional: { activation: -0.2, warmth: -0.1, connection: -1, boundary: 1.5, clarity: 0.5, release: 0.2 } },
  { id: "unknown", label: "我不知道這是什麼。", emotional: { activation: 0.1, warmth: 0, connection: 0.1, boundary: 0.2, clarity: -1.7, release: 0 } },
];
