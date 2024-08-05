
document.getElementById('checkout-form').addEventListener('submit', function(event)
 {
    const creditCardNumber = document.getElementById('creditCardNumber');
    const expirationDate = document.getElementById('expirationDate');
    const cvv = document.getElementById('cvv');
    const zipCode = document.getElementById('zipCode');

    if (!creditCardNumber.checkValidity()) {
        alert(creditCardNumber.title);
        event.preventDefault();
        return;
    }
    if (!expirationDate.checkValidity()) {
        alert(expirationDate.title);
        event.preventDefault();
        return;
    }
    if (!cvv.checkValidity()) {
        alert(cvv.title);
        event.preventDefault();
        return;
    }
    if (!zipCode.checkValidity()) {
        alert(zipCode.title);
        event.preventDefault();
        return;
    }
});
document.getElementById('cancel-cart').addEventListener('click', function() {
    // כאן אתה יכול לשים את הכתובת שאליה יופנה המשתמש לאחר לחיצה על כפתור ביטול
    window.location.href = '/cart';
});
