export const useManualDetails = defineStore('ManualStationDetails', {
    state: () => ({
        data: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchData() {
            this.loading = true;
            this.error = null;
            try {
                const { $axios } = useNuxtApp();
                const router = useRouter();

                if (!$axios || typeof $axios.get !== 'function') {
                    throw new Error('$axios is not properly defined or does not have a get method');
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Unauthorized Access. Please login again.');
                }

                const response = await $axios.get('/Station', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                this.data = response.data;
            } catch (error) {
                this.error = error.message || 'An error occurred';
                console.error("Error fetching manual station data:", this.error);

                if (error.response?.status === 401 || this.error.includes('Unauthorized')) {
                    // alert('Unauthorized Access. Please login again.');
                    const router = useRouter();
                    router.push('/login');
                }
            } finally {
                this.loading = false;
            }
        },
    },
});
