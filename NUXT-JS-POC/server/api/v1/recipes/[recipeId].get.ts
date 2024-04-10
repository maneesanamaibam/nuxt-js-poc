export default defineEventHandler(async (event) => {
  const recipeId = getRouterParam(event, "recipeId");

  return `Getting recipe ${recipeId}...`;
});
