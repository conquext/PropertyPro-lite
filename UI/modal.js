/* eslint-disable func-names */
// Get the modal
const listingModal = document.getElementById('add-property-modal');
const editingModal = document.getElementById('edit-property-modal');
const propertyList = document.querySelectorAll('.property-item');
// const viewModal = document.getElementById('view-property-modal');
const userId = localStorage.getItem('id');

const getProperty = async () => {
  let response = false;
  let res = await fetch(`${api}/property/1?owner=${userId}`, {
    method: 'get',
    mode: 'cors',
    headers,
    credentials: 'include',
    redirect: 'follow',
  });
  res = await res.json();
  if (res.status === 'success') {
    response = res;
  }
  return response;
};

const clearAndPopulateView = async () => {
  propertyList.forEach(pL => pL.style.display = 'none');
  const propertyFound = await getProperty();
  const pList = propertyFound.data;
  if (propertyFound) {
    let markup;
    const propertyHolder = [];

    for (let i = 0; i < pList.length; i++) {
      propertyHolder[i] = document.createElement('article');
      propertyHolder[i].classList.add('property-item', 'dropcard');
      markup = `    
                    <div class="image-div">
                        <img src=${pList[i].image_url} alt="Property ${i}">
                    <div>
                    <div class="property-status for-${pList[i].status.split(' ')[1].toLowerCase()}"> 
                        <a href="#for-${pList[i].status.split(' ')[1].toLowerCase()}">
                            <p>${pList[i].status.toLowerCase()}</p>
                        </a>
                    </div>
                    <div class="fav-icon"> 
                        <a href="#fav-list">
                            <i class="fa fa-heart fa-stack-2x" aria-hidden="true"></i>
                        </a>
                    </div>
                    <div class="description-body">
                        <h1 class="description-body__listing">A once in a lifetime opportunity! live in this grand home with its stunning entry and staircase, bedroom suites, firepla</h1>
                        <h1 class="property-price">${pList[i].price}</h1> 
                        <a href="#googlemap">
                            <div class="property-location">
                                <span class="fa-stack fa-lg">
                                    <i class="fa fa-map-marker"></i>
                                </span>
                                    <p>${pList[i].address}, ${pList[i].city}, ${pList[i].state}</p>
                            </div>
                        </a>
                        <div class="listing-details">
                            <span class="fa-stack fa-lg">
                                <i class="fa fa-bed" aria-hidden="true"></i>
                            </span>
                            <p class="prooms">${pList[i].rooms} Rooms</p>
                            <span class="fa-stack fa-lg">
                                <i class="fa fa-bath" aria-hidden="true"></i>
                            </span>
                            <p class="pbaths">${pList[i].baths} Bath</p>                                      
                        </div>
                    </div>
                    <div class="dropdown-card">
                        <div class="dropcard-content">
                            <a href="#property-edit">
                                <span>
                                    <i class="fa fa-edit"></i>
                                </span>
                            </a>
                            <a href="#property-delete">
                                <span>
                                    <i class="fa fa-trash"></i>
                                </span>
                            </a>
                            <a href="#property-sold">
                                <span>
                                    <i class="fa fa-check-circle"></i>
                                </span>
                            </a>
                        </div>
                    </div>
                </div></div>`;
      propertyHolder[i].innerHTML = markup;
    }

    propertyHolder.forEach(pHolding => document.querySelector('.agent-property__lists').append(pHolding));
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == listingModal) {
    listingModal.style.display = 'none';
  }
  if (event.target == editingModal) {
    editingModal.classList.remove('open');
    editingModal.style.display = 'none';
  }
};

if (propertyList) {
  window.onload = function () {
    clearAndPopulateView();
  };
}
