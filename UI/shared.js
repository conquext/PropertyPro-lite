const backdrop = document.querySelector(".main-auth__backdrop");
const modal = document.querySelector(".modal");
const modalNoButton = document.querySelector(".modal__action--negative");
const signupButton = document.querySelectorAll(".signup");
const signupLinks = document.querySelectorAll("[href='#signup']");
const loginButton  = document.querySelectorAll(".login");
const loginLinks  = document.querySelectorAll("[href='#login']");
const signupBox = document.querySelector(".signup-box");
const loginBox = document.querySelector(".login-box");
const toggleButton = document.querySelector(".toggle-button");
const mobileNav = document.querySelector(".mobile-nav");


for (var i = 0; i < signupButton.length; i++) {
  signupButton[i].addEventListener("click", function() {
    modal.classList.add("open");
    backdrop.classList.add("open");
    signupBox.classList.add("open");
    loginBox.classList.remove("open");
  });
}

for (var i = 0; i < signupLinks.length; i++) {
  signupLinks[i].addEventListener("click", function() {
    modal.classList.add("open");
    backdrop.classList.add("open");
    signupBox.classList.add("open");
    loginBox.classList.remove("open");
  });
}

for (var i = 0; i < loginButton.length; i++) {
  loginButton[i].addEventListener("click", function() {
    modal.classList.add("open");
    backdrop.classList.add("open");
    loginBox.classList.add("open");
    signupBox.classList.remove("open");
  });
}

for (var i = 0; i < loginLinks.length; i++) {
  loginLinks[i].addEventListener("click", function() {
    modal.classList.add("open");
    backdrop.classList.add("open");
    loginBox.classList.add("open");
    signupBox.classList.remove("open");
  });
}

backdrop.addEventListener("click", function() {
  mobileNav.classList.remove("open");
  closeModal();
});

if (modalNoButton) {
  modalNoButton.addEventListener("click", closeModal);
}

function closeModal() {
  if (modal) {
    modal.classList.remove("open");
  }
  backdrop.classList.remove("open");
}

toggleButton.addEventListener("click", function() {
  mobileNav.classList.add("open");
  backdrop.classList.add("open");
});
