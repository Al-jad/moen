<template>
  <div class="container">
    <div class="flex flex-col">
      <h1 class="m-auto my-4 text-2xl font-bold">Map</h1>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div>
        <SelectButton
          class="!m-auto"
          v-model="value"
          :options="options"
          @update:modelValue="handleViewChange"
        />
      </div>
      <Map :stations="StationDetails" />
    </div>
  </div>
</template>

<script setup>
const StationDetails = useManualDetails();
const data = ref([]);
const value = ref('Map View');
const options = ref(['Table View', 'Map View']);
const router = useRouter();
const handleViewChange = (newValue) => {
  router.push(newValue === 'Map View' ? '/stations/manual/map' : '/stations/manual/table');
};
onMounted(async () => {
  await StationDetails.fetchData();
  data.value = StationDetails.data;
});
</script>
