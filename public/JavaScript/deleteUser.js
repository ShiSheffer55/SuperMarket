function deleteUser(id) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            type: 'POST', // Changed from 'DELETE' to 'POST'
            url: `/admin/users/delete/${id}`,
            success: function (response) {
                alert(response.message);
                location.reload(); // Refresh the page to reflect changes
            },
            error: function (xhr, status, error) {
                console.error("Error deleting user:", xhr, status, error);
                const errorMessage = xhr.responseJSON && xhr.responseJSON.message 
                    ? xhr.responseJSON.message 
                    : 'An error occurred while deleting the user.';
                alert("Error deleting user: " + errorMessage);
            }
        });
        
    }
}
