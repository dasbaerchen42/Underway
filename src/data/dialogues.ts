import type { DialogueEntry } from "../types";

// 台詞原則(依規格 §25.4):短句、含蓄、不替玩家定義情緒、
// 行動描述多於安慰語、不責備、不說教。
// 可用變數：{creatureName}、{foodName}。

export const dialogueEntries: DialogueEntry[] = [
  // ── 初次收到這種食物 ──────────────────────────────
  { id: "first-1", intent: "first_food", line: "牠繞著{foodName}轉了半圈，先聞霧的那一側。" },
  { id: "first-2", intent: "first_food", line: "這是牠第一次收到{foodName}。牠決定先含著，不急著判斷。" },
  { id: "first-3", intent: "first_food", line: "牠把{foodName}舉到光下看了很久，像在讀一封新的信。" },
  { id: "first-4", intent: "first_food", line: "陌生的味道。牠的核心亮了一下，又慢慢調暗。" },
  { id: "first-5", intent: "first_food", line: "牠小心地碰了碰{foodName}的邊緣，然後才張開身體。" },
  { id: "first-6", intent: "first_food", line: "第一口很小。第二口停了很久。" },
  { id: "first-7", intent: "first_food", line: "牠把這個新味道放在身體最軟的地方滾了一圈，沒有說好或不好。" },

  // ── 熟悉的食物 ────────────────────────────────────
  { id: "familiar-1", intent: "familiar_food", line: "是熟悉的{foodName}。牠幾乎是用整個身體迎上去的。" },
  { id: "familiar-2", intent: "familiar_food", line: "牠認得這個味道，連消化的節奏都是現成的。" },
  { id: "familiar-3", intent: "familiar_food", line: "{foodName}一放下，牠就挪到了老位置。" },
  { id: "familiar-4", intent: "familiar_food", line: "牠熟練地把{foodName}分成慣常的大小，一小份留在最後。" },
  { id: "familiar-5", intent: "familiar_food", line: "這次牠沒有猶豫。有些味道已經是生活的一部分。" },
  { id: "familiar-6", intent: "familiar_food", line: "牠先做了一個小小的、像是點頭的動作，然後開始吃。" },
  { id: "familiar-7", intent: "familiar_food", line: "老朋友一樣的味道。牠吃得很慢，不是因為陌生。" },

  // ── 食物意義改變 ──────────────────────────────────
  { id: "shift-1", intent: "meaning_shift", line: "牠停了一下。這個味道，今天好像放在不同的位置。" },
  { id: "shift-2", intent: "meaning_shift", line: "同樣的{foodName}，牠這次換了一個方向靠近。" },
  { id: "shift-3", intent: "meaning_shift", line: "牠歪著身體，像是在核對記憶裡的另一個版本。" },
  { id: "shift-4", intent: "meaning_shift", line: "這次的{foodName}和牠記得的不太一樣。牠決定兩種都留著。" },
  { id: "shift-5", intent: "meaning_shift", line: "牠把這一份放在舊的旁邊，沒有合併。" },
  { id: "shift-6", intent: "meaning_shift", line: "熟悉的外皮，陌生的重量。牠多花了一點時間。" },

  // ── 玩家沉默/不要問 ──────────────────────────────
  { id: "silence-1", intent: "silence", line: "牠收下了，沒有追問。" },
  { id: "silence-2", intent: "silence", line: "牠什麼都沒問，只把身體往食物那邊傾了一點。" },
  { id: "silence-3", intent: "silence", line: "箱庭很安靜。牠把安靜也當成了一部分收好。" },
  { id: "silence-4", intent: "silence", line: "牠用薄薄的膜把那份東西輕輕蓋住，像蓋住一句沒說完的話。" },
  { id: "silence-5", intent: "silence", line: "沒有對話。只有牠消化時，霧裡細小的聲音。" },
  { id: "silence-6", intent: "silence", line: "牠把它放進身體裡比較深、比較不吵的地方。" },
  { id: "silence-7", intent: "silence", line: "牠看了你一眼，然後決定今天不看太久。" },

  // ── 感受強烈 ──────────────────────────────────────
  { id: "intense-1", intent: "intense", line: "牠接住的時候晃了一下，那份重量是真的。" },
  { id: "intense-2", intent: "intense", line: "核心的光亂了幾拍，牠用呼吸把它慢慢排回去。" },
  { id: "intense-3", intent: "intense", line: "牠沒有退開。牠把那股燙意攤平在身體最寬的地方。" },
  { id: "intense-4", intent: "intense", line: "太滿的東西，牠分成很多次小口吞。" },
  { id: "intense-5", intent: "intense", line: "牠的表面起了細小的波紋，過了一會兒才平。" },
  { id: "intense-6", intent: "intense", line: "牠先把它放在地上，陪它一起降溫。" },
  { id: "intense-7", intent: "intense", line: "牠把觸手收攏，用最穩的姿勢接下這一份。" },

  // ── 平靜日常 ──────────────────────────────────────
  { id: "calm-1", intent: "calm_daily", line: "普通的一天，普通的一餐。牠看起來滿意。" },
  { id: "calm-2", intent: "calm_daily", line: "牠慢慢地吃完，然後在原地多待了一會兒。" },
  { id: "calm-3", intent: "calm_daily", line: "沒有特別的事發生。這樣也很好。" },
  { id: "calm-4", intent: "calm_daily", line: "牠一邊吃，一邊看著霧從玻璃外流過去。" },
  { id: "calm-5", intent: "calm_daily", line: "吃完後，牠把地上的碎屑排成一條短短的線。" },
  { id: "calm-6", intent: "calm_daily", line: "牠打了一個很小的、像泡泡一樣的嗝。" },
  { id: "calm-7", intent: "calm_daily", line: "箱庭的光移動了一格，牠也跟著挪了一格。" },
  { id: "calm-8", intent: "calm_daily", line: "牠吃到一半停下來，發了一會兒呆，又繼續。" },

  // ── 想保存 ────────────────────────────────────────
  { id: "preserve-1", intent: "preserve", line: "牠沒有吃。牠把它包進一層薄薄的膜，收了起來。" },
  { id: "preserve-2", intent: "preserve", line: "牠選了櫃子最裡面的位置，放得很正。" },
  { id: "preserve-3", intent: "preserve", line: "牠替它留了一個乾燥、安靜的角落。" },
  { id: "preserve-4", intent: "preserve", line: "牠用觸手把它捲好，動作比平常慢一半。" },
  { id: "preserve-5", intent: "preserve", line: "這份會被留下來。牠對這種事一向認真。" },
  { id: "preserve-6", intent: "preserve", line: "牠把它和之前收著的那些放在一起，數了一遍。" },
  { id: "preserve-7", intent: "preserve", line: "放好之後，牠退後一步看了看，又向前調整了一點。" },

  // ── 想放下/消化 ──────────────────────────────────
  { id: "release-1", intent: "release", line: "牠把它整個吃掉了，連影子都沒有留下。" },
  { id: "release-2", intent: "release", line: "消化的波紋一圈一圈散開，然後歸零。" },
  { id: "release-3", intent: "release", line: "牠吃得很乾脆，像替你做完一個決定。" },
  { id: "release-4", intent: "release", line: "吃完後，牠往霧的方向吐了一口很輕的氣。" },
  { id: "release-5", intent: "release", line: "那份重量進到牠身體裡，變成一點點暖，然後散掉。" },
  { id: "release-6", intent: "release", line: "牠把最後一小塊拋起來接住，結束了這件事。" },
  { id: "release-7", intent: "release", line: "牠拍了拍身體，示意這裡已經處理好了。" },

  // ── 想靠近 ────────────────────────────────────────
  { id: "close-1", intent: "closeness", line: "牠把食物往你的方向推了一半，才想起來你吃不到。" },
  { id: "close-2", intent: "closeness", line: "牠貼著玻璃最靠近你的那一側吃完了。" },
  { id: "close-3", intent: "closeness", line: "吃到一半，牠伸出一段觸手，在你停留過的地方碰了一下。" },
  { id: "close-4", intent: "closeness", line: "牠吃得很近，近到你能看見核心裡細小的光。" },
  { id: "close-5", intent: "closeness", line: "牠把身體攤得比平常開，沒有防備。" },
  { id: "close-6", intent: "closeness", line: "牠一邊吃一邊看你，眼點的光是軟的。" },
  { id: "close-7", intent: "closeness", line: "吃完後，牠沒有走開，就在原地陪著。" },

  // ── 想獨處 ────────────────────────────────────────
  { id: "alone-1", intent: "solitude", line: "牠把食物拖到角落，背對著箱庭吃完了。" },
  { id: "alone-2", intent: "solitude", line: "牠替自己拉了一小片霧當簾子。" },
  { id: "alone-3", intent: "solitude", line: "牠退到石頭後面，只露出一點邊緣。" },
  { id: "alone-4", intent: "solitude", line: "牠慢慢吃著，和所有東西都保持一段剛好的距離。" },
  { id: "alone-5", intent: "solitude", line: "今天牠想離一切遠一點。食物，牠收下了。" },
  { id: "alone-6", intent: "solitude", line: "牠把身體縮小了一號，在自己的影子裡進食。" },
  { id: "alone-7", intent: "solitude", line: "箱庭另一頭傳來很小的咀嚼聲。牠在那裡，這樣就夠了。" },

  // ── 久別回來 ──────────────────────────────────────
  { id: "absence-1", intent: "long_absence", line: "牠從睡墊那邊慢慢滑過來，動作像剛醒。" },
  { id: "absence-2", intent: "long_absence", line: "牠看了你一會兒，然後把這段日子折起來，先吃飯。" },
  { id: "absence-3", intent: "long_absence", line: "箱庭裡多了一些牠自己過日子的痕跡。牠沒有解釋。" },
  { id: "absence-4", intent: "long_absence", line: "牠接過食物，姿勢和記憶裡的一樣。" },
  { id: "absence-5", intent: "long_absence", line: "牠沒有問你去了哪裡。牠把位置往旁邊挪了挪。" },
  { id: "absence-6", intent: "long_absence", line: "隔了一段時間再看，牠好像又長出了一點新的習慣。" },
  { id: "absence-7", intent: "long_absence", line: "牠把食物放在中間，像在說：從這裡繼續就可以。" },

  // ── 外觀發生變化 ──────────────────────────────────
  { id: "change-1", intent: "appearance_change", line: "吃完之後，牠身上有個地方，和剛才不一樣了。" },
  { id: "change-2", intent: "appearance_change", line: "新長出來的那個部分還很小，牠自己也在研究。" },
  { id: "change-3", intent: "appearance_change", line: "牠轉了一圈，讓光從新的角度穿過身體。" },
  { id: "change-4", intent: "appearance_change", line: "有什麼東西在牠的輪廓上安靜地定了下來。" },
  { id: "change-5", intent: "appearance_change", line: "牠碰了碰自己身上新的地方，又假裝沒事。" },
  { id: "change-6", intent: "appearance_change", line: "這次消化在牠身上留下了看得見的痕跡。" },
  { id: "change-7", intent: "appearance_change", line: "牠對著玻璃上自己的倒影，停了很久。" },

  // ── 不理解但願意收下 ──────────────────────────────
  { id: "confused-1", intent: "confused_accept", line: "牠不太確定這是什麼，但還是張開了身體。" },
  { id: "confused-2", intent: "confused_accept", line: "牠把它翻過來、又翻回去，最後決定一起收下。" },
  { id: "confused-3", intent: "confused_accept", line: "說不清楚的東西，牠就用不說清楚的方式消化。" },
  { id: "confused-4", intent: "confused_accept", line: "牠的核心閃了幾下，像在猜，然後放棄了猜。" },
  { id: "confused-5", intent: "confused_accept", line: "牠沒有懂。牠把不懂的部分也一起吃了。" },
  { id: "confused-6", intent: "confused_accept", line: "牠等了一下，看那份東西會不會自己說明。它沒有。牠聳了聳身體。" },
  { id: "confused-7", intent: "confused_accept", line: "形狀模糊的東西，牠咬下去之前先抱了一下。" },

  // ── 短時間重複餵食 ────────────────────────────────
  { id: "repeat-1", intent: "repeat_feeding", line: "又是這一份。牠把它和前面幾份排在一起。" },
  { id: "repeat-2", intent: "repeat_feeding", line: "牠這次吃得更慢，像在拉長同一句話。" },
  { id: "repeat-3", intent: "repeat_feeding", line: "牠把它疊在剛才那份旁邊，打算晚一點再吃。" },
  { id: "repeat-4", intent: "repeat_feeding", line: "同樣的味道來了好幾次，牠開始替它們排隊。" },
  { id: "repeat-5", intent: "repeat_feeding", line: "牠先收下，然後把其中一份挪到「留到晚上」的位置。" },
  { id: "repeat-6", intent: "repeat_feeding", line: "牠不急了。反正這個味道，今天還會再來。" },
  { id: "repeat-7", intent: "repeat_feeding", line: "牠把重複的那幾份捲起來，墊在身體下面，像一層軟軟的墊子。" },
];
