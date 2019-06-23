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
        
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (mobileNav.classList.contains("open")) {
    if (event.target == toggleButton ) {
    }
    else if (event.target !== mobileNavItems) {
      console.log('i was actioned');
      mobileNav.classList.remove("open");
      backdrop.classList.remove("open");
    }
  }
}

for (var i = 0; i < cancelButton.length; i++) {
  cancelButton[i].addEventListener("click", function() {
    modal.classList.remove("open");
  });
}