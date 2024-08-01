$(document).ready(function() {
    console.log('cart.js loaded');

    // Remove product from cart
    $('.delete-btn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission

        const productName = $(this).closest('tr').data('product-name'); // Get the product name
        console.log('Delete button clicked for product name:', productName);

        $.ajax({
            url: '/cart/delete/' + encodeURIComponent(productName), // Use the encoded product name
            method: 'POST',
            success: function(response) {
                // Alert the user about the successful removal
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
     $('#cancel-cart').click(function() {
        console.log('Cancel cart button clicked');
        $.ajax({
            url: '/cart/empty',
            method: 'POST',
            success: function(response) {
                alert(response.message);
                location.reload(); // Reload the page to update the cart
            },
            error: function(err) {
                console.error('Error emptying cart:', err);
                if (err.responseJSON && err.responseJSON.message) {
                    alert('Error: ' + err.responseJSON.message);
                } else {
                    alert('Failed to empty cart. Please try again.');
                }
            }
        });
    });
});
