export default {
    template: `
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow-sm p-3">
              <h4 class="text-center mb-3">Administrator Profile</h4>
              <div v-if="message" :class="'alert alert-' + category" role="alert">
                {{ message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        message: '',
        category: '',
      };
    },
    created() {
      this.fetchProfileData();
    },
    methods: {
      async fetchProfileData() {
        try {
          const response = await fetch('/admin/profile', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
          });
          if (response.ok) {
            const data = await response.json();
            this.message = data.message;
            this.category = data.category;
          } else {
            this.message = 'Could not retrieve profile details.';
            this.category = 'danger';
          }
        } catch (error) {             
          this.message = 'An error occurred while loading profile details.';
          this.category = 'danger';
        }
      }
    },
  };
  