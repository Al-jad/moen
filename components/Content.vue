<template>
  <div class="flex flex-col md:flex-row items-center justify-between gap-8 p-6 bg-white rounded-lg shadow-md sm:w-[90%] mx-auto transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
    <div class="flex-1 md:pr-8 animate-fade-in">
      <h2 class="text-xl font-bold mb-4 text-gray-800 animate-slide-down hover:scal">{{ title }}</h2>
      <p class="text-base text-gray-600 leading-relaxed animate-slide-up">{{ description }}</p>
    </div>
    <div class="flex-shrink-0 mt-6 md:mt-0 animate-fade-in">
      <img :src="image" :alt="title" class="w-full md:w-96 h-auto object-cover rounded-lg shadow-lg transition-all duration-300 hover:scale-105" loading="lazy" />
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
  },
  image: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
</style>