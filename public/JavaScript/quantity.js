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