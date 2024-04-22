import pg from "pg";
import { type PoolClient, type Pool } from "pg";

export class PostgresDBClient {
  private static _poolInstance: Pool;
  private static _clientInstance: PoolClient;
  static async init() {
    try {
      PostgresDBClient._poolInstance = new pg.Pool({
        connectionString: process.env.NUXT_POSTGRES_CONNECTION_STRING_URL,
      });
      PostgresDBClient._clientInstance =
        await PostgresDBClient._poolInstance.connect();
    } catch (err) {
      console.log("Error connecting to database: ", err.message);
    }
  }

  static getClient() {
    return PostgresDBClient._clientInstance;
  }

  static query(text: string, params: any[] = []) {
    return PostgresDBClient._poolInstance.query(text, params);
  }
  static releaseClient() {
    PostgresDBClient._clientInstance.release();
  }
}
