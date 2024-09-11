<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-xl">Dashboard</h1>
    <form
      @submit.prevent="addData"
      class="mx-auto max-w-2xl space-y-8 rounded-lg bg-white p-8 shadow-lg"
    >
      <div>
        <label for="city-select" class="mb-2 block text-sm font-semibold text-gray-700">
          City:
        </label>
        <Select
          id="city-select"
          v-model="selectedCity"
          :options="cities"
          optionLabel="name"
          optionValue="city"
          @change="updateStations"
          class="p-inputtext-sm w-full !bg-gray-200 !text-black"
        >
          <template #option="slotProps">
            <div class="flex items-center justify-between">
              <span>{{ slotProps.option.name }}</span>
              <span class="ml-2 text-sm text-gray-500">
                ({{ getStationCount(slotProps.option.city) }})
              </span>
            </div>
          </template>
        </Select>
        <small v-if="!selectedCity" class="text-red-500">Please select a city</small>
      </div>
      <div>
        <label for="station-select" class="mb-2 block text-sm font-semibold text-gray-700">
          Station:
        </label>
        <Select
          id="station-select"
          v-model="selectedStation"
          :options="filteredStations"
          optionLabel="name"
          optionValue="id"
          :disabled="!selectedCity"
          class="p-inputtext-sm w-full !bg-gray-200 !text-black"
        />
        <small v-if="selectedCity && !selectedStation" class="text-red-500">
          Please select a station
        </small>
      </div>
      <div>
        <label for="timeStamp" class="mb-2 block text-sm font-semibold text-gray-700">
          Time Stamp
        </label>
        <DatePicker
          v-model="data.timeStamp"
          id="timeStamp"
          :showTime="true"
          dateFormat="dd/mm/yy"
          class="p-inputtext-sm w-full"
          :disabled="!selectedStation"
        />
        <small v-if="selectedStation && !data.timeStamp" class="text-red-500">
          Please select a date and time
        </small>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="(value, key) in dataFields" :key="key" class="rounded-md p-4 sm:p-0">
          <label :for="key" class="mb-2 block w-full text-sm font-semibold text-gray-700">
            {{ getFullParameterName(key) }} ( {{ getParameterUnit(key) }} )
          </label>
          <div class="flex items-center justify-center sm:justify-start">
            <InputNumber
              v-model="data[key]"
              :id="key"
              :step="1"
              :mode="'decimal'"
              :minFractionDigits="2"
              :maxFractionDigits="4"
              class="p-inputtext-sm block w-full max-w-[90%] sm:max-w-[70%]"
              :disabled="!selectedStation"
              placeholder="0"
            />
          </div>
          <small
            v-if="data[key] < minValues[key] || data[key] > maxValues[key]"
            class="mt-1 block text-red-500"
          >
            Value must be between {{ minValues[key] }} and {{ maxValues[key] }}
          </small>
        </div>
      </div>
      <div class="flex justify-end">
        <Button
          type="submit"
          label="Add Data"
          icon="pi pi-check"
          class="!border-none !bg-DarkBlue !text-white"
          :disabled="!isFormValid"
        />
      </div>
    </form>
    <div
      v-if="errorMessage"
      class="mt-6 rounded-lg border border-red-400 bg-red-100 p-4 text-red-700"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="successMessage"
      class="mt-6 rounded-lg border border-green-400 bg-green-100 p-4 text-green-700"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

onMounted(() => {
  if (process.client) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      router.push('/');
    }
  }
});

const manualStationStore = useManualDetails();

const selectedCity = ref('');
const selectedStation = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const inputMessages = ref({});

const data = reactive({
  timeStamp: null,
  stationId: 0,
  ph: null,
  temp: null,
  dO2: null,
  boD5: null,
  pO4: null,
  nO3: null,
  ca: null,
  mg: null,
  th: null,
  k: null,
  na: null,
  sO4: null,
  cl: null,
  tds: null,
  ec: null,
  alk: null,
  acid: null,
  onG: null,
  turb: null
});

const minValues = {
  ph: 0,
  temp: 0,
  dO2: 0,
  boD5: 0,
  pO4: 0,
  nO3: 0,
  ca: 0,
  mg: 0,
  th: 0,
  k: 0,
  na: 0,
  sO4: 0,
  cl: 0,
  tds: 0,
  ec: 0,
  alk: 0,
  acid: 0,
  onG: 0,
  turb: 0
};

