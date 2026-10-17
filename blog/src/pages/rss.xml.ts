import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { formatDateI18nWithTime } from "@utils/date-utils";
import { renderFeedEntries } from "@utils/feed-utils";
import type { APIContext } from "astro";
import { siteConfig } from "@/config";
import pkg from "../../package.json";

export const prerender = true;

export async function GET(context: APIContext): Promise<Response> {
	const includeContent = (siteConfig.feed?.contentMode ?? "full") === "full";
	const blog = await getSortedPosts();
	const entries = await renderFeedEntries(blog, { includeContent });
	// RSS 的 channel link 必须是博客首页的完整地址。
	// context.site 只是 origin（siteConfig.site_url = https://nianxiamuma.github.io），
	// 不含 blog 子路径 —— 直接拼出来会变成主站首页，订阅者点进去找不到文章。
	// 兜底值同理：原值是模板作者的演示站 https://firefly.cuteleaf.cn。
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	const feedSite = context.site
		? new URL(`${base}/`, context.site).toString()
		: "https://nianxiamuma.github.io/portfolio/blog/";
	const feedItems: RSSFeedItem[] = entries.map((entry) => ({
		title: entry.title,
		pubDate: entry.published,
		description: entry.description,
		link: entry.link,
		...(includeContent ? { content: entry.content } : {}),
	}));
	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: feedSite,
		customData: `<templateTheme>Firefly</templateTheme>
		<templateThemeVersion>${pkg.version}</templateThemeVersion>
		<templateThemeUrl>https://github.com/CuteLeaf/Firefly</templateThemeUrl>
		<lastBuildDate>${formatDateI18nWithTime(new Date())}</lastBuildDate>`,
		items: feedItems,
	});
}
