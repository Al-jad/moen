<template>
  <div class="container">
    <DataTable
      showGridlines
      :paginator="true"
      stripedRows
      :value="value"
      rowGroupMode="rowspan"
      groupRowsBy="station.city"
      sortMode="single"
      sortField="station.city"
      :sortOrder="1"
      :rows="20"
      scrollable
      v-model:expandedRows="expandedRows"
      dataKey="id"
      class="hidden text-nowrap sm:block"
    >
      <!-- <Column field="station.city" header="City" style="max-width: 100px" /> -->
      <Column expander headerStyle="width: 3rem" style="padding: 0" />

      <Column
        v-for="col in visibleColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :class="col.class"
      >
        <template v-if="col.customBody" #body="slotProps">
          <div :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]">
            {{ slotProps.data.wqi }}
          </div>
        </template>
        <template v-else-if="col.field.includes('.')" #body="slotProps">
          {{ getNestedValue(slotProps.data, col.field) }}
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-3">
          <DataTable :value="[slotProps.data]">
            <Column
              v-for="col in hiddenColumns"
              :key="col.field"
              :field="[col.field]"
              :header="col.header"
            ></Column>
          </DataTable>
          <!-- <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="col in hiddenColumns" :key="col.field" class="flex flex-col">
              <span class="text-lg font-bold underline">{{ col.header }}:</span>
              <span class="">{{ slotProps.data[col.field] }}</span>
            </div>
          </div> -->
        </div>
      </template>
    </DataTable>

    <DataTable
      showGridlines
      @row-click="handleClick($event?.data?.station?.id)"
      scrollable
      stripedRows
      :value="value"
      rowGroupMode="rowspan"
      groupRowsBy="station.city"
      sortMode="single"
      sortField="station.city"
      :sortOrder="1"
      class="text-nowrap sm:hidden"
    >
      <!-- <Column field="station.city" header="City" style="max-width: 120px" /> -->

      <Column
        v-for="col in FrozenCols"
        style="position: sticky"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :frozen="true"
      ></Column>

      <Column
        v-for="col in NonFrozen"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :class="col.class"
      >
        <template v-if="col.customBody" #body="slotProps">
          <div :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]">
            {{ slotProps.data.wqi }}
          </div>
        </template>
        <template v-else-if="col.field === 'timeStamp'" #body="slotProps">
          {{ getNestedValue(slotProps.data, col.field) }}
        </template>
        <template v-else-if="col.field.includes('.')" #body="slotProps">
          {{ getNestedValue(slotProps.data, col.field) }}
        </template>
        <template v-else #body="slotProps">
          {{ slotProps.data[col.field] }}
        </template>
      </Column>
      <Column header="Details">
        <template #body>
          <div class="flex">
            <i class="pi pi-external-link text-white"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const router = useRouter();
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

const expandedRows = ref({});

const allColumns = [
  { field: 'station.externalId', header: 'ID' },
  { field: 'station.name', header: 'Name' },
  {
    field: 'wqi',
    header: 'WQI',
    class: 'p-0 !text-center',
    customBody: true
  },
  { field: 'timeStamp', header: 'Date' },
  { field: 'ph', header: 'pH' },
  { field: 'temp', header: 'Temp' },
  { field: 'dO2', header: 'DO2' },
  { field: 'boD5', header: 'BOD5' },
  { field: 'pO4', header: 'PO₄' },
  { field: 'nO3', header: 'NO₃' },
  { field: 'ca', header: 'Ca' },
  { field: 'mg', header: 'Mg' },
  { field: 'th', header: 'TH' },
  { field: 'k', header: 'K' },
  { field: 'na', header: 'Na' },
  { field: 'sO4', header: 'SO₄' },
  { field: 'cl', header: 'CL' },
  { field: 'tds', header: 'TDS' },
  { field: 'ec', header: 'EC' },
  { field: 'alk', header: 'Alk.' },
  { field: 'acid', header: 'Acid' },
  { field: 'onG', header: 'O&G' }
];

const FrozenCols = computed(() => {
  return allColumns.slice(0, 2);
});

const NonFrozen = computed(() => {
  return allColumns.slice(2);
});

const visibleColumns = computed(() => {
  return allColumns.slice(0, 3);
});

const hiddenColumns = computed(() => {
  return allColumns.slice(4);
});

function getWQIClass(wqi) {
  if (wqi >= 80) {
    return 'excellent';
  } else if (wqi >= 60) {
    return 'good';
  } else if (wqi >= 40) {
    return 'fair';
  } else if (wqi >= 20) {
    return 'poor';
  } else {
    return 'very-poor';
  }
}
function handleClick(stationId) {
  router.push(`/stations/manual/details/${stationId}`);
}
function getNestedValue(obj, path) {
  const value = path.split('.').reduce((p, c) => (p && p[c]) || null, obj);

  if (path === 'timeStamp' && value) {
    const date = new Date(value);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }

  return value;
}
</script>

<style>
/* .p-togglebutton {
  @apply !bg-red-700
} */
.p-datatable-header-cell {
  @apply !bg-black !text-white;
}

.p-datatable-row-expansion {
  @apply !bg-slate-700;
}
.p-paginator {
  @apply !bg-black;
}
.p-row-even td {
  @apply !bg-gray-400 !text-white;
}
.p-row-odd td {
  @apply !bg-gray-600 !text-white;
}
.wqi-cell {
  @apply min-h-full w-full text-xl text-nowrap p-4 !text-center;
}

.p-paginator-page-selected {
  @apply bg-red-900;
}
.excellent {
  background-color: #2e7d32;
}
.good {
  background-color: #0288d1;
}
.fair {
  background-color: #fbc02d;
  color: black;
}
.poor {
  background-color: #fb8c00;
  color: black;
}
.very-poor {
  background-color: #c62828;
  color: black;
}
:deep(.p-column-header-content) {
  @apply text-center;
}
</style>
