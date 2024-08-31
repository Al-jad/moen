<template>
  <div>
    <div class="mt-12 container">
      <div v-if="ManualStation.loading">Loading...</div>
      <div v-if="ManualStation.error" class="error">{{ ManualStation.error }}</div>
      <Table :value="ManualStation.data?.data" v-else />
    </div>
  </div>
</template>

<script setup>
const ManualStation = useManualStation();
console.log(ManualStation.data);
onMounted(() => {
  ManualStation.fetchData();
});
</script>
