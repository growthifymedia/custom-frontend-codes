const clientName = "SALMANKHAN";

const amount1 = "9";
const purpose1 = "2 Days live workshop";
const redirectUrl1 = "https://webinar.ravirkumar.com/2days-ws-ty";
const userDetailWebhook1 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";
const paymentDetailWebhook1 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc";
const checkPaymentWebhook1 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc";

const baseUrl = "https://growthifymedia-services.onrender.com";

const form1 = document.getElementById("details1");
const paymentButton1 = document.getElementById("payment1");

document.getElementsByClassName("amount1")[0].innerText = `₹${amount1}.00`;
document.getElementsByClassName("total-amount1")[0].innerText = `₹${amount1}.00`;
paymentButton1.innerText = `Pay ₹${amount1}.00`;

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

paymentButton1.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form1.name.value.trim(),
    email: form1.email.value.trim(),
    phone: form1.phone.value.trim(),
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
    paymentButton1.disabled = true;
    paymentButton1.style.opacity = 0.7;
    paymentButton1.innerText = "Submitting...";
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      name: formData.name,
      amount: amount1,
      email: formData.email,
      phone: formData.phone,
      purpose: purpose1,
      redirectUrl: redirectUrl1,
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

    const updatedData = {
      formData: data,
      userDetailWebhook: userDetailWebhook1,
      paymentDetailWebhook: paymentDetailWebhook1,
      checkPaymentWebhook: checkPaymentWebhook1,
    };
    try {
      const response = await fetch(
        `${baseUrl}/api/payments/new/instamojo/createPayment/${clientName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      const jsonData = await response.json();
      console.log(jsonData);
      paymentButton1.style.opacity = 1;
      paymentButton1.innerText = `Pay ₹${amount1}`;
      paymentButton1.disabled = false;
      window.location.href = jsonData.data;
    } catch (error) {
      alert("Some error occured! Please retry");
      console.log(error);
    }
  }
});