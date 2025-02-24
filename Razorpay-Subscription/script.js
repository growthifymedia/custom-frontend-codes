const sellerName = "TAPAN_TEST";
const webhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZlMDYzMTA0M2M1MjZkNTUzNzUxM2Ei_pc";
const plan_id = "plan_PxrKKTVmPSFFE1";
const total_count = "6";
const customer_notify = 0;

const form = document.getElementById("details");
const submitButton = document.getElementById("payment");
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

    const data = {
      ...formData,
      plan_id,
      total_count,
      customer_notify,
      notes: { webhook },
    };

    try {
      const response = await fetch(
        `https://auth-test-8eyl.onrender.com/api/subscriptions/createSubscriptionLink/${sellerName}`,
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
      if (result) {
        window.location.href = result.data.short_url;
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
