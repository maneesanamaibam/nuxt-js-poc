import { PostgresDBClient } from "~/server/queries/db";
import getRecipeById from "~/server/queries/getRecipeById";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "recipeId");
  try {
    const response = await getRecipeById(recipeId || "");
    return response;
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
