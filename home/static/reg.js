function changeType() {
  var toggle = document.form.checkbox;
  var password = document.getElementById("password");

  if (toggle.checked) {
    password.setAttribute("type", "text");
  } else {
    password.setAttribute("type", "password");
  }
}

function password_validation() {
  var form = document.getElementById("form");
  var password = document.getElementById("password").value;
  var msg = document.getElementById("msg");

  var patternLowercase = /[a-z]/;
  var patternUppercase = /[A-Z]/;
  var patternNumbers = /[\d]/;
  var patternSymbols = /[!-/:-@[-`{-~]/;

  var length = document.getElementsByClassName("length");
  var lowercase = document.getElementsByClassName("lowercase");
  var uppercase = document.getElementsByClassName("uppercase");
  var numbers = document.getElementsByClassName("numbers");
  var symbols = document.getElementsByClassName("symbols");

  if (password.length >= 8) {
    length[0].classList.add("active");
  } else {
    length[0].classList.remove("active");
  }

  if (patternLowercase.test(password)) {
    lowercase[0].classList.add("active");
  } else {
    lowercase[0].classList.remove("active");
  }

  if (patternUppercase.test(password)) {
    uppercase[0].classList.add("active");
  } else {
    uppercase[0].classList.remove("active");
  }

  if (patternNumbers.test(password)) {
    numbers[0].classList.add("active");
  } else {
    numbers[0].classList.remove("active");
  }

  if (patternSymbols.test(password)) {
    symbols[0].classList.add("active");
  } else {
    symbols[0].classList.remove("active");
  }

  var active = document.getElementsByClassName("active");
  var percentage = document.getElementsByClassName("percentage");
  percentage[0].setAttribute(
    "style",
    "width: " + (active.length / 5) * 100 + "%"
  );

  if (active.length <= 1) {
    msg.innerHTML = "Poor";
  } else if (active.length == 2) {
    msg.innerHTML = "Weak";
  } else if (active.length == 3) {
    msg.innerHTML = "Medium";
  } else if (active.length == 4) {
    msg.innerHTML = "Good";
  } else {
    msg.innerHTML = "Strong";
  }
}
