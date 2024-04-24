import updateRecipeById from "~/server/queries/updateRecipeById";
import {
  getPayloadRightFormatStatus,
  transformMultipartDataIntoCompatibleFormat,
} from "../create.post";
import { PostgresDBClient } from "~/server/queries/db";

export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "recipeId");
  const payloadBody = await readMultipartFormData(event);
  const transformedPayload =
    transformMultipartDataIntoCompatibleFormat(payloadBody);

  const { status, errorMessage } =
    getPayloadRightFormatStatus(transformedPayload);
  if (!status) {
    setResponseStatus(event, 400, errorMessage);
    return {
      status: "error",
      message: errorMessage,
    };
  }

  try {
    const result = await updateRecipeById(recipeId ?? "", transformedPayload);
    return {
      data: result,
      status: "success",
      message: "Recipe updated successfully",
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
