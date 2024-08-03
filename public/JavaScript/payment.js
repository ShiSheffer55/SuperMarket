document.querySelector('.card-number-input').oninput = () =>{
    document.querySelector('.card-number-box').innerText = document.querySelector('.card-number-input').value;
}

document.querySelector('.card-holder-input').oninput = () =>{
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () =>{
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () =>{
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () =>{
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}

document.querySelector('.card-number-input').addEventListener('keypress', function (e) {
    // מונע הכנסת תווים שאינם מספרים
    if (e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});
document.querySelector('.cvv-input').addEventListener('keypress', function (e) {
    // מונע הכנסת תווים שאינם מספרים
    if (e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});
document.querySelector('.card-holder-input').addEventListener('keypress', function (e) {
    // השגת התו שהוזן
    const char = String.fromCharCode(e.which || e.keyCode);
    // בדיקה אם התו הוא אות כלשהי
    if (!char.match(/^[\p{L}]$/u)) {
        e.preventDefault();
    }
});