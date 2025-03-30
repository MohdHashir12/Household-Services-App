import Carousel from "../components/Carousel.js";

export default {
  components: {
    Carousel,
  },
  data() {
    return {
      message: null,      
      category: null,
      services: [],
      serviceType: null,
      carouselSlides: [
        {
          image: "/static/static/images/cleaning.jpg",
          alt: "Cleaning Services",
          link: "/customer/dashboard?service_type=cleaning",
          title: "Cleaning Services",
          description: "Keep your home or office spotless with our professional cleaning services.",
        },
        {
          image: "/static/static/images/plumber.jpg",
          alt: "Plumbing Services",
          link: "/customer/dashboard?service_type=plumbing",
          title: "Plumbing Services",
          description: "Fix leaks and plumbing issues with our experienced plumbers.",
        },
        {
          image: "/static/static/images/electrical.jpg",
          alt: "Electrical Services",
          link: "/customer/dashboard?service_type=electrical",
          title: "Electrical Services",
          description: "Get reliable electrical services for your home or office needs.",
        },
        {
          image: "/static/static/images/painting.jpg",
          alt: "Painting Services",
          link: "/customer/dashboard?service_type=painting",
          title: "Painting Services",
          description: "Beautify your space with our expert painting services.",
        },
        {
          image: "/static/static/images/haircut.jpg",
          alt: "Haircut at Home Services",
          link: "/customer/dashboard?service_type=haircut",
          title: "Haircut at Home",
          description: "Get a professional haircut at the comfort of your home.",
        },
      ],
      serviceRequests: [],
      serviceDict: {},
      profDict: {},
    };
  },
  mounted() {
    const queryParams = this.$route.query;
    if (queryParams.service_type) {
      this.serviceType = queryParams.service_type;
    }
    this.fetchServices();
  },
  watch: {
    "$route.query.service_type": function(newServiceType) {
      this.serviceType = newServiceType;
      this.fetchServices();
    }
  },
  methods: {
    async fetchServices() {
      try {
        const apiUrl = this.serviceType
          ? `/customer/dashboard?service_type=${this.serviceType}`
          : "/customer/dashboard";
        const response = await fetch(apiUrl,{
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        });
        const data = await response.json();
        this.services = data.services || [];
        this.serviceRequests = data.service_requests || [];
        this.serviceDict = data.service_dict || {};
        this.profDict = data.prof_dict || {};
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    async createServiceRequest(serviceId) {
      try {
        const response = await fetch(`/customer/create_service_request/${serviceId}`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.message = data.message;
          this.category = data.category;
          this.fetchServices();
        } else {
          const errorData = await response.json();
          this.message = errorData.message;
          this.category = errorData.category;
          console.error("Error creating service request:", errorData);
        }
      } catch (error) {
        this.message = "An error occurred while processing your request.";
        this.category = "danger";
        console.error("Error creating service request:", error);
      }
    }
  },     
  template: `
    <div class="container mt-4">
      
      <!-- Carousel Section (Heading unchanged) -->
      <h3 class="text-center mb-3">Browse Our Services</h3>
      <Carousel :slides="carouselSlides" carousel-id="serviceCarousel" />

      <!-- Flash Message -->
      <div v-if="message" :class="'alert alert-' + category + ' mt-3 text-center'" role="alert">
        {{ message }}
      </div>

      <!-- Services Section -->
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-primary text-white text-center">
          <h4>Available Services</h4>
        </div>
        <div class="card-body">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services" :key="service.id">
                <td>{{ service.name }}</td>
                <td>{{ service.description }}</td>
                <td>{{ service.price }}</td>
                <td>
                  <button @click="createServiceRequest(service.id)" class="btn btn-success btn-sm">
                    Request
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Service History Section -->
      <div class="card shadow-sm mt-4">
        <div class="card-header bg-dark text-white text-center">
          <h4>Service History</h4>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead class="table-light">
              <tr>
                <th>Service Name</th>
                <th>Professional</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="serviceRequest in serviceRequests" :key="serviceRequest.id">
                <td>{{ serviceDict[serviceRequest.service_id]?.name }}</td>
                <td>{{ profDict[serviceRequest.professional_id]?.full_name }}</td>
                <td>{{ serviceRequest.service_status }}</td>
                <td>
                  <router-link v-if="serviceRequest.service_status !== 'completed'" 
                    :to="'/customer/closeServiceRequest/' + serviceRequest.id" 
                    class="btn btn-outline-danger btn-sm">
                    Close
                  </router-link>
                  <span v-else class="text-muted">Closed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
};
