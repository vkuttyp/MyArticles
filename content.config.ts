import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

export default defineContentConfig({
    collections: {
        articles: defineCollection(
            asSitemapCollection({
                source: "articles/**/*.md",
                type: "page",
                schema: z.object({
                    author: z.string(),
                    author_avatar: z.string(),
                    author_description: z.string(),
                    date: z.date(),
                    description: z.string(),
                    rawbody: z.string(),
                    tags: z.optional(z.array(z.string())),
                    thumbnail: z.string(),
                    title: z.string(),
                }),
            })
        ),
    },
});