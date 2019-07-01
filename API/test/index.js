import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiLike from 'chai-like';
import chaiThings from 'chai-things';
import app from '../app';
import UserController from '../controllers/userController';
import PropertyController from '../controllers/propertyController';
import { property } from '../db/db';

const { expect } = chai;
chai.use(chaiHttp);
chai.use(chaiLike);
chai.use(chaiThings);
chai.should();

const apiVersion = '/api/v1';

const authLoginURL = `${apiVersion}/auth/login`;
const authSignupURL = `${apiVersion}/auth/signup`;
const propertyURL = `${apiVersion}/property`;

let userToken = '';
let agentToken = '';

before((done) => {
  const userCredentials = {
    firstName: 'Shegs',
    lastName: 'Jolly',
    email: 'email129@email.com',
    password: 'password1',
    confirmPassword: 'password1',
    type: 'user',
    address: 'iyabo busstop',
  };
  chai
    .request(app)
    .post(`${authSignupURL}`)
    .send(userCredentials)
    .end((err, res) => {
      userToken = res.body.data.token;
      done();
    });
});

before((done) => {
  const agentCredentials = {
    firstName: 'Jega',
    lastName: 'Luve',
    email: 'email13@email.com',
    password: 'password1',
    confirmPassword: 'password1',
    type: 'agent',
  };
  chai
    .request(app)
    .post(`${authSignupURL}`)
    .send(agentCredentials)
    .end((err, res) => {
      agentToken = res.body.data.token;
      done();
    });
});

// Test default route
describe('Test default route', () => {
  // Test for default route
  it('Should return 200 for the default route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should return 200 for the home route', (done) => {
    chai
      .request(app)
      .get('/api/v1/auth')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('Welcome to PropertyPro-lite');
        done();
      });
  });
  // Test for getting undefined routes
  it('Should return 404 for routes not specified', (done) => {
    chai
      .request(app)
      .get('/another/undefined/route')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  // Test for posting to undefined routes
  it('Should return 404 for undefined routes', (done) => {
    chai
      .request(app)
      .post('/another/undefined/route')
      .send({ random: 'random' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

// Test Auth Controller for signup
describe('POST /api/v1/auth/signup', () => {
  it('should not register user with an empty email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Ajala',
        lastName: 'Adekunle',
        email: '',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });
  it('should not register user without a First name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: '',
        lastName: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('First name is required');
        done();
      });
  });
  it('should not register user without a valid First name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Nam3',
        lastName: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('First name should only contain alphabets');
        done();
      });
  });
  it('should not register user without a Last name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name1',
        lastName: '',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Last name is required');
        done();
      });
  });
  it('should not accept first name less than 3 letters', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Er',
        lastName: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('First name should contain more than 2 characters');
        done();
      });
  });
  it('should not register user with an invalid name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'E r',
        lastName: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('First name should only contain alphabets');
        done();
      });
  });
  it('should not register user with no password', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: '',
        confirmPassword: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password is required');
        done();
      });
  });
  it('should not register user with password less than 6 charaters', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'p23',
        confirmPassword: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password should be atleast 6 characters');
        done();
      });
  });
  it('should not register user if password does not match', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'password1',
        confirmPassword: 'password2',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Passwords must match');
        done();
      });
  });
  it('should not signup without an email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        password: 'password1',
        confirmPassword: 'password2',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });
  it('should use valid email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall.gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });
  it('should not register existing user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'email1@email.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('User already exists');
        done();
      });
  });
  it('should specify user type', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        email: 'swall@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Specify user type');
        done();
      });
  });
  it('should specify valid user type', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: '',
        email: 'swall@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Choose a valid user type');
        done();
      });
  });
  it('should register user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        firstName: 'Name',
        lastName: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.data).to.have.key('token', 'id', 'firstName', 'lastName', 'email', 'type', 'isAdmin');
        // expect(res.body.user).to.have.key('userId', 'name', 'email', 'type');
        done();
      });
  });
  it('should catch signup error', (done) => {
    const signupParams = {
      firstName: 'Jega',
      lastName: 'Luve',
      email: 'email13@email.com',
      password: 'password1',
      confirmPassword: 'password1',
      type: 'agent',
    };
    const { signup } = UserController;
    expect(signup.bind(signupParams)).to.throw('Something went wrong. Try again.');

    done();
  });
});

