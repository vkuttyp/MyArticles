import { definePerson } from "nuxt-schema-org/schema";
import appMeta from "./app/app.meta";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    fonts: {
        defaults: {
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        },
    },
    site: {
        name: appMeta.name,
        url: appMeta.url,
        defaultLocale: "en",
    },
    schemaOrg: {
        identity: definePerson(appMeta.author),
    },
    image: {
        providers: {
            shields: {
                name: "shields",
                provider: "~/providers/shields.ts",
            },
            favicon: {
                name: "favicon",
                provider: "~/providers/favicon.ts",
            },
        },
    },
    content: {
        build: {
            markdown: {
                toc: {
                    depth: 3,
                    searchDepth: 2,
                },
                remarkPlugins: {
                    "remark-reading-time": {},
                },
            },
        },
    },
    studio: {
    // Git repository configuration (owner and repo are required)
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'vkuttyp', // your GitHub/GitLab username or organization
      repo: 'myarticles', // your repository name
      branch: 'main', // the branch to commit to (default: 'main')
    }
  },
    modules: ["@nuxt/ui", "@nuxt/image", "@nuxtjs/mdc", "motion-v/nuxt", "@nuxt/content", "@nuxtjs/seo", "@vueuse/nuxt", "nuxt-studio"],
    
    sitemap: {
        // Disable runtime cache storage which tries to use service workers
        runtimeCacheStorage: false,
    },
    
});