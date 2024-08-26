const clientName = "SALMANKHAN";
const amount2 = "19";
const purpose2 = "2 Days live workshop";
const redirectUrl2 = "https://webinar.ravirkumar.com/2days-ws-ty";
const userDetailWebhook2 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";
const paymentDetailWebhook2 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc";
const checkPaymentWebhook2 =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc";

const baseUrl = "https://growthifymedia-services.onrender.com";

const form2 = document.getElementById("details2");
const paymentButton2 = document.getElementById("payment2");

document.getElementsByClassName("amount2")[0].innerText = `₹${amount2}.00`;
document.getElementsByClassName("total-amount2")[0].innerText = `₹${amount2}.00`;
paymentButton2.innerText = `Pay ₹${amount2}.00`;

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

paymentButton2.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    name: form2.name.value.trim(),
    email: form2.email.value.trim(),
    phone: form2.phone.value.trim(),
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
    paymentButton2.disabled = true;
    paymentButton2.style.opacity = 0.7;
    paymentButton2.innerText = "Submitting...";
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      name: formData.name,
      amount: amount2,
      email: formData.email,
      phone: formData.phone,
      purpose: purpose2,
      redirectUrl: redirectUrl2,
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
      userDetailWebhook: userDetailWebhook2,
      paymentDetailWebhook: paymentDetailWebhook2,
      checkPaymentWebhook: checkPaymentWebhook2,
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
      paymentButton2.style.opacity = 1;
      paymentButton2.innerText = `Pay ₹${amount2}`;
      paymentButton2.disabled = false;
      window.location.href = jsonData.data;
    } catch (error) {
      alert("Some error occured! Please retry");
      console.log(error);
    }
  }
});
