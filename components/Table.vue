<template>
  <div class="container mx-auto">
    <DataTable removableSort
      :value="value"
      class="text-nowrap !bg-DarkBlue"
      :rows="10"
      :paginator="true"
      :scrollable="true"
      @row-click="onRowClick"
      :sortField="'station.externalId'"
      :sortOrder="1"
    >
      <ColumnGroup type="header">
        <Row>
          <Column header="Station Info" :colspan="3" headerClass="!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white" />
          <Column header="Last Measurement" :colspan="3" headerClass="!bg-DarkBlue !outline !outline-1 sm:!text-sm !outline-white !text-white" />
        </Row>
        <Row>
          <Column header="ID" :sortable="true" field="station.externalId" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
          <Column header="Name" :sortable="true" field="station.name" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
          <Column header="City" :sortable="true" field="station.city" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
          <Column header="Water Quality Index" :sortable="true" field="wqi" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
          <Column header="Date" :sortable="true" field="timeStamp" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
          <Column header="Time" :sortable="true" field="timeStamp" headerClass="!bg-DarkBlue sm:!text-sm !outline !outline-1 !outline-white !text-white" />
        </Row>
      </ColumnGroup>
      <template #empty>
        <div class="m-0 bg-DarkBlue p-4 text-center text-white">No data available</div>
      </template>
      <Column
        field="station.externalId"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white rounded-tl-lg !text-white"
        header="ID"
        :sortable="true"
      ></Column>
      <Column
        field="station.name"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        header="Name"
        :sortable="true"
      ></Column>
      <Column
        field="station.city"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        header="City"
        :sortable="true"
      ></Column>
      <Column
        field="wqi"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        header="Water Quality Index"
        :sortable="true"
      >
        <template #body="slotProps">
          <div :class="['wqi-cell', getWQIClass(slotProps.data.wqi)]" class="ml-12 !text-center">
            <span class="wqi-value">{{ slotProps.data.wqi }}</span>
            <span class="wqi-description">{{ getWQIDescription(slotProps.data.wqi) }}</span>
          </div>
        </template>
      </Column>
      <Column
        field="timeStamp"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white"
        header="Date"
        :sortable="true"
      >
        <template #body="slotProps">
          {{ formatDate(slotProps.data.timeStamp) }}
        </template>
      </Column>
      <Column
        field="timeStamp"
        headerClass="!bg-DarkBlue !outline !outline-1 !outline-white !text-white rounded-tr-lg"
        header="Time"
        :sortable="true"
      >
        <template #body="slotProps">
          {{ formatTime(slotProps.data.timeStamp) }}
        </template>
      </Column>
      <template #paginatorstart>
        <div class="text-sm text-white">
          Showing max 10 of {{ value.length }} entries
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStationData } from '@/stores/stationData'; // Make sure this import is present

const router = useRouter();

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (dateString) => {
  if (!dateString) return '12:00 PM';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const stationData = useStationData();

const onRowClick = (event) => {
  const stationId = event.data.station.id;
  const stationCity = event.data.station.city;
  const stationName = event.data.station?.name;
  
  // Update the stationData store
  stationData.setStationInfo(stationCity, stationName);

  console.log('Station Name:', stationName);
  console.log('Station City:', stationCity);
  console.log('Full station data:', event.data.station);

  // Use nextTick to ensure the store is updated before navigation
  nextTick(() => {
    // Persist the data in localStorage before navigation
    localStorage.setItem('stationCity', stationCity);
    localStorage.setItem('stationName', stationName);

    router.push({
      path: `/stations/manual/details/${stationId}`,
      query: {
        stationName: stationName,
        stationCity: stationCity
      }
    });
  });
};

// Remove the onMounted hook from here, as it's not needed in this component
</script>

<style>
.p-datatable-sort-icon {
  @apply !text-white sm:scale-75;
}
.p-datatable tr {
  @apply !bg-DarkBlue cursor-pointer;
}
.p-paginator {
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
  @apply bg-gradient-to-br from-blue-400 to-blue-600 text-white;
}
.good {
  @apply bg-gradient-to-br from-green-400 to-green-600 text-white;
}
.fair {
  @apply bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900;
}
.poor {
  @apply bg-gradient-to-br from-orange-400 to-orange-600 text-white;
}
.very-poor {
  @apply bg-gradient-to-br from-red-400 to-red-600 text-white;
}

.p-datatable .p-datatable-tbody > tr.p-row-even {
  @apply !bg-white !text-black;
}
.p-datatable .p-datatable-tbody > tr.p-row-odd {
  @apply !bg-gray-100 !text-black;
}
.p-datatable .p-datatable-tbody > tr:not(.p-datatable-empty-message):hover {
  @apply !bg-gray-300 !text-black !cursor-pointer;
}
.p-paginator-rpp-dropdown {
  @apply !bg-DarkNavy !text-white border-white;
}
.p-select-overlay {
  @apply !bg-DarkNavy hover:!bg-DarkBlue !text-white border-white;
}
</style>
