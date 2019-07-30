/* eslint-disable */
const backdrop = document.querySelector(".main-auth__backdrop");
const modal = document.querySelector(".modal");
const signupButton = document.querySelectorAll(".signup");
const signupLinks = document.querySelectorAll("[href='#signup']");
const loginButton  = document.querySelectorAll(".login");
const loginLinks  = document.querySelectorAll("[href='#login']");
const signupForm = document.querySelector("#signup");
const loginForm = document.querySelector("#login");
const toggleButton = document.querySelector(".toggle-button__bar");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavItems = document.querySelector(".mobile-nav__items");
const cancelButton = document.querySelectorAll(".cancelbtn");
const closeIcon = document.querySelectorAll(".close");
const editProperty = document.querySelectorAll("[href='#property-edit']");
const soldProperty = document.querySelectorAll("[href='#property-sold']");
const deleteProperty = document.querySelectorAll("[href='#property-delete']");
const selectedProperty = document.querySelectorAll(".property-item");
const updateListing = document.querySelector("#update-listing");
const listingType = document.querySelectorAll(".property-status a");
const propertyView = document.querySelectorAll(".property-view");
const viewModal = document.getElementById('view-property-modal');
const api = "https://property-pro-lite1.herokuapp.com/api/v1";

let docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

for (var i = 0; i < signupButton.length; i++) {
  signupButton[i].addEventListener("click", function() {
    modal.classList.add("open");
    signupForm.classList.add("open");
    loginForm.classList.remove("open");
  });
}

for (var i = 0; i < signupLinks.length; i++) {
  signupLinks[i].addEventListener("click", function() {
    modal.classList.add("open");
    signupForm.classList.add("open");
    loginForm.classList.remove("open");
  });
}

for (var i = 0; i < loginButton.length; i++) {
  loginButton[i].addEventListener("click", function() {
    modal.classList.add("open");
    loginForm.classList.add("open");
    signupForm.classList.remove("open");
  });
}

for (var i = 0; i < loginLinks.length; i++) {
  loginLinks[i].addEventListener("click", function() {
    modal.classList.add("open");
    loginForm.classList.add("open");
    signupForm.classList.remove("open");
  });
}

backdrop.addEventListener("click", function() {
  mobileNav.classList.remove("open");
  closeModal();
});

const closeModal = () => {
  if (modal) {
    modal.classList.remove("open");
  }
  backdrop.classList.remove("open");
}

toggleButton.addEventListener("click", function() {
  mobileNav.classList.add("open");
  backdrop.classList.add("open");
});
        
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (mobileNav.classList.contains("open")) {
    if (event.target == toggleButton ) {
    }
    else if (event.target !== mobileNavItems) {
      mobileNav.classList.remove("open");
      backdrop.classList.remove("open");
    }
  }
}

for (var i = 0; i < cancelButton.length; i++) {
  cancelButton[i].addEventListener("click", function() {
    modal.classList.remove("open");
    // editingModal.classList.remove("open");
  });
}

for (var i = 0; i < closeIcon.length; i++) {
  closeIcon[i].addEventListener("click", function() {
    modal.classList.remove("open");
    // editingModal.classList.remove("open");
  });
}

for (var i = 0; i < editProperty.length; i++) {
  editProperty[i].addEventListener("click", function() {
      editingModal.classList.add("open"); 
      populateModal(editingModal); 
  });
}

const updatePropertyItem = (event) => {
  let currentNode = event.target; 


  while(!currentNode.parentNode.classList.contains("property-item")) {
    currentNode = currentNode.parentNode;
  }
  
  let theNode = currentNode.querySelector(".property-status a");
  if (theNode.textContent.trim() == "For Sale"){
    theNode.classList.remove("for-sale");
    theNode.textContent = "Sold";
    theNode.classList.add("sold"); 
  }
  else if (theNode.textContent.trim() == "For Rent") {
    theNode.classList.remove("for-rent");
    theNode.textContent = "Taken";
    theNode.classList.add("sold");
  }
}

