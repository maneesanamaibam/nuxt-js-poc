import { PostgresDBClient } from "~/server/queries/db";
import getAllRecipes from "~/server/queries/getAllRecipes";

export default defineEventHandler(async (event) => {
  try {
    const response = await getAllRecipes();
    return {
      recipes: response,
    };
  } catch (err: Error | unknown) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    setResponseStatus(event, 405, errMsg);
    return {
      status: "error",
      message: errMsg,
    };
  } finally {
    PostgresDBClient.releaseClient();
  }
});
