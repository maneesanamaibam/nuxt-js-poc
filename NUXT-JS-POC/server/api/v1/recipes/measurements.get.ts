import { PostgresDBClient } from "~/server/queries/db";

export default defineEventHandler(async (event) => {
  try {
    PostgresDBClient.init();
    const response = await PostgresDBClient.query(
      `SELECT unit from recipe_measurements;`
    );
    const result = response.rows.map(({ unit }) => unit);
    return {
      measurements: result,
    };
  } catch (err: Error | unknown) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    setResponseStatus(event, 405, errMsg);
    return {
      status: "error",
      message: errMsg,
    };
  }
});
