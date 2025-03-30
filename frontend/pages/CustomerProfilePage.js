export default {
    template: `
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card border-0 shadow">
              <div class="card-header bg-info text-white text-center">
                <h4>Manage Your Profile</h4>
              </div>
              <div class="card-body">
                
                <!-- Notification -->
                <div v-if="alertMessage" :class="'alert alert-' + alertType + ' text-center'" role="alert">
                  {{ alertMessage }}
                </div>
  
                <form @submit.prevent="updateProfile">
                  <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input 
                      type="text" 
                      id="username" 
                      v-model="profile.username" 
                      class="form-control" 
                      readonly 
                    />
                  </div>
  
                  <div class="mb-3">
                    <label for="fullname" class="form-label">Full Name</label>
                    <input 
                      type="text" 
                      id="fullname" 
                      v-model="profile.fullname" 
                      class="form-control" 
                    />
                  </div>
  
                  <div class="mb-3">
                    <label for="location" class="form-label">Location</label>
                    <input 
                      type="text" 
                      id="location" 
                      v-model="profile.location" 
                      class="form-control" 
                    />
                  </div>
  
                  <div class="mb-3">
                    <label for="zipcode" class="form-label">ZIP Code</label>
                    <input 
                      type="text" 
                      id="zipcode" 
                      v-model="profile.zipcode" 
                      class="form-control" 
                    />
                  </div>                
  
                  <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </div>
                </form>
  
              </div>
            </div>
          </div>
        </div>
      </div>
    `,    
    data() {
      return {
        profile: {
          username: '',
          fullname: '',
          location: '',
          zipcode: ''
        },
        userId: '',
        alertMessage: '',
        alertType: '',            
      };
    },
    mounted() {
      this.loadProfile();
    },
    methods: {
      async loadProfile() {
        try {
          const response = await fetch('/customer/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          if (response.ok) {
            const data = await response.json();
            this.userId = data.user_id;
            this.profile.username = data.username;
            this.profile.fullname = data.full_name;
            this.profile.location = data.address;
            this.profile.zipcode = data.pin_code;
          } else {
            this.alertMessage = 'Could not retrieve profile details.';
            this.alertType = 'warning';
          }
        } catch (error) {
          this.alertMessage = 'Error loading profile. Please try again later.';
          this.alertType = 'danger';
        }
      },
      async updateProfile() {
        try {
          const response = await fetch('/customer/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ 
              'full_name': this.profile.fullname,
              'address': this.profile.location,
              'pin_code': this.profile.zipcode 
            })
          });
          if (response.ok) {
            const data = await response.json();
            this.alertMessage = data.message;
            this.alertType = data.category;
          } else {
            this.alertMessage = 'Profile update failed.';
            this.alertType = 'danger';
          }
        } catch (error) {
          this.alertMessage = 'Something went wrong. Try again later.';
          this.alertType = 'danger';
        }            
      }
    }
  };
  