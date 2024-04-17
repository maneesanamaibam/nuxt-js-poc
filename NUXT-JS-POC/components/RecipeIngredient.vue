<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Ingredient Form</h2>

    <form
      action="#"
      method="POST"
      enctype="multipart/form-data"
      class="space-y-6"
    >
      <div>
        <label for="imageFile" class="block text-sm font-medium text-gray-700"
          >Image File</label
        >
        <div class="mt-1 flex items-center">
          <label
            for="image-upload"
            class="relative cursor-pointer bg-gray-100 py-2 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Upload</span>
            <input
              id="image-upload"
              name="imageFile"
              type="file"
              class="sr-only"
            />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
      </div>
      <div class="relative">
        <label for="measurement" class="block text-sm font-medium text-gray-700"
          >Measurement</label
        >
        <div class="mt-1">
          <select
            id="measurement"
            name="measurement"
            class="block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
          >
            <option>Ounce</option>
            <option>Gram</option>
            <option>Milliliter</option>
            <option>Teaspoon</option>
            <option>Tablespoon</option>
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
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
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
          type="number"
          id="quantity"
          name="quantity"
          class="mt-1 block w-full rounded-md border-none shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
