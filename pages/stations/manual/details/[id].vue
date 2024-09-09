<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="fluent:water-16-filled" class="text-3xl text-blue-500" />
        <h1 class="mr-2 text-2xl font-bold text-black">Water Quality Monitoring Data</h1>
      </div>
      <!-- <NuxtLink href="/water-quality" class="text-blue-500 hover:underline">
        Back to Water Quality
      </NuxtLink> -->
    </div>

    <div v-if="isLoading" class="text-center">
      <p class="text-lg">Loading station data...</p>
    </div>

    <div
      v-else-if="stationData.error"
      class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
      role="alert"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ stationData.error }}</span>
    </div>

    <div v-else-if="stdata" class="min-w-full rounded-lg bg-white p-6 shadow-md">
      <h2 class="mb-4 text-xl font-semibold">
        Station:
        {{ stdata.station?.name || 'N/A' }}
      </h2>
      <h2 class="text-xl font-semibold">
        City:
        {{ stdata.station?.city || 'N/A' }}
      </h2>
      <div class=" flex flex-row items-center">
        <p class="mr-2 text-lg font-semibold">Average Water Quality Index:</p>
        <div :class="['wqi-cell', getWQIClass(averageWQI)]">
          <span class="wqi-value font-semibold">{{ averageWQI }}</span>
          <span class="wqi-description font-semibold">{{ getWQIDescription(averageWQI) }}</span>
        </div>
      </div>
      <div class="mb-8 flex items-center justify-between">
        <div class="min-w-[300px] flex-1">
          <div class="mt-6 flex items-center gap-3">
            <FloatLabel>
              <DatePicker
                id="date-from"
                v-model="selectedDateFrom"
                :showIcon="true"
                dateFormat="dd/mm/yy"
                class="p-inputtext-sm flex-1"
              />
              <label for="date-from" class="block px-2 text-sm font-semibold !text-gray-700">
                From
              </label>
            </FloatLabel>
            <FloatLabel>
              <DatePicker
                id="date-to"
                v-model="selectedDateTo"
                :showIcon="true"
                dateFormat="dd/mm/yy"
                class="p-inputtext-sm flex-1"
              />
              <label for="date-to" class="block px-2 text-sm font-semibold !text-gray-700">
                To
              </label>
            </FloatLabel>
            <Button
              label="Reset"
              icon="pi pi-refresh"
              @click="resetDatePicker"
              class="p-button-sm p-button-secondary"
            />
          </div>
        </div>
      </div>
      <div v-if="filteredData.length === 0 && selectedDateFrom && selectedDateTo" class="mb-4 text-center text-red-500">
        No data available for the selected date range.
      </div>
      <DataTable
        class="text-nowrap !bg-DarkBlue"
        v-if="filteredData.length > 0"
        :value="filteredData"
        :paginator="true"
        :rows="20"
      >
        <Column
          field="timeStamp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white  !text-white"
          header="Date"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.timeStamp) }}
          </template>
        </Column>
        <Column
          field="timeStamp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white  !text-white"
          header="Time"
        >
          <template #body="slotProps">
            {{ formatTime(slotProps.data.timeStamp) }}
          </template>
        </Column>
        <Column
          field="wqi"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex">
              <p class="m-auto text-base font-semibold">WQI</p>
            </div>
          </template>
          <template #body="slotProps">
            <div
              v-if="slotProps.data.wqi"
              :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]"
              class="ml-10 inline-flex"
            >
              <span class="wqi-value">{{ slotProps.data.wqi }}</span>
              <span class="wqi-description">{{ getWQIDescription(slotProps.data.wqi) }}</span>
            </div>
            <span v-else class="ml-16">0</span>
          </template>
        </Column>
        <Column
          field="ph"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">pH</p>
            </div>
          </template>
        </Column>
        <Column
          field="temp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Temp</p>
              <div class="text-sm">(°C)</div>
            </div>
          </template>
          <template #body="slotProps">{{ slotProps.data.temp }} °C</template>
        </Column>
        <Column
          field="dO2"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">DO2</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
          <template #body="slotProps">{{ slotProps.data.dO2 }} mg/L</template>
        </Column>
        <Column
          field="boD5"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">BOD5</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="pO4"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">PO4</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="nO3"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">NO3</p>
              <div class="text-sm">(mg/L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="ca"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Ca</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="mg"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Mg</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="th"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">T. H.</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column field="k" headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white">
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">K</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="na"
          headerClass="!bg-DarkBlue  !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Na</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="sO4"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">SO4</p>
              <div class="text-sm">(mg /L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="cl"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Cl</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="tds"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">TDS</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="ec"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">EC</p>
              <div class="text-sm">(μS / cm)</div>
            </div>
          </template>
        </Column>
        <Column
          field="alk"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Alk.</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="acid"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Acid</p>
              <div class="text-sm">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="onG"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">OnG</p>
              <div class="text-sm">(mg/L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="turb"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold">Turb</p>
              <div class="text-sm">(NTU)</div>
            </div>
          </template>
        </Column>
      </DataTable>
      <p v-else-if="!selectedDateFrom || !selectedDateTo" class="text-center text-lg">No data available for this station.</p>
    </div>
    <div class="mt-6 w-full rounded-lg bg-white p-6 shadow-md">
      <div class="my-8">
        <span class="p-float-label flex items-center gap-4">
          <label for="paramSelector">Select Parameter</label>
          <Select
            v-model="selectedParam"
            checkmark
            :options="availableParams"
            optionLabel="label"
            optionValue="value"
            inputId="paramSelector"
            class="p-inputtext-xs !w-40 !border-2 !border-gray-300 !bg-gray-100 !text-black"
          />
        </span>
      </div>

      <client-only>
        <v-chart class="chart" :option="chartOption" autoresize />
      </client-only>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent
]);

const route = useRoute();
const stationData = useStationData();
const isLoading = ref(true);
const stdata = ref(null);
const selectedParam = ref('wqi');

const availableParams = [
  { value: 'wqi', label: 'Water Quality Index', code: 'WQI' },
  { value: 'ph', label: 'pH', code: 'PH' },
  { value: 'temp', label: 'Temperature', code: 'TEMP' },
  { value: 'dO2', label: 'Dissolved Oxygen', code: 'DO2' },
  { value: 'boD5', label: 'Biochemical Oxygen Demand', code: 'BOD5' },
  { value: 'pO4', label: 'Phosphate', code: 'PO4' },
  { value: 'nO3', label: 'Nitrate', code: 'NO3' },
  { value: 'ca', label: 'Calcium', code: 'CA' },
  { value: 'mg', label: 'Magnesium', code: 'MG' },
  { value: 'th', label: 'Total Hardness', code: 'TH' },
  { value: 'k', label: 'Potassium', code: 'K' },
  { value: 'na', label: 'Sodium', code: 'NA' },
  { value: 'sO4', label: 'Sulfate', code: 'SO4' },
  { value: 'cl', label: 'Chloride', code: 'CL' },
  { value: 'tds', label: 'Total Dissolved Solids', code: 'TDS' },
  { value: 'ec', label: 'Electrical Conductivity', code: 'EC' },
  { value: 'alk', label: 'Alkalinity', code: 'ALK' },
  { value: 'acid', label: 'Acidity', code: 'ACID' },
  { value: 'onG', label: 'Oil and Grease', code: 'ONG' },
  { value: 'turb', label: 'Turbidity', code: 'TURB' }
];

const selectedDateFrom = ref(null);
const selectedDateTo = ref(null);

onMounted(async () => {
  const stationId = route.params.id;
  try {
    await stationData.fetchData(stationId);
    stdata.value = stationData.data;
    if (!stdata.value || !stdata.value.data) {
      throw new Error('No data received from the server');
    }
    stdata.value = stdata.value.data;
  } catch (error) {
    console.error('Error fetching station data:', error);
    stationData.error = 'Failed to fetch station data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getWQIClass = (wqi) => {
  if (wqi >= 95) return 'excellent';
  if (wqi >= 80) return 'good';
  if (wqi >= 65) return 'fair';
  if (wqi >= 45) return 'poor';
  return 'very-poor';
};

const getWQIDescription = (wqi) => {
  if (wqi >= 95) return 'ممتاز';
  if (wqi >= 80) return 'جيد';
  if (wqi >= 65) return 'مقبول';
  if (wqi >= 45) return 'ردئ';
  return 'مرفوض';
};

const filteredData = computed(() => {
  if (!stdata.value) return [];
  let filtered = stdata.value;

  if (selectedDateFrom.value && selectedDateTo.value) {
    const fromDate = new Date(selectedDateFrom.value);
    const toDate = new Date(selectedDateTo.value);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.timeStamp);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }

  return filtered;
});

const averageWQI = computed(() => {
  if (!filteredData.value || filteredData.value.length === 0) return '0';
  const sum = filteredData.value.reduce((acc, curr) => acc + (curr.wqi || 0), 0);
  return (sum / filteredData.value.length).toFixed(2);
});

const chartOption = computed(() => {
  if (!filteredData.value) return {};

  const dates = filteredData.value.map((item) => formatDate(item.timeStamp));
  const values = filteredData.value.map((item) => item[selectedParam.value]);

  return {
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2
        }
      }
    ],
    tooltip: {
      trigger: 'axis'
    }
  };
});

const resetDatePicker = () => {
  selectedDateFrom.value = null;
  selectedDateTo.value = null;
};

provide(THEME_KEY, 'light');
</script>

<style>
/* ... (styles remain unchanged) ... */
</style>
