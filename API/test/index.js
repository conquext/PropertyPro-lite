import chai from 'chai';
import chaiHttp from 'chai-http';
import swaggerTest from 'swagger-test';
// import preq from 'preq';
import app from '../app';
import specs from '../../swaggerDoc';
import UserHelper from '../helpers/userHelper';
import Migration from '../db/migrations';
import Seeder from '../db/seed';
import { pool } from '../db/config';

const { expect } = chai;
chai.use(chaiHttp);
chai.should();

const apiVersion = '/api/v1';

const authLoginURL = `${apiVersion}/auth/signin`;
const authSignupURL = `${apiVersion}/auth/signup`;
const propertyURL = `${apiVersion}/property`;

let userToken = '';
let agentToken = '';
let agent2Token = '';
const invalidToken = 'bC5jZJCzArgIaWN4KqXCbTiQerA9LpEiZZE';
let createPropertyId;

before(async () => {
  try {
    // await Migration.dropAllTables();
    // await Migration.createAllTables();
    await Seeder.seed();
  } catch (err) {
    //
  }
});

after(async () => {
  try {
    await Migration.dropUsersTable;
    await Migration.dropPropertyTable;
    await Migration.dropAllTables();
    await Migration.createAllTables();
    pool.end();
  } catch (err) {
    //
  }
});

before(async () => {
  const userCredentials = {
    first_name: 'Shegs',
    last_name: 'Jolly',
    email: 'email1e23329@email.com',
    password: 'password1',
    // confirm_password: 'password1',
    type: 'user',
    address: 'iyabo busstop',
    phoneNumber: '07066245789',
  };
  const resp = await chai
    .request(app)
    .post(`${authSignupURL}`)
    .send(userCredentials);
  userToken = resp.body.data.token;
});

before(async () => {
  const agentCredentials = {
    first_name: 'Jega',
    last_name: 'Luve',
    email: 'email13@email.com',
    password: 'password1',
    // confirm_password: 'password1',
    type: 'agent',
    address: 'iyabo busstop',
    phoneNumber: '07066565799',
  };
  const resp = await chai
    .request(app)
    .post(`${authSignupURL}`)
    .send(agentCredentials);
  agentToken = resp.body.data.token;
});

before(async () => {
  const thisAgentCredentials = {
    first_name: 'Shegs',
    last_name: 'Jolly',
    email: 'email28@email.com',
    password: 'password1',
    // confirm_password: 'password1',
    type: 'agent',
    address: 'Landmark busstop',
    phoneNumber: '07086245789',
  };
  const resp = await chai
    .request(app)
    .post(`${authSignupURL}`)
    .send(thisAgentCredentials);
  agent2Token = resp.body.data.token;
});