const maxValues = {
  ph: 14,
  temp: 100,
  dO2: 20,
  boD5: 100,
  pO4: 100,
  nO3: 100,
  ca: 1000,
  mg: 500,
  th: 1000,
  k: 100,
  na: 2000,
  sO4: 1000,
  cl: 2000,
  tds: 10000,
  ec: 10000,
  alk: 500,
  acid: 500,
  onG: 1000,
  turb: 1000
};

const dataFields = computed(() => {
  const { timeStamp, stationId, ...rest } = data;
  return rest;
});

const cities = computed(() => {
  if (!manualStationStore.data) return [];
  const citySet = new Set(manualStationStore.data.map((item) => item.city));
  return [...Array.from(citySet).map((city) => ({ name: city, city: city }))];
});

const stations = computed(() => {
  if (!manualStationStore.data) return [];
  return manualStationStore.data.map((item) => ({
    id: item.id,
    name: item.name,
    city: item.city
  }));
});

const filteredStations = computed(() => {
  if (!selectedCity.value) return [];
  return [...stations.value.filter((station) => station.city === selectedCity.value)];
});

const getStationCount = (city) => {
  return stations.value.filter((station) => station.city === city).length;
};

const updateStations = () => {
  selectedStation.value = '';
};

const isFormValid = computed(() => {
  return (
    selectedCity.value &&
    selectedStation.value &&
    data.timeStamp &&
    Object.entries(dataFields.value).every(
      ([key, value]) => value !== null && value >= minValues[key] && value <= maxValues[key]
    )
  );
});

const getFullParameterName = (key) => {
  const parameterNames = {
    ph: 'pH',
    temp: 'Temperature',
    dO2: 'Dissolved Oxygen',
    boD5: 'Biochemical Oxygen Demand',
    pO4: 'Phosphate',
    nO3: 'Nitrate',
    ca: 'Calcium',
    mg: 'Magnesium',
    th: 'Total Hardness',
    k: 'Potassium',
    na: 'Sodium',
    sO4: 'Sulfate',
    cl: 'Chloride',
    tds: 'Total Dissolved Solids',
    ec: 'Electrical Conductivity',
    alk: 'Alkalinity',
    acid: 'Acidity',
    onG: 'Oil and Grease',
    turb: 'Turbidity'
  };
  return parameterNames[key] || key.toUpperCase();
};

const getParameterUnit = (key) => {
  const parameterUnits = {
    ph: 'unitless',
    temp: '°C',
    dO2: 'mg / L',
    boD5: 'mg / L',
    pO4: 'mg / L',
    nO3: 'mg / L',
    ca: 'mg / L',
    mg: 'mg / L',
    th: 'mg / L',
    k: 'mg / L',
    na: 'mg / L',
    sO4: 'mg / L',
    cl: 'mg / L',
    tds: 'mg / L',
    ec: 'µS / cm',
    alk: 'mg / L',
    acid: 'mg / L',
    onG: 'mg / L',
    turb: 'NTU'
  };
  return parameterUnits[key] || '';
};

const addData = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill all fields correctly before submitting.';
    successMessage.value = '';
    return;
  }

  try {
    errorMessage.value = '';
    successMessage.value = '';
    data.stationId = parseInt(selectedStation.value);
    data.timeStamp = data.timeStamp.toISOString();
    const { $axios } = useNuxtApp();
    const response = await $axios.post('/Data', data);
    console.log('Data added successfully:', response.data);
    successMessage.value = 'Data added successfully!';
    // Reset form after successful submission
    selectedCity.value = '';
    selectedStation.value = '';
    Object.keys(data).forEach((key) => {
      if (key !== 'stationId') {
        data[key] = key === 'timeStamp' ? null : null;
      }
    });
    inputMessages.value = {};
  } catch (error) {
    console.error('Error adding data:', error);
    errorMessage.value = 'Failed to add data. Please try again.';
    successMessage.value = '';
  }
};

onMounted(async () => {
  await manualStationStore.fetchData();
});
</script>

<style>
.p-select-list {
  @apply !bg-gray-200 !text-black;
}
.p-select-option {
  @apply !text-black;
}
.p-select-option:hover {
  @apply !bg-gray-300;
}
/* .p-focus {
  @apply !bg-gray-300 hover:!bg-gray-300;
} */
.p-select-option-selected {
  @apply !bg-gray-300;
}
.p-select-label {
  @apply !text-black;
}
.p-datepicker-input {
  @apply !bg-gray-200 !text-black;
}
.p-inputnumber-input {
  @apply !bg-gray-200 !text-black;
}
</style>
