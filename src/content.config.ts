import { defineCollection } from "astro:content";
import type { CollectionConfig } from "astro/content/config";
import { glob } from "astro/loaders";
import { type ZodType, z } from "astro/zod";
import {
	getPostCategorySlug,
	isPostCategoryName,
	POST_CATEGORY_NAMES,
} from "./constants/post-categories";

type PostData = {
	title: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	image: string;
	tags: string[];
	category: string | null;
	lang: string;
	pinned: boolean;
	author: string;
	sourceLink: string;
	licenseName: string;
	licenseUrl: string;
	comment: boolean;
	password: string;
	passwordHint: string;
	prevTitle: string;
	prevSlug: string;
	nextTitle: string;
	nextSlug: string;
};

type DynamicData = {
	published: Date;
	pinned: boolean;
	location: string;
};

type ContentCollection<T> = CollectionConfig<
	ZodType<T>,
	ReturnType<typeof glob>
>;

const postTagSchema = z
	.string()
	.trim()
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tags must use lowercase kebab-case");

const postTagsSchema = z
	.array(postTagSchema)
	.max(5, "Use at most five focused tags per post")
	.refine((tags) => new Set(tags).size === tags.length, {
		message: "Tags must be unique within a post",
	});

const postCategorySchema = z
	.string()
	.trim()
	.refine(
		(category) => category === "" || isPostCategoryName(category),
		`Category must be one of: ${POST_CATEGORY_NAMES.join(", ")}`,
	);

const postsCollection: ContentCollection<PostData> = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z
		.object({
			title: z.string(),
			published: z.date(),
			updated: z.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			tags: postTagsSchema.optional().default([]),
			category: postCategorySchema.optional().nullable().default(""),
			lang: z.string().optional().default(""),
			pinned: z.boolean().optional().default(false),
			author: z.string().optional().default(""),
			sourceLink: z.string().optional().default(""),
			licenseName: z.string().optional().default(""),
			licenseUrl: z.string().optional().default(""),
			comment: z.boolean().optional().default(true),
			password: z.string().optional().default(""),
			passwordHint: z.string().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.superRefine(({ category, tags }, context) => {
			const categorySlug = getPostCategorySlug(category);
			if (categorySlug && tags.includes(categorySlug)) {
				context.addIssue({
					code: "custom",
					message: `Do not repeat the category as the "${categorySlug}" tag`,
					path: ["tags"],
				});
			}
		}),
});

const specCollection: ContentCollection<Record<string, never>> =
	defineCollection({
		loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
		schema: z.object({}),
	});

const dynamicCollection: ContentCollection<DynamicData> = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/dynamic" }),
	schema: z.object({
		published: z.date(),
		pinned: z.boolean().optional().default(false),
		location: z.string().optional().default(""),
	}),
});

export const collections: {
	dynamic: typeof dynamicCollection;
	posts: typeof postsCollection;
	spec: typeof specCollection;
} = {
	dynamic: dynamicCollection,
	posts: postsCollection,
	spec: specCollection,
};
