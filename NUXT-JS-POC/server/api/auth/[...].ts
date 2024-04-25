/* eslint-disable camelcase */
import GithubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";

import type { AuthConfig } from "@auth/core/types";
import { NuxtAuthHandler } from "#auth";
import PostgresAdapter from "@auth/pg-adapter";
import { PostgresDBClient } from "~/server/queries/db";
const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  adapter: PostgresAdapter(PostgresDBClient.getPool()),
  secret: runtimeConfig.authJs.secret,
  providers: [
    GoogleProvider({
      clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
};
export default NuxtAuthHandler(authOptions, runtimeConfig);
