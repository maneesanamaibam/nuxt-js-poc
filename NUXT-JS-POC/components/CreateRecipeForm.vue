<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Create Recipe Form</h2>
    <form class="space-y-6">
      {{ createRecipeForm }}
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Recipe Name</label
        >
        <input
          v-model="createRecipeForm.name"
          type="text"
          id="name"
          name="name"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>

      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Description
        </label>
        <textarea
          v-model="createRecipeForm.description"
          id="description"
          name="description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-4 py-2"
        ></textarea>
      </div>

      <div>
        <img
          v-if="props.formValues && props.formValues.recipeImage"
          :src="props.formValues.recipeImage"
          alt="recipe-image"
        />
      </div>
      <div class="border border-gray-300 rounded-md p-4">
        <label
          for="imageFile"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Recipe Image Upload</label
        >
        <div
          class="relative border-dashed border-2 border-gray-300 bg-gray-50 rounded-md p-6 text-center"
        >
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 30.7c0 1.6 1.3 3 3 3s3-1.3 3-3m-6-4.7c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5M34 19V9a2 2 0 00-2-2H16a2 2 0 00-2 2v10H8a4 4 0 00-4 4v14a4 4 0 004 4h32a4 4 0 004-4V23a4 4 0 00-4-4h-6z"
              />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="file-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  @change="createRecipeFileHandler($event)"
                  id="file-upload"
                  name="imageFile"
                  type="file"
                  class="sr-only"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            {{
              createRecipeForm.recipeImage
                ? createRecipeForm.recipeImage.name
                : "No file selected"
            }}
          </p>
          <p class="text-xs text-gray-500 mt-3">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Recipe Category</label
        >
        <input
          v-model="createRecipeForm.recipeCategory"
          type="text"
          id="name"
          name="name"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>
      <div>
        <label class="block text-xl font-medium text-gray-600"
          >Total number of steps:
          <span class="text-[#1bb380]">{{ totalNumberOfRecipeSteps }}</span>

          <span class="block italic text-sm font-light text-gray-400"
            >(Click the below button to add a new step to your recipe)</span
          >
        </label>
      </div>

      <button
        type="button"
        class="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600"
        @click="addRecipeStep"
      >
        Add a recipe step
      </button>

      <ul v-if="recipeSteps.length > 0">
        <h3 class="ml-2 mb-4 text-xl font-bold text-indigo-700">
          Recipe Steps
        </h3>
        <li
          class="flex items-center justify-between border-2 border-teal-500 border-dashed rounded-md p-4 m-2"
          v-for="recipeStep in recipeSteps"
          :key="recipeStep.step"
        >
          <p>
            <span class="mr-5 text-gray-700 font-bold text-xl"
              >{{ recipeStep.step }}
            </span>
            <span class="text-[#403c32] text-ellipsis">
              {{ recipeStep.stepDetails }}
            </span>
          </p>
          <button type="button" @click="recipeStepPreviewHandler(recipeStep)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="#6B7280"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.5 12s4-8 10-8 10 8 10 8-4 8-10 8S2.5 12 2.5 12zM12 8a4 4 0 100 8 4 4 0 000-8zm0 0a2 2 0 110 4 2 2 0 010-4z"
                stroke="#6B7280"
              />
            </svg>
          </button>
        </li>
      </ul>

      <RecipeStep
        v-if="showRecipeStepForm"
        @cancel-recipe-step-form="showRecipeStepForm = false"
        @recipe-step-form-data-submit="recipeStepFormDataHandler"
      />

      <Modal
        v-if="isRecipeModalOpen"
        @modal-close="recipeStepModalCloseHandler"
      >
        <template #modal-content>
          <ImagePreview v-bind="recipeStepImagePreviewProps"
        /></template>
        <template #modal-footer>
          <p>This is footer</p>
        </template>
      </Modal>

      <div>
        <label class="block text-xl font-medium text-gray-600"
          >Number of ingredients: <span class="text-[#1bb380]">4</span>
          <span class="block italic text-sm font-light text-gray-400"
            >(Click the below button to add an ingredient)</span
          >
        </label>
      </div>
      <button
        type="button"
        class="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600"
        @click="addIngredient"
      >
        Add an ingredient
      </button>

      <ul v-if="ingredients.length > 0">
        <h3 class="ml-2 mb-4 text-xl font-bold text-indigo-700">Ingredients</h3>
        <li
          class="flex items-center justify-between border-2 border-teal-500 border-dashed rounded-md p-4 m-2"
          v-for="ingredient in ingredients"
          :key="ingredient.name"
        >
          <p>
            <span class="mr-5 text-gray-700 font-bold text-xl"
              >{{ ingredient.name }}
            </span>
            <span class="text-[#403c32] text-ellipsis">
              {{ ingredient.quantity }}
            </span>
          </p>
          <button type="button" @click="ingredientPreviewHandler(ingredient)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="#6B7280"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.5 12s4-8 10-8 10 8 10 8-4 8-10 8S2.5 12 2.5 12zM12 8a4 4 0 100 8 4 4 0 000-8zm0 0a2 2 0 110 4 2 2 0 010-4z"
                stroke="#6B7280"
              />
            </svg>
          </button>
        </li>
      </ul>
      <RecipeIngredient
        v-if="showIngredientForm"
        @cancel-ingredient-form="showIngredientForm = false"
        @ingredient-form-data-submit="ingredientFormDataSubmit"
      />
      <Modal
        v-if="isIngredientPreviewModalOpen"
        @modal-close="ingredientModalCloseHandler"
      >
        <template #modal-content>
          <ImagePreview v-bind="ingredientPreviewProps"
        /></template>
        <template #modal-footer>
          <p>This is footer</p>
        </template>
      </Modal>

      <div>
        <button
          @click="createRecipeFormSubmitHandler($event)"
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
  <Loading v-if="isRecipeSubmitFormLoading" />
