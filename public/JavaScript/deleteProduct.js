
function deleteProduct(collectionName, id) {
    $.ajax({
        type: 'DELETE',
        url: `/admin/products/delete/${collectionName}/${id}`,
        success: function (response) {
            console.log("Product deleted successfully:", response);
            alert(response.message);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Error deleting product:", xhr, status, error);
            alert("Error deleting product: " + xhr.responseJSON.message);
        }
    });
}