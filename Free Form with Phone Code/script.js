window.onload = function () {
    fetch('https://cdn.jsdelivr.net/npm/country-code-flag-phone-extension-json@1.0.2/dist/index.json')
        .then(response => response.json())
        .then(data => {
            const countries = data;
            console.log(countries);
            const countryList = document.getElementById('country');
            
            for (const countryCode in countries) {
                if (countries.hasOwnProperty(countryCode)) {
                    const country = countries[countryCode];
                    const option = document.createElement('option');
                    option.value = country.dail_code;
                    // Set the text content to the emoji followed by the country name and dial code
                    option.textContent = `${country.name} (${country.dail_code})`;
                    countryList.appendChild(option);
                }
            }
            // Set default value to India (+91)
            countryList.value = '+91';
        })
        .catch(error => console.error('Error fetching the country data:', error));
}

const selectElement = document.getElementById('country');
selectElement.addEventListener('change', function() {
    const selectedCountryCode = this.value;
    console.log("Selected Country Code:", selectedCountryCode);
});



const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");

const getInput = (name) => {
  return document.getElementById(name);
};

const setBorder = (input, value) => {
  input.style.border = value;
};

const isValidName = (name) => {
  // Check if the name is not empty
  if (!name.trim()) {
    return false;
  }

  // Check if the name contains only letters (no numbers or special characters)
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[5-9][0-9]{9}$/;
  const sequentialPattern = /(.)\1{9}/; // Check for 10 repeated digits
  const sequentialMatch = phone.match(sequentialPattern);
  return phoneRegex.test(phone) && !sequentialMatch;
};

paymentButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  let isValid = true;

  if (!isValidName(formData.name)) {
    const nameError = getInput("nameError");
    nameError.style.display = "flex";
    const input = getInput("name");
    input.oninput = function () {
      nameError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (!isValidEmail(formData.email)) {
    const emailError = getInput("emailError");
    emailError.style.display = "flex";
    const input = getInput("email");
    input.oninput = function () {
      emailError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (!isValidPhone(formData.phone)) {
    const phoneError = getInput("phoneError");
    phoneError.style.display = "flex";
    const input = getInput("phone");
    input.oninput = function () {
      phoneError.style.display = "none";
      setBorder(input, "");
    };
    setBorder(input, "1px solid red");
    isValid = false;
  }

  if (isValid) {
    formData.phone = `${selectElement.value}${formData.phone}`;
    console.log("Form data:", formData);
  }
});
