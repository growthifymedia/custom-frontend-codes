// Put this whole code in Custom Javascript Footer, before pasting this add a <script>paste your code in between this</script>

const clientName = "TAPAN_TEST";
let amount = "199";
let bumpAmount = "199";
const purpose = "test";
const redirectUrl = "https://google.com";
const formSubmissionWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2M1MjY1NTUzZDUxMzci_pc";
const paymentDetailsWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2M1MjY1NTUzZDUxMzci_pc";
const apiKey = "rzp_test_6yEg7KBlHdDa7q";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";
const baseUrl = "https://instamojopaymentsetup-test.onrender.com";
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

const onSubmitHandler = (e) => {
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

  data = {
    name,
    email,
    phone,
    amount: addOn.checked ? (Number(amount) + Number(bumpAmount)) * 100 : Number(amount) * 100,
    purpose,
    clientName,
    redirectUrl,
    formSubmissionWebhook,
    paymentDetailsWebhook,
    apiKey,
    userImage,
    baseUrl,
  };

  const options = {
    key: apiKey,
    amount: data.amount,
    currency: "INR",
    name: data.name,
    description: purpose,
    image: userImage,
    handler: function (response) {
      fetch(paymentDetailsWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((response) => response.json())
        .then((response) => {
          window.location.href = redirectUrl;
        })
        .catch((error) => console.error("Error:", error));
    },
    prefill: {
      name: data.name,
      email: data.email,
      contact: data.phone,
    },
    notes: {
      address: "note value",
    },
    theme: {
      color: "#F37254",
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    console.error(response.error);
  });

  rzp1.open();
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