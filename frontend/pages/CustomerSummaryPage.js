export default {
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12 text-center">
          <h2 class="text-secondary fw-semibold mb-3">Customer Service Summary</h2>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm mb-3">
            <div class="card-body text-center">
              <h5 class="text-success fw-bold">Total Requests: {{ totalRequests }}</h5>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <canvas id="serviceRequests" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      serviceRequestsChart: null,
      totalRequests: 0,
    };
  },
  methods: {
    async fetchServiceRequestsCustomer() {
      try {
        // Fetch user ID via claims
        const claimsResponse = await fetch(`${location.origin}/get-claims`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!claimsResponse.ok) {
          console.error('Error fetching claims:', claimsResponse.statusText);
          return;
        }

        const claimData = await claimsResponse.json();
        const userId = claimData.claims.user_id;

        // Fetch service request data for this user
        const serviceResponse = await fetch(`${location.origin}/customer/summary/service_requests/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!serviceResponse.ok) {
          console.error('Error fetching service request data:', serviceResponse.statusText);
          return;
        }

        const serviceData = await serviceResponse.json();
        
        // Calculate total requests
        this.totalRequests = serviceData.reduce((sum, item) => sum + item.count, 0);

        const labels = serviceData.map(item => item.date);
        const counts = serviceData.map(item => item.count);
        this.updateServiceRequestCustomerChart(labels, counts);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    updateServiceRequestCustomerChart(labels, data) {
      const ctx = document.getElementById('serviceRequests').getContext('2d');
      if (this.serviceRequestsChart) this.serviceRequestsChart.destroy();
      this.serviceRequestsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Service Requests Per Day',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',   // Blue
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: tooltipItem => `Requests: ${tooltipItem.raw}`
              }
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  },
  mounted() {
    this.fetchServiceRequestsCustomer();
  }
};
