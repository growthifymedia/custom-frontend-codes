const sellerNameB = "STOCKTUTOR";
const redirectUrlB = "https://workshop.wealthysandeep.com/double-ticket";
const webhookB = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";

// Get form and button
const formB = document.getElementById("formB-lead-form");
const submitButtonB = document.getElementById("formB-submit-btn");

// Utility function to get input element by ID
const getInputB = (id) => document.getElementById(id);

// Utility to set border color
const setBorderB = (input, value) => {
  input.style.border = value;
};

// Email and Phone validation
const isValidEmailB = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneB = (phone) => /^[0-9]{10}$/.test(phone);

// Show error and attach event to hide it on input
const showErrorB = (inputId, errorId) => {
  const errorElement = getInputB(errorId);
  const input = getInputB(inputId);

  errorElement.style.display = "flex";
  setBorderB(input, "1px solid red");

  input.oninput = function () {
    errorElement.style.display = "none";
    setBorderB(input, "");
  };
};

// Handle form submission
submitButtonB.addEventListener("click", async (e) => {
  e.preventDefault();

  const formDataB = {
    name: formB["formB_name"].value.trim(),
    email: formB["formB_email"].value.trim(),
    phone: formB["formB_phone"].value.trim(),
    dob: formB["formB_dob"].value,
    city: formB["formB_city"].value.trim(),
    purpose: formB["formB_purpose"].value.trim(),
    favorite_food: formB["formB_favorite_food"].value.trim(),
  };

  let isValidB = true;

  // Validations
  if (!formDataB.name) {
    showErrorB("formB-name", "formB-name-error");
    isValidB = false;
  }

  if (!isValidEmailB(formDataB.email)) {
    showErrorB("formB-email", "formB-email-error");
    isValidB = false;
  }

  if (!isValidPhoneB(formDataB.phone)) {
    showErrorB("formB-phone", "formB-phone-error");
    isValidB = false;
  }

  if (!isValidB) return;

  // Disable button
  submitButtonB.disabled = true;
  submitButtonB.innerText = "Submitting...";
  submitButtonB.style.cursor = "not-allowed";
  submitButtonB.style.backgroundColor = "#ccc";

  // UTM parameters
  const urlParamsB = new URLSearchParams(window.location.search);

  const dataB = {
    ...formDataB,
    utmParams: {
      utm_source: urlParamsB.get("utm_source"),
      utm_medium: urlParamsB.get("utm_medium"),
      utm_campaign: urlParamsB.get("utm_campaign"),
      utm_adgroup: urlParamsB.get("utm_adgroup"),
      utm_content: urlParamsB.get("utm_content"),
      utm_term: urlParamsB.get("utm_term"),
      adsetName: urlParamsB.get("adset name"),
      adName: urlParamsB.get("ad name"),
    },
    landingPageUrl: window.location.href,
    webhook: webhookB,
  };

  try {
    const response = await fetch(
      `https://growthifymedia-services.onrender.com/api/free-lead/${sellerNameB}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataB),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log("Success:", result);

    if (result.success) {
      window.location.href = redirectUrlB;
    }

  } catch (error) {
    console.error("Error:", error.message);
    alert("An error occurred. Please try again.");
  } finally {
    submitButtonB.disabled = false;
    submitButtonB.innerText = "Submit";
    submitButtonB.style.cursor = "pointer";
    submitButtonB.style.backgroundColor = "black";
  }
});
