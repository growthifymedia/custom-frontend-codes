const config = {
  clientName: "SAPNA",
  baseAmount: "1",
  bump1Amount: "96",
  bump2Amount: "249",
  purpose: "Report",
  redirectUrl: "https://sapnnaverma.com/thank-you-numerology",
  redirectUrlBump1: "https://sapnnaverma.com/thank-you-numerology",
  redirectUrlBump2: "https://sapnnaverma.com/thank-you-numerology",
  redirectUrlBothBumps: "https://sapnnaverma.com/thank-you-numerology",
  formSubmissionWebhook:
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZjMDYzMDA0MzA1MjY1NTUzMzUxMzEi_pc",
  paymentDetailsWebhook:
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZjMDYzMDA0MzA1MjY1NTUzMjUxMzQi_pc",
  apiKey: "rzp_live_pOj720oFA5IEvd",
  userImage: "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg",
  baseUrl: "https://growthifymedia-services.onrender.com",
};
const elements = {
  form: document.getElementById("details"),
  paymentButton: document.getElementById("payment"),
  bump1: document.getElementById("bump"),
  addOn1: document.getElementById("addOn"),
  bump2: document.getElementById("bump2"),
  addOn2: document.getElementById("addOn2"),
  amountValue: document.getElementsByClassName("amount")[0],
  totalAmountValue: document.getElementsByClassName("total-amount")[0],
  firstNameInput: document.getElementById("firstName"),
  lastNameInput: document.getElementById("lastName"),
  firstNameError: document.getElementById("firstNameError"),
  lastNameError: document.getElementById("lastNameError"),
  emailInput: document.getElementById("email"),
  phoneInput: document.getElementById("phone"),
  emailError: document.getElementById("emailError"),
  phoneError: document.getElementById("phoneError"),
  loaderContainer: document.getElementById("loader-container"),
  gender: document.getElementById("gender"),
  birthday: document.getElementById("birthday"),
};

// Helper Functions
const calculateTotalAmount = () => {
  let total = Number(config.baseAmount);
  if (elements.addOn1.checked) total += Number(config.bump1Amount);
  if (elements.addOn2.checked) total += Number(config.bump2Amount);
  return total;
};

const updateAmount = () => {
  const newAmount = calculateTotalAmount();
  elements.amountValue.innerText = `₹${newAmount}.00`;
  elements.totalAmountValue.innerText = `₹${newAmount}.00`;
  elements.paymentButton.innerText = `Pay ₹${newAmount}`;
  return newAmount;
};

const validateForm = () => {
  const firstName = elements.firstNameInput.value.trim();
  const lastName = elements.lastNameInput.value.trim();
  const email = elements.emailInput.value.trim();
  const phone = elements.phoneInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  let isValid = true;

  isValid = validateField(firstName !== "", elements.firstNameError) && isValid;
  isValid = validateField(lastName !== "", elements.lastNameError) && isValid;
  isValid = validateField(emailRegex.test(email), elements.emailError) && isValid;
  isValid = validateField(phoneRegex.test(phone), elements.phoneError) && isValid;

  return isValid;
};

const validateField = (condition, errorElement) => {
  if (condition) {
    errorElement.classList.add("hidden");
    return true;
  } else {
    errorElement.classList.remove("hidden");
    return false;
  }
};

const getRedirectUrl = () => {
  if (elements.addOn1.checked && elements.addOn2.checked)
    return config.redirectUrlBothBumps;
  if (elements.addOn1.checked) return config.redirectUrlBump1;
  if (elements.addOn2.checked) return config.redirectUrlBump2;
  return config.redirectUrl;
};

const getFormData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const amount = calculateTotalAmount();

  const fullName = `${elements.firstNameInput.value.trim()} ${elements.lastNameInput.value.trim()}`.trim();

  return {
    name: fullName,
    email: elements.emailInput.value.trim(),
    phone: elements.phoneInput.value.trim(),
    amount: amount * 100, 
    purpose: config.purpose,
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_adgroup: urlParams.get("utm_adgroup"),
    utm_content: elements.gender.value,
    utm_term: elements.birthday.value,
    utm_id: urlParams.get("utm_id"),
    adsetname: urlParams.get("adset name"),
    adname: urlParams.get("ad name"),
    landingPageUrl: window.location.href.split("?")[0],
    bump1: elements.addOn1.checked,
    bump2: elements.addOn2.checked,
  };
};

// Razorpay Configuration
const getRazorpayOptions = (orderId) => {
  const fullName = `${elements.firstNameInput.value.trim()} ${elements.lastNameInput.value.trim()}`.trim();

  return {
    key: config.apiKey,
    amount: calculateTotalAmount() * 100,
    currency: "INR",
    name: config.clientName,
    description: config.purpose,
    image: config.userImage,
    order_id: orderId,
    handler: handlePaymentSuccess,
    prefill: {
      name: fullName,
      email: elements.emailInput.value.trim(),
      contact: elements.phoneInput.value.trim(),
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
};

// API Calls
const createOrder = async (data) => {
  const response = await fetch(
    `${config.baseUrl}/api/payments/new/razorpay/createOrder/${config.clientName}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData: data,
        userWebhook: config.formSubmissionWebhook,
        paymentWebhook: config.paymentDetailsWebhook,
      }),
    }
  );
  return response.json();
};

const verifyPayment = async (paymentData) => {
  const response = await fetch(
    `${config.baseUrl}/api/payments/new/razorpay/verify/${config.clientName}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    }
  );
  return response.json();
};

// Event Handlers
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setButtonState(true, "Submitting...");

  try {
    const formData = getFormData();
    const result = await createOrder(formData);

    if (result && result.order && result.order.id) {
      const rzp1 = new Razorpay(getRazorpayOptions(result.order.id));
      rzp1.open();
    } else {
      throw new Error("Unable to retrieve order ID");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again later.");
  } finally {
    setButtonState(false);
  }
};

const handlePaymentSuccess = async (response) => {
  elements.form.style.display = "none";
  elements.loaderContainer.style.display = "flex";

  try {
    const verificationData = await verifyPayment({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });

    console.log(verificationData);
    window.location.href = getRedirectUrl();
  } catch (error) {
    console.error(error);
    alert("Payment verification failed. Please contact support.");
    setButtonState(false);
  }
};

const handleBumpClick = (bumpElement, addOnElement) => (e) => {
  e.stopPropagation();
  if (e.target !== addOnElement) {
    addOnElement.checked = !addOnElement.checked;
    updateAmount();
  }
};

// Utility Functions
const setButtonState = (disabled, text) => {
  elements.paymentButton.disabled = disabled;
  elements.paymentButton.style.opacity = disabled ? 0.7 : 1;
  elements.paymentButton.innerText = text || `Pay ₹${updateAmount()}`;
};

// Event Listeners
elements.form.addEventListener("submit", handleSubmit);

elements.bump1.addEventListener(
  "click",
  handleBumpClick(elements.bump1, elements.addOn1)
);
elements.addOn1.addEventListener("click", (e) => {
  e.stopPropagation();
  elements.addOn1.checked = !elements.addOn1.checked;
  updateAmount();
});

elements.bump2.addEventListener(
  "click",
  handleBumpClick(elements.bump2, elements.addOn2)
);
elements.addOn2.addEventListener("click", (e) => {
  e.stopPropagation();
  elements.addOn2.checked = !elements.addOn2.checked;
  updateAmount();
});

// Initialize
updateAmount();
