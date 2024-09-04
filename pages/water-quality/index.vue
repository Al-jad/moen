<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-6 text-center text-3xl font-bold">Water Quality</h1>
    <div class="mb-8 flex flex-wrap gap-4 justify-center items-center">
      <div class="flex-1 min-w-[150px]">
        <label for="city-select" class="mb-1 block text-xs font-medium text-gray-700">
          Governorate:
        </label>
        <Select
          id="city-select"
          v-model="selectedCity"
          :options="citiesWithAll"
          optionLabel="name"
          optionValue="city"
          placeholder="Choose a city"
          @change="updateStations"
          class="w-full p-inputtext-sm"
        />
      </div>
      <div class="flex-1 min-w-[150px]">
        <label for="station-select" class="mb-1 block text-xs font-medium text-gray-700">
          Station:
        </label>
        <Select
          id="station-select"
          v-model="selectedStation"
          :options="stationsWithAll"
          optionLabel="name"
          optionValue="id"
          placeholder="Choose a station"
          :disabled="!selectedCity"
          class="w-full p-inputtext-sm"
        />
      </div>
      <div class="flex-1 min-w-[250px]" v-if="viewMode !== 'Map'">
        <label for="date-range" class="mb-1 block text-xs font-medium text-gray-700">
          Date Range:
        </label>
        <div class="flex items-center gap-2">
          <DatePicker
            id="date-from"
            v-model="selectedDateFrom"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            placeholder="From"
            class="flex-1 p-inputtext-sm"
          />
          <DatePicker
            id="date-to"
            v-model="selectedDateTo"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            placeholder="To"
            class="flex-1 p-inputtext-sm"
          />
        </div>
      </div>
      <div class="flex-1 min-w-[150px]">
        <SelectButton
          v-model="viewMode"
          :options="viewOptions"
          @change="handleViewChange"
          class="p-button-sm"
        />
      </div>
      <div class="flex-1 min-w-[150px]">
        <InputText
          v-model="searchQuery"
          placeholder="Search..."
          class="w-full p-inputtext-sm"
        />
      </div>
    </div>
    <Table
      v-if="viewMode === 'Data'"
      :value="filteredData"
      class="overflow-hidden rounded-lg shadow-lg"
    />
    <div v-else-if="viewMode === 'Map'" class="mt-12">
      <Map :stations="mapStations" />
    </div>
  </div>
</template>

<script setup>
const selectedCity = ref('All');
const selectedStation = ref('All');
const selectedDateFrom = ref(null);
const selectedDateTo = ref(null);
const searchQuery = ref('');
const cities = ref([]);
const stations = ref([]);
const viewMode = ref('Data');
const viewOptions = ['Data', 'Map'];
const manualStationStore = useManualStation();
const manualDetailsStore = useManualDetails();
const router = useRouter();
const route = useRoute();

const handleViewChange = (newValue) => {
  if (newValue === 'Data') {
    router.push({ name: 'water-quality' });
  } else if (newValue === 'Map') {
    router.push({ name: 'stations-map' });
  }
};

onMounted(async () => {
  await Promise.all([
    manualStationStore.fetchData(),
    manualDetailsStore.fetchData()
  ]);
  updateCities();
  viewMode.value = route.name === 'stations-map' ? 'Map' : 'Data';
});

const updateCities = () => {
  if (manualDetailsStore.data) {
    const uniqueCities = [...new Set(manualDetailsStore.data.map((item) => item.city).filter(Boolean))];
    cities.value = uniqueCities.map((city) => ({ name: city, city: city }));
  }
};

const updateStations = () => {
  if (manualDetailsStore.data) {
    stations.value = manualDetailsStore.data
      .filter((item) => selectedCity.value === 'All' || item.city === selectedCity.value)
      .map((item) => ({ name: item.name, id: item.id }))
      .filter((station) => station.name && station.id);
  }
};

watch(selectedCity, () => {
  updateStations();
});

const citiesWithAll = computed(() => [
  { name: 'All', city: 'All' },
  ...cities.value
]);

const stationsWithAll = computed(() => [
  { name: 'All', id: 'All' },
  ...stations.value
]);

const filteredData = computed(() => {
  if (!manualStationStore.data?.data) return [];
  let filtered = manualStationStore.data.data;
  
  if (selectedCity.value !== 'All') {
    filtered = filtered.filter((item) => item.station?.city === selectedCity.value);
  }
  
  if (selectedStation.value !== 'All') {
    filtered = filtered.filter((item) => item.station?.id === selectedStation.value);
  }
  
  if (selectedDateFrom.value && selectedDateTo.value) {
    const fromDate = new Date(selectedDateFrom.value);
    const toDate = new Date(selectedDateTo.value);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.timeStamp);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => 
      item.station?.name.toLowerCase().includes(query) ||
      item.station?.city.toLowerCase().includes(query) ||
      item.station?.externalId.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [day, month, year].join('/');
};

const mapStations = computed(() => {
  if (!manualDetailsStore.data) {
    console.log('manualDetailsStore.data is empty or undefined');
    return [];
  }
  let result = manualDetailsStore.data
    .filter(item => 
      item.lat &&
      item.lng &&
      (selectedCity.value === 'All' || item.city === selectedCity.value) &&
      (selectedStation.value === 'All' || item.id === selectedStation.value)
    )
    .map(item => ({
      id: item.id,
      name: item.name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      lastEntryData: item.lastEntryData
    }));
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((item) => 
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  }
  
  console.log('Map data:', result);
  console.log('Map data length:', result.length);
  
  return result;
});
</script>
