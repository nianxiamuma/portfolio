/**
 * 抽奖机的「纸条」库。
 *
 * 版权取舍（重要，别随手加）：
 *  - 诗词 / 骈文 / 赋：中国古典，公有领域。
 *  - 俳句：芭蕉、一茶、芜村，公有领域；此处给中译（译文为本站自拟，非引用他人译本）。
 *  - 英文名句：只收公有领域的（莎士比亚、多恩、塞内加、德尔斐箴言一类）。
 *  - 电影台词：**现代作品，版权归片方**。只收广为流传的极短句，且必须带出处。
 *    这是「个人展示站的短句引用」，不是可以随意扩充的一类 —— 再加要慎重。
 *  - answer：答案之书式短句，本站原创，无版权问题，可以随便加。
 */

export const ORACLE_KINDS = {
  poem: { label: '诗', accent: '#edff66' },
  pianwen: { label: '骈文', accent: '#7c5cff' },
  haiku: { label: '俳句', accent: '#90e8d6' },
  movie: { label: '台词', accent: '#ff8fab' },
  english: { label: '名句', accent: '#4fb7dd' },
  answer: { label: '签', accent: '#ffe7b8' },
}

export const ORACLE_SLIPS = [
  /* ── 诗词（公有领域） ── */
  { id: 'poem-01', kind: 'poem', text: '行到水穷处，坐看云起时。', source: '王维《终南别业》' },
  { id: 'poem-02', kind: 'poem', text: '人生如逆旅，我亦是行人。', source: '苏轼《临江仙》' },
  { id: 'poem-03', kind: 'poem', text: '此心安处是吾乡。', source: '苏轼《定风波》' },
  { id: 'poem-04', kind: 'poem', text: '莫听穿林打叶声，何妨吟啸且徐行。', source: '苏轼《定风波》' },
  { id: 'poem-05', kind: 'poem', text: '山重水复疑无路，柳暗花明又一村。', source: '陆游《游山西村》' },
  { id: 'poem-06', kind: 'poem', text: '长风破浪会有时，直挂云帆济沧海。', source: '李白《行路难》' },
  { id: 'poem-07', kind: 'poem', text: '沉舟侧畔千帆过，病树前头万木春。', source: '刘禹锡《酬乐天扬州初逢席上见赠》' },
  { id: 'poem-08', kind: 'poem', text: '莫愁前路无知己，天下谁人不识君。', source: '高适《别董大》' },

  /* ── 骈文 / 赋（公有领域） ── */
  { id: 'pian-01', kind: 'pianwen', text: '落霞与孤鹜齐飞，秋水共长天一色。', source: '王勃《滕王阁序》' },
  { id: 'pian-02', kind: 'pianwen', text: '老当益壮，宁移白首之心；穷且益坚，不坠青云之志。', source: '王勃《滕王阁序》' },
  { id: 'pian-03', kind: 'pianwen', text: '翩若惊鸿，婉若游龙。', source: '曹植《洛神赋》' },
  { id: 'pian-04', kind: 'pianwen', text: '云无心以出岫，鸟倦飞而知还。', source: '陶渊明《归去来兮辞》' },
  { id: 'pian-05', kind: 'pianwen', text: '木欣欣以向荣，泉涓涓而始流。', source: '陶渊明《归去来兮辞》' },
  { id: 'pian-06', kind: 'pianwen', text: '清风徐来，水波不兴。', source: '苏轼《赤壁赋》' },
  { id: 'pian-07', kind: 'pianwen', text: '寄蜉蝣于天地，渺沧海之一粟。', source: '苏轼《赤壁赋》' },
  { id: 'pian-08', kind: 'pianwen', text: '知不可乎骤得，托遗响于悲风。', source: '苏轼《赤壁赋》' },

  /* ── 俳句（公有领域；中译为本站自拟） ── */
  { id: 'haiku-01', kind: 'haiku', text: '古池——青蛙跃入，水声。', source: '松尾芭蕉' },
  { id: 'haiku-02', kind: 'haiku', text: '静寂——蝉声渗入岩石。', source: '松尾芭蕉' },
  { id: 'haiku-03', kind: 'haiku', text: '夏草萋萋，武士们梦的遗迹。', source: '松尾芭蕉' },
  { id: 'haiku-04', kind: 'haiku', text: '秋深了，邻家是做什么的。', source: '松尾芭蕉' },
  { id: 'haiku-05', kind: 'haiku', text: '来和我玩吧，没爹娘的小麻雀。', source: '小林一茶' },
  { id: 'haiku-06', kind: 'haiku', text: '露水的世，虽然是露水的世，虽然是如此。', source: '小林一茶' },
  { id: 'haiku-07', kind: 'haiku', text: '油菜花田，月在东边，日在西边。', source: '与谢芜村' },
  { id: 'haiku-08', kind: 'haiku', text: '春之海，终日轻轻荡漾。', source: '与谢芜村' },

  /* ── 英文名句（只收公有领域） ── */
  { id: 'en-01', kind: 'english', text: 'To be, or not to be, that is the question.', source: 'Shakespeare, Hamlet' },
  { id: 'en-02', kind: 'english', text: 'We are such stuff as dreams are made on.', source: 'Shakespeare, The Tempest' },
  { id: 'en-03', kind: 'english', text: "What's past is prologue.", source: 'Shakespeare, The Tempest' },
  { id: 'en-04', kind: 'english', text: 'This above all: to thine own self be true.', source: 'Shakespeare, Hamlet' },
  { id: 'en-05', kind: 'english', text: 'No man is an island, entire of itself.', source: 'John Donne' },
  { id: 'en-06', kind: 'english', text: 'We suffer more often in imagination than in reality.', source: 'Seneca' },
  { id: 'en-07', kind: 'english', text: 'The unexamined life is not worth living.', source: 'Socrates（柏拉图《申辩篇》）' },
  { id: 'en-08', kind: 'english', text: 'Know thyself.', source: '德尔斐神庙箴言' },

  /* ── 电影台词（版权归片方；仅极短句引用，带出处） ── */
  { id: 'mv-01', kind: 'movie', text: '希望是件好事，也许是人间至善。', source: '《肖申克的救赎》' },
  { id: 'mv-02', kind: 'movie', text: '生活就像一盒巧克力，你永远不知道下一块是什么味道。', source: '《阿甘正传》' },
  { id: 'mv-03', kind: 'movie', text: '念念不忘，必有回响。', source: '《一代宗师》' },
  { id: 'mv-04', kind: 'movie', text: '世间所有的相遇，都是久别重逢。', source: '《一代宗师》' },
  { id: 'mv-05', kind: 'movie', text: '人生不能像做菜，把所有的料都准备好了才下锅。', source: '《饮食男女》' },
  { id: 'mv-06', kind: 'movie', text: 'Carpe diem. Seize the day, boys.', source: '《死亡诗社》' },
  { id: 'mv-07', kind: 'movie', text: 'May the Force be with you.', source: '《星球大战》' },
  { id: 'mv-08', kind: 'movie', text: '我们一路奋战，不是为了改变世界，而是为了不让世界改变我们。', source: '《熔炉》' },

  /* ── 答案之书式（本站原创，可随便加） ── */
  { id: 'ans-01', kind: 'answer', text: '去把那件拖了很久的小事做完。', source: '答案之书' },
  { id: 'ans-02', kind: 'answer', text: '今天别做决定，先去睡一觉。', source: '答案之书' },
  { id: 'ans-03', kind: 'answer', text: '给一个人发消息，不必先想好开场白。', source: '答案之书' },
  { id: 'ans-04', kind: 'answer', text: '把手机放下十分钟，看看窗外。', source: '答案之书' },
  { id: 'ans-05', kind: 'answer', text: '去做那件让你有点紧张的事。', source: '答案之书' },
  { id: 'ans-06', kind: 'answer', text: '把没写完的东西写完，哪怕很难看。', source: '答案之书' },
  { id: 'ans-07', kind: 'answer', text: '出门走一走，走到你觉得够了为止。', source: '答案之书' },
  { id: 'ans-08', kind: 'answer', text: '今天适合整理，不适合开始。', source: '答案之书' },
  { id: 'ans-09', kind: 'answer', text: '先吃点东西，再想这件事。', source: '答案之书' },
  { id: 'ans-10', kind: 'answer', text: '把那本书翻到最后一页。', source: '答案之书' },
  { id: 'ans-11', kind: 'answer', text: '给很久没联系的人打个电话。', source: '答案之书' },
  { id: 'ans-12', kind: 'answer', text: '把那句话说出口，就今天。', source: '答案之书' },
]

