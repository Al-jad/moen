export const useStationData = defineStore('StationData', {
  state: () => ({
    data: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchData(stationId) {
      this.loading = true;
      this.error = null;
      try {
        const { $axios } = useNuxtApp();
        if ($axios && typeof $axios.get === 'function') {
          const response = await $axios.get(`/Data/${stationId}/report`);
          this.data = response.data;
        } else {
          throw new Error('$axios is not properly defined or does not have a get method');
        }
      } catch (error) {
        this.error = error.message || 'An error occurred';
      } finally {
        this.loading = false;
      }
    },
  },
});
