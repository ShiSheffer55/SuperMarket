
$(document).ready(function() {
    console.log('cart.js loaded');

    // Remove product from cart
    $('.delete-btn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission

        const productId = $(this).closest('tr').data('product-id');
        console.log('Delete button clicked for product ID:', productId);

        $.ajax({
            url: '/cart/delete/' + productId,
            method: 'POST',
            success: function(response) {
                alert(response.message);
                location.reload(); // Reload the page to update the cart
            },
            error: function(err) {
                console.log('Error removing product:', err);
            }
        });
    });

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
                console.log('Error emptying cart:', err);
            }
        });
    });
});
