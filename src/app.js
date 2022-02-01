const form = document.getElementById("contact-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const doggoName = document.getElementById("doggo-name");
const doggoBreed = document.getElementById("doggo-breed");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const successModal = document.getElementById("modal-success");

initFormListeners(form);
initModals(successModal);
initCookieBanner();
populateDoggoBreedSelect();

function initFormListeners(formToInit) {
  formToInit.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateAllInputs()) {
      displaySuccessModal();
    }
  });
}

function initModals(successModalToInit) {
  let closeButtons = document.getElementsByClassName("modal__close");

  for (let el of closeButtons) {
    el.onclick = function () {
      successModalToInit.style.display = "none";
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
          fillSelectElem(selectElem, data);
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
