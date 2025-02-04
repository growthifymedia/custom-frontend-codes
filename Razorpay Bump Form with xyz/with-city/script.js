// Put this whole code in Custom Javascript Footer, before pasting this add a <script>paste your code in between this</script>

const clientName = "STOCKTUTOR";
let amount = "199";
let bumpAmount = "199";
const purpose = "test";
const redirectUrl = "https://google.com";
const redirectUrlBump = "https://google.com";
const formSubmissionWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMDA0MzI1MjY1NTUzNjUxM2Ei_pc";
const paymentDetailsWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMDA0MzM1MjZhNTUzNjUxM2Ii_pc";
const apiKey = "rzp_live_zT6qxWnoCMD9tU";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";
const baseUrl = "https://growthifymedia-services.onrender.com";
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

let rzpCompatibleAmount = Number(amount) * 100;
rzpCompatibleAmount = rzpCompatibleAmount.toString();

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

let options = {
  key: apiKey,
  amount: rzpCompatibleAmount,
  currency: "INR",
  description: purpose,
  image: userImage,
  prefill: {
    email: "test@gmail.com",
    contact: "9812791045",
  },
  config: {
    display: {
      blocks: {
        banks: {
          name: "Most Used Methods",
          instruments: [
            {
              method: "wallet",
              wallets: ["phonepe"],
            },
            {
              method: "upi",
            },
          ],
        },
      },
      sequence: ["block.banks"],
      preferences: {
        show_default_blocks: true,
      },
    },
  },
  handler: async function (response) {
    const paymentId = response.razorpay_payment_id;
    const orderId = response.razorpay_order_id;
    const signature = response.razorpay_signature;
    form.style.display = "none";
    document.getElementById("loader-container").style.display = "flex";

    const verification = await fetch(
      `${baseUrl}/api/payments/new/razorpay/verify/${clientName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
        }),
      }
    );

    const verificationData = await verification.json();
    console.log(verificationData);
    paymentButton.disabled = false;
    paymentButton.style.opacity = 1;
    paymentButton.innerText = `Pay ₹${
      addOn.checked ? parseInt(amount) + parseInt(bumpAmount) : amount
    }`;
    window.location.href = addOn.checked ? redirectUrlBump : redirectUrl;
  },

  modal: {
    ondismiss: function () {
      paymentButton.disabled = false;
      paymentButton.style.opacity = 1;
      paymentButton.innerText = `Pay ₹${
        addOn.checked ? parseInt(amount) + parseInt(bumpAmount) : amount
      }`;
    },
  },
};

const onSubmitHandler = async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value.trim();
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const cityError = document.getElementById("cityError");

  let isValid = true;

  if (name === "") {
    nameError.classList.remove("hidden");
    isValid = false;
  } else {
    nameError.classList.add("hidden");
  }

  if (city === "") {
    cityError.classList.remove("hidden");
    isValid = false;
  } else {
    cityError.classList.add("hidden");
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
    amount: addOn.checked
      ? (Number(amount) + Number(bumpAmount)) * 100
      : Number(amount) * 100,
    purpose,
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_adgroup: urlParams.get("utm_adgroup"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
    utm_id: city,
    adsetname: urlParams.get("adset name"),
    adname: urlParams.get("ad name"),
    landingPageUrl: window.location.href.split("?")[0],
  };

  const updatedData = {
    formData: data,
    userWebhook: formSubmissionWebhook,
    paymentWebhook: paymentDetailsWebhook,
  };

  try {
    const response = await fetch(
      `${baseUrl}/api/payments/new/razorpay/createOrder/${clientName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    const result = await response.json();
    if (result && result.order && result.order.id) {
      options.prefill = {
        email: form.email.value.trim(),
        contact: form.phone.value.trim(),
      };
      options.order_id = result.order.id;
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } else {
      alert("Error: Unable to retrieve order ID. Please try again later.");
      paymentButton.disabled = false;
      paymentButton.style.opacity = 1;
      paymentButton.innerText = `Pay ₹${
        addOn.checked ? parseInt(amount) + parseInt(bumpAmount) : amount
      }`;
    }
  } catch (error) {
    alert("Some error occured! Please retry");
    console.log(error);
  } finally {
    paymentButton.disabled = false;
    paymentButton.style.opacity = 1;
    paymentButton.innerText = `Pay ₹${
      addOn.checked ? Number(amount) + Number(bumpAmount) : amount
    }`;
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
