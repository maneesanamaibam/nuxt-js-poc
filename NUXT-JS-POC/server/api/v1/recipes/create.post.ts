import { RecipeFileNamingConstants } from "~/constants/namingContants";
import createRecipe from "~/server/queries/createRecipe";
import { PostgresDBClient } from "~/server/queries/db";
import { Recipe } from "~/server/types/recipeType";

export function getPayloadRightFormatStatus(payload: Recipe) {
  const recipeKeys = [
    "recipeSteps",
    "name",
    "description",
    "recipeImage",
    "totalSteps",
    "recipeCategory",
    "ingredients",
  ];
  const recipeStepsKeys = ["step", "stepId", "stepDetails", "imageFile"];
  const ingredientsKeys = [
    "imageFile",
    "id",
    "measurement",
    "name",
    "quantity",
  ];

  const response = {
    status: true,
    errorMessage: "NO ERROR",
  };
  // TODO: add null case
  for (const key of Object.keys(payload)) {
    if (!recipeKeys.includes(key)) {
      response.status = false;
      response.errorMessage = `${key} is not a valid field for a recipe.`;
      return response;
    }
  }
  if (!Array.isArray(payload.recipeSteps)) {
    response.status = false;
    response.errorMessage = "recipeSteps must be an array.";
    return response;
  } else if (payload.recipeSteps.length === 0) {
    response.status = false;
    response.errorMessage = "recipeSteps should consist of at least one step.";
    return response;
  } else {
    for (const key of Object.keys(payload.recipeSteps[0])) {
      if (!recipeStepsKeys.includes(key)) {
        response.status = false;
        response.errorMessage = `${key} is not a valid field for a recipe step.`;
        return response;
      }
    }
  }

  if (!Array.isArray(payload.ingredients)) {
    response.status = false;
    response.errorMessage = "ingredients must be an array.";
    return response;
  } else if (payload.ingredients.length === 0) {
    response.status = false;
    response.errorMessage =
      "ingredients should consist of at least one ingredient item.";
    return response;
  } else {
    for (const key of Object.keys(payload.ingredients[0])) {
      if (!ingredientsKeys.includes(key)) {
        response.status = false;
        response.errorMessage = `${key} is not a valid field for a recipe ingredient.`;
        return response;
      }
    }
  }

  return response;
}

export function transformMultipartDataIntoCompatibleFormat(
  payload: MultiPartData[] | undefined
): Recipe {
  const keys = ["recipeImage", "imageFile"];
  const result: {
    [key: string]: any;
  } = {};

  const mapper = new Map();

  payload?.forEach(({ name, data }) => {
    if (name === "recipeImage") {
      result[name as string] = data;
    } else if (
      name?.startsWith(RecipeFileNamingConstants.INGREDIENT_FILE_NAMING)
    ) {
      const ingredientName = name.split("_")[1];
      mapper.set(ingredientName, data);
    } else if (
      name?.startsWith(RecipeFileNamingConstants.RECIPE_STEP_FILE_NAMING)
    ) {
      const step = name.split("_")[1];
      mapper.set(+step, data);
    } else {
      result[name as string] =
        name === "ingredients" || name === "recipeSteps"
          ? JSON.parse(data.toString())
          : data.toString();
    }
  });
  for (let itm of result.ingredients) {
    itm.imageFile = mapper.get(itm.name);
  }
  for (const itm of result.recipeSteps) {
    itm.imageFile = mapper.get(itm.step);
  }

  return result as Recipe;
}
export default defineEventHandler(async (event) => {
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
    const result = await createRecipe(transformedPayload);
    return {
      status: "success",
      message: "Recipe created successfully!",
      recipe: result,
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