// after(async () => {
//   await UserHelper.deleteDb('users', 'email', 'email1e23329@email.com');
//   await UserHelper.deleteDb('users', 'email', 'email13@email.com');
// });

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
  // Test for getting undefined routes
  it('Should return 404 for routes not specified', (done) => {
    chai
      .request(app)
      .get('/another/undefined/route')
      .end((err, res) => {
        expect(res.body.error).to.have.eql('Page Not Found');
        done();
      });
  });
  // Test for posting to wrong methods on defined routes
  it('Should return 405 for wrong methods on defined routes', (done) => {
    chai
      .request(app)
      .get(`${authSignupURL}`)
      .end((err, res) => {
        expect(res).to.have.status(405);
        expect(res.body.error).to.have.eql('Method Not Allowed');
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

// Test API Doc
describe('Specification-driven tests', () => {
  swaggerTest.parse(specs, { inferXamples: true });

  it('Should return 200 for the docs route', (done) => {
    chai
      .request(app)
      .get('/docs')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should follow documentation specifications', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.header['content-type']).to.equal('application/json; charset=utf-8');
        expect(res.body.paths).to.deep.include(
          {
            '/auth/signin':
            {
              post:
                {
                  tags: ['Users'],
                  name: 'Signin',
                  summary: 'Logs in a user',
                  consumes: ['application/json'],
                  produces: ['application/json'],
                  parameters: [{
                    description: 'User',
                    in: 'body',
                    name: 'body',
                    required: true,
                    schema: {
                      properties: {
                        email: {
                          format: 'email',
                          type: 'string',
                        },
                        password: {
                          format: 'password',
                          type: 'string',
                        },
                        required: 'email password',
                      },
                      type: 'object',
                    },
                  }],
                  responses: {
                    200: {
                      description: 'User found and logged in successfully',
                      schema: {
                        $ref: '#/definitions/User',
                        type: 'object',
                      },
                    },
                    400: {
                      description: 'Bad request',
                    },
                    401: {
                      description: 'User not found',
                    },
                    403: {
                      description: "Username and password don't match",
                    },
                    500: {
                      description: 'Something went wrong. Try again',
                    },
                  },
                },
            },
          },
        );
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
        first_name: 'Ajala',
        last_name: 'Adekunle',
        email: '',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });

  it('should not register user without a First name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: '',
        last_name: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('First name is required');
        done();
      });
  });

  it('should not register user without a valid First name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Nam3',
        last_name: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('First name should only contain alphabets');
        done();
      });
  });

  it('should not register user without a Last name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name1',
        last_name: '',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Last name is required');
        done();
      });
  });

  it('should not accept first name less than 3 letters', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Er',
        last_name: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('First name should contain more than 2 characters');
        done();
      });
  });

  it('should not register user with an invalid name', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'E r',
        last_name: 'Name',
        type: 'user',
        email: 'Ajala@banka.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('First name should only contain alphabets');
        done();
      });
  });

  it('should not register user with no password', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: '',
        confirm_password: '',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Password is required');
        done();
      });
  });

  it('should not register user with password less than 6 charaters', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        email: 'swall@gmail.com',
        password: 'p',
        confirm_password: '',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Password should be atleast 2 characters');
        done();
      });
  });
  // it('should not register user if password does not match', (done) => {
  //   chai
  //     .request(app)
  //     .post(`${authSignupURL}`)
  //     .send({
  //       first_name: 'Name',
  //       last_name: 'Name',
  //       type: 'user',
  //       email: 'swall@gmail.com',
  //       password: 'password1',
  //       confirm_password: 'password2',
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(400);
  //       expect(res.body.status).to.be.equal('error');
  //       expect(res.body.error).to.be.equal('Passwords must match');
  //       done();
  //     });
  // });

  it('should not signup without an email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        password: 'password1',
        confirm_password: 'password2',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Email is required');
        done();
      });
  });

  it('should use valid email', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        email: 'swall.gmail.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Email is invalid');
        done();
      });
  });

  it('should not register existing user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        email: 'email1@email.com',
        password: 'password1',
        confirm_password: 'password1',
      })


      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('User already exists');
        done();
      });
  });
  it('should specify user type', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        email: 'swall@gmail.com',
        password: 'password1',
        confirm_password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Specify user type');
        done();
      });
  });
  it('should specify valid user type', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: '',
        email: 'swall@gmail.com',
        password: 'password1',
        confirm_password: 'password1',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Choose a valid user type');
        done();
      });
  });

  it('should register user', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Name',
        last_name: 'Name',
        type: 'user',
        email: 'swall523@gmail.com',
        password: 'password1',
        // confirm_password: 'password1',
        address: 'This is a fake address',
        phoneNumber: '09048765342',
      })
      .end((err, res) => {
        done();
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('User is registered successfully');
        expect(res.body.data).to.have.key('token', 'id', 'first_name', 'last_name', 'email', 'type', 'is_admin');
      });
  });
  it('should not register another user with the same phone number', (done) => {
    chai
      .request(app)
      .post(`${authSignupURL}`)
      .send({
        first_name: 'Anothername',
        last_name: 'AnotherName',
        type: 'user',
        email: 'swall5231@gmail.com',
        password: 'password1',
        // confirm_password: 'password1',
        address: 'This is a fake address',
        phoneNumber: '09048765342',
      })
      .end((err, res) => {
        done();
        expect(res).to.have.status(409);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Phone Number already exists');
      });
  });

  // it('should catch signup error', (done) => {
  //   const signupParams = {
  //     first_name: 'Jega',
  //     last_name: 'Luve',
  //     email: 'email13@email.com',
  //     password: 'password1',
  //     confirm_password: 'password1',
  //     phoneNumber: '0803001',
  //     address: 'This is a fake address',
  //     type: 'agent',
  //   };
  //   const { signup } = UserController;
  //   expect(signup.bind(signupParams)).to.throw('Something went wrong. Try again.');

  //   done();
  // });
});

