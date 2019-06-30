import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import UserController from '../controllers/userController';

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const apiVersion = '/api/v1';

const authLoginURL = `${apiVersion}/auth/login`;
const authSignupURL = `${apiVersion}/auth/signup`;

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
  const cashierCredentials = {
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
    .send(cashierCredentials)
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
