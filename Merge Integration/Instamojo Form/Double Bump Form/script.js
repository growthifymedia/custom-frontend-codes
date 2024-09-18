// Configuration
const config = {
    clientName: "RAVI",
    baseAmount: "47",
    bump1Amount: "199",
    bump2Amount: "299",
    purpose: "test",
    redirectUrl: "https://google.com",
    redirectUrlBump1: "https://google1.com",
    redirectUrlBump2: "https://google2.com",
    userDetailWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc",
    paymentDetailWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc",
    checkPaymentWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc",
    userImage: "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg",
    baseUrl: "https://growthifymedia-services.onrender.com"
  };
  
  // DOM Elements
  const elements = {
    form: document.getElementById("details"),
    paymentButton: document.getElementById("payment"),
    bump1: document.getElementById("bump"),
    addOn1: document.getElementById("addOn"),
    bump2: document.getElementById("bump2"),
    addOn2: document.getElementById("addOn2"),
    amountValue: document.getElementsByClassName("amount")[0],
    totalAmountValue: document.getElementsByClassName("total-amount")[0],
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    phoneInput: document.getElementById("phone"),
    nameError: document.getElementById("nameError"),
    emailError: document.getElementById("emailError"),
    phoneError: document.getElementById("phoneError")
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
    const name = elements.nameInput.value.trim();
    const email = elements.emailInput.value.trim();
    const phone = elements.phoneInput.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
  
    let isValid = true;
  
    isValid = validateField(name !== "", elements.nameError) && isValid;
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
    if (elements.addOn1.checked && elements.addOn2.checked) return config.redirectUrlBump2;
    if (elements.addOn1.checked) return config.redirectUrlBump1;
    if (elements.addOn2.checked) return config.redirectUrlBump2;
    return config.redirectUrl;
  };
  
  const getFormData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = calculateTotalAmount();
  
    return {
      name: elements.nameInput.value.trim(),
      email: elements.emailInput.value.trim(),
      phone: elements.phoneInput.value.trim(),
      amount: amount,
      purpose: config.purpose,
      redirectUrl: getRedirectUrl(),
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_adgroup: urlParams.get("utm_adgroup"),
      utm_content: urlParams.get("utm_content"),
      utm_term: urlParams.get("utm_term"),
      utm_id: urlParams.get("utm_id"),
      adsetname: urlParams.get("adset name"),
      adname: urlParams.get("ad name"),
      landingPageUrl: window.location.href.split('?')[0],
    };
  };
  
  // API Calls
  const createPayment = async (data) => {
    const response = await fetch(
      `${config.baseUrl}/api/payments/new/instamojo/createPayment/${config.clientName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: data,
          userDetailWebhook: config.userDetailWebhook,
          paymentDetailWebhook: config.paymentDetailWebhook,
          checkPaymentWebhook: config.checkPaymentWebhook,
        }),
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
      console.log(formData);
      const result = await createPayment(formData);
      
      if (result && result.data) {
        window.location.href = result.data;
      } else {
        throw new Error("Unable to create payment");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
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
  elements.bump1.addEventListener("click", handleBumpClick(elements.bump1, elements.addOn1));
  elements.addOn1.addEventListener("click", (e) => {
    e.stopPropagation();
    elements.addOn1.checked = !elements.addOn1.checked;
    updateAmount();
  });
  elements.bump2.addEventListener("click", handleBumpClick(elements.bump2, elements.addOn2));
  elements.addOn2.addEventListener("click", (e) => {
    e.stopPropagation();
    elements.addOn2.checked = !elements.addOn2.checked;
    updateAmount();
  });
  
  // Initialize
  updateAmount();