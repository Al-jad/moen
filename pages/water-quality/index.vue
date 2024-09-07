<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex flex-col items-center">
      <div class="mb-4 flex w-full sm:flex-col justify-between items-center sm:justify-center">
        <div class="flex items-center mb-4">
          <h1 class="mr-2 text-2xl font-bold text-black">Water Quality</h1>
          <Icon name="fluent:water-16-filled" class="text-3xl text-blue-500" />
        </div>
        <div class="sm:mt-4">
          <SelectButton
            v-model="viewMode"
            :options="viewOptions"
            @change="handleViewChange"
            class="p-button-sm"
          />
        </div>
      </div>
    </div>
    <div
      class="mb-10 flex flex-wrap items-center justify-center gap-6 rounded-lg bg-gray-300 p-6 shadow-md"
    >
      <div class="min-w-[150px] flex-1">
        <label for="city-select" class="mb-2 block text-sm font-semibold text-gray-700">
          City:
        </label>
        <MultiSelect
          id="city-select"
          v-model="selectedCities"
          :options="cities"
          optionLabel="name"
          optionValue="city"
          placeholder="Choose governorates"
          @change="updateStations"
          class="p-inputtext-xs w-full !border-2 !border-gray-300 !bg-white"
          :showToggleAll="false"
          display="chip"
        >
          <template #header>
            <div class="bg-white p-1">
              <div
                @click="toggleAllCities"
                class="cursor-pointer rounded-sm !bg-gray-100 p-2 text-black hover:!bg-gray-300"
              >
                <Checkbox @change="toggleAllCities" v-model="allCitiesSelected" :binary="true" />
                <span class="ml-2">{{ allCitiesSelected ? 'Deselect All' : 'Select All' }}</span>
              </div>
            </div>
          </template>
        </MultiSelect>
      </div>
      <div class="min-w-[150px] flex-1">
        <label for="station-select" class="mb-2 block text-sm font-semibold text-gray-700">
          Station:
        </label>
        <MultiSelect
          id="station-select"
          v-model="selectedStations"
          :options="stations"
          optionLabel="name"
          optionValue="id"
          placeholder="Choose stations"
          :disabled="selectedCities.length === 0"
          class="p-inputtext-xs w-full !border-2 !border-gray-300 !bg-white"
          :showToggleAll="false"
          display="chip"
        >
          <template #header>
            <div class="bg-white p-1">
              <div
                @click="toggleAllStations"
                class="cursor-pointer rounded-sm !bg-gray-100 p-2 text-black hover:!bg-gray-300"
              >
                <Checkbox @change="toggleAllStations" v-model="allStationsSelected" :binary="true" />
                <span class="ml-2">{{ allStationsSelected ? 'Deselect All' : 'Select All' }}</span>
              </div>
            </div>
          </template>
        </MultiSelect>
      </div>
      <div class="min-w-[300px] flex-1" v-if="viewMode !== 'Map'">
        <label for="date-range" class="mb-2 block text-sm font-semibold text-gray-700">
          Date Range:
        </label>
        <div class="flex items-center gap-3">
          <DatePicker
            id="date-from"
            v-model="selectedDateFrom"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            placeholder="From"
            class="p-inputtext-sm flex-1"
          />
          <DatePicker
            id="date-to"
            v-model="selectedDateTo"
            :showIcon="true"
            dateFormat="dd/mm/yy"
            placeholder="To"
            class="p-inputtext-sm flex-1"
          />
        </div>
      </div>
      <div class="max-w-[300px] flex-1">
        <label for="search" class="mb-2 block text-sm font-semibold text-gray-700">Search:</label>
        <InputText
          id="search"
          v-model="searchQuery"
          placeholder="Search by station name, city, or external ID"
          class="p-inputtext-sm w-full !h-11 !border-2 !border-gray-300 !bg-white"
        />
      </div>
    </div>
    <Table
      v-if="viewMode === 'Data'"
      :value="filteredData"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
    />
    <div v-else-if="viewMode === 'Map'" class="mt-12">
      <Map :stations="filteredMapStations" />
    </div>
  </div>
</template>

<script setup>
const selectedCities = ref([]);
const selectedStations = ref([]);
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

const allCitiesSelected = ref(true);
const allStationsSelected = ref(true);

const handleViewChange = (newValue) => {
  router.push({ name: newValue === 'Data' ? 'water-quality' : 'stations-map' });
};

onMounted(async () => {
  await Promise.all([manualStationStore.fetchData(), manualDetailsStore.fetchData()]);
  updateCities();
  viewMode.value = route.name === 'stations-map' ? 'Map' : 'Data';
});

