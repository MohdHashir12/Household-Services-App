export default {
    template: `
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <h3 class="text-center">Service Remarks</h3>

                <!-- Flash Messages -->
                <div v-if="flashMessages.length" class="mt-3">
                    <div 
                        v-for="(message, index) in flashMessages" 
                        :key="index" 
                        class="alert alert-dismissible fade show" 
                        :class="'alert-' + message.category"
                        role="alert">
                        {{ message.text }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

                <!-- Service Remarks Form -->
                <form @submit.prevent="submitForm" class="card p-3 shadow-sm">
                    <div class="form-group">
                        <label>Request ID</label>
                        <input type="text" v-model="formData.request_id" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label>Service Name</label>
                        <input type="text" v-model="formData.service_name" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" v-model="formData.full_name" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label>Service Description</label>
                        <input type="text" v-model="formData.service_description" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label>Remarks</label>
                        <textarea v-model="formData.remarks" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <input type="number" v-model="formData.rating" class="form-control" min="1" max="5">
                    </div>
                    <div class="text-center mt-3">
                        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
                        <button @click="cancel" type="button" class="btn btn-outline-secondary btn-sm ml-2">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `,

    props: {
        id: {
            type: [String, Number],
            default: null
        }
    },

    created() {
        if (this.id) {
            this.fetchServiceRequest();
        } else {
            alert('No service request ID provided.');
            this.$router.push('/customer/dashboard');
        }
    },

    data() {
        return {
            flashMessages: [],
            formData: {
                request_id: '',
                service_name: '',
                full_name: '',
                service_description: '',
                remarks: '',
                rating: 0,
            }
        };
    },

    methods: {
        async submitForm() {
            try {
                const response = await fetch(`/customer/close_service_request/${this.formData.request_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(this.formData),
                });

                const data = await response.json();

                if (response.ok) {
                    this.flashMessages = [{ text: data.message, category: 'success' }];
                    setTimeout(() => this.$router.push('/customer/dashboard'), 1500);
                } else {
                    this.flashMessages = [{ text: data.message || 'Something went wrong.', category: 'warning' }];
                }
            } catch (error) {
                this.flashMessages = [{ text: 'Network error. Please try again later.', category: 'danger' }];
                console.error(error);
            }
        },

        async fetchServiceRequest() {
            try {
                const response = await fetch(`/customer/close_service_request/${this.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.formData = { ...data };
                } else {
                    this.flashMessages = [{ text: 'Could not load service request data.', category: 'danger' }];
                }
            } catch (error) {
                this.flashMessages = [{ text: 'Error fetching data. Try again later.', category: 'danger' }];
                console.error(error);
            }
        },

        cancel() {
            this.$router.push('/customer/dashboard');
        }
    }
};
