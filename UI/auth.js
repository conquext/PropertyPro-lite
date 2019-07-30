const signupModalForm = document.querySelector('.modal-content__signup');
const loginModalForm = document.querySelector('.modal-content__login');

signup.addEventListener('click', () => {
  const refresh = document.querySelector('.signup-button .fa-refresh');
  refresh.style.display = 'inline';
});

login.addEventListener('click', () => {
  const refresh = document.querySelector('.login-button .fa-refresh');
  refresh.style.display = 'inline';
});

const loginUser = (data, delay) => {
  if (data.type === 'user') {
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
  fetch(`${api}/auth/signup`, {
    method: 'post',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-cache',
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
      const refresh = document.querySelector('.signup-button .fa-refresh');
      refresh.style.display = 'inline';
      if (res.status === 'error') {
        signup.disabled = false;
        refresh.style.display = 'none';
        resForm.innerHTML = res.error;
        resForm.classList.add('error');
      }
      if (res.status === 'sucess') {
        resForm.classList.add('success');
        resForm.innerHTML = res.message;
        localStorage.id = res.data.id;
        loginUser(res.data, 5000);
      }
    })
    .catch(error => error);
});

loginModalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  fetch(`${api}/auth/signin`, {
    method: 'post',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-cache',
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
        resForm.innerHTML = res.error;
        resForm.classList.add('error');
      } else {
        resForm.classList.add('success');
        resForm.innerHTML = 'Login success, preparing your dashboard';
        localStorage.id = res.data.id;
        loginUser(res.data, 3000);
      }
    });
});
