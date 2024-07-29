//  document.addEventListener('DOMContentLoaded', function() {
//         const forms = document.querySelectorAll('.add-to-cart-form');

//         forms.forEach(form => {
//             form.addEventListener('submit', function(event) {
//                 event.preventDefault();
                
//                 const formData = new FormData(this);
                
//                 fetch(this.action, {
//                     method: 'POST',
//                     body: formData,
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         // Update cart UI dynamically here
//                         alert('Product added to cart successfully!');
//                     } else {
//                         alert('Failed to add product to cart.');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             });
//         });
//     });

