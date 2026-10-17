import type { SponsorConfig } from "../types/sponsorConfig";

/**
 * 打赏配置。
 *
 * 现状（2026-10-18）：四种打赏方式全部 enabled: false —— 上游 Firefly 模板自带的
 * 支付宝/微信收款码图片是模板作者（CuteLeaf）的，ko-fi/爱发电链接也指向该作者，
 * 直接把「换成我的」做成了假动作：页面长得像能收钱，扫出来是别人。
 *
 * 恢复方式：
 * 1. 把自己的收款码放到 blog/public/assets/images/sponsor/（替换后把对应项 enabled 改 true）
 * 2. 有 ko-fi / 爱发电账号时，填入自己的 link 再把 enabled 改 true
 * 3. 收到打赏后在 sponsors 里追加记录，并把 showSponsorsList 改回 true
 */
export const sponsorConfig: SponsorConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 打赏用途说明
	usage: "如果这里的东西对你有用，欢迎请我喝一杯。",

	// 是否显示打赏者列表
	showSponsorsList: false,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: false,

	// 是否在文章详情页底部显示打赏按钮
	// 没有任何可用打赏方式时保持 false，避免点进去是空页
	showButtonInPost: false,

	// 打赏方式列表
	methods: [
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",
			// 收款码图片路径（需要放在 public 目录下）
			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "使用 支付宝 扫码打赏",
			// 待换成自己的收款码后再开
			enabled: false,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "使用 微信 扫码打赏",
			// 待换成自己的收款码后再开
			enabled: false,
		},
		{
			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "",
			description: "Buy a Coffee",
			enabled: false,
		},
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "",
			description: "通过 爱发电 进行打赏",
			enabled: false,
		},
	],

	// 打赏者列表（可选）
	sponsors: [],
};
