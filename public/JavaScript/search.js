$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $("#amount").val("₪" + $("#slider-range").slider("values", 0) + " - ₪" + $("#slider-range").slider("values", 1));
    $("#minPrice").val($("#slider-range").slider("values", 0));
    $("#maxPrice").val($("#slider-range").slider("values", 1));

    // Handle the reset quantity functionality
    $(".reset-link").click(function() {
        $(this).closest('.custom-input-container').find('.custominput').val(1);
    });
});

function changeQuantity(button, delta) {
    var input = $(button).siblings('.custominput');
    var newValue = parseInt(input.val()) + delta;
    var max = parseInt(input.attr('max'));
    if (newValue >= 1 && newValue <= max) {
        input.val(newValue);
    }
}

function resetQuantity() {
    $(".custominput").val(1);
}