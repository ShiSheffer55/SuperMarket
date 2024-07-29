function toggleFilters() { 
    const filterBar = document.getElementById('filterBar');
    filterBar.style.display = filterBar.style.display === 'none' ? 'block' : 'none';
}

$(function() {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [0, 500],
        slide: function(event, ui) {
            $("#price-range").text(ui.values[0] + " - " + ui.values[1]);
        }
    });
    $("#price-range").text($("#slider-range").slider("values", 0) + " - " + $("#slider-range").slider("values", 1));
});

$(document).ready(function() {
    // Initial fetch of products
    fetchProducts();

    // Handle form submission
    $('#filterForm').submit(function(event) {
        event.preventDefault();
        fetchProducts();
    });

    function fetchProducts() {
        const minPrice = $("#slider-range").slider("values", 0);
        const maxPrice = $("#slider-range").slider("values", 1);

        $.ajax({
            url: '/filter',
            method: 'GET',
            data: {
                minPrice: minPrice,
                maxPrice: maxPrice
            },
            success: function(response) {
                displayProducts(response.products);
            },
            error: function(error) {
                console.log('Error fetching products:', error);
            }
        });
    }

    function displayProducts(products) {
        const productList = $('#products');
        productList.empty();
        if (products.length > 0) {
            products.forEach(product => {
                productList.append(`
                    <div class="product-card">
                        <img src="${product.img}" alt="${product.title}">
                        <h5>${product.title}</h5>
                        <p>${product.description}</p>
                        <p>₪ ${product.price}</p>
                    </div>
                `);
            });
        } else {
            productList.append('<p>No products found in this price range.</p>');
        }
    }
});