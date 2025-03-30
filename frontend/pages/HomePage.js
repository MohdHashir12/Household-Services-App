export default {
    template: `
    <div class="page-container d-flex align-items-center justify-content-center">
        <div class="col-md-4 text-center bg-white p-4 rounded shadow">
            <h2 class="mb-3">HomeBuddy</h2>
            <p class="text-muted">Your Home, Our Expertise!</p>
            <div class="d-grid gap-3 mt-4">
                <router-link to="/admin/login" class="btn btn-primary w-100">Admin Login</router-link>
                <router-link to="/login" class="btn btn-success w-100">Customer/Professional Login</router-link>
            </div>
        </div>    
    </div>
    `,
    mounted() {
        document.body.classList.add('bg-image');
    },
    beforeDestroy() {
        document.body.classList.remove('bg-image');
    }
}
