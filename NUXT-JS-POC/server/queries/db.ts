import pg from "pg";
import { type PoolClient, type Pool } from "pg";

const config = useRuntimeConfig();
export class PostgresDBClient {
  private static _poolInstance: Pool;
  private static _clientInstance: PoolClient;
  static async init() {
    PostgresDBClient._poolInstance = new pg.Pool({
      connectionString: config.postgresConnectionStringURL,
    });
    PostgresDBClient._clientInstance =
      await PostgresDBClient._poolInstance.connect();
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
