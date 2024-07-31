$(function() {
    // Initialize the slider
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300], // Default values
        slide: function(event, ui) {
            // Update the display values
            $("#amount").val("₪" + ui.values[0] + " - ₪" + ui.values[1]);
            // Update the hidden fields
            $("#minPrice").val(ui.values[0]);
            $("#maxPrice").val(ui.values[1]);
        }
    });

    // Set the initial values for the display and hidden fields
    $("#amount").val("₪" + $("#slider-range").slider("values", 0) + " - ₪" + $("#slider-range").slider("values", 1));
    $("#minPrice").val($("#slider-range").slider("values", 0));
    $("#maxPrice").val($("#slider-range").slider("values", 1));
});
    // Update the form action with the search query
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
