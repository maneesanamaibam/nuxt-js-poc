<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Create Recipe Form</h2>
    <form class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Recipe Name</label
        >
        <input
          id="name"
          v-model="recipeForm.name"
          type="text"
          name="name"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>

      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Description
        </label>
        <textarea
          id="description"
          v-model="recipeForm.description"
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
                  id="file-upload"
                  name="imageFile"
                  type="file"
                  class="sr-only"
                  @change="createRecipeFileHandler($event)"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">
            {{
              recipeForm.recipeImage
                ? (recipeForm.recipeImage as File).name
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
          id="name"
          v-model="recipeForm.recipeCategory"
          type="text"
          name="name"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>
      <div>
        <label class="block text-xl font-medium text-gray-600"
          >Total number of steps:
          <span class="text-[#1bb380]">{{ totalNumberOfRecipeSteps }}</span>

          <span
            v-if="!isRecipeFormUpdateMode"
            class="block italic text-sm font-light text-gray-400"
            >(Click the below button to add a new step to your recipe)</span
          >
        </label>
      </div>

      <button
        v-if="!isRecipeFormUpdateMode"
        type="button"
        class="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600"
        @click="showRecipeForm"
      >
        Add a recipe step
      </button>
      <ul v-if="totalNumberOfRecipeSteps > 0">
        <h3 class="ml-2 mb-4 text-xl font-bold text-indigo-700">
          Recipe Steps
        </h3>
        <li
          v-for="recipeStep in recipeForm.recipeSteps"
          :key="recipeStep.step"
          class="flex items-center justify-between border-2 border-teal-500 border-dashed rounded-md p-4 m-2"
        >
          <p>
            <span class="mr-5 text-gray-700 font-bold text-xl"
              >{{ recipeStep.step }}
            </span>
            <span class="text-[#403c32] text-ellipsis">
              {{ recipeStep.stepDetails }}
            </span>
          </p>

          <button
            v-if="isRecipeFormUpdateMode"
            type="button"
            @click="recipeUpdateHandler(recipeStep)"
          >
            <svg
              class="feather feather-edit-2"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
              />
            </svg>
          </button>
          <button
            v-else
            type="button"
            @click="recipeStepPreviewHandler(recipeStep)"
          >
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
        v-if="showRecipeStepForm && !isRecipeFormUpdateMode"
        @cancel-recipe-step-form="showRecipeStepForm = false"
        @recipe-step-form-data-submit="recipeStepFormDataHandler"
      />
      <RecipeStep
        v-else-if="showRecipeStepForm && isRecipeFormUpdateMode"
        :stepValues="updateModeCurrentSelectedRecipeStep"
        @cancel-recipe-step-form="showRecipeStepForm = false"
        @recipe-step-form-data-submit="updateRecipeStepFormData"
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
          >Number of ingredients:
          <span class="text-[#1bb380]">{{ totalNumberOfIngredients }}</span>
          <span
            v-if="!isRecipeFormUpdateMode"
            class="block italic text-sm font-light text-gray-400"
            >(Click the below button to add an ingredient)</span
          >
        </label>
      </div>
      <button
        v-if="!isRecipeFormUpdateMode"
        type="button"
        class="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:bg-teal-600"
        @click="showIngredientFormHandler"
      >
        Add an ingredient
      </button>

      <ul v-if="totalNumberOfIngredients > 0">
        <h3 class="ml-2 mb-4 text-xl font-bold text-indigo-700">Ingredients</h3>
        <li
          v-for="ingredient in recipeForm.ingredients"
          :key="ingredient.name"
          class="flex items-center justify-between border-2 border-teal-500 border-dashed rounded-md p-4 m-2"
        >
          <p>
            <span class="mr-5 text-gray-700 font-bold text-xl"
              >{{ ingredient.name }}
            </span>
            <span class="text-[#403c32] text-ellipsis">
              {{ ingredient.quantity }}
            </span>
          </p>
          <button
            v-if="isRecipeFormUpdateMode"
            type="button"
            @click="updateIngredientHandler(ingredient)"
          >
            <svg
              class="feather feather-edit-2"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
              />
            </svg>
          </button>

          <button
            v-else
            type="button"
            @click="ingredientPreviewHandler(ingredient)"
          >
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
        v-if="showIngredientForm && !isRecipeFormUpdateMode"
        @cancel-ingredient-form="showIngredientForm = false"
        @ingredient-form-data-submit="ingredientFormDataSubmit"
      />
      <RecipeIngredient
        v-else-if="showIngredientForm && isRecipeFormUpdateMode"
        :ingredientValues="updateModeCurrentSelectedIngredient"
        @cancel-ingredient-form="showIngredientForm = false"
        @ingredient-form-data-submit="updateIngredientFormData"
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
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          type="submit"
          @click="recipeFormSubmitHandler($event)"
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
  import type { ImagePreviewProps } from "~/types/ImagePreview";
  import type {
    IngredientForm,
    RecipeForm,
    RecipeFormProps,
    RecipeStepForm,
  } from "~/types/Recipe";

  const props = defineProps<{
    formValues?: RecipeFormProps;
    externalFormDataHandler: (recipe: FormData) => Promise<void>;
  }>();

  const isRecipeFormUpdateMode = computed(() => {
    return !!props.formValues;
  });

  const updateModeCurrentSelectedIngredient = ref<any>(null);
  const updateModeCurrentSelectedRecipeStep = ref<any>(null);
  const recipeForm = ref<RecipeForm>({
    name: "",
    recipeImage: null,
    description: "",
    totalSteps: 0,
    recipeCategory: "",
    ingredients: [],
    recipeSteps: [],
  });
  const recipeStepImagePreviewProps = ref<ImagePreviewProps>(
    {} as ImagePreviewProps
  );
  const isRecipeModalOpen = ref(false);
  const showRecipeStepForm = ref(false);
  const showIngredientForm = ref(false);
  const isIngredientPreviewModalOpen = ref(false);
  const ingredientPreviewProps = ref<ImagePreviewProps>(
    {} as ImagePreviewProps
  );

  const isRecipeSubmitFormLoading = ref(false);

  const totalNumberOfIngredients = computed(() => {
    return recipeForm.value.ingredients.length;
  });
  const totalNumberOfRecipeSteps = computed(() => {
    return recipeForm.value.recipeSteps.length;
  });

  onMounted(() => {
    const formValues = toRaw(props.formValues);
    if (!formValues) return;

    if (typeof formValues.recipeImage === "string") {
      const convertedFile = base64ToFile(
        formValues.recipeImage?.split("base64,")[1] as string,
        "recipeImage"
      );
      recipeForm.value.recipeImage = convertedFile;
    } else {
      recipeForm.value.recipeImage = formValues.recipeImage;
    }
    recipeForm.value.name = formValues.name;
    recipeForm.value.description = formValues.description;
    recipeForm.value.totalSteps = formValues.totalSteps;
    recipeForm.value.recipeCategory = formValues.recipeCategory;
    recipeForm.value.ingredients = formValues.ingredients.map(
      ({ id, imageFile, name, quantity, measurement }) => {
        let convertedFile: File | string = imageFile!;
        if (typeof imageFile === "string") {
          convertedFile = base64ToFile(
            imageFile?.split("base64,")[1] as string,
            "recipeIngredient"
          );
        }
        return {
          id,
          imageFile: convertedFile,
          name,
          quantity,
          measurement,
        };
      }
    );
    recipeForm.value.recipeSteps = formValues.steps.map(
      ({ stepId, step, stepDetails, imageFile }) => {
        let convertedFile: File | string = imageFile!;
        if (typeof imageFile === "string") {
          convertedFile = base64ToFile(
            imageFile?.split("base64,")[1] as string,
            "recipeStep"
          );
        }
        return {
          stepId,
          step,
          stepDetails,
          imageFile: convertedFile,
        };
      }
    );
  });

  function recipeStepModalCloseHandler() {
    isRecipeModalOpen.value = false;
  }
  // show recipe form on click of add recipe button
  function showRecipeForm() {
    showRecipeStepForm.value = true;
  }
  // setting file for recipe image
  function createRecipeFileHandler(event: Event) {
    recipeForm.value.recipeImage = (event.target as HTMLInputElement)
      .files?.[0] as File;
  }
  function updateIngredientHandler(ingredient: IngredientForm) {
    showIngredientForm.value = true;
    updateModeCurrentSelectedIngredient.value = ingredient;
  }

  function recipeUpdateHandler(recipeStep: RecipeStepForm) {
    showRecipeStepForm.value = true;
    updateModeCurrentSelectedRecipeStep.value = recipeStep;
  }
  function ingredientPreviewHandler(ingredient: IngredientForm) {
    ingredientPreviewProps.value.properties = {
      ingredient_name: ingredient.name,
      quantity: ingredient.quantity,
      measurement: ingredient.measurement,
    };
    ingredientPreviewProps.value.previewName = "Ingredient";
    ingredientPreviewProps.value.imageFile = ingredient.imageFile as
      | File
      | string;

    isIngredientPreviewModalOpen.value = true;
  }

  function updateIngredientFormData(ingredientFormData: IngredientForm) {
    recipeForm.value.ingredients[
      recipeForm.value.ingredients.findIndex(
        (ingredient) => ingredient.id === ingredientFormData.id
      )
    ] = ingredientFormData;
    showIngredientForm.value = false;
  }
  function ingredientModalCloseHandler() {
    isIngredientPreviewModalOpen.value = false;
  }
  function showIngredientFormHandler() {
    showIngredientForm.value = true;
  }
  function recipeStepPreviewHandler(recipeStep: RecipeStepForm) {
    isRecipeModalOpen.value = true;
    recipeStepImagePreviewProps.value.previewName = "Recipe Step";
    recipeStepImagePreviewProps.value.imageFile = recipeStep.imageFile as
      | File
      | string;
    recipeStepImagePreviewProps.value.properties = {
      recipe_step: recipeStep.step,
      step_details: recipeStep.stepDetails,
    };
  }
  function ingredientFormDataSubmit(ingredientData: IngredientForm) {
    showIngredientForm.value = false;
    recipeForm.value.ingredients.push(ingredientData);
  }

  function updateRecipeStepFormData(recipeStepData: RecipeStepForm) {
    recipeForm.value.recipeSteps[
      recipeForm.value.recipeSteps.findIndex(
        (recipeStep) => recipeStep.stepId === recipeStepData.stepId
      )
    ] = recipeStepData;
    showRecipeStepForm.value = false;
  }

  function recipeStepFormDataHandler(recipeStepData: RecipeStepForm) {
    showRecipeStepForm.value = false;
    recipeForm.value.recipeSteps.push(recipeStepData);
    recipeForm.value.recipeSteps = recipeForm.value.recipeSteps.sort(
      (a, b) => a.step - b.step
    );
  }

  function resetRecipeForm() {
    recipeForm.value = {
      name: "",
      recipeImage: null,
      description: "",
      totalSteps: 0,
      recipeCategory: "",
      ingredients: [],
      recipeSteps: [],
    };
  }

  async function recipeFormSubmitHandler(event: Event) {
    event.preventDefault();
    recipeForm.value.totalSteps = totalNumberOfRecipeSteps.value;
    try {
      isRecipeSubmitFormLoading.value = true;
      const formData = new FormData();

      for (const [key, value] of Object.entries(toRaw(recipeForm.value))) {
        if (key === "ingredients" || key === "recipeSteps") {
          for (const itm of value as Array<any>) {
            const imageFileName =
              key === "ingredients"
                ? `${RecipeFileNamingConstants.INGREDIENT_FILE_NAMING}_${itm.name}`
                : `${RecipeFileNamingConstants.RECIPE_STEP_FILE_NAMING}_${itm.step}`;
            formData.append(imageFileName, itm.imageFile);
            Reflect.deleteProperty(itm, "imageFile");
          }
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
      await props.externalFormDataHandler(formData);
      resetRecipeForm();
      isRecipeSubmitFormLoading.value = false;
      navigateTo({ path: "/" });
    } catch (error) {
      isRecipeSubmitFormLoading.value = false;
      console.error(error);
    }
  }
</script>

<style></style>
