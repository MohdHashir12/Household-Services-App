export default {
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h3 class="text-center mb-4">Professional Profile</h3>

          <!-- Flash Messages -->
          <div v-if="messages.length">
            <div v-for="(message, index) in messages" :key="index" 
                 :class="'alert alert-' + message.category">
              {{ message.text }}
            </div>
          </div>

          <!-- Profile Form -->
          <div class="card shadow-sm border rounded p-3">
            <form @submit.prevent="submitForm" enctype="multipart/form-data">
              
              <div class="mb-2">
                <label for="user_name" class="fw-bold text-dark">Username</label>
                <input id="user_name" v-model="form.user_name" class="form-control" type="text" readonly />
              </div>  

              <div class="mb-2">
                <label for="full_name" class="fw-bold text-dark">Full Name</label>
                <input id="full_name" v-model="form.full_name" class="form-control" type="text" />
              </div>

              <div class="mb-2">
                <label for="service_type" class="fw-bold text-dark">Service Type</label>
                <select id="service_type" v-model="form.service_type" class="form-control">
                  <option disabled value="">Select a service</option>
                  <option v-for="service in serviceOptions" :key="service.id" :value="service.id">
                    {{ service.name }}
                  </option>
                </select>
              </div>

              <div class="mb-2">
                <label for="experience" class="fw-bold text-dark">Experience (Years)</label>
                <input id="experience" v-model="form.experience" class="form-control" type="number" />
              </div>

              <div class="mb-2">
                <label for="file" class="fw-bold text-dark">Upload File</label>
                <input id="file" type="file" class="form-control" @change="handleFileUpload" />
              </div>

              <div class="mb-2">
                <label for="address" class="fw-bold text-dark">Address</label>
                <textarea id="address" v-model="form.address" class="form-control"></textarea>
              </div>

              <div class="mb-3">
                <label for="pin_code" class="fw-bold text-dark">Pin Code</label>
                <input id="pin_code" v-model="form.pin_code" class="form-control" type="text" />
              </div>

              <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-dark px-4">Save</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form: {
        user_name: '',
        full_name: '',
        service_type: '',
        experience: '',
        address: '',
        pin_code: '',
        file: null, 
      },
      serviceOptions: [], 
      messages: [], 
    };
  },
  mounted() {
    this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      try {
        const response = await fetch('/professional/profile', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Accept': 'application/json'
          },
        });

        if (!response.ok) throw new Error(await response.text());

        const result = await response.json();
        this.serviceOptions = result.services;
        this.form.user_name = result.profile.username;
        this.form.full_name = result.profile.full_name || '';
        this.form.service_type = result.profile.service_type || '';
        this.form.experience = result.profile.experience || '';
        this.form.address = result.profile.address || '';
        this.form.pin_code = result.profile.pin_code || '';
      } catch (error) {
        this.messages.push({ category: 'danger', text: error.message || 'Error loading profile' });
      }
    },

    handleFileUpload(event) {
      this.form.file = event.target.files[0];
    },

    async submitForm() {
      this.messages = [];

      try {
        const requiredFields = ['full_name', 'service_type', 'experience', 'address', 'pin_code'];
        const missingFields = requiredFields.filter(field => !this.form[field]);

        if (missingFields.length > 0) {
          throw { message: `Missing: ${missingFields.join(', ')}`, category: 'danger' };
        }

        const formData = new FormData();
        formData.append('full_name', this.form.full_name);
        formData.append('service_type', this.form.service_type);
        formData.append('experience', this.form.experience);
        formData.append('address', this.form.address);
        formData.append('pin_code', this.form.pin_code);
        
        if (this.form.file) {
          formData.append('file', this.form.file);
        }

        const response = await fetch('/professional/profile', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          body: formData
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(await response.text());
        }

        const result = await response.json();
        if (!response.ok) throw result;

        this.messages.push({ category: 'success', text: result.message || 'Profile updated' });

        this.fetchProfileData();
      } catch (error) {
        this.messages.push({ category: error.category || 'danger', text: error.message || 'Update failed' });
      }
    }
  }
};
