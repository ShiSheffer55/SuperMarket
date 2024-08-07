document.getElementById('fName').addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!char.match(/^[\p{L}\s]$/u)) {
        e.preventDefault();
    }
});
// for cntrl c to numbers
document.getElementById('fName').addEventListener('input', function (e) {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z\u0590-\u05FF\s]/g, '');
    e.target.value = sanitizedValue;
});
document.getElementById('lName').addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!char.match(/^[\p{L}\s]$/u)) {
        e.preventDefault();
    }
});
// for cntrl c to numbers
document.getElementById('lName').addEventListener('input', function (e) {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z\u0590-\u05FF\s]/g, '');
    e.target.value = sanitizedValue;
});
document.getElementById('tel').addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!char.match(/[0-9\s-]/)) {
        e.preventDefault();
    }
});
// copy paste
document.getElementById('tel').addEventListener('input', function (e) {
    const sanitizedValue = e.target.value.replace(/[^0-9\s-]/g, '');
    e.target.value = sanitizedValue;
});