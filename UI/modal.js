 // Get the modal
 var listingModal = document.getElementById('add-property-modal');
        
 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == listingModal) {
     listingModal.style.display = "none";
     }
 }