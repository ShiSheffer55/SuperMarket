document.addEventListener('DOMContentLoaded', function() {
    // Check if user data is missing in a specific element
    if (document.getElementById('user-data') === null) {
        // Redirect to login page if user is not logged in
        window.location.href = '/users/login';
    }
});
