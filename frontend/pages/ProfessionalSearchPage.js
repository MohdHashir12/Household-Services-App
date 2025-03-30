export default {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h3 class="text-center mb-3">Find a Service Professional</h3>

          <!-- Flash Messages -->
          <div v-if="messages.length" class="mb-3">
            <div v-for="(message, index) in messages" :key="index" class="alert" 
                 :class="'alert-' + message.category">
              {{ message.text }}
            </div>
          </div>

          <!-- Search Form -->
          <div class="card shadow-sm border rounded p-3">
            <form @submit.prevent="submitSearch">
              <div class="mb-2">
                <label for="search_type" class="fw-bold text-dark">Search By</label>
                <select id="search_type" v-model="form.search_type" class="form-control">
                  <option value="date">Date</option>
                  <option value="location">Location</option>
                  <option value="pin">PIN Code</option>
                </select>
              </div>

              <div class="mb-2">
                <label for="search_text" class="fw-bold text-dark">Enter Search Value</label>
                <input id="search_text" v-model="form.search_text" class="form-control" type="text" />
                <small v-if="errors.search_text" class="text-danger">{{ errors.search_text }}</small>
              </div>

              <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-dark px-4">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length" class="container mt-4">
        <h4 class="text-center mb-3">Search Results</h4>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-dark">
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in searchResults" :key="index">
                <td>{{ result.customer_name }}</td>
                <td>{{ result.service_name }}</td>
                <td>{{ result.status }}</td>
                <td>{{ result.start_date }}</td>
                <td>{{ result.remarks }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        search_type: "location",
        search_text: "",
      },
      errors: { search_text: "" },
      messages: [],
      searchResults: [],
    };
  },
  methods: {
    async submitSearch() {
      this.messages = [];
      this.errors.search_text = "";

      if (!this.form.search_text.trim()) {
        this.errors.search_text = "Please enter a search value.";
        return;
      }

      try {
        const response = await fetch('/professional/search', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(this.form),
        });

        const data = await response.json();

        if (response.ok) {
          this.searchResults = data.data?.service_requests || [];
          this.messages.push({ category: "success", text: data.message });
        } else {
          this.messages.push({ category: "danger", text: data.message || "Search failed." });
        }
      } catch (error) {
        this.messages.push({ category: "danger", text: "An error occurred. Try again later." });
      }
    },
  },
};
