export interface RecipeStep {
  stepId?: string;
  step: number;
  recipeId?: string;
  stepDetails: string;
  imageFile: File | null;
}

export interface Ingredient {
  id?: string;
  recipeId?: string;
  name: string;
  measurement: string;
  quantity: number;
  imageFile: File | null;
}
export interface Recipe {
  recipeSteps: RecipeStep[];
  recipeId?: string;
  name: string;
  recipeImage: File | null;
  description: string;
  totalSteps: number;
  ingredients: Ingredient[];
  recipeCategory: string;
}
