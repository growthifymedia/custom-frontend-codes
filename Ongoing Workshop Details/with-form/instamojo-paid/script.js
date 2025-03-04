const clientName = "RAVI";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${ordinalSuffix(day)} ${date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };
  
  // Format time to "HH:MM AM/PM"
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  // Fetch ongoing workshop details
  const fetchOngoingWorkshopDetails = async () => {
    try {
      const res = await fetch(
        `https://auth-test-8eyl.onrender.com/api/reset/ongoing?sellerName=${sellerName}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      const { data } = await res.json();
      const { workshopDate, workshopTime, whatsappGroupLink } = data;
  
      document.getElementById("workshopDetails").style.display = "flex";
      document.getElementById("workshopDate").textContent =
        formatDate(workshopDate);
      document.getElementById("workshopTime").textContent =
        formatTime(workshopTime);
      // document.getElementById("whatsAppBtn").addEventListener("click", () => {
      //   window.open(whatsappGroupLink, "_blank");
      // });
    } catch (error) {
      document.getElementById("noWorkshopDetails").style.display = "flex";
    }
  };
  
  fetchOngoingWorkshopDetails();
  
const amount = "199";
const purpose = "2 Days live workshop";
const redirectUrl = "https://webinar.ravirkumar.com/2days-ws-ty";
const userDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";
const paymentDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc";
const checkPaymentWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc";
const baseUrl = "https://growthifymedia-services.onrender.com";

const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");

document.getElementsByClassName("amount")[0].innerText = `₹${amount}.00`;

document.getElementsByClassName("total-amount")[0].innerText = `₹${amount}.00`;

paymentButton.innerText = `Pay ₹${amount}.00`;

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
    paymentButton.style.opacity = 0.7;
    paymentButton.innerText = "Submitting...";
    const urlParams = new URLSearchParams(window.location.search);
    const data = {
      name: formData.name,
      amount,
      email: formData.email,
      phone: formData.phone,
      purpose,
      redirectUrl,
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
      userDetailWebhook,
      paymentDetailWebhook,
      checkPaymentWebhook,
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
      paymentButton.style.opacity = 1;
      paymentButton.innerText = `Pay ₹${amount}`;
      paymentButton.disabled = false;
      window.location.href = jsonData.data;
    } catch (error) {
      alert("Some error occured! Please retry");
      console.log(error);
    }
  }
});
