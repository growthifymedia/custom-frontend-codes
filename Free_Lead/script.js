const sellerName = "STOCKTUTOR";
const redirectUrl= "https://google.com";
const webhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc"

const form = document.getElementById("freeLead");
const submitButton = document.getElementById("submitButton");
const getInput = (name) => document.getElementById(name);

const setBorder = (input, value) => {
  input.style.border = value;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const showError = (inputId, errorId) => {
  const errorElement = getInput(errorId);
  errorElement.style.display = "flex";
  const input = getInput(inputId);
  input.oninput = function () {
    errorElement.style.display = "none";
    setBorder(input, "");
  };
  setBorder(input, "1px solid red");
};

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    dob: form.dob.value,
    city: form.city.value.trim(),
    purpose: form.purpose.value.trim(),
    favorite_food: form.favorite_food.value.trim(),
  };

  let isValid = true;

  if (!formData.name) {
    showError("name", "nameError");
    isValid = false;
  }

  if (!isValidEmail(formData.email)) {
    showError("email", "emailError");
    isValid = false;
  }

  if (!isValidPhone(formData.phone)) {
    showError("phone", "phoneError");
    isValid = false;
  }

  if (isValid) {
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
    submitButton.style.cursor = "not-allowed";
    submitButton.style.backgroundColor = "#ccc";

    const urlParams = new URLSearchParams(window.location.search);

    const data = {
      ...formData,
      utmParams: {
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        utm_adgroup: urlParams.get("utm_adgroup"),
        utm_content: urlParams.get("utm_content"),
        utm_term: urlParams.get("utm_term"),
        adsetName: urlParams.get("adset name"),
        adName: urlParams.get("ad name"),
      },
      landingPageUrl: window.location.href,
      webhook
    };

    try {
      const response = await fetch(
        `https://growthifymedia-services.onrender.com/api/free-lead/${sellerName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Success:", result);
      if (result.success) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("An error occurred. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
      submitButton.style.cursor = "pointer";
      submitButton.style.backgroundColor = "black";
    }
  }
});
