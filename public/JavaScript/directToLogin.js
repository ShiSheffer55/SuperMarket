document.addEventListener('DOMContentLoaded', function() {
    const userDataElement = document.getElementById('user-data');
    
    // Log whether the user-data element exists or not
    console.log('User data element found:', userDataElement !== null);

    // Redirect to login page if user data is missing
    if (userDataElement === null) {
        console.log('Redirecting to login page');
        window.location.href = '/login';
    }
});
