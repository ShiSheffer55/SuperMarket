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
        e.preventDefault(); // Prevent default link behavior
        var userConfirmed = confirm("האם אתה בטוח שברצונך למחוק את הסל?");
        if (userConfirmed){
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
        });}
        else {
            // User canceled, do nothing
            alert("הסל לא נמחק.");
        }
    });
    
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
