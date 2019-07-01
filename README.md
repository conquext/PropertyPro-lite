
# PropertyPro-lite
Property Pro Lite is a platform where people can create and/or search properties for sale or rent.

[![Build Status](https://travis-ci.org/conquext/PropertyPro-lite.svg?branch=develop)](https://travis-ci.org/conquext/PropertyPro-lite) [![Coverage Status](https://coveralls.io/repos/github/conquext/PropertyPro-lite/badge.svg?branch=develop)](https://coveralls.io/github/conquext/PropertyPro-lite?branch=develop)

#### Views/Templates
> * [Landing Page/Sign Up/ Sign In](https://conquext.github.io/PropertyPro-lite/UI/)
> * [User Page/Search/Views](https://conquext.github.io/PropertyPro-lite/UI/users)
> * [Agent Page/Edit/Delete/Update listing](https://conquext.github.io/PropertyPro-lite/UI/agents)

#### Project Management
> * Pivotal Tracker https://www.pivotaltracker.com/n/projects/2354400

## Features
>
#### Users
* Users can signup and signin to the application
* Users can create an account
* Users can view all properties
* Users can view all proerties of a specific type
* Users can view a specific property

#### Users (Agents) ==> Agents
* Agents can post a property advert
* Agents can update the details of a property advert
* Agents can mark his/her posted advert as sold
* Agents can delete an advert

## Installation
To get the application running follow this steps:
* Install NodeJs on your local machine
* Clone the repository $ git clone https://github.com/conquext/conquext.github.io.git
* Install npm dependencies by running npm install

#### Testing
>Run npm run test to run server side tests

## Technologies
#### FrontEnd
> * Html
> * Css

#### Backend
> * NodeJS 
> * Express JS 
> * ESLint 
> * Mocha/Chai

#### DevOps
> * Git
> * Travis CI
> * Coveralls
> * Postman

## API End Points

| METHOD        | DESCRIPTION   | ENDPOINTS  |
| ------------- |:-------------:| -----:|
| POST      | `/api/v1/auth/signup` | Register a new user |
| POST      | `/api/v1/auth/login` | Sign in a user |
 POST      | `/api/v1/property` | Create a new property listing advert |
| GET      | `/api/v1/property` | Return active property listing |
| GET      | `/api/v1/property/:propertyId` | Return a specific property |
| GET      | `/api/v1/property/:propertyId?owner=3` | Return listings of owner 3 |
| GET      | `/api/v1/property/:propertyId?owner=3&type=Flat` | Return Flat listings of owner 3 |
| GET      | `/api/v1/property/:propertyId?owner=3&type=Flat&room=2` | Return Flat listings of owner 3 with 2 rooms |
| GET      | `/api/v1/property/:propertyId?type=Duplex&room=3&baths=2` | Return Duplex listings of 3rooms and 2 baths |
| PATCH      | `/api/v1/property/:property` | Edit a property listing |
| PATCH      | `/api/v1/property/:propertyId/sold` | Mark a property as sold |
| DELETE      | `/api/v1/property/:id` | Delete a property listing |


## Connect
> I am on twitter [![Twitter](https://img.icons8.com/color/50/000000/twitter.png)](www.twitter.com/rash3ye)
>
> And also Instagram [![Instagram](https://img.icons8.com/color/48/000000/instagram-new.png)](https://www.instagram.com/thexxplanet)