$(document).ready(function() {
    console.log('cart.js loaded');

    $('.delete-btn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        const productName = $(this).closest('tr').data('product-name'); // Get the product name
        console.log('Delete button clicked for product name:', productName);
    
        $.ajax({
            url: '/cart/delete/' + encodeURIComponent(productName), // Use the encoded product name
            method: 'POST', // Or 'DELETE' if the server expects DELETE requests
            success: function(response) {
                console.log('Product removed successfully:', response);
                alert(response.message);
                location.reload(); // Reload the page to update the cart
            },
            error: function(err) {
                console.log('Error removing product:', err);
                alert('Error removing product. Please try again.');
            }
        });
    });
    
    // Function to update the cart UI
    function updateCartUI(cart) {
        // Update the cart UI with the new cart contents
        // This could include updating a cart summary or removing the product from the list
        // Example:
        $('#cart-items').empty(); // Assuming you have a container with ID `cart-items`
        cart.forEach(item => {
            $('#cart-items').append(`
                <tr data-product-id="${item._id}">
                    <td>${item.title}</td>
                    <td>${item.quantity}</td>
                    <!-- Add more table data if needed -->
                </tr>
            `);
        });
    }

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