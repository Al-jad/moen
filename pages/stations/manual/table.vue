<template>
  <div class="container">
    <div class="mt-12">
      <div class="card justify grid grid-cols-2 gap-4 sm:w-full sm:gap-2">
        <div>
          <DatePicker v-model="date" view="month" dateFormat="mm/yy" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <div class="select">
            <SelectButton
              class="select mx-auto"
              v-model="value"
              :options="options"
              @update:modelValue="handleViewChange"
            />
          </div>
          <IconField>
            <InputText
              :pt="{
                root: {
                  class: '!bg-LightGray !text-black !border-none hover:!border-black'
                }
              }"
              v-model="searchVal"
              placeholder="Search"
            />
            <InputIcon
              :pt="{
                root: {
                  class: '!text-black'
                }
              }"
              class="pi pi-search w-12"
            />
          </IconField>
        </div>
      </div>
      <div class="container">
        <div v-if="ManualStation.loading">Loading...</div>
        <div v-if="ManualStation.error" class="error">{{ ManualStation.error }}</div>
        <Table :value="filteredData" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
const ManualStation = useManualStation();
const Stations = ref([]);
const value = ref('Table View');
const options = ref(['Table View', 'Map View']);
const searchVal = ref('');
const date = ref('');
const router = useRouter();

const handleViewChange = (newValue) => {
  router.push(newValue === 'Table View' ? '/stations/manual/table' : '/stations/manual/map');
};

const filteredData = computed(() => {
  return Stations.value.filter(
    (station) =>
      station.station.name.toLowerCase().includes(searchVal.value.toLowerCase()) ||
      station.station.city.toLowerCase().includes(searchVal.value.toLowerCase()) ||
      station.station.externalId.toLowerCase().includes(searchVal.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    await ManualStation.fetchData();
    Stations.value = ManualStation.data?.data || [];
  } catch (error) {
    console.error('Error fetching station data:', error);
  }
});
</script>