// Test Auth Controller for login
describe('POST /api/v1/auth/login', () => {
  it('should not login with incorrect email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email0@email.com',
        password: 'password0',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Incorrect email');
        done();
      });
  });
  it('should not login with incorrect password', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email1@email.com',
        password: 'password12',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Incorrect email or Wrong password');
        done();
      });
  });
  it('should not login without email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: '',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });
  it('should not login without a valid email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'swall.gmail.com',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });
  it('should not login without a password', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'swall@gmail.com',
        password: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Password is required');
        done();
      });
  });
  it('should login a valid user', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'email1@email.com',
        password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        expect(res.body.data).to.have.key('id', 'firstName', 'lastName', 'email', 'type', 'token');
        done();
      });
  });
  it('should catch login error', (done) => {
    const loginParams = {
      email: 'email13@email.com',
      password: 'password1',
    };
    const { login } = UserController;
    expect(login.bind(loginParams)).to.throw('Something went wrong. Try again.');

    done();
  });
});

// Test Property Controller
describe('POST /api/v1/property', () => {
  const newListing = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noStatus = {
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectStatus = {
    status: 'Sold',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noAddress = {
    status: 'For Sale',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectAddress = {
    status: 'For Sale',
    address: 55,
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noType = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectType = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Bingo',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noRooms = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectRooms = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 'two',
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noBaths = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectBaths = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: 'three',
    price: 40000,
    image_url: 'www.google.com',
  };
  const noPrice = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    image_url: 'www.google.com',
  };
  const notCorrectPirce = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 'Twenty-Four thousand',
    image_url: 'www.google.com',
  };
  const noImageLink = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
  };
  const notCorrectImageLink = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'wwwcom',
  };
  it('should create a new property listing for an agent', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(
        newListing,
      )
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.equal('true');
        expect(res.body.message).to.be.equal('New property listed successfully');
        expect(res.body.data).to.include.key('propertyId', 'owner', 'status', 'price', 'state', 'city', 'address', 'type', 'baths', 'rooms');
        done();
      });
  });
  it('should not allow a user to create property listing', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', userToken)
      .send(
        newListing,
      )
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should require a property status', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noStatus)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Specify property status');
        done();
      });
  });
  it('should require appropriate property status', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectStatus)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select the property status [For Sale or For Rent]');
        done();
      });
  });
  it('should require property address', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noAddress)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide address of your property');
        done();
      });
  });
  it('should require property address', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectAddress)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Address should contain more than 4 characters');
        done();
      });
  });
  it('should require property type', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noType)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select type of property');
        done();
      });
  });
  it('should require appropriate property type', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectType)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select the appropritate property type');
        done();
      });
  });
  it('should require no of rooms ', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noRooms)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select number of rooms');
        done();
      });
  });
  it('should require require number of rooms as a number', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectRooms)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Number of rooms should be numeric');
        done();
      });
  });
  it('should require no of baths ', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noBaths)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select number of baths');
        done();
      });
  });
  it('should require require number of baths as a number', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectBaths)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Number of baths should be numeric');
        done();
      });
  });
  it('should require price of property ', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noPrice)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide price information');
        done();
      });
  });
  it('should require price of property in decimal', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectPirce)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Price should be in decimal');
        done();
      });
  });
  it('should require link to property image', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noImageLink)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide image link');
        done();
      });
  });
  it('should require a valid link to property image', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectImageLink)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide a valid url link');
        done();
      });
  });
  it('should catch listing error', (done) => {
    const { listNewProperty } = PropertyController;
    expect(listNewProperty.bind(newListing)).to.throw('Something went wrong. Try again.');

    done();
  });
});

describe('GET /api/v1/property', () => {
  it('should get all properties for user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Properties retrieved successfully');
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            address: '234, Eleyele, Ikeja',
            baths: '2',
            city: 'Ikeja',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            marketer: 'Etihad Properties',
            owner: 1,
            price: '40000',
            propertyId: 1,
            rooms: '3',
            state: 'Lagos',
            status: 'For Sale',
            type: 'Flat',
          },
        );
        done();
      });
  });
  it('should get not get properties without authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unathorized. Token not found');
        done();
      });
  });
  it('should catch get all property error when encountered a problem', (done) => {
    const { getAllProperty } = PropertyController;
    expect(getAllProperty.bind('')).to.throw('Something went wrong. Try again.');
    done();
  });
});

