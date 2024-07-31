
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
