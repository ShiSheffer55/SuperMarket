$(document).ready(function() {
    console.log('cart.js loaded');

    // Reinitialize delete button icon
    $('.delete-btn').html('<i class="bi bi-trash"></i>');

    $('.delete-btn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission

        const button = $(this);
        const productId = button.data('product-id'); // Get the product ID from the button
        const row = button.closest('tr'); // Find the closest row to the button

        console.log('Delete button clicked for product ID:', productId);

        $.ajax({
            url: '/cart/delete/' + encodeURIComponent(productId), // Use the encoded product ID
            method: 'POST', // Or 'DELETE' if the server expects DELETE requests
            success: function(response) {
                console.log('Product removed successfully:', response);
                alert(response.message);

                // Remove the row from the table
                row.remove();
            },
            error: function(err) {
                console.log('Error removing product:', err);
                alert('Error removing product. Please try again.');
            }
        });
    });

    // Empty the cart
    $('#cancel-cart').on('click', function(e) {
    // Empty the cart
    $('#cancel-cart').on('click', function(e) {
        e.preventDefault(); // Prevent default link behavior

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
    });
});

