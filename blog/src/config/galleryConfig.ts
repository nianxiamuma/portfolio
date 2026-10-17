import type { GalleryConfig } from "@/types/galleryConfig";

/**
 * 相册配置。
 *
 * 现状（2026-10-18）：albums 为空 —— 上游模板自带两个示例相册
 * （firefly-2026「可爱流萤」9 张、encrypted-test「加密相册示例」密码 123456）
 * 已经连同 public/gallery/ 下的图片一起移除，避免线上挂着别人的图。
 *
 * 加相册的方式：
 * 1. 在 blog/public/gallery/<相册id>/ 放图片（可选 cover.* 作为封面）
 * 2. 在下面 albums 数组里加一项，id 与目录名一致
 */
export const galleryConfig: GalleryConfig = {
	// 相册列表
	albums: [
		// 示例（填好图片后取消注释并改成自己的）：
		// {
		// 	id: "life-2026",
		// 	name: "日常",
		// 	description: "随手拍的。",
		// 	location: "本地",
		// 	date: "2026-10-18",
		// 	tags: ["日常"],
		// },
	],

	// 瀑布流最小列宽(px)，浏览器根据容器宽度自动计算列数，默认 240
	// 值越小列数越多，值越大列数越少
	columnWidth: 240,
};
