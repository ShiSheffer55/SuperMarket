function changeQuantity(button, increment) {
    var input = button.parentElement.querySelector('input');
    var currentValue = parseInt(input.value);
    var newValue = currentValue + increment;
    var min = parseInt(input.min);
    var max = parseInt(input.max);
  
    if (newValue >= min && newValue <= max) {
      input.value = newValue;
    }
  }

  function resetQuantity() {
    console.log("Reset Quantity function called");
    document.getElementById('quantity').value = 1;
  }