const updateCities = () => {
  if (manualDetailsStore.data) {
    const uniqueCities = [
      ...new Set(manualDetailsStore.data.map((item) => item.city).filter(Boolean))
    ];
    cities.value = uniqueCities.map((city) => ({ name: city, city: city }));
    selectedCities.value = uniqueCities;
  }
};

const updateStations = () => {
  if (manualDetailsStore.data) {
    stations.value = manualDetailsStore.data
      .filter((item) => selectedCities.value.includes(item.city))
      .map((item) => ({ name: item.name, id: item.id }))
      .filter((station) => station.name && station.id);
    selectedStations.value = stations.value.map((station) => station.id);
  }
};

watch(selectedCities, () => {
  updateStations();
  allStationsSelected.value = selectedStations.value.length === stations.value.length;
});

const toggleAllCities = () => {
  allCitiesSelected.value = !allCitiesSelected.value;
  selectedCities.value = allCitiesSelected.value ? cities.value.map((city) => city.city) : [];
};

const toggleAllStations = () => {
  allStationsSelected.value = !allStationsSelected.value;
  selectedStations.value = allStationsSelected.value
    ? stations.value.map((station) => station.id)
    : [];
};

const filteredData = computed(() => {
  if (!manualStationStore.data?.data) return [];
  let filtered = manualStationStore.data.data;

  filtered = filtered.filter(
    (item) =>
      selectedCities.value.includes(item.station?.city) &&
      selectedStations.value.includes(item.station?.id)
  );

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
    filtered = filtered.filter(
      (item) =>
        item.station?.name.toLowerCase().includes(query) ||
        item.station?.city.toLowerCase().includes(query) ||
        item.station?.externalId.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const formatDate = (date) => {
  const d = new Date(date);
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const mapStations = computed(() => {
  if (!manualDetailsStore.data) {
    console.warn('manualDetailsStore.data is empty or undefined');
    return [];
  }
  return manualDetailsStore.data
    .filter((item) => item.lat && item.lng)
    .map((item) => ({
      id: item.id,
      name: item.name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      lastEntryData: item.lastEntryData,
      city: item.city,
      externalId: item.externalId
    }));
});

const filteredMapStations = computed(() => {
  let filtered = mapStations.value;

  filtered = filtered.filter(
    (item) => selectedCities.value.includes(item.city) && selectedStations.value.includes(item.id)
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.externalId.toLowerCase().includes(query)
    );
  }

  return filtered;
});
</script>

<style>
.p-selectbutton .p-togglebutton {
  @apply !bg-gray-300 !text-black;
}
.p-selectbutton .p-togglebutton-checked {
  @apply !text-white;
}
.p-chip-remove-icon {
  @apply !text-black;
}
.p-datepicker-input {
  @apply !border-2 !border-gray-300 !bg-white !text-black;
}
.p-datepicker-dropdown {
  @apply !border-2 !border-gray-300 !bg-gray-200;
}
.p-datepicker-dropdown .p-icon {
  @apply text-black;
}
.p-multiselect-chip {
  @apply !bg-gray-200 !text-black;
}
.p-multiselect {
  @apply border-2 border-gray-300 bg-white;
}

.p-multiselect-option {
  @apply !bg-gray-100 !text-black hover:!bg-gray-300;
}

.p-multiselect-trigger {
  @apply bg-gray-100;
}
.p-checkbox-box {
  @apply !border-gray-600 !bg-gray-600;
}
.p-checkbox-icon {
  @apply !text-white;
}
.p-multiselect-item {
  @apply text-gray-700 hover:bg-gray-300;
}

.p-multiselect-item.p-highlight {
  @apply bg-gray-200 text-gray-900;
}

.p-multiselect-chip {
  @apply bg-gray-200 text-gray-700;
}

.p-checkbox .p-checkbox-box {
  @apply border-gray-300;
}

.p-checkbox .p-checkbox-box.p-highlight {
  @apply border-gray-500 bg-gray-500;
}

.p-multiselect-header {
  @apply border-b border-gray-300 bg-gray-100;
}

.p-multiselect-close {
  @apply text-gray-500 hover:text-gray-700;
}

.p-multiselect-filter-container .p-inputtext {
  @apply border-gray-300;
}
.p-multiselect-list {
  @apply border-2 border-gray-300 bg-white;
}
.p-multiselect-option {
  @apply text-black focus:!bg-gray-100;
}
.p-multiselect-item {
  @apply !text-black;
}
</style>
