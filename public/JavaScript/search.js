$(function() {
    const minPrice = parseFloat($("#minPriceSlider").val()) || 0;
    const maxPrice = parseFloat($("#maxPriceSlider").val()) || 500;

    $("#slider-range").slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        step: 0.01,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
            $("#amount").val("₪" + ui.values[0] + " - ₪" + ui.values[1]);
            $("#minPrice").val(ui.values[0]);
            $("#maxPrice").val(ui.values[1]);
        }
    });

    $("#amount").val("₪" + $("#slider-range").slider("values", 0) + " - ₪" + $("#slider-range").slider("values", 1));
    $("#minPrice").val($("#slider-range").slider("values", 0));
    $("#maxPrice").val($("#slider-range").slider("values", 1));
    
    $('#searchForm').submit(function(e) {
        e.preventDefault();

        const query = new URLSearchParams(window.location.search).get('q') || '';
        const minPrice = $("#minPrice").val();
        const maxPrice = $("#maxPrice").val();
        const kashrut = $("input[name='kashrut']:checked").map(function() { return $(this).val(); }).get();
        const manufacturer = $("input[name='manufacturer']:checked").map(function() { return $(this).val(); }).get();
        
        const url = new URL('/search', window.location.origin);
        url.searchParams.set('q', query);
        url.searchParams.set('minPrice', minPrice);
        url.searchParams.set('maxPrice', maxPrice);
        kashrut.forEach(value => url.searchParams.append('kashrut', value));
        manufacturer.forEach(value => url.searchParams.append('manufacturer', value));

        window.location.href = url.toString();
    });
});
function filterProducts(products) {
    const minPrice = parseFloat($("#minPrice").val());
    const maxPrice = parseFloat($("#maxPrice").val());
    const filteredProducts = products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    updateDisplay(filteredProducts);
}