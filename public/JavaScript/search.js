$(document).ready(function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const kashrutFilters = urlParams.getAll('kashrut');
    const manufacturerFilters = urlParams.getAll('manufacturer');
    const query = urlParams.get('q') || ''; // takes from url


    // Set the checked state for kashrut filters
    $("input[name='kashrut']").each(function() {
        if (kashrutFilters.includes($(this).val())) { // checks if chosen
            $(this).prop('checked', true);
        }
    });

    // Set the checked state for manufacturer filters
    $("input[name='manufacturer']").each(function() {
        if (manufacturerFilters.includes($(this).val())) {
            $(this).prop('checked', true);
        }
    });

    // Update price slider values based on URL parameters

    const defaultMinPrice = parseFloat($('#minPrice').data('default-min'));
    const defaultMaxPrice = parseFloat($('#maxPrice').data('default-max'));
    const minPrice = parseFloat(urlParams.get('minPrice'))||defaultMinPrice;
    const maxPrice = parseFloat(urlParams.get('maxPrice'))||defaultMaxPrice;
    $("#slider-range").slider({
        range: true,
        min: defaultMinPrice,
        max: defaultMaxPrice,
        step: 0.01,
        values: [minPrice, maxPrice],
        slide: function(event, ui) {
            $("#amount").val("₪" + ui.values[0] + " - ₪" + ui.values[1]);
            $("#minPrice").val(ui.values[0]);
            $("#maxPrice").val(ui.values[1]);
        }
    });

    // Set initial display values
    $("#amount").val("₪" + minPrice + " - ₪" + maxPrice);
    $("#minPrice").val(minPrice);
    $("#maxPrice").val(maxPrice);
});

$('#searchForm').submit(function(e) {
    e.preventDefault();

    const query = $("#searchQuery").val() || '';
    const minPrice = $("#minPrice").val();
    const maxPrice = $("#maxPrice").val();
    const kashrut = $("input[name='kashrut']:checked").map(function() { return $(this).val(); }).get();
    const manufacturer = $("input[name='manufacturer']:checked").map(function() { return $(this).val(); }).get();

    const url = new URL('/search', window.location.origin);

    // adding to the url the filters 
    url.searchParams.set('q', query);
    url.searchParams.set('minPrice', minPrice);
    url.searchParams.set('maxPrice', maxPrice);
    kashrut.forEach(value => url.searchParams.append('kashrut', value));
    manufacturer.forEach(value => url.searchParams.append('manufacturer', value));

    window.location.href = url.toString();
});