/**
 * 抽奖机的壁纸池（public/wallpapers/oracle/ 下的文件名）。
 *
 * 来源：wallhaven 的 anime 分类、SFW、≥1920×1080、16:9、单张 ≤2.2MB。
 * ⚠ 版权：wallhaven 只是索引站，**版权仍归原作者**（多来自 pixiv / X / ArtStation）。
 *   个人展示站风险较低，但不是「授权干净」—— 商用或大规模再分发要另想办法。
 * 换图：把文件丢进 public/wallpapers/oracle/ 并把文件名加到这里即可，代码不用动。
 */
export const ORACLE_WALLPAPERS = [
  'wallhaven-216o5y.png',
  'wallhaven-3zmr6y.jpg',
  'wallhaven-4dk13n.jpg',
  'wallhaven-5d1m61.png',
  'wallhaven-72drx3.jpg',
  'wallhaven-72pgxv.jpg',
  'wallhaven-72r8ry.jpg',
  'wallhaven-8o3m71.jpg',
  'wallhaven-8o77d1.jpg',
  'wallhaven-dp7gkm.png',
  'wallhaven-g8g6re.png',
  'wallhaven-gp7mq3.jpg',
  'wallhaven-gpjyvl.png',
  'wallhaven-j3mk8y.jpg',
  'wallhaven-jx5p65.jpg',
  'wallhaven-k7jd2q.jpg',
  'wallhaven-kxwp96.jpg',
  'wallhaven-lygy6l.jpg',
  'wallhaven-lygyw2.png',
  'wallhaven-m9j35y.jpg',
  'wallhaven-mdmz51.jpg',
  'wallhaven-mprye8.jpg',
  'wallhaven-nr1jj0.png',
  'wallhaven-o333pp.jpg',
  'wallhaven-o35p7p.jpg',
  'wallhaven-p26eq9.jpg',
  'wallhaven-q67z9d.jpg',
  'wallhaven-r29w2m.jpg',
  'wallhaven-vg3k1m.jpg',
  'wallhaven-vg7vk8.jpg',
  'wallhaven-vp2qv3.png',
  'wallhaven-weee76.jpg',
  'wallhaven-x6p3y3.jpg',
  'wallhaven-x8gkvz.jpg',
  'wallhaven-xek7ld.png',
  'wallhaven-ym181g.jpg',
  'wallhaven-ymwj9d.jpg',
  'wallhaven-yqkl97.jpg',
  'wallhaven-yqkqeg.png',
  'wallhaven-yqmlmx.png',
  'wallhaven-yx5kml.jpg',
  'wallhaven-zmmkkv.png',
]
