function deleteProduct(collectionName,id) {
    $.ajax({
        type: 'DELETE',
        url: `/admin/products/delete/${collectionName}/${id}`, // עדכן את ה-URL לפי הצורך
        success: function (){
            //reloadAllProductPage();
        },
        error: function () {
            alert("Error deleting product");
        }
    });
}