import type { CareIntent } from "../types";

export const careIntents: CareIntent[] = [
  { id: "together", label: "陪我一起吃掉。", vector: { closeness: 1.5, silence: 0, preservation: 0, digestion: 0.8, release: 0.4, ritual: 0.2 } },
  { id: "keep", label: "替我收起來。", vector: { closeness: 0.5, silence: 0.4, preservation: 1.8, digestion: 0.1, release: -0.2, ritual: 0.8 } },
  { id: "digest", label: "幫我消化一點。", vector: { closeness: 0.6, silence: 0.1, preservation: 0.1, digestion: 1.9, release: 0.8, ritual: 0.2 } },
  { id: "quiet", label: "不要問，只要收下。", vector: { closeness: -0.1, silence: 1.8, preservation: 0.8, digestion: 0.4, release: 0, ritual: 0.2 } },
  { id: "overnight", label: "讓它在這裡待一晚。", vector: { closeness: 0.2, silence: 0.6, preservation: 1.2, digestion: 0.2, release: -0.1, ritual: 1.4 } },
  { id: "nothing", label: "今天不用做什麼。", vector: { closeness: 0, silence: 1, preservation: 0.2, digestion: 0.1, release: 1.3, ritual: 0 } },
];
