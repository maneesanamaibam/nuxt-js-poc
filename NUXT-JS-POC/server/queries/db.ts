import pg, { type Pool, type PoolClient } from "pg";

import fs from "node:fs";
import { resolve } from "node:path";

export class PostgresDBClient {
  private static _poolInstance: Pool;
  private static _clientInstance: PoolClient;
  static async init(): Promise<void> {
    const sslOptions =
      process.env.ENVIRONMENT === "local"
        ? {}
        : {
            ssl: {
              rejectUnauthorized: false,
              cert: fs.readFileSync(resolve("ssl/server.crt")).toString(),
            },
          };
    try {
      PostgresDBClient._poolInstance = new pg.Pool({
        connectionString: process.env.NUXT_POSTGRES_CONNECTION_STRING_URL,
        connectionTimeoutMillis: 10000, // 10 seconds
        ...sslOptions,
      });

      PostgresDBClient._clientInstance =
        await PostgresDBClient._poolInstance.connect();
    } catch (err: Error | unknown) {
      const message = err instanceof Error ? err.message : err;
      console.error("Error connecting to database: ", message);
    }
  }

  static getClient(): PoolClient {
    return PostgresDBClient._clientInstance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static query(text: string, params: any[] = []): Promise<pg.QueryResult<any>> {
    return PostgresDBClient._poolInstance.query(text, params);
  }
  static releaseClient(): void {
    PostgresDBClient._clientInstance.release();
  }
}
