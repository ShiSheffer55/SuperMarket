// document.getElementById('registerForm').onsubmit = function(event) {
//     event.preventDefault();

//     const userName = document.getElementById('userName').value;
//     const fName = document.getElementById('fName').value;
//     const lName = document.getElementById('lName').value;
//     const password = document.getElementById('password').value;
//     const gmail = document.getElementById('gmail').value;
//     const tel = document.getElementById('tel').value;
//     const city = document.getElementById('city').value;
//     const isLivesInCenter = document.getElementById('isLivesInCenter').checked;
//     const role = document.getElementById('role').value;

//     fetch('/users/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userName, fName, lName, password, gmail, tel, city, isLivesInCenter, role })
//     })
//     .then(response => {
//         if (response.ok) {
//             window.location.href = '/'; // Redirect to the homepage
//         } else {
//             return response.json().then(data => { throw new Error(data.message); });
//         }
//     })
//     .catch(error => {
//         alert('Registration failed: ' + error.message);
//     });
// };
