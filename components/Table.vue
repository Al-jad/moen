<template>
  <div class="container">
    <DataTable
      stripedRows
      :value="value"
      rowGroupMode="rowspan"
      groupRowsBy="station.city"
      sortMode="single"
      sortField="station.city"
      :sortOrder="1"
      paginator
      :rows="20"
      scrollable
      v-model:expandedRows="expandedRows"
      dataKey="id"
      class="hidden text-nowrap sm:block"
    >
      <Column field="station.city" :sortable="true" header="City"  style="max-width: 100px;" />
      <Column expander headerStyle="width: 3rem" style="padding: 0;" />

      <Column
        v-for="col in visibleColumns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :class="col.class"
      >
        <template v-if="col.customBody"  #body="slotProps">
          <div :class="getWQIClass(slotProps.data.wqi)" class="wqi-cell">
            {{ slotProps.data.wqi }}
          </div>
        </template>
        <template v-else-if="col.field.includes('.')" #body="slotProps">
          {{ getNestedValue(slotProps.data, col.field) }}
        </template>
      </Column>

      <template #expansion="slotProps">
        <div class="p-3">
          <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="col in hiddenColumns" :key="col.field" class="flex flex-col">
              <span class="text-lg font-bold underline">{{ col.header }}:</span>
              <span class="">{{ slotProps.data[col.field] }}</span>
            </div>
          </div>
        </div>
      </template>
    </DataTable>

    <DataTable
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
      <Column field="station.city" header="City" style="max-width: 120px; " />

      <Column
        v-for="col in FrozenCols" style="position: sticky;"
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
          <div :class="getWQIClass(slotProps.data.wqi)" class="wqi-cell">
            {{ slotProps.data.wqi }}
          </div>
        </template>
        <template v-else-if="col.field.includes('.')" #body="slotProps">
          {{ getNestedValue(slotProps.data, col.field) }}
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
    class: 'wqi-cell text-nowrap p-0 !text-center',
    customBody: true
  },
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
  return path.split('.').reduce((p, c) => (p && p[c]) || null, obj);
}
</script>

<style>

/* .p-togglebutton {
  @apply !bg-red-700
} */
.p-datatable-header-cell {
  @apply !bg-DarkBlue/40 !text-white;
}

.p-datatable-row-expansion {
  @apply !bg-[#3e638b]
}
.p-paginator {
  @apply !bg-DarkBlue
}
.p-row-even td {
  @apply !bg-DarkBlue;
}
.p-row-odd td {
  @apply !bg-LighBlue;
}
.wqi-cell {
  @apply min-h-full w-full text-xl;
}

.p-paginator-page-selected {
  @apply bg-red-900
}
.excellent {
  background-color: #2e7d32;
  padding: 12px 0;
  @apply w-full text-nowrap p-4 !text-center;
}
.good {
  background-color: #0288d1;
  padding: 12px 0;
  @apply text-nowrap p-4 !text-center;
}
.fair {
  background-color: #fbc02d;
  color: black;
  padding: 12px 0;
  @apply text-nowrap p-4 !text-center;
}
.poor {
  background-color: #fb8c00;
  color: black;
  padding: 12px 0;
  @apply text-nowrap p-4 !text-center;
}
.very-poor {
  background-color: #c62828;
  color: black;
  padding: 12px 0;
  @apply text-nowrap p-4 !text-center;
}
:deep(.p-column-header-content) {
  @apply text-center;
}
</style>
