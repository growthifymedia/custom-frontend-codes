const sellerName = "TAPAN_TEST";
const baseUrl = "https://backend-test.growthifymedia.com";
const webhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZlMDYzMTA0M2M1MjZkNTUzNzUxM2Ei_pc";
const paymentWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZlMDYzMTA0M2M1MjZkNTUzNzUxM2Ei_pc";
const redirectionUrl = "https://google.com";
const sellerApiKey = "rzp_test_6yEg7KBlHdDa7q";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";

// Define your plans here
const plans = {
  quarterly: {
    id: "plan_PxrKKTVmPSFFE1",
    totalCount: 3,
    price: 3,
  },
  annual: {
    id: "plan_PxrKKTVmPSFFE1",
    totalCount: 1,
    price: 12,
  },
};

const customerNotify = 0;

const form = document.getElementById("details");
const submitButton = document.getElementById("payment");
const selectedPlan = document.getElementById("plan-type");

// Utility functions
const getInput = (id) => document.getElementById(id);

const setBorder = (input, value) => {
  input.style.border = value;
};

const showError = (inputId, errorId) => {
  const errorElement = getInput(errorId);
  const input = getInput(inputId);

  errorElement.style.display = "flex";
  setBorder(input, "1px solid red");

  input.oninput = () => {
    errorElement.style.display = "none";
    setBorder(input, "");
  };
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) => /^[5-9][0-9]{9}$/.test(phone);

const isValidName = (name) => {
  if (!name.trim()) return false;
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

const validateForm = ({ name, email, phone }) => {
  let isValid = true;
  if (!isValidName(name)) {
    showError("name", "nameError");
    isValid = false;
  }
  if (!isValidEmail(email)) {
    showError("email", "emailError");
    isValid = false;
  }
  if (!isValidPhone(phone)) {
    showError("phone", "phoneError");
    isValid = false;
  }
  return isValid;
};

const updatePriceDisplay = (planKey) => {
  const { price } = plans[planKey];
  submitButton.innerText = `Pay ₹${price}.00`;
  getInput("original-price").innerText = `₹${price}.00`;
  getInput("total-price").innerText = `₹${price}.00`;
};

const createSubscription = async (data) => {
  const url = `${baseUrl}/api/subscriptions/createSubscription/${sellerName}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }
  return response.json();
};

const openRazorpayCheckout = async (subscription, customerData, planPrice) => {
  const options = {
    key: sellerApiKey,
    subscription_id: subscription.sub_id,
    name: "Acme Corp.",
    description: "Subscription Plan",
    image: userImage,
    config: {
      display: {
        blocks: {
          banks: {
            name: "Most Used Methods",
            instruments: [
              { method: "wallet", wallets: ["phonepe"] },
              { method: "upi" },
            ],
          },
        },
        sequence: ["block.banks"],
        preferences: { show_default_blocks: true },
      },
    },
    // callback_url: redirectionUrl,
    handler: async function (response) {
        console.log("Payment successful")
        window.location.href = redirectionUrl
    },
    prefill: {
      name: customerData.name,
      email: customerData.email,
      contact: customerData.phone,
    },
    notes: subscription.notes,
    theme: { color: "#F37254" },
    modal: {
      ondismiss: function () {
        submitButton.disabled = false;
        submitButton.style.opacity = 1;
        submitButton.innerText = `Pay ₹${planPrice}`;
      },
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  if (!validateForm(formData)) return;

  if (!selectedPlan.value) {
    alert("Please select a plan.");
    return;
  }

  submitButton.disabled = true;
  submitButton.innerText = "Submitting...";
  submitButton.style.cursor = "not-allowed";
  submitButton.style.backgroundColor = "#ccc";

  const planKey = selectedPlan.value;
  const { id: plan_id, totalCount, price } = plans[planKey];

  const subscriptionData = {
    ...formData,
    plan_id,
    total_count: totalCount,
    customer_notify: customerNotify,
    notes: { webhook, paymentWebhook, redirectionUrl },
  };

  try {
    const result = await createSubscription(subscriptionData);
    if (result) {
      openRazorpayCheckout(result.data, formData, price);
    } else {
      alert("Failed to create subscription. Please try again.");
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
  } finally {
    submitButton.disabled = false;
    updatePriceDisplay(planKey);
    submitButton.style.cursor = "pointer";
    submitButton.style.backgroundColor = "black";
  }
});

selectedPlan.addEventListener("change", () => {
  updatePriceDisplay(selectedPlan.value);
});

// Initialize price display on page load
updatePriceDisplay(selectedPlan.value);
