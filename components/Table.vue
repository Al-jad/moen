<template>
  <div>
    <DataTable
      :value="value"
      class="text-nowrap"
      paginator
      :autoLayout="true"
      :rows="20"
      :pt="{
        tableContainer: {
          class: '!bg-red-900'
        },
        headerRow: {
          class: 'hover:!bg-red-900'
        }
      }"
    >
      <Column
        v-for="col in columns"
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
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

const columns = [
  { field: 'station.externalId', header: 'ID' },
  { field: 'station.name', header: 'Station Name' },
  { field: 'station.city', header: 'City' },
  {
    header: 'Water Quality Index',
    class: 'wqi-cell text-nowrap p-4 !text-center',
    customBody: true
  },
  { field: 'ph', header: 'pH' },
  { field: 'temp', header: 'Temperature ( °C )' },
  { field: 'dO2', header: 'Dissolved O2 ( mg/L )' },
  { field: 'boD5', header: 'BOD5 ( mg/L )' },
  { field: 'pO4', header: 'PO₄³⁻ ( mg/L )' },
  { field: 'nO3', header: 'NO₃⁻ ( mg/L )' },
  { field: 'ca', header: 'Calcium ( mg/L )' },
  { field: 'mg', header: 'Magnesium ( mg/L )' },
  { field: 'th', header: 'Total Hardness ( mg/L )' },
  { field: 'k', header: 'Potassium ( mg/L )' },
  { field: 'na', header: 'Sodium ( mg/L )' },
  { field: 'sO4', header: 'SO₄²⁻ ( mg/L )' },
  { field: 'cl', header: 'Chloride ( mg/L )' },
  { field: 'tds', header: 'TDS ( mg/L )' },
  { field: 'ec', header: 'EC ( µS/cm )' },
  { field: 'alk', header: 'Alkalinity ( mg/L )' },
  { field: 'acid', header: 'Acidity ( mg/L )' },
  { field: 'onG', header: 'Organic Nitrogen ( mg/L )' }
];

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
</script>

<style scoped>
.wqi-cell {
  @apply h-full w-full p-px text-xl;
}

.excellent {
  background-color: #2e7d32;
  padding: 12px 0;
}
Column {
  @apply text-center;
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
}

.very-poor {
  background-color: #c62828;
}
</style>
