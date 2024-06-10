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
  const phoneRegex = /^\d{8,15}$/;
  return phoneRegex.test(phone);
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
    paymentButton.disabled = true;
    paymentButton.textContent = "Submitting...";
    paymentButton.style.cursor = "not-allowed";
    paymentButton.style.backgroundColor = "#ccc";
    formData.phone = `${selectElement.value}${formData.phone}`;
    console.log("Form data:", formData);
    const urlParams = new URLSearchParams(window.location.search);
    const detailData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_adgroup: urlParams.get("utm_adgroup"),
      utm_content: urlParams.get("utm_content"),
      utm_term: urlParams.get("utm_term"),
      utm_id: urlParams.get("utm_id"),
      adsetname: urlParams.get("adset name"),
      adname: urlParams.get("ad name"),
      landingPageUrl: window.location.href,
    };
    console.log(detailData)
    try {
      const response = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZiMDYzNzA0M2Q1MjY5NTUzYzUxMzAi_pc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detailData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    paymentButton.disabled = false;
    paymentButton.textContent = "Submit";
    paymentButton.style.cursor = "pointer";
    paymentButton.style.backgroundColor = "black";
    document.getElementById("thanks").style.display = "block"
      // const data = await response.json();
      window.open(
  `https://workshop.catapan.in/typage?name=${form.name.value}&email=${form.email.value}&phone=${form.phone.value}`, 
  '_blank'
);

    } catch (error) {
      alert("Error occurred, please try again...");
      console.error("Error!", error.message);
    }
  }
});