// Test Auth Controller for signin/login
describe('POST /api/v1/auth/signin', () => {
  it('should not login with incorrect email', (done) => {
    chai
      .request(app)
      .post(`${authLoginURL}`)
      .send({
        email: 'emai@email.com',
        password: 'password0',
      })


      .end((err, res) => {
        done();
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Incorrect email or Wrong password');
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
        done();
        expect(res).to.have.status(401);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Incorrect email or Wrong password');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.data).to.have.key('id', 'first_name', 'last_name', 'email', 'type', 'token');
        done();
      });
  });

  // it('should catch login error', (done) => {
  //   const loginParams = {
  //     email: 'email13@email.com',
  //     password: 'password1',
  //   };
  //   const { signin } = UserController;
  //   expect(signin.bind(loginParams)).to.throw('Something went wrong. Try again.');

  //   done();
  // });
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

  const noCity = {
    status: 'For Sale',
    address: 'Oshodi Park',
    type: 'Flat',
    state: 'Lagos',
    rooms: 2,
    baths: '3',
    price: 40000,
    image_url: 'www.google.com',
  };

  const noState = {
    status: 'For Sale',
    address: 'Oshodi Park',
    type: 'Flat',
    city: 'Lekki',
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

  const notCorrectPrice = {
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
        done();
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('New property listed successfully');
        expect(res.body.data).to.include.key('property_id', 'status', 'price', 'state', 'city', 'address', 'type', 'baths', 'rooms', 'owneremail', 'ownerphonenumber');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Address should contain more than 3 characters');
        done();
      });
  });

  it('should require property state', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noState)

      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Provide state of your property location');
        done();
      });
  });

  it('should require property city', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(noCity)

      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Provide city of your property location');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Provide price information');
        done();
      });
  });

  it('should require price of property in decimal', (done) => {
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(notCorrectPrice)


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Provide a valid url link');
        done();
      });
  });

  // it('should catch listing error', () => {
  //   const { listNewProperty } = PropertyController;
  //   expect(listNewProperty.bind(newListing)).to.throw('Something went wrong. Try again.');
  // });
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
  const notCorrectPrice = {
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
  let createProperty2Id;

  beforeEach((done) => {
    const newProperty2Listing = {
      status: 'For Sale',
      address: 'Uganda Park',
      city: 'Lekki',
      state: 'Lagos',
      type: 'Flat',
      rooms: 2,
      baths: '3',
      price: 40000,
      image_url: 'www.google.com',
    };
    chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agent2Token)
      .send(newProperty2Listing)
      .end((err, res) => {
        done();
        const id = res.body.data.property_id;
        createProperty2Id = parseInt(id, 10);
      });
  });

  beforeEach(async () => {
    const newPropertyListing = {
      status: 'For Rent',
      address: 'Lagos Park',
      city: 'Monrovia',
      state: 'Lagos',
      type: 'Flat',
      rooms: 3,
      baths: '2',
      price: 240000,
      image_url: 'www.google.com',
    };
    const resp = await chai
      .request(app)
      .post(`${propertyURL}`)
      .set('Authorization', agentToken)
      .send(newPropertyListing);
    const id = resp.body.data.property_id;
    createPropertyId = parseInt(id, 10);
  });

  it('should edit property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(
        newDetails,
      )
      .end((err, res) => {
        done();
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });

  it('should not allow user to edit property', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', userToken)
      .send(
        newDetails,
      )
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should not allow agents to edit property of other agents', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agentToken)
      .send(
        newDetails,
      )


      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should require appropriate property status', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectStatus)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Select the property status [For Sale or For Rent]');
        done();
      });
  });

  it('should require appropriate property address', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectAddress)


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Address should contain more than 4 characters');
        done();
      });
  });

  it('should require appropriate property type', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectType)


      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Select the appropritate property type');
        done();
      });
  });

  it('should require require number of rooms as a number', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectRooms)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Number of rooms should be numeric');
        done();
      });
  });

  it('should require require number of baths as a number', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectBaths)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Number of baths should be numeric');
        done();
      });
  });

  it('should require price of property in decimal', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectPrice)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Price should be in decimal');
        done();
      });
  });

  it('should require a valid link to property image', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/${createProperty2Id}`)
      .set('Authorization', agent2Token)
      .send(notCorrectImageLink)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Provide a valid url link');
        done();
      });
  });

  // it('should catch edit listing error', (done) => {
  //   const { editProperty } = PropertyController;
  //   expect(editProperty.bind(newDetails)).to.throw('Something went wrong. Try again.');

  //   done();
  // });
});

describe('PATCH /api/v1/property/<:property-id>/sold', () => {
  it('should update property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .patch(`${propertyURL}/3/sold`)
      .set('Authorization', agent2Token)


      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');

        // expect(res.body.data).to.be.an('Array').contains.something.like(
        //   {
        //     id: 3,
        //     owner: 2,
        //     status: 'Sold',
        //     state: 'Abuja',
        //     city: 'Gwarwa',
        //     type: 'Flat',

        //     marketer: 'Lemlem Properties',
        //
        //   },
        // );
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  // it('should catch update listing error', (done) => {
  //   const { updateProperty } = PropertyController;
  //   expect(updateProperty.bind('')).to.throw('Something went wrong. Try again.');
  //   done();
  // });
});

describe('DELETE /api/v1/property/<:property-id>', () => {
  it('should not allow agents to delete property of other agents', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/${createPropertyId}`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should not delete property that does not exist', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/30000`)
      .set('Authorization', agent2Token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });

  it('should not allow user to delete property', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/${createPropertyId}`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unauthorized');
        done();
      });
  });

  it('should delete property with a given id by the property owner', (done) => {
    chai
      .request(app)
      .delete(`${propertyURL}/${createPropertyId}`)
      .set('Authorization', agentToken)
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
      .get(`${propertyURL}/${createPropertyId}`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });

  // it('should catch delete listing error', (done) => {
  //   const { deleteProperty } = PropertyController;
  //   expect(deleteProperty.bind('')).to.throw('Something went wrong. Try again.');
  //   done();
  // });
});

describe('GET /api/v1/property', () => {
  it('should get all properties for user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        expect(res.body.message).to.be.equal('Properties retrieved successfully');

        // expect(res.body.data).to.be.an('array').that.contains.something.like(
        //   {
        //     address: '234, Eleyele, Ikeja',
        //     baths: '2',
        //     city: 'Ikeja',
        //     image_url: 'www.wwwww',
        //     marketer: 'Etihad Properties',
        //     owner: 1,
        //     price: '40000',
        //     id: 1,
        //     rooms: '3',
        //     state: 'Lagos',
        //     status: 'For Sale',
        //     type: 'Flat',
        //   },
        // );
        done();
      });
  });

  it('should get not get properties with invalid authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unathorized. Token invalid. Please login');
        done();
      });
  });

  it('should get not get properties without authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Unathorized. Token not found');
        done();
      });
  });

  // it('should catch get all property error when encountered a problem', (done) => {
  //   const { getAllProperty } = PropertyController;
  //   expect(getAllProperty.bind('')).to.throw('Something went wrong. Try again.');
  //   done();
  // });
});

describe('GET /api/v1/property/<:property-id>/', () => {
  it('should get not get properties without authorization', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/${createPropertyId}`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.be.equal('error');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });

  it('should get property with a given id, search by user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with a given id, search by agent', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/2`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with id of a given owner, search by user', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/2?owner=3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with id of a given owner and and price and a number of baths and rooms', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/2?owner=5&price=20000-250000&rooms=3&baths=2`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner, type and a number of baths ', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&owner=5&baths=2`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner, type and a price range', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&owner=5&price=200000-500000`)
      .set('Authorization', agentToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given status', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?status=For Sale`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given status and price', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?status=For Sale&price=10000-500000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner and status', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?owner=5&status=For Sale`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner and status and a price range', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?owner=5&status=For Sale&price=10000-500000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner and status and a number of rooms', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?owner=3&status=For Sale&rooms=3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given status and number of rooms and baths', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?status=For Sale&rooms=3&baths=2`)
      .set('Authorization', userToken)


      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given owner and number of rooms', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/6?owner=3&rooms=3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  // it('should get property with of a given owner, type, status and number of rooms', (done) => {
  //   chai
  //     .request(app)
  //     .get(`${propertyURL}/3?owner=3&status=For Sale&type=Flat&rooms=7`)
  //     .set('Authorization', userToken)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.status).to.be.equal('success');
  //       done();
  //     });
  // });

  it('should get property with of a given number of rooms and baths', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?rooms=3&baths=2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given number of rooms and baths and a price range', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?rooms=3&baths=2&price=10000-500000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });
  it('should get property within a price range', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?price=10000-500000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given type and status', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&status=For Sale`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given type and number of rooms', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&rooms=3`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given type and number of baths', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&baths=2`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property with of a given status', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?status=For Sale`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
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
        expect(res.body.status).to.be.equal('success');
        done();
      });
  });

  it('should get property of a given type and price', (done) => {
    chai
      .request(app)
      .get(`${propertyURL}/3?type=Flat&price=10000-60000`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal('success');
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
        expect(res.body.status).to.be.equal('error');
        expect(res.body.error).to.be.equal('Property not found');
        done();
      });
  });

  // it('should catch get property error when encountered a problem', (done) => {
  //   const { getProperty } = PropertyController;
  //   expect(getProperty.bind('')).to.throw('Something went wrong. Try again.');
  //   done();
  // });
});
