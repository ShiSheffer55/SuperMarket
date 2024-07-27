document.getElementById('AddtoCart').addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        console.log(data);
        // Handle success or error messages
    })
    .catch(error => {
        console.error('Error:', error);
    });
});