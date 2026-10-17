import type { CommentConfig } from "../types/commentConfig";

export const commentConfig: CommentConfig = {
	// 评论系统类型: none, twikoo, waline, giscus, disqus, artalk，默认为none，即不启用评论系统
	//
	// 现状（2026-10-18）：none —— 本站还没有评论后端，留言板页面开关也一并关了。
	// 下面各家的地址已清空：上游模板留的是模板作者/官方 demo 的端点
	// （twikoo.vercel.app、waline.vercel.app、artalk.example.com、disqus shortname "firefly"），
	// type 一旦从 none 改掉，评论就会静默写进别人的服务里。接自己的后端时再逐项填。
	type: "none",

	//twikoo评论系统配置
	twikoo: {
		envId: "",
		// 设置 Twikoo 评论系统语言
		lang: "zh-CN",
		// 是否启用文章访问量统计功能
		visitorCount: true,
		// Twikoo JS 文件地址，支持 CDN 链接
		// 中国推荐1: https://registry.npmmirror.com/twikoo/1.7.14/files/dist/twikoo.min.js
		// 中国推荐2: https://s4.zstatic.net/npm/twikoo@1.7.14/dist/twikoo.min.js
		// 国际推荐: https://cdn.jsdelivr.net/npm/twikoo@1.7.14/dist/twikoo.min.js
		jsUrl: "https://cdn.jsdelivr.net/npm/twikoo@1.7.14/dist/twikoo.min.js",
		// Twikoo 自定义 CSS 文件地址，为空则不加载
		cssUrl: "/assets/css/twikoo-custom.css",
	},

	//waline评论系统配置
	waline: {
		// waline 后端服务地址
		serverURL: "",
		// 设置 Waline 评论系统语言
		lang: "zh-CN",
		// 设置 Waline 评论系统表情地址
		emoji: [
			"https://unpkg.com/@waline/emojis@1.4.0/weibo",
			"https://unpkg.com/@waline/emojis@1.4.0/bilibili",
			"https://unpkg.com/@waline/emojis@1.4.0/bmoji",
		],
		// 评论登录模式。可选值如下：
		//   'enable'   —— 默认，允许访客匿名评论和用第三方 OAuth 登录评论，兼容性最佳。
		//   'force'    —— 强制必须登录后才能评论，适合严格社区，关闭匿名评论。
		//   'disable'  —— 禁止所有登录和 OAuth，仅允许匿名评论（填写昵称/邮箱），适用于极简留言。
		login: "enable",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},

	// artalk评论系统配置
	artalk: {
		// artalk后端程序 API 地址
		server: "",
		// 设置 Artalk 语言
		locale: "zh-CN",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},

	//giscus评论系统配置
	giscus: {
		// 设置 Giscus 评论系统仓库
		// 必须是自己的仓库：在 https://giscus.app 用 GitHub 账号给该仓库安装 giscus App 并开启 Discussions，
		// 再从 giscus.app 生成下面四项。上游模板的 CuteLeaf/Firefly 值已清空 ——
		// 留着会让本站的评论写进模板作者的仓库。
		repo: "",
		// 设置 Giscus 评论系统仓库ID
		repoId: "",
		// 设置 Giscus 评论系统分类
		category: "",
		// 获取 Giscus 评论系统分类ID
		categoryId: "",
		// 获取 Giscus 评论系统映射方式
		mapping: "title",
		// 获取 Giscus 评论系统严格模式
		strict: "0",
		// 获取 Giscus 评论系统反应功能
		reactionsEnabled: "1",
		// 获取 Giscus 评论系统元数据功能
		emitMetadata: "1",
		// 获取 Giscus 评论系统输入位置
		inputPosition: "top",
		// 获取 Giscus 评论系统语言
		lang: "zh-CN",
		// 获取 Giscus 评论系统加载方式
		loading: "lazy",
	},

	//disqus评论系统配置
	disqus: {
		// 获取 Disqus 评论系统
		shortname: "",
	},
};
