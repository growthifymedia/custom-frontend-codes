const sellerName = "STOCKTUTOR";
const redirectUrl = "https://workshop.wealthysandeep.com/double-ticket";
const webhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";

// Get form and button
const form = document.getElementById("formB-lead-form");
const submitButton = document.getElementById("formB-submit-btn");

// Utility function to get input element by ID
const getInput = (id) => document.getElementById(id);

// Utility to set border color
const setBorder = (input, value) => {
  input.style.border = value;
};

// Email and Phone validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

// Show error and attach event to hide it on input
const showError = (inputId, errorId) => {
  const errorElement = getInput(errorId);
  const input = getInput(inputId);

  errorElement.style.display = "flex";
  setBorder(input, "1px solid red");

  input.oninput = function () {
    errorElement.style.display = "none";
    setBorder(input, "");
  };
};

// Handle form submission
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form["formB_name"].value.trim(),
    email: form["formB_email"].value.trim(),
    phone: form["formB_phone"].value.trim(),
    dob: form["formB_dob"].value,
    city: form["formB_city"].value.trim(),
    purpose: form["formB_purpose"].value.trim(),
    favorite_food: form["formB_favorite_food"].value.trim(),
  };

  let isValid = true;

  // Validations
  if (!formData.name) {
    showError("formB-name", "formB-name-error");
    isValid = false;
  }

  if (!isValidEmail(formData.email)) {
    showError("formB-email", "formB-email-error");
    isValid = false;
  }

  if (!isValidPhone(formData.phone)) {
    showError("formB-phone", "formB-phone-error");
    isValid = false;
  }

  if (!isValid) return;

  // Disable button
  submitButton.disabled = true;
  submitButton.innerText = "Submitting...";
  submitButton.style.cursor = "not-allowed";
  submitButton.style.backgroundColor = "#ccc";

  // UTM parameters
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
    webhook,
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
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
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
});
