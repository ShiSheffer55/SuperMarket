function toggleFilters() { 
    const filterBar = document.getElementById('filterBar');
    filterBar.style.display = filterBar.style.display === 'none' ? 'block' : 'none';
}


function applyFilters() {}

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



