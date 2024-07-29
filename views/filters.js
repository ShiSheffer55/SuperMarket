function toggleFilters() { 
    const filterBar = document.getElementById('filterBar');
    filterBar.style.display = filterBar.style.display === 'none' ? 'block' : 'none';
}


$(function() { //פונקציה בשביל טווח המחירים
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function(event, ui) {
            $("#price-range").text("₪" + ui.values[0] + " - ₪" + ui.values[1]);
        }
    });
    $("#price-range").text("₪" + $("#slider-range").slider("values", 0) +
        " - ₪" + $("#slider-range").slider("values", 1));
});

















$(document).ready(function() {
    // Initial fetch of products
    fetchProducts();

    // Handle slider input
    $('#price-min, #price-max').on('input', function() {
        const minPrice = $('#price-min').val();
        const maxPrice = $('#price-max').val();
        $('#price-range').text(`${minPrice} - ${maxPrice}`);
        fetchProducts(minPrice, maxPrice);
    });
});

function fetchProducts(minPrice = 0, maxPrice = 500) {
    $.ajax({
        url: '/products/filter',
        method: 'GET',
        data: {
            minPrice: minPrice,
            maxPrice: maxPrice
        },
        success: function(response) {
            displayProducts(response.products);
        }
    });
}

function displayProducts(products) {
    const productList = $('#product-list');
    productList.empty();
    if (products.length > 0) {
        products.forEach(product => {
            productList.append(`
                <div class="col-md-4">
                    <div class="card">
                        <img src="${product.img}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description}</p>
                            <p>₪ ${product.price}</p>
                            <form class="add-to-cart-form" action="/cart/add" method="POST">
                                <input type="hidden" name="productId" value="${product._id}">
                                <input type="number" name="quantity" value="1" min="1">
                                <button class="btn btn-primary">Add to Cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            `);
        });
    } else {
        productList.append('<p>No products found in this price range.</p>');
    }}



