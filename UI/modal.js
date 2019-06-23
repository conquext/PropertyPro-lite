 // Get the modal
const listingModal = document.getElementById('add-property-modal');
const editingModal = document.getElementById('edit-property-modal');
     
 // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == listingModal) {
        listingModal.style.display = "none";
    }
    if (event.target == editingModal) {
        editingModal.classList.remove("open");
        editingModal.style.display = "none";
    }
}