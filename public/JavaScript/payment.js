document.querySelector('.card-number-input').oninput = () => {
    let cardNumber = document.querySelector('.card-number-input').value;
    cardNumber = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    document.querySelector('.card-number-input').value = formattedCardNumber;
    document.querySelector('.card-number-box').innerText = formattedCardNumber;
}

document.querySelector('.card-holder-input').oninput = () => {
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () => {
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () => {
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () => {
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}

document.querySelector('.card-number-input').addEventListener('keypress', function (e) {
    if (e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});

document.querySelector('.cvv-input').addEventListener('keypress', function (e) {
    if (e.key < '0' || e.key > '9') {
        e.preventDefault();
    }
});

document.querySelector('.card-holder-input').addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!char.match(/^[\p{L}\s]$/u)) {
        e.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const cardNumberInput = document.querySelector(".card-number-input");
    const cvvInput = document.querySelector(".cvv-input");
    const monthInput = document.querySelector(".month-input");
    const yearInput = document.querySelector(".year-input");
    const addressInput = document.querySelector("#addressInput");
    const cardHolderInput = document.querySelector(".card-holder-input");
    const checkoutForm = document.getElementById("checkout-form");

    function validateCardNumber(cardNumber) {
        const regex = /^[0-9]{16}$/;
        return regex.test(cardNumber.replace(/\s+/g, ''));
    }

    function validateCVV(cvv) {
        const regex = /^[0-9]{3,4}$/;
        return regex.test(cvv);
    }

    function validateForm() {
        if (
            cardNumberInput.value === '' ||
            !validateCardNumber(cardNumberInput.value) ||
            cvvInput.value === '' ||
            !validateCVV(cvvInput.value) ||
            monthInput.value === '' ||
            yearInput.value === '' ||
            addressInput.value === '' ||
            cardHolderInput.value === ''
        ) {
            return false;
        }
        return true;
    }

    cardNumberInput.addEventListener("input", function() {
        if (!validateCardNumber(cardNumberInput.value)) {
            cardNumberInput.setCustomValidity("מספר כרטיס אשראי חייב להיות 16 ספרות.");
        } else {
            cardNumberInput.setCustomValidity("");
        }
    });

    cvvInput.addEventListener("input", function() {
        if (!validateCVV(cvvInput.value)) {
            cvvInput.setCustomValidity("CVV חייב להיות 3 או 4 ספרות.");
        } else {
            cvvInput.setCustomValidity("");
        }
    });

    checkoutForm.addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault();
            alert("אנא תקן את השגיאות בטופס לפני שליחתו.");
        }
    });
});
const monthSelect = document.getElementById('monthSelect');
  const yearSelect = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based

  yearSelect.addEventListener('change', function() {
    const selectedYear = parseInt(this.value);

    // Clear existing month options
    while (monthSelect.firstChild) {
      monthSelect.removeChild(monthSelect.firstChild);
    }

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "חודש";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    monthSelect.appendChild(defaultOption);

    // Determine the start month based on the selected year
    let startMonth = 1;
    if (selectedYear === currentYear) {
      startMonth = currentMonth; // Only allow future or current months for the current year
    }

    // Add month options
    for (let i = startMonth; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i < 10 ? '0' + i : i;
      option.textContent = i < 10 ? '0' + i : i;
      monthSelect.appendChild(option);
    }
  });