import { resolve } from "node:path";
import { createDBTables } from "./server/queries/createTables";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@hebilicious/authjs-nuxt",
    "@nuxtjs/eslint-module",
  ],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  runtimeConfig: {
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET, // You can generate one with `openssl rand -base64 32`
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true, // whether to hit the /auth/session endpoint on every client request
      },
    },
  },
  eslint: {
    lintOnStart: false,
    emitError: false,
    emitWarning: false,
  },
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config.js",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },

  hooks: {
    listen: () => {
      createDBTables();
    },
  },
});
