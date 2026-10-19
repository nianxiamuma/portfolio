import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像：夜晚暖光人像（C336A878...png 的居中裁方副本，2026-10-20）。
	// 放在 src 目录下，由 Astro 自动优化成多尺寸 webp。
	avatar: "assets/images/avatar.jpg",

	// 名字
	name: "年下牧马",

	// 个人签名（与主站 tagline 同一句）
	bio: "把喜欢的东西，留在手边。",

	// 链接配置
	// 已经预装的图标集：fa7-brands，fa7-regular，fa7-solid，material-symbols，simple-icons
	// 访问 https://icones.js.org/ 获取图标代码
	// showName: true 时显示图标和名称，false 时只显示图标
	// 注意：本地路径写不带 base 的形式（如 "/rss.xml"），由 Profile.astro 渲染时过 url() 加 /<repo>/blog 前缀。
	// 不要在本文件调用 url()：本模块也会被 Node 侧的 tsx 脚本加载，那里没有 import.meta.env
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/nianxiamuma",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:807273679@qq.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss.xml",
			showName: false,
		},
		{
			name: "Atom",
			icon: "fa7-solid:atom",
			url: "/atom.xml",
			showName: false,
		},
	],
};
