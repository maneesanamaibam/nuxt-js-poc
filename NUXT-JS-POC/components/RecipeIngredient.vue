<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Ingredient Form</h2>

    <form class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          v-model="ingredientForm.name"
          type="text"
          id="name"
          name="name"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>
      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700"
          >Quantity</label
        >
        <input
          v-model="ingredientForm.quantity"
          type="number"
          id="quantity"
          name="quantity"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
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
                  @input="imageFileInputHandler($event)"
                  accept="image/png, image/jpeg"
                  name="imageFile"
                  type="file"
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-3">
            {{
              ingredientForm.imageFile
                ? ingredientForm.imageFile.name
                : "No file selected"
            }}
          </p>
          <p class="text-xs text-gray-500 mt-3">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      <div class="relative">
        <label for="measurement" class="block text-sm font-medium text-gray-700"
          >Measurement</label
        >
        <div class="mt-1">
          <select
            v-model="ingredientForm.measurement"
            id="measurement"
            name="measurement"
            class="block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
          >
            <option value="Ounce">Ounce</option>
            <option value="Gram">Gram</option>
            <option value="Milliliter">Milliliter</option>
            <option value="Teaspoon">Teaspoon</option>
            <option value="Cup">Cup</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label
          for="newMeasurement"
          class="block text-sm font-medium text-gray-700"
          >Add New Measurement</label
        >
        <input
          type="text"
          id="newMeasurement"
          name="newMeasurement"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>

      <div>
        <button
          @click="$emit('cancel-ingredient-form')"
          type="button"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 mb-3"
        >
          Cancel
        </button>
        <button
          @click="ingredientFormSubmitHandler"
          type="button"
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Add Ingredient
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits([
    "ingredient-form-data-submit",
    "cancel-ingredient-form",
  ]);
  const ingredientForm = ref({
    imageFile: null,
    measurement: "",
    name: "",
    quantity: 0,
  });

  function imageFileInputHandler(event) {
    console.log(event.target.files[0]);
    ingredientForm.value.imageFile = event.target.files[0];
  }

  function resetIngredientForm() {
    ingredientForm.value.imageFile = null;
    ingredientForm.value.measurement = "";
    ingredientForm.value.name = "";
    ingredientForm.value.quantity = 0;
  }
  function ingredientFormSubmitHandler() {
    console.log("Ingredient form submit");
    const hasFormError = () => {
      if (!ingredientForm.value.imageFile) {
        return true;
      }
      if (!ingredientForm.value.measurement) {
        return true;
      }
      if (!ingredientForm.value.name) {
        return true;
      }
      if (!ingredientForm.value.quantity) {
        return true;
      }
      return false;
    };

    if (!hasFormError()) {
      emit(
        "ingredient-form-data-submit",
        structuredClone(toRaw(ingredientForm.value))
      );
      resetIngredientForm();
    } else {
      console.error("Error while submitting ingredient form");
    }
  }
</script>

<style></style>
