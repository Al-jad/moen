<template>
  <div class="container">
    <div class="flex flex-col">
      <h1 class="text-2xl m-auto font-bold my-4">Map Page</h1>
    </div>
    <Map :stations="StationDetails" />
  </div>
</template>

<script setup>
const StationDetails = useManualDetails();
const data = ref([]);

onMounted(async () => {
  await StationDetails.fetchData();
  data.value = StationDetails.data;
});
</script>
