<template>
  <div class="container mx-auto px-4 py-8">
    <NuxtLink
      to="/water-quality"
      class="mb-4 flex items-center text-blue-500 hover:underline sm:text-xs"
    >
      <Icon name="mdi:arrow-left" class="mr-1" />
      Back to All Stations
    </NuxtLink>
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon name="fluent:water-16-filled" class="text-3xl text-blue-500 sm:text-xl" />
        <h1 class="mr-2 text-2xl font-bold text-black sm:text-lg">Water Quality Monitoring Data</h1>
      </div>
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

    <div
      v-else-if="stdata"
      class="min-w-full rounded-lg bg-white p-6 text-lg font-semibold shadow-md sm:text-sm"
    >
      <h2 class="mb-4">
        Station:
        {{ stationData?.stationName }}
      </h2>
      <h2 class="font-semibold">
        City:
        {{ stationData.StationCity || 'N/A' }}
      </h2>
      <div class="flex flex-row items-center">
        <p class="mr-2">Average Water Quality Index:</p>
        <div :class="['wqi-cell', getWQIClass(averageWQI)]">
          <span class="wqi-value">{{ averageWQI }}</span>
          <span class="wqi-description">{{ getWQIDescription(averageWQI) }}</span>
        </div>
      </div>
      <div class="mb-8">
        <div class="flex min-w-[300px] flex-col">
          <div class="mt-6 flex flex-row gap-4 sm:gap-2">
            <FloatLabel class="m-auto w-[50%] sm:w-full">
              <DatePicker
                id="date-from"
                v-model="selectedDateFrom"
                :showIcon="true"
                dateFormat="dd/mm/yy"
                class="p-inputtext-sm w-full sm:w-full"
              />
              <label for="date-from" class="block px-2 text-sm font-semibold !text-gray-700">
                From
              </label>
            </FloatLabel>
            <FloatLabel class="m-auto w-[50%] sm:w-full">
              <DatePicker
                id="date-to"
                v-model="selectedDateTo"
                :showIcon="true"
                dateFormat="dd/mm/yy"
                class="p-inputtext-sm w-full sm:w-full"
              />
              <label for="date-to" class="block px-2 text-sm font-semibold !text-gray-700">
                To
              </label>
            </FloatLabel>
            <Button
              label="Reset"
              icon="pi pi-refresh"
              @click="resetDatePicker"
              class="p-button-sm p-button-secondary m-auto h-10 w-[30%] !bg-DarkBlue !text-white transition-colors duration-300 hover:!bg-DarkNavy sm:!hidden"
            />
          </div>
          <div class="m-auto mt-2 hidden sm:block">
            <Button
              label="Reset"
              icon="pi pi-refresh"
              @click="resetDatePicker"
              class="p-button-sm p-button-secondary m-auto h-10 w-[30%] !bg-DarkBlue !text-white transition-colors duration-300 hover:!bg-DarkNavy sm:m-auto sm:w-full"
            />
          </div>
        </div>
      </div>
      <div
        v-if="filteredData.length === 0 && selectedDateFrom && selectedDateTo"
        class="mb-4 text-center text-red-500"
      >
        No data available for the selected date range.
      </div>
      <DataTable
        class="text-nowrap !bg-DarkBlue"
        v-if="filteredData.length > 0"
        :value="filteredData"
        :paginator="true"
        :rows="10"
      >
        <Column
          field="timeStamp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white  !text-white sm:text-sm"
          bodyClass="!text-center"
          header="Date"
        >
          <template #body="slotProps">
            {{ formatDate(slotProps.data.timeStamp) }}
          </template>
        </Column>
        <Column
          field="timeStamp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white  !text-white sm:text-sm"
          bodyClass="!text-center"
          header="Time"
        >
          <template #body="slotProps">
            {{ formatTime(slotProps.data.timeStamp) }}
          </template>
        </Column>
        <Column
          field="wqi"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white sm:text-sm"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex items-center justify-center">
              <p class="ml-2 text-base font-semibold sm:text-sm">WQI</p>
            </div>
          </template>
          <template #body="slotProps">
            <div
              v-if="slotProps.data.wqi"
              :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]"
              class="inline-flex"
            >
              <span class="wqi-value">{{ slotProps.data.wqi }}</span>
              <span class="wqi-description">{{ getWQIDescription(slotProps.data.wqi) }}</span>
            </div>
            <div v-else class="wqi-cell very-poor inline-flex">
              <span class="wqi-value">0</span>
              <span class="wqi-description">مرفوض</span>
            </div>
          </template>
        </Column>
        <Column
          field="ph"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">pH</p>
            </div>
          </template>
        </Column>
        <Column
          field="temp"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Temp</p>
              <div class="text-sm sm:text-xs">( °C )</div>
            </div>
          </template>
          <template #body="slotProps">{{ slotProps.data.temp }} °C</template>
        </Column>
        <Column
          field="dO2"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">DO2</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
          <template #body="slotProps">{{ slotProps.data.dO2 }} mg/L</template>
        </Column>
        <Column
          field="boD5"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">BOD5</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="pO4"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">PO4</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="nO3"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">NO3</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="ca"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Ca</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="mg"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Mg</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="th"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">T. H.</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="k"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">K</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="na"
          headerClass="!bg-DarkBlue  !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Na</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="sO4"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">SO4</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="cl"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Cl</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="tds"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">TDS</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="ec"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">EC</p>
              <div class="text-sm sm:text-xs">( μS / cm )</div>
            </div>
          </template>
        </Column>
        <Column
          field="alk"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Alk.</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="acid"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Acid</p>
              <div class="text-sm sm:text-xs">(mg / L)</div>
            </div>
          </template>
        </Column>
        <Column
          field="onG"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">OnG</p>
              <div class="text-sm sm:text-xs">( mg / L )</div>
            </div>
          </template>
        </Column>
        <Column
          field="turb"
          headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
          bodyClass="!text-center"
        >
          <template #header>
            <div class="flex flex-col items-center gap-2">
              <p class="text-lg font-semibold sm:text-sm">Turb</p>
              <div class="text-sm sm:text-xs">( NTU )</div>
            </div>
          </template>
        </Column>
      </DataTable>
      <p v-else-if="!selectedDateFrom || !selectedDateTo" class="text-center text-lg">
        No data available for this station.
      </p>
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
            class="p-inputtext-xs !w-56 !border-2 !border-gray-300 !bg-gray-100 !text-black"
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
  return date.toLocaleTimeString('en-US', {
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

  const dates = filteredData.value.map((item) => formatDate(item.timeStamp)).reverse();
  const values = filteredData.value.map((item) => item[selectedParam.value]).reverse();

  const units = {
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
    ec: 'μS / cm',
    alk: 'mg/L',
    acid: 'mg / L',
    onG: 'mg / L',
    turb: 'NTU',
    wqi: 'unitless'
  };

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
      type: 'value',
      name: units[selectedParam.value],
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 'bold'
      }
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
      trigger: 'axis',
      formatter: function (params) {
        const value = params[0].value;
        const date = params[0].axisValue;
        return `${date}<br/>${selectedParam.value}: ${value} ${units[selectedParam.value]}`;
      }
    }
  };
});

