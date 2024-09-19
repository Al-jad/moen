<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
      <p class="text-gray-600 mb-4">{{ description }}</p>
      <div class="flex space-x-4">
        <NuxtLink to="/Laws" class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300">
          Learn More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});
</script>