</template>

<script lang="ts" setup>
  import { RecipeFileNamingConstants } from "~/constants/namingContants";
  import RecipeService from "~/services/RecipeService";
  import type { Recipe } from "~/types/Recipe";

  const props = defineProps<{
    formValues?: Recipe;
  }>();

  const createRecipeForm = ref({
    name: "",
    recipeImage: null,
    description: "",
    totalSteps: 0,
    recipeCategory: "",
    ingredients: [],
    recipeSteps: [],
  });
  const recipeStepImagePreviewProps = ref({});
  const isRecipeModalOpen = ref(false);
  const showRecipeStepForm = ref(false);
  const recipeSteps = ref<any>([]);
  const showIngredientForm = ref(false);
  const isIngredientPreviewModalOpen = ref(false);
  const ingredientPreviewProps = ref({});
  const ingredients = ref<any>([]);

  const isRecipeSubmitFormLoading = ref(false);

  const totalNumberOfRecipeSteps = computed(() => {
    return recipeSteps.value.length;
  });

  onMounted(() => {
    console.log("Create recipe form on mounted", toRaw(props.formValues));

    const formValues = toRaw(props.formValues);
    if (!formValues) return;
    createRecipeForm.value.name = formValues.name;
    // createRecipeForm.value.recipeImage = formValues.recipeImage;
    createRecipeForm.value.description = formValues.description;
    createRecipeForm.value.totalSteps = formValues.totalSteps;
    createRecipeForm.value.recipeCategory = formValues.recipeCategory;
    ingredients.value = formValues.ingredients.map(
      ({ imageFile, name, quantity, measurement }) => ({
        imageFile,
        name,
        quantity,
        measurement,
      })
    );
    recipeSteps.value = formValues.steps.map(
      ({ step, stepDetails, imageFile }) => ({
        step,
        stepDetails,
        imageFile,
      })
    );
  });

  function recipeStepModalCloseHandler() {
    isRecipeModalOpen.value = false;
    console.log("Recipe step modal closed");
  }
  function addRecipeStep() {
    showRecipeStepForm.value = true;
    console.log("Add a recipe step");
  }
  function createRecipeFileHandler(event) {
    createRecipeForm.value.recipeImage = event.target.files[0];
  }
  function ingredientPreviewHandler(ingredient) {
    console.log("Ingredient preview clicked");
    ingredientPreviewProps.value.imageFile = ingredient.imageFile;
    ingredientPreviewProps.value.properties = {
      ingredient_name: ingredient.name,
      quantity: ingredient.quantity,
      measurement: ingredient.measurement,
    };
    ingredientPreviewProps.value.previewName = "Ingredient";
    ingredientPreviewProps.value.imageFile = ingredient.imageFile;

    isIngredientPreviewModalOpen.value = true;
  }

  function ingredientModalCloseHandler() {
    isIngredientPreviewModalOpen.value = false;
  }
  function addIngredient() {
    showIngredientForm.value = true;
    console.log("Add an ingredient clicked");
  }
  function recipeStepPreviewHandler(recipeStep) {
    isRecipeModalOpen.value = true;
    recipeStepImagePreviewProps.value.previewName = "Recipe Step";
    recipeStepImagePreviewProps.value.imageFile = recipeStep.imageFile;
    recipeStepImagePreviewProps.value.properties = {
      recipe_step: recipeStep.step,
      step_details: recipeStep.stepDetails,
    };
  }
  function ingredientFormDataSubmit(ingredientData) {
    console.log(
      "Receiving ingredient data from child component",
      ingredientData
    );

    showIngredientForm.value = false;
    ingredients.value.push(ingredientData);
    ingredients.value = ingredients.value.sort((a, b) => a.name - b.name);

    // setting ingredients form data to create recipe form
    createRecipeForm.value.ingredients = ingredients.value;
  }
  function recipeStepFormDataHandler(recipeStepData) {
    recipeSteps.value.push(recipeStepData);
    recipeSteps.value = recipeSteps.value.sort((a, b) => a.step - b.step);
    showRecipeStepForm.value = false;
    // setting recipe steps form data to create recipe form
    createRecipeForm.value.recipeSteps = recipeSteps.value;
    console.log("Receiving recipe step data: ", recipeStepData);
  }

  function resetCreateRecipeForm() {
    createRecipeForm.value = {
      name: "",
      recipeImage: null,
      description: "",
      totalSteps: 0,
      recipeCategory: "",
      ingredients: [],
      recipeSteps: [],
    };
    recipeSteps.value = [];
    ingredients.value = [];
  }

  async function createRecipeFormSubmitHandler(event) {
    event.preventDefault();
    console.log("Create recipe form submitted", createRecipeForm.value);
    createRecipeForm.value.totalSteps = totalNumberOfRecipeSteps.value;
    try {
      isRecipeSubmitFormLoading.value = true;
      const formData = new FormData();

      for (const [key, value] of Object.entries(
        toRaw(createRecipeForm.value)
      )) {
        if (key === "ingredients" || key === "recipeSteps") {
          for (const itm of value as Array<any>) {
            const imageFileName =
              key === "ingredients"
                ? `${RecipeFileNamingConstants.INGREDIENT_FILE_NAMING}_${itm.name}`
                : `${RecipeFileNamingConstants.RECIPE_STEP_FILE_NAMING}_${itm.step}`;
            formData.append(imageFileName, itm.imageFile);
            Reflect.deleteProperty(itm, "imageFile");
          }
          console.log("Stringifying ", JSON.stringify(value));
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
      await RecipeService.createNewRecipe(formData);
      isRecipeSubmitFormLoading.value = false;
      resetCreateRecipeForm();
    } catch (error) {
      isRecipeSubmitFormLoading.value = false;
      console.error(error);
    }
  }
</script>

<style></style>