describe('GET /api/v1/property', () => {
  beforeEach(() => {
    property.forEach((thisProperty) => {
      if (thisProperty.propertyId !== 1) {
        thisProperty.deleted = true;
      }
    });
  });
  afterEach(() => {
    property.forEach(thisProperty => thisProperty.deleted = false);
  });
  it('should get the only property for a user when all but one is deleted', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Property retrieved successfully');
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            address: '234, Eleyele, Ikeja',
            baths: '2',
            city: 'Ikeja',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            marketer: 'Etihad Properties',
            owner: 1,
            price: '40000',
            propertyId: 1,
            rooms: '3',
            state: 'Lagos',
            status: 'For Sale',
            type: 'Flat',
          },
        );
        done();
      });
  });
  it('should get not get property without authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unathorized. Token not found');
        done();
      });
  });
});

describe('GET /api/v1/property', () => {
  beforeEach(() => {
    property.forEach(thisProperty => thisProperty.deleted = true);
  });
  afterEach(() => {
    property.forEach(thisProperty => thisProperty.deleted = false);
  });
  it('should get no property for a user when all properties are deleted', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal('No property found');
        done();
      });
  });
});

describe('GET /api/v1/property/<:property-id>/', () => {
  it('should get property with a given id, search by user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 3,
            owner: 2,
            status: 'For Sale',
            price: '140000',
            state: 'Abuja',
            city: 'Gwarwa',
            address: '4, Indiana, Gwarwa',
            type: 'Flat',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '2',
            rooms: '4',
            marketer: 'Lemlem Properties',
            deleted: false,
          },
        );
        done();
      });
  });
  it('should get property with a given id, search by agent', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 3,
            owner: 2,
            status: 'For Sale',
            price: '140000',
            state: 'Abuja',
            city: 'Gwarwa',
            address: '4, Indiana, Gwarwa',
            type: 'Flat',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '2',
            rooms: '4',
            marketer: 'Lemlem Properties',
            deleted: false,
          },
        );
        done();
      });
  });
  it('should get not get properties without authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/2`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unathorized. Token not found');
        done();
      });
  });
  it('should not get property with an unknown id', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/30000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should get property with of a given owner, search by user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?owner=4`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 5,
            owner: 4,
            status: 'For Rent',
            price: '668000',
            state: 'Lagos',
            city: 'Gbagada',
            address: 'Plot 23, Soluyi, Gbagada',
            type: 'Flat',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '2',
            rooms: '3',
            marketer: 'Lemlem Properties',
            deleted: false,
          },
        );
        done();
      });
  });
  it('should get property with of a given owner and number of rooms', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?owner=3&rooms=7`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 4,
            owner: 3,
            status: 'For Sale',
            price: '3210000',
            state: 'Lagos',
            city: 'Lekki',
            address: '234, Bimbo Street, Lekki',
            type: 'Duplex',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '4',
            rooms: '7',
            marketer: 'Etihad Properties',
          },
        );
        done();
      });
  });
  it('should get property with of a given type and status', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Duplex&status=For Sale`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 4,
            owner: 3,
            status: 'For Sale',
            price: '3210000',
            state: 'Lagos',
            city: 'Lekki',
            address: '234, Bimbo Street, Lekki',
            type: 'Duplex',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '4',
            rooms: '7',
            marketer: 'Etihad Properties',
          },
        );
        done();
      });
  });
  it('should get property of a given type', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array').that.contains.something.like(
          {
            propertyId: 1,
            owner: 1,
            status: 'For Sale',
            price: '40000',
            state: 'Lagos',
            city: 'Ikeja',
            address: '234, Eleyele, Ikeja',
            type: 'Flat',
            createdOn: '1906-08-11T23:46:24.000Z',
            image_url: 'www.wwwww',
            baths: '2',
            rooms: '3',
            marketer: 'Etihad Properties',
            deleted: false,
          },
        );
        done();
      });
  });
  it('should not get property of a type that does not exist', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flatsu`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should catch get property error when encountered a problem', (done) => {
    const { getProperty } = PropertyController;
    expect(getProperty.bind('')).to.throw('Something went wrong. Try again.');
    done();
  });
});

