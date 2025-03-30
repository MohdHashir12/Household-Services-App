export default {
    template: `
    <div class="bg-image d-flex align-items-center justify-content-center">
        <div class="p-4 bg-white shadow rounded w-100" style="max-width: 350px;">
            <h3 class="text-center mb-3">Admin Login</h3>
            <p class="text-center text-muted">Access your dashboard</p>
            <div v-if="message" :class="'alert alert-' + category" role="alert">
                {{ message }}
            </div>
            <form @submit.prevent="submitLogin">
                <div class="mb-3">
                    <label for="username" class="form-label">Username:</label>
                    <input type="text" id="username" v-model="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" id="password" v-model="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
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
                const res = await fetch(location.origin + '/admin/login', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 'username': this.username, 'password': this.password })
                });                
                if (res.ok) {
                    const data = await res.json();
                    this.$root.login('admin', data.access_token);
                    this.$router.push('/admin/dashboard');
                } else {
                    const errorData = await res.json();  
                    this.message = errorData.message; 
                    this.category = errorData.category; 
                }                
            } catch (error) {
                this.message = 'An unexpected error occurred.';
                this.category = 'danger';
            }
        }
    }
};
