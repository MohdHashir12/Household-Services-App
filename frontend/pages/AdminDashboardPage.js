export default {
    data() {
        return {
            services: [],
            professionalProfile: [],
            serviceType: {},
            userDict: {},
            users: [],
            serviceRequests: [],
            profDict: {},
        };
    },

    computed: {
        totalServices() {
            return this.services.length;
        },
        totalProfessionals() {
            return this.professionalProfile.length;
        },
        totalCustomers() {
            return this.users.length;
        },
        totalServiceRequests() {
            return this.serviceRequests.length;
        }
    },
    template: `
    <div class="container mt-4">
    <h2 class="text-center">Admin Dashboard</h2>
    <div class="d-flex justify-content-end">
                    <router-link to="/admin/services/create_services" class="btn btn-outline-success">Create Service</router-link>
                    <router-link to="/admin/downloadReport" class="btn btn-outline-success">Download Report</router-link>
                </div>
    <div class="row text-center mb-4">
            <div class="col-md-3">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Total Services</h5>
                        <h3>{{ totalServices }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-success mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Total Professionals</h5>
                        <h3>{{ totalProfessionals }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-warning mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Total Customers</h5>
                        <h3>{{ totalCustomers }}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-white bg-danger mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Service Requests</h5>
                        <h3>{{ totalServiceRequests }}</h3>
                    </div>
                </div>
            </div>
        </div>


    <div> <!-- Root element wrapping all content -->
        <div class="row">
            <div class="col-md-12">
                <h3>Manage Services</h3>
                
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Base Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="service in services" :key="service.id">
                            <td>{{ service.id }}</td>
                            <td>{{ service.name }}</td>
                            <td>{{ service.price }}</td>
                            <td>
                                <router-link :to="'/admin/services/update/' + service.id" class="btn btn-warning">Edit</router-link>
                                <button @click="deleteService(service.id)" class="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Manage Professionals</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Service</th>
                            <th>Experience</th>
                            <th>Reviews</th>
                            <th>Doc</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="professional in professionalProfile" :key="professional.id">
                            <td>{{ professional.id }}</td>
                            <td>{{ professional.full_name }}</td>
                            <td>{{ serviceType[professional.user_id].name }}</td>
                            <td>{{ professional.experience }}</td>
                            <td>{{ professional.reviews }}</td>
                            <td><a :href="'uploads/' + professional.filename"  @click.prevent="downloadFile(professional.filename)">{{ professional.filename }}</a></td>
                            <td>
                                <button 
                                    @click="toggleApproval(professional.user_id)" 
                                    :class="userDict[professional.user_id].approve ? 'btn btn-secondary' : 'btn btn-success'"
                                >
                                    {{ userDict[professional.user_id].approve ? 'Reject' : 'Approve' }}
                                </button>

                                <button 
                                    @click="toggleBlock(professional.user_id)" 
                                    :class="userDict[professional.user_id].blocked ? 'btn btn-success' : 'btn btn-danger'"
                                >
                                    {{ userDict[professional.user_id].blocked ? 'Unblock' : 'Block' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Manage Customers</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.username }}</td>
                            <td>
                                <button 
                                    @click="toggleCustomerApproval(user)" 
                                    :class="user.approve ? 'btn btn-secondary' : 'btn btn-success'"
                                >
                                    {{ user.approve ? 'Reject' : 'Approve' }}
                                </button>

                                <button 
                                    @click="toggleCustomerBlock(user)" 
                                    :class="user.blocked ? 'btn btn-success' : 'btn btn-danger'"
                                >
                                    {{ user.blocked ? 'Unblock' : 'Block' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3>Service Requests</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Assigned Professional</th>
                            <th>Requested Date</th>
                            <th>Status</th>
                            <th>Customer Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="serviceRequest in serviceRequests" :key="serviceRequest.id">
                            <td>{{ serviceRequest.id }}</td>
                            <td>{{ profDict[serviceRequest.professional_id].full_name }}</td>
                            <td>{{ serviceRequest.date_of_request }}</td>
                            <td>{{ serviceRequest.service_status }}</td>
                            <td>{{ serviceRequest.remarks || "" }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    mounted() {
        this.fetchAdminDashboard();
    },
    methods: {
        async fetchAdminDashboard() {
            try {
                const res = await fetch(location.origin + '/admin/dashboard', 
                    {
                        method: 'POST', 
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')}, 
                    });                
                if (res.ok) {
                    const data = await res.json();
                    this.services = data.services;
                    this.professionalProfile = data.professional_profiles;
                    this.serviceType = data.service_type;
                    this.userDict = data.user_dict;
                    this.users = data.customers;
                    this.serviceRequests = data.service_requests;
                    this.profDict = data.prof_dict;
                } else {
                    res.json().then(data => {
                        console.log(data);
                    });
                    console.log("Error"); 
                }                
            } catch (error) {
                console.log("Error");
            }
        },
        async deleteService(serviceId) {
            const confirmed = confirm("Are you sure you want to delete this service?");
            if (!confirmed) return;
    
            try {
                const response = await fetch(`/admin/services/delete/${serviceId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    alert("Service deleted successfully!");
                    this.services = this.services.filter(service => service.id !== serviceId);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Failed to delete service.");
                }
            } catch (error) {
                console.error("An error occurred:", error);
                alert("An error occurred while deleting the service.");
            }
        },
        async toggleApproval(userId) {
            try {
                const newApprovalStatus = !this.userDict[userId].approve;
                const response = await fetch(`/admin/manage_user/${userId}/approve/${this.userDict[userId].approve}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    this.userDict[userId].approve = newApprovalStatus;
                } else {
                    const errorData = await response.json();
                    console.log(errorData.message || "An error occurred while updating approval status.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
    
        async toggleBlock(userId) {
            try {
                const newBlockStatus = !this.userDict[userId].blocked;
                const response = await fetch(`/admin/manage_user/${userId}/blocked/${this.userDict[userId].blocked}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    this.userDict[userId].blocked = newBlockStatus;
                } else {
                    const errorData = await response.json();
                    console.log(errorData.message || "An error occurred while updating block status.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async toggleCustomerApproval(user) {
            try {
                const newApprovalStatus = !user.approve;
                const response = await fetch(`/admin/manage_user/${user.id}/approve/${user.approve}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    user.approve = newApprovalStatus;
                } else {
                    const errorData = await response.json();
                    console.log(errorData.message || "An error occurred while updating approval status.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async toggleCustomerBlock(user) {
            try {
                const newBlockStatus = !user.blocked;
                const response = await fetch(`/admin/manage_user/${user.id}/blocked/${user.blocked}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    user.blocked = newBlockStatus;
                } else {
                    const errorData = await response.json();
                    console.log(errorData.message || "An error occurred while updating block status.");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async downloadFile(filename) {
            try {
            const response = await fetch(`/download/${filename}`,
                {
                    method: 'GET',
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
                }
            );
            if (!response.ok) {
                alert("Error downloading file.");
                return;
            }
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();    
            // Clean up the object URL to free memory
            window.URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error("Error downloading file:", error);
                alert("An error occurred while downloading the file.");
            }
        }
          
    }
};