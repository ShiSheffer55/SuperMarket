document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Event delegation for handling form submissions
    document.body.addEventListener('submit', function(event) {
        if (event.target.classList.contains('add-to-cart-form')) {
            console.log('Form submitted');
            addToCart(event);
        }
    });
});
async function addToCart(event) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const productId = form.querySelector('input[name="productId"]').value;
    const category = form.querySelector('input[name="category"]').value;
    const quantity = parseInt(form.querySelector('input[name="quantity"]').value, 10);

    console.log(productId); 
    console.log(category); 
    console.log(quantity); 
    
    const data = {
        productId,
        category,
        quantity
    };

    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            updateCartUI(result.cart);
        } else {
            const errorText = await response.text();
            showAlert(`Error adding product to cart: ${errorText}`);
        }
    } catch (err) {
        showAlert('An unexpected error occurred. Please try again.');
    }
}

// Function to display an alert or message to the user
function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.textContent = message;
        alertContainer.style.display = 'block';
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 5000);
    }
}

// Function to update the cart UI
function updateCartUI(cart) {
    const cartItemCount = document.getElementById('cart-badge');
    if (cartItemCount) {
        cartItemCount.textContent = cart.length;
    }
}
