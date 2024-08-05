$(document).ready(function() {
    console.log('cart.js loaded');

    // Reinitialize delete button icon
    $('.delete-btn').html('<i class="bi bi-trash"></i>');

    $('.delete-btn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission

        const button = $(this);
        const productName = button.data('product-name'); // Get the product name from the button
        const row = button.closest('tr'); // Find the closest row to the button

        console.log('Delete button clicked for product name:', productName);

        $.ajax({
            url: '/cart/delete/' + encodeURIComponent(productName), // Use the encoded product name
            method: 'POST', // Or 'DELETE' if the server expects DELETE requests
            success: function(response) {
                console.log('Product removed successfully:', response);
                alert(response.message);
                location.reload(); // Reload the page to update the cart
                // Remove the row from the table
                row.remove();
            },
            error: function(err) {
                console.log('Error removing product:', err);
                alert('Error removing product. Please try again.');
            }
        });
    });

    $('#cancel-cart').on('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
    
        // Show the custom confirmation modal
        $('#confirm-modal').show();
    });
    
    // Handle the "Yes" button click
    $('#confirm-yes').on('click', function() {
        // User confirmed, proceed with the AJAX request to empty the cart
        $.ajax({
            url: '/cart/empty', // Adjust URL based on your route
            type: 'POST', // Or 'DELETE' if that fits your route
            success: function(response) {
                // Optionally update the UI to show the cart is empty
                $('#cart-container').html('<p>הסל ריק</p>'); // Example update
                alert(response.message);
                location.reload(); // Reload the page to update the cart
            },
            error: function(xhr) {
                console.error('Error emptying cart:', xhr.responseText);
                alert('Error emptying cart');
            }
        });
    
        // Hide the modal after the action is confirmed
        $('#confirm-modal').hide();
    });
    
    // Handle the "No" button click
    $('#confirm-no').on('click', function() {
        // User canceled, just hide the modal
        $('#confirm-modal').hide();
    });
})