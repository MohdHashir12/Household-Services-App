export default {
    template: `
    <div class="bg-image d-flex align-items-center justify-content-center">
        <div class="p-4 bg-white shadow rounded w-100" style="max-width: 350px;">
            <h3 class="text-center mb-3">Login</h3>
            <p class="text-center text-muted">Access your account</p>
            <div v-if="message" :class="'alert alert-' + category" role="alert">
                {{ message }}
            </div>
            <form @submit.prevent="submitLogin">
                <div class="mb-3">
                    <label for="username" class="form-label">Username (Email):</label>
                    <input type="text" id="username" v-model="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" id="password" v-model="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <div class="text-center mt-3">
                    <router-link to="/register">Register as Customer/Professional</router-link>
                </div>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            username: null,
            password: null,
            message: null,      
            category: null,
        };
    },
    methods: {
        async submitLogin() {
            try {
                var res = await fetch(location.origin + '/login', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 'username': this.username, 'password': this.password })
                });
                if (res.ok) {
                    const data = await res.json();
                    res = await fetch(location.origin + '/get-claims', {
                        method: 'GET', 
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + data.access_token }
                    });                
                    if (res.ok) {
                        const claim_data = await res.json();
                        this.$root.login(claim_data.claims.role, data.access_token);
                        if (claim_data.claims.redirect === 'customer_dashboard') {
                            this.$router.push('/customer/dashboard');
                        } else if (claim_data.claims.redirect === 'professional_dashboard') {
                            this.$router.push('/professional/dashboard');
                        } else if (claim_data.claims.redirect === 'professional_profile') {
                            this.$router.push('/professional/profile');
                        } else if (claim_data.claims.redirect === 'customer_profile') {
                            this.$router.push('/customer/profile');
                        } else {
                            this.message = 'An unexpected error occurred.';
                            this.category = 'danger';
                        }
                    } else {
                        this.message = 'An unexpected error occurred.';
                        this.category = 'danger';
                    }                            
                } else {
                    const errorData = await res.json();  
                    this.message = errorData.message; 
                    this.category = errorData.category; 
                }                
            } catch (error) {
                console.log(error);
                this.message = 'An unexpected error occurred.';
                this.category = 'danger';
            }
        }
    }
};
