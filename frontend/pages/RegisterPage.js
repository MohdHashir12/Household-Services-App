export default {
    template: `
    <div class="bg-image d-flex align-items-center justify-content-center">
        <div class="p-4 bg-white shadow rounded w-100" style="max-width: 350px;">
            <h3 class="text-center mb-3">Register</h3>
            <p class="text-center text-muted">Create your account</p>
            <div v-if="message" :class="'alert alert-' + category" role="alert">
                {{ message }}
            </div>
            <form @submit.prevent="submitRegister">
                <div class="mb-3">
                    <label for="username" class="form-label">Username:</label>
                    <input type="text" id="username" v-model="username" class="form-control" required> 
                </div>
                <div class="mb-3">    
                    <label for="password" class="form-label">Password:</label>
                    <input type="password" id="password" v-model="password" class="form-control" required> 
                </div> 
                <div class="mb-3">
                    <label for="role" class="form-label">Select Role:</label>
                    <select v-model="role" id="role" class="form-select">
                        <option value="customer">Customer</option>
                        <option value="professional">Professional</option>
                    </select>
                </div>    
                <button type="submit" class="btn btn-primary w-100">Register</button>
                <div class="text-center mt-3">
                    <router-link to="/login" class="btn btn-secondary btn-sm">Cancel</router-link>
                </div>    
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            username: null,
            password: null,
            role: null,
            message: null,      
            category: null,            
        };
    },
    methods: {
        async submitRegister() {
            try {
                const res = await fetch(location.origin + '/register', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 'username': this.username, 'password': this.password, 'role': this.role })
                });
                if (res.ok) {
                    const data = await res.json();
                    this.message = data.message; 
                    this.category = data.category;
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
