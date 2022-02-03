const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirm-email");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const successModal = document.getElementById("modal-success");
const errorModal = document.getElementById("modal-error");

const api_url = "https://api.devnovatize.com/frontend-challenge";

initFormListeners(form);
initModals(successModal, errorModal);
initCookieBanner();
populateDoggoBreedSelect();

function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      postUser();
    }
  });
}

function initModals(successModalToInit, errorModalToInit) {
  let closeButtons = document.getElementsByClassName("modal__close");

  for (let el of closeButtons) {
    el.onclick = function () {
      successModalToInit.style.display = "none";
      errorModalToInit.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == successModal) {
      successModalToInit.style.display = "none";
    }
  };
}

function initCookieBanner() {
  let acceptCookiesButton = document.querySelector("#cookie-banner .button__primary");
  acceptCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");

    cookieBanner.style.display = "none";
  }

  let rejectCookiesButton = document.querySelector("#cookie-banner .button__secondary");
  rejectCookiesButton.onclick = function () {
    let cookieBanner = document.getElementById("cookie-banner");
    let submitButton = document.querySelector("form button");

    submitButton.disabled = true;
    cookieBanner.style.display = "none";
  };
}

function postUser() {
  const body = {
    "first-name": firstName.value,
    "last-name": lastName.value,
    "doggo-name": doggoName.value,
    "doggo-breed": doggoBreed.value,
    "email": email.value,
    "confirm-email": confirmEmail.value,
    "password": password.value,
    "confirm-password": confirmPassword.value,
  }

  fetch(api_url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }).then(
      function (response) {
        if (!response.ok) {
          displayErrorModal(response.status)
          console.log("Error calling external API. Status Code: " + response.status);
          return;
        } else {
          displaySuccessModal();
        }
      }
  )
}

function populateDoggoBreedSelect() {
  fetch("https://api.devnovatize.com/frontend-challenge")
    .then(
      function (response) {
        if (!response.ok) {
          console.log("Error calling external API. Status Code: " +
            response.status);
          return;
        }

        response.json().then(function (data) {
          var selectElem = document.getElementById("doggo-breed");
          fillSelectElem(selectElem, data.sort());
        });
      }
    )
    .catch(function (err) {
      console.log("Fetch Error : ", err);
    });
}

function fillSelectElem(selectElem, dataToFill) {
  dataToFill.forEach((element) => {
    var optionElem = document.createElement("option");
    optionElem.innerHTML = element;

    if (element.toLowerCase() === "labernese") {
      optionElem.setAttribute("selected", "selected");
    }
    selectElem.appendChild(optionElem);
  });
}

function validateAllInputs() {
  let allInputValids =
    validateInput(firstName) &&
    validateInput(lastName) &&
    validateInput(email, validateEmail) &&
    validateInput(confirmEmail, validateConfirmEmail) &&
    validateInput(doggoName) &&
    validateInput(doggoBreed) &&
    validateInput(password, validatePassword) &&
    validateInput(confirmPassword, function (value) { return value === password.value.trim(); });

  return allInputValids;
}

function validateInput(element, validationFunction) {
  let inputValid = isInputValid(element, validationFunction);

  inputValid ? setSuccessInput(element) : setErrorInput(element);

  return inputValid;
}

function isInputValid(element, validationFunction) {
  let value = element.value.trim();

  return !(value === "" || (validationFunction && !validationFunction(value)));
}

function validatePassword(password) {
  let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // 8 chars, lower, upper and digits
  return re.test(String(password));
}

function validateEmail(email) {
  let re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(String(email));
}

function validateConfirmEmail() {
  if (email.value === confirmEmail.value) {
    return true;
  }
  return false;
}

function setErrorInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.remove("success")
  formControl.classList.add("error");
}

function setSuccessInput(input) {
  const formControl = input.parentElement.parentElement;
  formControl.classList.remove("error")
  formControl.classList.add("success");
}


function displaySuccessModal() {
  var modal = document.getElementById("modal-success");
  modal.style.display = "block";
}

function displayErrorModal(status) {
  var statusText = document.getElementById("status-error");
  statusText.innerHTML = status;

  var modal = document.getElementById("modal-error");
  modal.style.display = "block";
}