for (var i = 0; i < soldProperty.length; i++) {
  soldProperty[i].addEventListener("click", updatePropertyItem, false); 
}

const deletePropertyItem = (event) => {
  let currentNode = event.target; 

  while(!currentNode.parentNode.classList.contains("property-item")) {
    currentNode = currentNode.parentNode;
  }
  
  currentNode.parentNode.style.display = "none";
}

for (var i = 0; i < deleteProperty.length; i++) {
  deleteProperty[i].addEventListener("click", deletePropertyItem, false); 
}

const enlargeView = (event) => {
  let currentNode = event.target; 

  while(!currentNode.parentNode.classList.contains("property-item")) {
    currentNode = currentNode.parentNode;
  }
}

for (var i = 0; i < propertyView.length; i++) {
  propertyView[i].addEventListener("click", function() {
    // modal.classList.add("open");
    viewModal.classList.add("open"); 
    enlargeView(viewModal); 
  });
  propertyView[i].addEventListener("click", enlargeView, false); 
}

const populateModal = (theModal) => {
  let currentNode = event.target; 
  let formNode = theModal.childNodes[3];

  while(!currentNode.parentNode.classList.contains("property-item")) {
    currentNode = currentNode.parentNode;
  }

  formNode.querySelector('[name="pdesc"]').value = currentNode.querySelector('.description-body__listing').textContent.trim();
  formNode.querySelector('[name="paddress"]').value = currentNode.querySelector('.property-location').textContent.trim();
  // formNode.querySelector('[name="ptype"]').value = currentNode.querySelector('.property-location').textContent.trim();
  formNode.querySelector('[name="prooms"]').value = currentNode.querySelector('.prooms').textContent.trim().charAt(0);
  formNode.querySelector('[name="pbaths"]').value = currentNode.querySelector('.pbaths').textContent.trim().charAt(0);
  formNode.querySelector('[name="pprice"]').value = currentNode.querySelector('.property-price').textContent.trim().match(/\d/g).join("");
  if (formNode.querySelector('#img_preview').querySelector("img")) {
    let formerImage = formNode.querySelector('#img_preview').querySelectorAll("img");
    formerImage.forEach(imageElement => imageElement.parentNode.removeChild(imageElement));
  }
  previewImage(formNode.querySelector('#img_preview'), currentNode.querySelectorAll('div.image-div img'));

  // updateListing.addEventListener('click', (event) => updateProperty(event, currentNode, formNode), false);
  // updateListing.addEventListener('click', updateProperty.apply(this, [currentNode, formNode]), false);

  currentNode.querySelector('.description-body__listing').textContent = formNode.querySelector('[name="pdesc"]').value.trim();
  currentNode.querySelector('.property-location').textContent = formNode.querySelector('[name="paddress"]').value.trim();
  // currentNode.querySelector('.property-location').textContent = formNode.querySelector('[name="ptype"]').value.trim();
  currentNode.querySelector('.prooms').textContent = `${formNode.querySelector('[name="prooms"]').value}  Rooms`;
  currentNode.querySelector('.pbaths').textContent =  `${formNode.querySelector('[name="pbaths"]').value} Baths`; 
  currentNode.querySelector('.property-price').textContent = formNode.querySelector('[name="pprice"]').value;

}

function updateProperty(currentNode, formNode) {
  console.log(currentNode);
  console.log(formNode);
  currentNode.querySelector('.description-body__listing').textContent = formNode.querySelector('[name="pdesc"]').value.trim();
  currentNode.querySelector('.property-location').textContent = formNode.querySelector('[name="paddress"]').value.trim();
  // currentNode.querySelector('.property-location').textContent = formNode.querySelector('[name="ptype"]').value.trim();
  currentNode.querySelector('.prooms').textContent = `${formNode.querySelector('[name="prooms"]').value}  Rooms`;
  currentNode.querySelector('.pbaths').textContent =  `${formNode.querySelector('[name="pbaths"]').value} Baths`; 
  currentNode.querySelector('.property-price').textContent = formNode.querySelector('[name="pprice"]').value;
}




