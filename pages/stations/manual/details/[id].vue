<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="mr-2 text-2xl font-bold text-black">Water Quality</h1>
        <Icon name="fluent:water-16-filled" class="text-3xl text-blue-500" />
      </div>
      <NuxtLink href="/water-quality" class="text-blue-500 hover:underline">
        Back to Water Quality
      </NuxtLink>
    </div>
    <div class="mb-8 flex items-center justify-between"></div>

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
        {{ stdata.station?.name || 'N/A' }}
      </h2>
      <DataTable
        class="text-nowrap !bg-DarkBlue"
        v-if="stdata.length > 0"
        :value="stdata"
        :paginator="true"
        :rows="20"
      >
        <Column field="timeStamp" headerClass="!bg-DarkBlue  !text-white" header="Date">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.timeStamp) }}
          </template>
        </Column>
        <Column field="wqi" headerClass="!bg-DarkBlue !text-white" header="Water Quality Index">
          <template #body="slotProps">
            <div
              v-if="slotProps.data.wqi"
              :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]"
              class="ml-10 inline-flex"
            >
              <span class="wqi-value">{{ slotProps.data.wqi }}</span>
              <span class="wqi-description">{{ getWQIDescription(slotProps.data.wqi) }}</span>
            </div>
            <span v-else class="ml-16">N/A</span>
          </template>
        </Column>
        <Column field="ph" headerClass="!bg-DarkBlue !text-white" header="pH"></Column>
        <Column field="temp" headerClass="!bg-DarkBlue !text-white" header="Temp">
          <template #body="slotProps">{{ slotProps.data.temp }} °C</template>
        </Column>
        <Column field="dO2" headerClass="!bg-DarkBlue !text-white" header="DO2">
          <template #body="slotProps">{{ slotProps.data.dO2 }} mg/L</template>
        </Column>
        <Column field="boD5" headerClass="!bg-DarkBlue !text-white" header="BOD5"></Column>
        <Column field="pO4" headerClass="!bg-DarkBlue !text-white" header="PO4"></Column>
        <Column field="nO3" headerClass="!bg-DarkBlue !text-white" header="NO3"></Column>
        <Column field="ca" headerClass="!bg-DarkBlue !text-white" header="Ca"></Column>
        <Column field="mg" headerClass="!bg-DarkBlue !text-white" header="Mg"></Column>
        <Column field="th" headerClass="!bg-DarkBlue !text-white" header="Total Hardness"></Column>
        <Column field="k" headerClass="!bg-DarkBlue !text-white" header="K"></Column>
        <Column field="na" headerClass="!bg-DarkBlue !text-white" header="Na"></Column>
        <Column field="sO4" headerClass="!bg-DarkBlue !text-white" header="SO4"></Column>
        <Column field="cl" headerClass="!bg-DarkBlue !text-white" header="Cl"></Column>
        <Column
          field="tds"
          headerClass="!bg-DarkBlue !text-white"
          header="Total Dissolved Solids"
        ></Column>
        <Column
          field="ec"
          headerClass="!bg-DarkBlue !text-white"
          header="Electrical Conductivity"
        ></Column>
        <Column field="alk" headerClass="!bg-DarkBlue !text-white" header="Alkalinity"></Column>
        <Column field="acid" headerClass="!bg-DarkBlue !text-white" header="Acidity"></Column>
        <Column field="onG" headerClass="!bg-DarkBlue !text-white" header="OnG"></Column>
        <Column field="turb" headerClass="!bg-DarkBlue !text-white" header="Turbidity"></Column>
      </DataTable>
      <p v-else class="text-center text-lg">No data available for this station.</p>
    </div>
    <div class="w-full rounded-lg bg-white p-6 shadow-md mt-12">
      <div class="my-16">
        <span class="p-float-label flex gap-4 items-center">
          <label for="paramSelector">Select Parameter</label>
          <Select
            v-model="selectedParam" checkmark
            :options="availableParams"
            optionLabel="label"
            optionValue="value"
            inputId="paramSelector"
            class="!w-40 p-inputtext-xs !border-2 !border-gray-300 !bg-gray-100 !text-black"
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
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, ToolboxComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, ToolboxComponent]);

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

const chartOption = computed(() => {
  if (!stdata.value) return {};

  const dates = stdata.value.map((item) => formatDate(item.timeStamp));
  const values = stdata.value.map((item) => item[selectedParam.value]);

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

provide(THEME_KEY, 'light');
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
  @apply flex h-16 w-16 flex-col items-center justify-center rounded-full shadow-sm;
}

.wqi-value {
  @apply text-sm font-bold;
}

.wqi-description {
  @apply text-xs;
}

.excellent {
  @apply bg-blue-500;
}
.good {
  @apply bg-green-500;
}
.fair {
  @apply bg-yellow-500;
}
.poor {
  @apply bg-orange-500;
}
.very-poor {
  @apply bg-red-500;
}

.p-datatable tr {
  @apply cursor-pointer !bg-DarkBlue;
}
.p-paginator {
  @apply !bg-DarkBlue !text-white;
}

.p-datatable .p-datatable-tbody > tr.p-row-even {
  @apply !bg-gray-100 !text-black;
}
.p-datatable .p-datatable-tbody > tr.p-row-odd {
  @apply !bg-gray-200 !text-black;
}
.p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
  @apply !bg-gray-300 !text-black;
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
</style>