describe('PATCH /api/v1/property/<:property-id>/', () => {
  const newDetails = {
    status: 'For Sale',
    address: 'Oshodi nothing',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  let agent2Token;
  const notCorrectStatus = {
    status: 'Sold',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectAddress = {
    status: 'For Sale',
    address: 55,
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectType = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Bingo',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectRooms = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 'two',
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectBaths = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: 'three',
    price: 40000,
    image_url: 'www.google.com',
  };
  const notCorrectPirce = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 'Twenty-Four thousand',
    image_url: 'www.google.com',
  };
  const notCorrectImageLink = {
    status: 'For Sale',
    address: 'Oshodi Park',
    city: 'Lekki',
    state: 'Lagos',
    type: 'Flat',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'wwwcom',
  };
  before((done) => {
    const thisAgentCredentials = {
      email: 'email2@email.com',
      password: 'password1',
    };
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send(thisAgentCredentials)
      .end((err, res) => {
        agent2Token = res.body.data.token;
        done();
      });
  });
  it('should edit property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('Array').contains.something.like(
          {
            address: newDetails.address,
            baths: newDetails.baths,
            city: 'Gwarwa',
            createdOn: '1906-08-11T23:46:24.000Z',
            deleted: false,
            image_url: newDetails.image_url,
            lastUpdatedOn: '6/30/2019',
            marketer: 'Lemlem Properties',
            owner: 2,
            price: newDetails.price,
            propertyId: 3,
            rooms: newDetails.rooms,
            state: 'Abuja',
            status: newDetails.status,
            type: newDetails.type,
          },
        );
        done();
      });
  });
  it('should not edit property that does not exist', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3000`)
      .set('Authorization', agent2Token)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should not allow user to edit property', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', userToken)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not allow agents to edit property of other agents', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/2`)
      .set('Authorization', agent2Token)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not allow agents to edit property of other agents', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agentToken)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should require appropriate property status', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectStatus)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select the property status [For Sale or For Rent]');
        done();
      });
  });
  it('should require appropriate property address', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectAddress)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Address should contain more than 4 characters');
        done();
      });
  });
  it('should require appropriate property type', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectType)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Select the appropritate property type');
        done();
      });
  });
  it('should require require number of rooms as a number', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectRooms)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Number of rooms should be numeric');
        done();
      });
  });
  it('should require require number of baths as a number', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectBaths)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Number of baths should be numeric');
        done();
      });
  });
  it('should require price of property in decimal', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectPirce)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Price should be in decimal');
        done();
      });
  });
  it('should require a valid link to property image', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .send(notCorrectImageLink)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('false');
        expect(res.body.error).to.be.equal('Provide a valid url link');
        done();
      });
  });
  it('should catch edit listing error', (done) => {
    const { editProperty } = PropertyController;
    expect(editProperty.bind(newDetails)).to.throw('Something went wrong. Try again.');

    done();
  });
});

describe('PATCH /api/v1/property/<:property-id>/sold', () => {
  let agent2Token;
  before((done) => {
    const thisAgentCredentials = {
      email: 'email2@email.com',
      password: 'password1',
    };
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send(thisAgentCredentials)
      .end((err, res) => {
        agent2Token = res.body.data.token;
        done();
      });
  });
  it('should update property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3/sold`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.an('Array').contains.something.like(
          {
            propertyId: 3,
            owner: 2,
            status: 'Sold',
            state: 'Abuja',
            city: 'Gwarwa',
            type: 'Flat',
            createdOn: '1906-08-11T23:46:24.000Z',
            marketer: 'Lemlem Properties',
            deleted: false,
          },
        );
        done();
      });
  });
  it('should not allow agents to update property of other agents', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/2/sold`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not update property that does not exist', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3000/sold`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should not allow user to update property', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3/sold`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should catch update listing error', (done) => {
    const { updateProperty } = PropertyController;
    expect(updateProperty.bind('')).to.throw('Something went wrong. Try again.');
    done();
  });
});

describe('DELETE /api/v1/property/<:property-id>', () => {
  let agent2Token;
  before((done) => {
    const thisAgentCredentials = {
      email: 'email2@email.com',
      password: 'password1',
    };
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send(thisAgentCredentials)
      .end((err, res) => {
        agent2Token = res.body.data.token;
        done();
      });
  });
  it('should not allow agents to delete property of other agents', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/2`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should not delete property that does not exist', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/3000`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should not allow user to delete property', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });
  it('should delete property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/3`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        expect(res.body.data.message).to.be.equal('Property deleted successfully');
        done();
      });
  });
  it('should not get property that has been deleted', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.success).to.be.equal('false');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });
  it('should catch delete listing error', (done) => {
    const { deleteProperty } = PropertyController;
    expect(deleteProperty.bind('')).to.throw('Something went wrong. Try again.');
    done();
  });
});