const resetDatePicker = () => {
  selectedDateFrom.value = null;
  selectedDateTo.value = null;
};

provide(THEME_KEY, 'light');

onMounted(async () => {
  const stationId = route.params.id;
  try {
    await stationData.fetchData(stationId);
    stdata.value = stationData.data;
    if (!stdata.value || !stdata.value.data) {
      throw new Error('No data received from the server');
    }
    stdata.value = stdata.value.data;
    if (!stationData.stationName || !stationData.StationCity) {
      const storedStationName = localStorage.getItem('stationName');
      const storedStationCity = localStorage.getItem('stationCity');
      if (storedStationName && storedStationCity) {
        stationData.setStationInfo(storedStationCity, storedStationName);
      }
    }
  } catch (error) {
    console.error('Error fetching station data:', error);
    stationData.error = 'Failed to fetch station data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
.p-select-label {
  @apply !bg-gray-100 !text-black;
}
.p-select-list {
  @apply !bg-gray-100 !text-black;
}
.p-select-option {
  @apply !bg-gray-100 !text-black hover:!bg-gray-200;
}
.p-select-option-check-icon {
  @apply !text-black;
}
.p-datatable-thead {
  @apply !bg-DarkBlue !text-white;
}
.wqi-cell {
  @apply flex h-16 w-16 flex-col items-center justify-center rounded-full shadow-sm sm:h-12 sm:w-12;
}

.wqi-value {
  @apply text-sm font-bold sm:text-xs;
}

.wqi-description {
  @apply text-xs;
}

.excellent {
  @apply bg-blue-500 text-white;
}
.good {
  @apply bg-green-500 text-white;
}
.fair {
  @apply bg-yellow-500 text-black;
}
.poor {
  @apply bg-orange-500 text-white;
}
.very-poor {
  @apply bg-red-500 text-white;
}

.p-datatable tr {
  @apply cursor-pointer !bg-DarkBlue;
}
.p-paginator {
  @apply !bg-DarkBlue !text-white;
}

.p-datatable .p-datatable-tbody > tr.p-row-even {
  @apply !bg-gray-100 !text-center !text-black;
}
.p-datatable .p-datatable-tbody > tr.p-row-odd {
  @apply !bg-gray-200 !text-center !text-black;
}
.p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
  @apply !bg-gray-300 !text-center !text-black;
}
.p-paginator-rpp-dropdown {
  @apply border-white !bg-DarkNavy !text-white;
}
.p-select-overlay {
  @apply border-white !bg-DarkNavy !text-white hover:!bg-DarkBlue;
}

.chart {
  height: 500px;
  width: 100%;
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
</style>
