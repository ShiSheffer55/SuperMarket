function changeQuantity(button, delta) {
    console.log('Button clicked:', button, 'Delta:', delta); // בדיקת לחיצה על כפתור
   // const input = button.parentElement.querySelector('.quantity-input');
    let value = parseInt(input.value, 10) || 0;
    value += delta;
    if (value < parseInt(input.min, 10)) value = input.min;
    if (value > parseInt(input.max, 10)) value = input.max;
    input.value = value;
    console.log('New quantity value:', input.value); // בדיקת ערך כמות חדשה
}