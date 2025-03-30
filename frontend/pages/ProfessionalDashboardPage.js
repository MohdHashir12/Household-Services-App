export default {
    template: `
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <h2 class="text-secondary fw-semibold mb-3">Service Requests for Today</h2>
                <div v-if="message" :class="'alert alert-' + category" role="alert">
                    {{ message }}
                </div>

                <div class="card shadow-sm mb-4">
                    <div class="card-body">
                        <table class="table table-bordered table-hover" v-if="pendingRequests.length > 0">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <th>Client</th>
                                    <th>Requested Service</th>
                                    <th>Current Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="request in pendingRequests" :key="request.id">
                                    <td>{{ customers[request.customer_id]?.full_name || 'Not Available' }}</td>
                                    <td>{{ services[request.service_id]?.name || 'Not Available' }}</td>
                                    <td>
                                        <span class="badge bg-warning text-dark">{{ request.service_status }}</span>
                                    </td>
                                    <td>
                                        <button @click="modifyRequestStatus('accept', request.id)" class="btn btn-outline-success btn-sm">Approve</button>
                                        <button @click="modifyRequestStatus('reject', request.id)" class="btn btn-outline-danger btn-sm">Decline</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="alert alert-info text-center">No pending service requests at the moment</div>
                    </div>
                </div>

                <h2 class="text-secondary fw-semibold mb-3">Processed Service Requests</h2>
                <div class="card shadow-sm">
                    <div class="card-body">
                        <table class="table table-bordered table-hover" v-if="completedRequests.length > 0">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <th>Client</th>
                                    <th>Service</th>
                                    <th>Status</th>
                                    <th>Completion Date</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="request in completedRequests" :key="request.id">
                                    <td>{{ customers[request.customer_id]?.full_name || 'Not Available' }}</td>
                                    <td>{{ services[request.service_id]?.name || 'Not Available' }}</td>
                                    <td>
                                        <span v-if="request.service_status === 'Rejected'" class="badge bg-danger text-white">
                                            {{ request.service_status }}
                                        </span>
                                        <span v-else class="badge bg-success text-white">
                                            {{ request.service_status }}
                                        </span>
                                    </td>
                                    <td>{{ request.date_of_completion || 'Not Provided' }}</td>
                                    <td>{{ request.remarks || 'No remarks' }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="alert alert-info text-center">No completed service records</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            message: null,
            category: null,
            pendingRequests: [],
            completedRequests: [],
            customers: {},
            services: {}
        };
    },
    mounted() {
        this.loadDashboardData();
    },
    methods: {
        async loadDashboardData() {
            try {
                const response = await fetch(location.origin + '/professional/dashboard', 
                    {
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json', 
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }, 
                    });
                
                if (response.ok) {
                    const result = await response.json();
                    this.pendingRequests = result.service_requests || [];
                    this.completedRequests = result.service_requests_closed || [];
                    this.customers = result.cust_dict || {};
                    this.services = result.service_dict || {};
                } else {
                    const errorData = await response.json();
                    this.message = errorData.message || 'Unable to retrieve data';
                    this.category = 'danger';
                }                
            } catch (error) {
                this.message = 'A network error occurred';
                this.category = 'danger';
                console.error("Error:", error);
            }
        },
        async modifyRequestStatus(status, requestId) {
            try {
                const response = await fetch(
                    location.origin + '/professional/update_request_status/' + status + '/' + requestId, 
                    {
                        method: 'PUT', 
                        headers: {
                            'Content-Type': 'application/json', 
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }, 
                    });
                
                if (response.ok) {
                    const result = await response.json();
                    this.message = result.message;
                    this.category = result.category;
                    this.loadDashboardData();
                } else {
                    const errorData = await response.json();
                    this.message = errorData.message || 'Failed to update request status';
                    this.category = 'danger';
                }                
            } catch (error) {
                this.message = 'A network error occurred';
                this.category = 'danger';
                console.error("Error:", error);
            }
        }
    }
};
