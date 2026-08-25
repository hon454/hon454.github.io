export const POST_CATEGORY_NAMES = [
	"언리얼 엔진",
	"C++",
	"개발 도구",
	"개발 인프라",
	"블로그",
	"커리어",
	"개발 이야기",
] as const;

export type PostCategoryName = (typeof POST_CATEGORY_NAMES)[number];

export type PostCategoryDefinition = {
	readonly name: PostCategoryName;
	readonly slug: string;
	readonly aliases: readonly string[];
};

export const POST_CATEGORIES: readonly PostCategoryDefinition[] = [
	{
		name: "언리얼 엔진",
		slug: "unreal-engine",
		aliases: ["Unreal Engine"],
	},
	{ name: "C++", slug: "cpp", aliases: [] },
	{ name: "개발 도구", slug: "development-tools", aliases: [] },
	{ name: "개발 인프라", slug: "devops", aliases: ["DevOps"] },
	{ name: "블로그", slug: "blog", aliases: [] },
	{ name: "커리어", slug: "career", aliases: [] },
	{ name: "개발 이야기", slug: "development-stories", aliases: [] },
];

export function normalizeCategoryToken(value: string): string {
	return value.trim().toLocaleLowerCase("en-US");
}

export const POST_CATEGORY_NAME_BY_TOKEN: Readonly<
	Record<string, PostCategoryName>
> = Object.freeze(
	Object.fromEntries(
		POST_CATEGORIES.flatMap(({ name, slug, aliases }) =>
			[name, slug, ...aliases].map((token) => [
				normalizeCategoryToken(token),
				name,
			]),
		),
	) as Record<string, PostCategoryName>,
);

export const POST_CATEGORY_SLUG_BY_NAME: Readonly<
	Record<PostCategoryName, string>
> = Object.freeze(
	Object.fromEntries(
		POST_CATEGORIES.map(({ name, slug }) => [name, slug]),
	) as Record<PostCategoryName, string>,
);

export function resolvePostCategory(
	value: string | null | undefined,
): PostCategoryName | null {
	if (!value) return null;
	return POST_CATEGORY_NAME_BY_TOKEN[normalizeCategoryToken(value)] ?? null;
}

export function isPostCategoryName(value: string): value is PostCategoryName {
	return POST_CATEGORY_NAMES.includes(value as PostCategoryName);
}

export function getPostCategorySlug(
	value: string | null | undefined,
): string | null {
	const category = resolvePostCategory(value);
	return category ? POST_CATEGORY_SLUG_BY_NAME[category] : null;
}
