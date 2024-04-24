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
  authJs: {
    guestRedirectTo: process.env.NUXT_GITHUB_GUEST_REDIRECT,
    authenticatedRedirectTo: process.env.NUXT_GITHUB_AUTHENTICATED_REDIRECT,
    // where to redirect if the user is authenticated
    baseUrl: process.env.NUXT_NEXTAUTH_URL, // should be something like https://www.my-app.com
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
  hooks: {
    listen: () => {
      createDBTables();
    },
  },
});
