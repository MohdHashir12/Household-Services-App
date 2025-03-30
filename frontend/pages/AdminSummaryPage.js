export default {
  template: `
    <div class="container mt-4">
      <div class="text-center mb-4">
        <h2 class="fw-bold" style="font-family: 'Courier New', Courier, monospace; color: #001F3F;">
          Admin Summary
        </h2>
      </div>

      <div class="row">
        <!-- Overall Customer Ratings -->
        <div class="col-md-6">
          <div class="card shadow-sm p-3 mb-4 text-center border-primary">
            <h4 class="fw-bold text-primary">Overall Customer Ratings</h4>
            <h5 class="fw-bold text-success">Total: {{ totalReviews }}</h5>
            <canvas id="reviewsDoughnutChart" height="250"></canvas>
          </div>
        </div>

        <!-- Service Request Summary -->
        <div class="col-md-6">
          <div class="card shadow-sm p-3 mb-4 text-center border-primary">
            <h4 class="fw-bold text-primary">Service Request Summary</h4>
            <h5 class="fw-bold text-success">Total: {{ totalRequests }}</h5>
            <canvas id="serviceRequests" height="250"></canvas>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      reviewsDoughnutChart: null,
      serviceRequestsChart: null,
      totalReviews: 0,
      totalRequests: 0
    };
  },

  methods: {
    async fetchReviewsData() {
      try {
        const response = await fetch('/admin/summary/reviews', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        const labels = data.map(item => item.full_name);
        const reviews = data.map(item => item.reviews);

        this.totalReviews = reviews.reduce((sum, num) => sum + num, 0); // Calculate total reviews
        this.updateDoughnutChart(labels, reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },

    updateDoughnutChart(labels, data) {
      const ctx = document.getElementById('reviewsDoughnutChart').getContext('2d');
      if (this.reviewsDoughnutChart) this.reviewsDoughnutChart.destroy();

      this.reviewsDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Customer Ratings',
            data: data,
            backgroundColor: ['#001F3F', '#003366', '#004080', '#00509E', '#0066CC'],
            borderColor: '#fff',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: tooltipItem => `Ratings: ${tooltipItem.raw}`
              }
            }
          }
        }
      });
    },

    async fetchServiceRequests() {
      try {
        const response = await fetch('/admin/summary/service_requests', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        const labels = data.map(item => item.date);
        const count = data.map(item => item.count);

        this.totalRequests = count.reduce((sum, num) => sum + num, 0); // Calculate total requests
        this.updateServiceRequestChart(labels, count);
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    },

    updateServiceRequestChart(labels, data) {
      const ctx = document.getElementById('serviceRequests').getContext('2d');
      if (this.serviceRequestsChart) this.serviceRequestsChart.destroy();

      this.serviceRequestsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Service Requests',
            data: data,
            backgroundColor: 'rgba(0, 31, 63, 0.2)',
            borderColor: '#001F3F',
            borderWidth: 1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: tooltipItem => `Requests: ${tooltipItem.raw}`
              }
            }
          }
        }
      });
    }
  },

  mounted() {
    this.fetchReviewsData();
    this.fetchServiceRequests();
  }
};
