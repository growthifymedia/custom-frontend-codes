// Put this whole code in Custom Javascript Footer, before pasting this add a <script>paste your code in between this</script>

const clientName = "RAVI";
let amount = "199";
let bumpAmount = "199";
const purpose = "test";
const redirectUrl = "https://google.com";
const redirectUrlBump = "https://google.com"
const userDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";
const paymentDetailWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc";
const checkPaymentWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";
const baseUrl = "https://instamojopaymentapi.onrender.com";
let data;

const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");
const bump = document.getElementById("bump");
const addOn = document.getElementById("addOn");
const amountValue = document.getElementsByClassName("amount")[0];
const totalAmountValue = document.getElementsByClassName("total-amount")[0];

amountValue.innerText = `₹${amount}.00`;
totalAmountValue.innerText = `₹${amount}.00`;
paymentButton.innerText = `Pay ₹${amount}`;

const updateAmount = () => {
  if (addOn.checked) {
    const newAmount = Number(amount) + Number(bumpAmount);
    amountValue.innerText = `₹${newAmount}.00`;
    totalAmountValue.innerText = `₹${newAmount}.00`;
    paymentButton.innerText = `Pay ₹${newAmount}`;
  } else {
    amountValue.innerText = `₹${amount}.00`;
    totalAmountValue.innerText = `₹${amount}.00`;
    paymentButton.innerText = `Pay ₹${amount}`;
  }
};

const onSubmitHandler = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");

  let isValid = true;

  if (name === "") {
    nameError.classList.remove("hidden");
    isValid = false;
  } else {
    nameError.classList.add("hidden");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.classList.remove("hidden");
    isValid = false;
  } else {
    emailError.classList.add("hidden");
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    phoneError.classList.remove("hidden");
    isValid = false;
  } else {
    phoneError.classList.add("hidden");
  }

  if (!isValid) {
    return;
  }

  paymentButton.disabled = true;
  paymentButton.style.opacity = 0.7;
  paymentButton.innerText = "Submitting...";
  const urlParams = new URLSearchParams(window.location.search);
  
  data = {
    name,
    email,
    phone,
    amount: addOn.checked ? (Number(amount) + Number(bumpAmount)) : Number(amount),
    purpose,
    redirectUrl: addOn.checked ? redirectUrlBump : redirectUrl,
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
    bump.click()
    paymentButton.style.opacity = 1;
    paymentButton.innerText = `Pay ₹${data.amount}`;
    paymentButton.disabled = false;
    window.location.href = jsonData.data;
  } catch (error) {
    alert("Some error occured! Please retry");
    console.log(error);
  }
};

form.addEventListener("submit", onSubmitHandler);

bump.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.id !== "addOn") {
    addOn.checked = !addOn.checked;
    updateAmount();
  }
});

addOn.addEventListener("click", (e) => {
  e.stopPropagation();
  addOn.checked = !addOn.checked;
  updateAmount();
});