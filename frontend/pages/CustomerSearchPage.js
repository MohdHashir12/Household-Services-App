export default {
  template: `
    <div>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h3 class="text-center">Customer Search</h3>

          <!-- Flash Messages -->
          <div v-if="messages.length" class="mt-3">
            <div v-for="(message, index) in messages" :key="index" :class="'alert alert-' + message.category">
              {{ message.text }}
            </div>
          </div>

          <!-- Search Form -->
          <form @submit.prevent="submitSearch" class="card p-3 shadow-sm">
            <div class="form-group">
              <label for="search_type">Search By</label>
              <select v-model="form.search_type" id="search_type" class="form-control">
                <option value="service">Service Name</option>
                <option value="location">Location</option>
                <option value="pin">PIN Code</option>
              </select>
            </div>

            <div class="form-group">
              <label for="search_text">Enter Search Query</label>
              <input v-model="form.search_text" id="search_text" type="text" class="form-control" />
            </div>

            <div class="text-center mt-3">
              <button type="submit" class="btn btn-primary">Search</button>
              <router-link to="/customer/dashboard" class="btn btn-outline-secondary ml-2">Cancel</router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Search Results -->
      <div class="container mt-5" v-if="searchResults.length">
        <h4 class="text-center mb-3">Available Services</h4>
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>PIN Code</th>
              <th>Base Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(service, index) in searchResults" :key="index">
              <td>{{ service.service_name }}</td>
              <td>{{ service.service_description }}</td>
              <td>{{ service.address }}</td>
              <td>{{ service.pin_code }}</td>
              <td>{{ service.service_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,

  data() {
    return {
      form: {
        search_type: "service", // Default selection
        search_text: ""
      },
      searchResults: [], // Updated variable name
      messages: []
    };
  },

  methods: {
    async submitSearch() {
      this.messages = [];

      try {
        const res = await fetch(`${location.origin}/customer/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({
            search_type: this.form.search_type,
            search_text: this.form.search_text
          })
        });

        const data = await res.json();

        if (res.ok) {
          this.searchResults = data.data.service_professional;
          this.messages.push({ category: "success", text: "Search successful!" });
        } else {
          this.searchResults = [];
          this.messages.push({
            category: "warning",
            text: data.message || "No results found for your search."
          });
        }
      } catch (error) {
        console.error("Error:", error);
        this.searchResults = [];
        this.messages.push({
          category: "danger",
          text: "A network error occurred. Please try again."
        });
      }
    }
  }
};
