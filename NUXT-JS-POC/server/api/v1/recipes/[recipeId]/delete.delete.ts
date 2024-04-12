import { PostgresDBClient } from "~/server/queries/db";
import deleteRecipeById from "~/server/queries/deleteRecipeById";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "recipeId");

  if (typeof recipeId !== "string") {
    setResponseStatus(event, 400, "Invalid recipe ID");
    return {
      status: 400, // Bad Request
      error: true,
      message: "Invalid recipe ID",
    };
  }

  try {
    const result = await deleteRecipeById(recipeId);
    setResponseStatus(event, 200, "Recipe deleted successfully");
    return {
      status: 200, // OK
      error: false,
      message: "Recipe deleted successfully",
      data: result,
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
