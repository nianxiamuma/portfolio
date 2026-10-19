import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	// 2026-10-20：全用本地曲库（用户下载的 19 首 + 自带 1 首）。
	// 在线歌单解析在无登录态下大半曲目播不出来，体验差，故不再默认走 meting。
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	// 2026-10-20：默认随机（你要的是歌单里随机播放）
	playMode: "random",

	// 是否显启用歌词
	showLyrics: false,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		// 2026-10-20：换成「博客背景音乐」歌单（10 首纯音乐）
		id: "2374411071",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			// 自带曲（保留）
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			// 2026-10-20：D:\music\轻音乐 19 首（用户下载的网易云歌单曲目，LOCAL 来源即插即用）
			
			  {
			    "name": "直到清晨黄昏",
			    "artist": "Adoreya",
			    "url": "/assets/music/local/Adoreya%20-%20%E7%9B%B4%E5%88%B0%E6%B8%85%E6%99%A8%E9%BB%84%E6%98%8F.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "いい日だったね。 (1)",
			    "artist": "DEPAPEPE",
			    "url": "/assets/music/local/DEPAPEPE%20-%20%E3%81%84%E3%81%84%E6%97%A5%E3%81%A0%E3%81%A3%E3%81%9F%E3%81%AD%E3%80%82%20%281%29.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "いい日だったね。",
			    "artist": "DEPAPEPE",
			    "url": "/assets/music/local/DEPAPEPE%20-%20%E3%81%84%E3%81%84%E6%97%A5%E3%81%A0%E3%81%A3%E3%81%9F%E3%81%AD%E3%80%82.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Represent feat. Kimbara Chieko",
			    "artist": "DJ OKAWARI",
			    "url": "/assets/music/local/DJ%20OKAWARI%20-%20Represent%20feat.%20Kimbara%20Chieko.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Past Lives",
			    "artist": "Jasper,Martin Arteta,1111 Music Group",
			    "url": "/assets/music/local/Jasper%2CMartin%20Arteta%2C1111%20Music%20Group%20-%20Past%20Lives.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "The truth that you leave",
			    "artist": "Pianoboy高至豪",
			    "url": "/assets/music/local/Pianoboy%E9%AB%98%E8%87%B3%E8%B1%AA%20-%20The%C2%A0truth%C2%A0that%C2%A0you%C2%A0leave.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "ãFREEãlucky",
			    "artist": "Salder4cash",
			    "url": "/assets/music/local/Salder4cash%20-%20%C3%A3FREE%C3%A3lucky.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Liekkas",
			    "artist": "Sofia Jannok",
			    "url": "/assets/music/local/Sofia%20Jannok%20-%20Liekkas.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "修炼森林",
			    "artist": "StudioEIM",
			    "url": "/assets/music/local/StudioEIM%20-%20%E4%BF%AE%E7%82%BC%E6%A3%AE%E6%9E%97.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "What A Difference A Day Made",
			    "artist": "Timbo Mehrstein Gypsy Jazz Ensemble",
			    "url": "/assets/music/local/Timbo%20Mehrstein%20Gypsy%20Jazz%20Ensemble%20-%20What%20A%20Difference%20A%20Day%20Made.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "《从你的全世界路过》插曲扒带",
			    "artist": "ULY",
			    "url": "/assets/music/local/ULY%20-%20%E3%80%8A%E4%BB%8E%E4%BD%A0%E7%9A%84%E5%85%A8%E4%B8%96%E7%95%8C%E8%B7%AF%E8%BF%87%E3%80%8B%E6%8F%92%E6%9B%B2%E6%89%92%E5%B8%A6.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "A Little Story",
			    "artist": "Valentin",
			    "url": "/assets/music/local/Valentin%20-%20A%20Little%20Story.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "ÇÉuÉÉ¹ÊuÇ uÉ Æuá´ÊÉÉ¯ (combination lock & Êpoqou)",
			    "artist": "Êpoqou",
			    "url": "/assets/music/local/%C3%8Apoqou%20-%20%C3%87%C3%89u%C3%89%C3%89%C2%B9%C3%8Au%C3%87%20u%C3%89%20%C3%86u%C3%A1%C2%B4%C3%8A%C3%89%C3%89%C2%AF%20%28combination%20lock%20%26%20%C3%8Apoqou%29.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Summer",
			    "artist": "久石譲",
			    "url": "/assets/music/local/%E4%B9%85%E7%9F%B3%E8%AD%B2%20-%20Summer.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "小心",
			    "artist": "佳佳佳_zZ",
			    "url": "/assets/music/local/%E4%BD%B3%E4%BD%B3%E4%BD%B3_zZ%20-%20%E5%B0%8F%E5%BF%83.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Night Cruising",
			    "artist": "牛尾憲輔",
			    "url": "/assets/music/local/%E7%89%9B%E5%B0%BE%E6%86%B2%E8%BC%94%20-%20Night%20Cruising.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "梦中的婚礼",
			    "artist": "群星",
			    "url": "/assets/music/local/%E7%BE%A4%E6%98%9F%20-%20%E6%A2%A6%E4%B8%AD%E7%9A%84%E5%A9%9A%E7%A4%BC.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "诀别书",
			    "artist": "邓垚",
			    "url": "/assets/music/local/%E9%82%93%E5%9E%9A%20-%20%E8%AF%80%E5%88%AB%E4%B9%A6.mp3",
			    "cover": "",
			    "lrc": ""
			  },
			  {
			    "name": "Refrain",
			    "artist": "阿南亮子",
			    "url": "/assets/music/local/%E9%98%BF%E5%8D%97%E4%BA%AE%E5%AD%90%20-%20Refrain.mp3",
			    "cover": "",
			    "lrc": ""
			  }
			
		],
	},
};
