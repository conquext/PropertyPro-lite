const signupModalForm = document.querySelector('.modal-content__signup');
const loginModalForm = document.querySelector('.modal-content__login');
const signup = document.querySelector('.signup-button');
const login = document.querySelector('.login-button');
const signupRefresh = document.querySelector('.signup-button .fa-refresh');
const loginRefresh = document.querySelector('.login-button .fa-refresh');



signup.addEventListener('click', (e) => {
  signupRefresh.style.display = 'inline';
});

login.addEventListener('click', () => {
  loginRefresh.style.display = 'inline';
});

const loginUser = (data, delay) => {
  if (data.type) {
    if (data.type === 'user') {
      window.setTimeout(() => { window.location.replace('./users/index.html'); }, delay);
    }
    if (data.type === 'agent') {
      window.setTimeout(() => { window.location.replace('./agents/index.html'); }, delay);
    }
  }
};

signupModalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  signup.disabled = true;
  signup.classList.add('disabled');
  fetch(`${api}/auth/signup`, {
    method: 'post',
    mode: 'cors',
    headers,
    credentials: 'include',
    // cache: 'no-cache',
    body: JSON.stringify({
      first_name: event.target.fname.value,
      last_name: event.target.lname.value,
      email: event.target.email.value,
      password: event.target.password.value,
      confirm_password: event.target.cpassword.value,
      phoneNumber: event.target.phonenumber.value,
      address: event.target.address.value,
      state: event.target.state.value,
      country: event.target.country.value,
      dob: event.target.dob.value,
      type: event.target.type.value,
    }),
    redirect: 'follow',
  })
    .then(response => response.json())
    .then((res) => {
      const resForm = document.querySelector('.signup-msg');
      signupRefresh.style.display = 'none';
      if (res.status === 'error') {
        signup.disabled = false;
        signup.classList.remove('disabled');
        signupRefresh.style.display = 'none';
        resForm.innerHTML = res.error;
        resForm.classList.add('error');
      }
      if (res.status === 'success') {
        resForm.classList.add('success');
        resForm.innerHTML = res.message;
        localStorage.setItem('id', res.data.id);
        docCookies.setItem('Authorization', res.data.token);
        document.cookie = `token=${res.data.token}`;
        loginUser(res.data, 5000);
      }
    })
    .catch(error => error);
});

loginModalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  login.disabled = true;
  login.classList.add('disabled');
  fetch(`${api}/auth/signin`, {
    method: 'post',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    // cache: 'no-cache',
    body: JSON.stringify({
      email: event.target.email.value,
      password: event.target.password.value,
    }),
    redirect: 'follow',
  })
    .then(response => response.json())
    .then((res) => {
      const resForm = document.querySelector('.login-msg');
      if (res.status === 'error') {
        login.disabled = false;
        login.classList.remove('disabled');
        loginRefresh.style.display = 'none';
        resForm.innerHTML = res.error;
        resForm.classList.add('error');
      } else {
        resForm.classList.add('success');
        resForm.innerHTML = 'Login successful, preparing your dashboard';
        localStorage.setItem('id', res.data.id);
        docCookies.setItem('Authorization', res.data.token);
        document.cookie = `token=${res.data.token}`;
        loginUser(res.data, 3000);
      }
    });
});
