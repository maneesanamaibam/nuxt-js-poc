<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Step 1</h2>
    <p class="text-gray-600 mb-6">This is step 1</p>

    <form class="space-y-6">
      <div>
        <label for="step" class="block text-sm font-medium text-gray-700"
          >Step</label
        >
        <input
          id="step"
          v-model.number="form.step"
          type="number"
          name="step"
          class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-4 py-2"
        />
      </div>
      <div>
        <label for="stepDetails" class="block text-sm font-medium text-gray-700"
          >Step Details</label
        >
        <textarea
          id="stepDetails"
          v-model="form.stepDetails"
          name="stepDetails"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-4 py-2"
        ></textarea>
      </div>
      <div class="border border-gray-300 rounded-md p-4">
        <label
          for="imageFile"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Image File</label
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
                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  class="sr-only"
                  accept="image/png, image/jpeg"
                  name="imageFile"
                  type="file"
                  @input="imageFileInputHandler($event)"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-3">
            {{
              form.imageFile
                ? (form.imageFile as File).name
                : "No file selected"
            }}
          </p>
          <p class="text-xs text-gray-500 mt-3">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mb-3"
          @click="$emit('cancel-recipe-step-form')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          @click="recipeStepFormHandler"
        >
          {{ isFormUpdateMode ? "Updated" : "Add" }} Step
        </button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
  import type { RecipeStepForm } from "~/types/Recipe";

  const emit = defineEmits([
    "recipe-step-form-data-submit",
    "cancel-recipe-step-form",
  ]);

  const props = defineProps<{
    stepValues?: RecipeStepForm;
  }>();
  const form = ref<RecipeStepForm>({
    step: 0,
    stepDetails: "",
    imageFile: null,
  });

  const isFormUpdateMode = computed(() => {
    return !!props.stepValues;
  });
  onMounted(() => {
    if (props.stepValues) {
      form.value = structuredClone(toRaw(props.stepValues));
    }
  });
  function imageFileInputHandler(event: Event) {
    form.value.imageFile = (event.target as HTMLInputElement)
      .files?.[0] as File;
  }

  function resetRecipeStepForm() {
    form.value.step = 0;
    form.value.stepDetails = "";
    form.value.imageFile = null;
  }
  function recipeStepFormHandler() {
    const hasFormError = () => {
      if (typeof form.value.step !== "number" || form.value.step < 0)
        return true;

      if (form.value.stepDetails === "") return true;

      if (!form.value.imageFile) return true;

      return false;
    };
    if (!hasFormError()) {
      emit("recipe-step-form-data-submit", structuredClone(toRaw(form.value)));
      resetRecipeStepForm();
    } else {
      console.error("Recipe step form data error: ", form.value);
    }
  }
</script>
