<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-3xl font-bold text-gray-800">Add New Station</h1>
    <form @submit.prevent="addStation" class="space-y-6 max-w-2xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input v-model="station.id" id="id" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="externalId" class="block text-sm font-medium text-gray-700 mb-1">External ID</label>
          <input v-model="station.externalId" id="externalId" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="station.name" id="name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input v-model="station.city" id="city" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="lat" class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input v-model.number="station.lat" id="lat" type="number" step="any" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="lng" class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input v-model.number="station.lng" id="lng" type="number" step="any" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        </div>
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea v-model="station.description" id="description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>
      <div>
        <label for="images" class="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
        <input v-model="imagesInput" id="images" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div class="flex justify-end">
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          Add Station
        </button>
      </div>
    </form>
    <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { $axios } = useNuxtApp();

const station = ref({
  id: '',
  externalId: '',
  name: '',
  city: '',
  lat: null,
  lng: null,
  description: '',
  images: []
});

const imagesInput = ref('');
const errorMessage = ref('');

const addStation = async () => {
  try {
    errorMessage.value = ''; // Clear previous error messages
    const stationData = {
      externalId: station.value.externalId,
      name: station.value.name,
      city: station.value.city,
      lat: station.value.lat,
      lng: station.value.lng,
      description: station.value.description,
    };
    console.log(stationData);
    const response = await $axios.put(`/Station/${station.value.id}`, stationData);
    console.log('Station added successfully:', response.data);
    router.push('/water-quality');
  } catch (error) {
    console.error('Error adding station:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    // Handle the error and show a user-friendly message
    if (error.response && error.response.data && error.response.data.errors) {
      const errorDetails = Object.entries(error.response.data.errors)
        .map(([key, value]) => `${key}: ${value.join(', ')}`)
        .join('; ');
      errorMessage.value = `Validation errors: ${errorDetails}`;
    } else if (error.response && error.response.data && error.response.data.title) {
      errorMessage.value = error.response.data.title;
    } else if (error.code === "ERR_BAD_REQUEST") {
      errorMessage.value = 'Bad request: Please check your input and try again.';
    } else {
      errorMessage.value = 'Failed to add station. Please try again.';
    }
  }
};
</script>
