export const useManualStation = defineStore('ManualStation', {
    state: () => ({
        data: null,
        loading: false,
        error: null,
        isAdmin: false, // Add this line to track admin status
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

                const response = await $axios.get('/Data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                this.data = response.data;
            } catch (error) {
                this.error = error.message || 'An error occurred';
                console.error("Error fetching manual station data:", this.error);

                if (error.response?.status === 401 || this.error.includes('Unauthorized')) {
                    alert('Unauthorized Access. Please login again.');
                    const router = useRouter();
                    router.push('/login');
                }
            } finally {
                this.loading = false;
            }
        },
        async deleteData(id) {
            this.loading = true;
            this.error = null;
            try {
                const { $axios } = useNuxtApp();
                const router = useRouter();

                if (!$axios || typeof $axios.delete !== 'function') {
                    throw new Error('$axios is not properly defined or does not have a delete method');
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Unauthorized Access. Please login again.');
                }

                await $axios.delete(`/Data/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Remove the deleted item from the data array
                if (this.data) {
                    this.data = this.data.filter(item => item.id !== id);
                }
            } catch (error) {
                this.error = error.message || 'An error occurred';
                console.error("Error deleting manual station data:", this.error);

                if (error.response?.status === 401 || this.error.includes('Unauthorized')) {
                    alert('Unauthorized Access. Please login again.');
                    const router = useRouter();
                    router.push('/login');
                }
            } finally {
                this.loading = false;
            }
        },
        setAdminStatus(isAdmin) {
            this.isAdmin = isAdmin; // Add this method to set admin status
        },
    },
});
