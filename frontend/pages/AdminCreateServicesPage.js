export default {
    props: {
      editing: {
        type: Boolean,
        default: false
      },
      id: {
        type: [String, Number],
        default: null
      }
    },
    data() {
      return {
        service: {
          id: this.id,
          service_type: '',
          name: '',
          description: '',
          price: ''
        },
        message: null,
        category: null
      };
    },
    created() {
      if (this.editing && this.id) {
        this.fetchServiceData();
      }
    },
    methods: {
      async fetchServiceData() {
        try {
          const response = await fetch(`/admin/services/get/${this.id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
          });
          if (response.ok) {
            const data = await response.json();
            this.service = data;
          } else {
            this.message = 'Unable to fetch service details.';
            this.category = 'danger';
          }
        } catch (error) {
          this.message = 'An error occurred while retrieving service details.';
          this.category = 'danger';
        }
      },
      async submitForm() {
        try {
          const url = this.editing
            ? `/admin/services/update/${this.service.id}`
            : '/admin/services/create_services';
          
          const response = await fetch(url, {
            method: this.editing ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(this.service)
          });
  
          if (response.ok) {
            this.message = this.editing ? 'Service successfully updated!' : 'Service successfully added!';
            this.category = 'success';
            this.$router.push('/admin/dashboard');
          } else {
            const errorData = await response.json();
            this.message = errorData.message || 'Something went wrong.';
            this.category = 'danger';
          }
        } catch (error) {
          this.message = 'An unexpected issue occurred.';
          this.category = 'danger';
        }
      }
    },
    template: `
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow-sm p-4">
              <h4 class="text-center mb-3">{{ editing ? 'Update Service' : 'Create Service' }}</h4>
  
              <div v-if="message" :class="'alert alert-' + category" role="alert">
                {{ message }}
              </div>
  
              <form @submit.prevent="submitForm">
                <div class="form-group">
                  <label for="service_type">Select Service Type</label>
                  <select id="service_type" v-model="service.service_type" class="form-control" required>
                    <option value="haircut">Haircut</option>
                    <option value="cleaning">Home Cleaning</option>
                    <option value="electrical">Electrical Repairs</option>
                    <option value="painting">Painting Services</option>
                    <option value="plumbing">Plumbing Services</option>
                  </select>
                </div>
  
                <div class="form-group">
                  <label for="name">Service Name</label>
                  <input type="text" id="name" v-model="service.name" class="form-control" required>
                </div>
  
                <div class="form-group">
                  <label for="description">Service Description</label>
                  <textarea id="description" v-model="service.description" class="form-control" required></textarea>
                </div>
  
                <div class="form-group">
                  <label for="price">Price (in INR)</label>
                  <input type="number" id="price" v-model="service.price" class="form-control" required>
                </div>
  
                <div class="form-group text-center">
                  <button type="submit" class="btn btn-primary btn-sm">{{ editing ? 'Update' : 'Submit' }}</button>
                  <router-link to="/admin/dashboard" class="btn btn-secondary btn-sm">Cancel</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `
  };
  