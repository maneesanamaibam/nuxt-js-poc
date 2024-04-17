<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
    <h2 class="text-2xl font-bold mb-4">Image Preview</h2>

    <div class="flex items-center justify-center mb-6">
      <img
        src="https://via.placeholder.com/150"
        alt="Image Preview"
        class="rounded-md shadow-md"
      />
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-2">Image Information</h3>
      <ul>
        <li class="flex items-center space-x-4">
          <span class="text-gray-700 font-medium">Name:</span>
          <span class="text-gray-900">Sample Image</span>
        </li>
        <li class="flex items-center space-x-4">
          <span class="text-gray-700 font-medium">Size:</span>
          <span class="text-gray-900">150x150</span>
        </li>
        <li class="flex items-center space-x-4">
          <span class="text-gray-700 font-medium">Format:</span>
          <span class="text-gray-900">JPEG</span>
        </li>
      </ul>
    </div>
  </div>
</template>
