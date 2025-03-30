export default {
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h3 class="text-center mb-3">Search Panel</h3>
          <div v-if="messages.length" class="flash-messages">
            <div v-for="(message, index) in messages" :key="index" :class="'alert alert-' + message.category">
              {{ message.text }}
            </div>
          </div>
          <form @submit.prevent="submitSearch" class="card p-3 shadow-sm">
            <div class="mb-3">
              <label for="search_type" class="form-label">Select Category</label>
              <select v-model="form.search_type" id="search_type" class="form-select" required>
                <option value="customer">Customer</option>
                <option value="service">Service</option>
                <option value="professional">Service Provider</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="search_text" class="form-label">Enter Search Term</label>
              <input v-model="form.search_text" id="search_text" type="text" class="form-control" />
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary btn-sm">Search</button>
              <router-link to="/admin/dashboard" class="btn btn-secondary btn-sm">Back</router-link>
            </div>
          </form>
        </div>
      </div>

      <div class="mt-5">
        <h4 v-if="services.length">Available Services</h4>
        <table v-if="services.length" class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Base Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.price }}</td>
            </tr>
          </tbody>
        </table>

        <h4 v-if="professionals.length">Service Providers</h4>
        <table v-if="professionals.length" class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Expertise</th>
              <th>Experience</th>
              <th>Ratings</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="professional in professionals" :key="professional.id">
              <td>{{ professional.id }}</td>
              <td>{{ professional.full_name }}</td>
              <td>{{ serviceType[professional.user_id]?.name }}</td>
              <td>{{ professional.experience }}</td>
              <td>{{ professional.reviews }}</td>
            </tr>
          </tbody>
        </table>

        <h4 v-if="serviceRequests.length && !customers.length">Service Requests</h4>
        <table v-if="serviceRequests.length && !customers.length" class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Assigned Provider</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in serviceRequests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ profDict[request.professional_id]?.full_name }}</td>
              <td>{{ request.date_of_request }}</td>
              <td>{{ request.service_status }}</td>
              <td>{{ request.remarks || '' }}</td>
            </tr>
          </tbody>
        </table>

        <h4 v-if="customers.length">Customers & Services</h4>
        <table v-if="customers.length" class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Zip Code</th>
              <th>Service</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Completion Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in serviceRequests" :key="request.id">
              <td>{{ custDict[request.customer_id]?.full_name }}</td>
              <td>{{ custDict[request.customer_id]?.address }}</td>
              <td>{{ custDict[request.customer_id]?.pin_code }}</td>
              <td>{{ serviceDict[request.service_id]?.name }}</td>
              <td>{{ request.service_status }}</td>
              <td>{{ request.date_of_request || '' }}</td>
              <td>{{ request.date_of_completion || '' }}</td>
              <td>{{ request.remarks || '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        search_type: "",
        search_text: ""
      },
      services: [],
      professionals: [],
      serviceRequests: [],
      customers: [],
      messages: [],
      profDict: {},
      serviceType: {},
      custDict: {},
      serviceDict: {}
    };
  },
  methods: {
    async submitSearch() {
      this.messages = [];  
      try {
        const res = await fetch(`${location.origin}/admin/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            search_type: this.form.search_type,
            search_text: this.form.search_text
          })
        });

        if (res.ok) {
          const data = await res.json();
          this.customers = data.data.customers;
          this.professionals = data.data.professionals;
          this.services = data.data.services;
          this.serviceRequests = data.data.service_requests;
          this.serviceType = data.data.service_type;
          this.profDict = data.data.prof_dict;
          this.custDict = data.data.cust_dict;
          this.serviceDict = data.data.service_dict;
          this.messages.push({ category: 'success', text: data.message });
        } else {
          const errorData = await res.json();
          this.messages.push({
            category: errorData.category || 'danger',
            text: errorData.message || 'Error processing search request.'
          });
        }
      } catch (error) {
        this.messages.push({
          category: 'danger',
          text: 'Unexpected error. Try again later.'
        });
      }
    },
  }
};
