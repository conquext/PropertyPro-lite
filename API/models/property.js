class Property {
  constructor({
    propertyId,
    owner,
    status,
    price,
    state,
    city,
    address,
    type,
    createdOn,
    imageUrl,
    baths,
    rooms,
    marketer,
    lastUpdatedOn,
  }) {
    this.propertyId = propertyId;
    this.status = status || 'For Rent';
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = price;
    this.createdOn = new Date().toLocaleString();
    this.imageUrl = imageUrl;
    this.baths = baths;
    this.rooms = rooms;
    this.marketer = marketer || owner;
    this.lastUpdatedOn = new Date().toLocaleString();
    this.owner = owner; // userId
    this.deleted = 'false';
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  getType() {
    return this.type;
  }

  getOwner() {
    return this.owner;
  }

  setDelete() {
    this.deleted = 'true';
  }

  isDeleted() {
    return this.deleted;
  }

  getDateCreated() {
    return this.createdOn;
  }

  setUpdate() {
    this.lastUpdatedOn = new Date().toLocaleDateString();
    return this.lastUpdatedOn;
  }

  getLastUpdated() {
    return this.lastUpdatedOn;
  }
}

export default Property;