interface Recipe {
  id: string;
  name: string;
  totalSteps: number;
  description: string;
  recipeImage: File | null | string;
  recipeCategory: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

interface Ingredient {
  id: string;
  imageFile: File | null;
  measurement: string;
  name: string;
  quantity: number;
  recipeId: string;
}

interface RecipeStep {
  stepId: string;
  step: number;
  stepDetails: string;
  recipeId: string;
  imageFile: File | null;
}

type RecipeStepProps = Omit<RecipeStep, "imageFile"> & {
  imageFile: string;
};
type IngredientProps = Omit<Ingredient, "imageFile"> & {
  imageFile: string;
};

type RecipePageProps = Omit<Recipe, "recipeImage" | "ingredients" | "steps"> & {
  recipeImage: string;
  ingredients: IngredientProps[];
  steps: RecipeStepProps[];
};
interface RecipeCard {
  name: string;
  recipeImage: File | null | string;
  description: string;
  recipeCategory: string;
}
export type { Recipe, Ingredient, RecipeStep, RecipePageProps, RecipeCard };
