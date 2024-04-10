import { PostgresDBClient } from "~/server/queries/db";

export default defineEventHandler(async (event) => {
  const pgClient = await PostgresDBClient.init();
  const result = await PostgresDBClient.query("SELECT * FROM recipe;");

  return {
    recipes: result.rows,
  };
});
