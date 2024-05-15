document.getElementById("fallback").style =
  "height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center";
document.getElementById("container").style = "display: none";
let formData;
let amount = "100";
const clientName = "GARIMAARORA";
const baseUrl = "http://localhost:3000";
const description = "test";
const formSubmissionWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2Q1MjZkNTUzMzUxM2Ei_pc";
const paymentDetailsWebhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0M2Q1MjZkNTUzYzUxMzEi_pc";
const apiKey = "rzp_test_skM71oyLuEDDnC";
const redirectUrl = "https://workshop.catapan.in/welcome";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";

const paymentButton = document.getElementById("payment");

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const form = document.getElementById("details");

const postDataToWebhook = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();

    if (responseData.success) {
      // Success message handling
      console.log("Data posted successfully to webhook:", responseData.message);
    } else {
      // Failure message handling
      console.error("Error occurred:", responseData.error);
    }
  } catch (error) {
    // Network error handling
    console.error("Error!", error.message);
  }
};

const postUserDetailsToWebhook = async () => {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();

  const urlParams = new URLSearchParams(window.location.search);

  formData = {
    name,
    email,
    phone,
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_adgroup: urlParams.get("utm_adgroup"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
    utm_id: urlParams.get("utm_id"),
    adsetname: urlParams.get("adset name"),
    adname: urlParams.get("ad name"),
    landingPageSource: window.location.href,
  };

  const webhookUrl = `${baseUrl}/api/payments/new/razorpay/saveUser/${clientName}`;

  await postDataToWebhook(webhookUrl, {
    webhook: formSubmissionWebhook,
    formData,
  });
};

var options = {
  key: apiKey,
  amount,
  currency: "INR",
  description,
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
    document.getElementById("fallback").style =
      "height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center";
    document.getElementById("container").style = "display: none";
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
    if (verificationData.success) {
      await fetch(
        `${baseUrl}/api/payments/new/razorpay/savePayment/${clientName}/${paymentId}/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook: paymentDetailsWebhook,
            formData,
          }),
        }
      );
      window.location.href =
        `${redirectUrl}?name=${form.name.value.trim()}&email=${form.email.value.trim()}&phone=${form.phone.value.trim()}&paymentId=` +
        paymentId;
    }
  },

  modal: {
    ondismiss: function () {
      paymentButton.disabled = false;
    },
  },
};

document.getElementById("payment").onclick = async function (e) {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
  };

  const getInput = (name) => {
    return document.getElementById(name);
  };

  const setBorder = (input, value) => {
    input.style.border = value;
    input.onchange = function () {
      input.style.border = "";
      paymentButton.disabled = false;
    };
  };

  for (const [key, value] of Object.entries(formData)) {
    const input = getInput(key);
    if (value === "") {
      setBorder(input, "1px solid red");
      return;
    }
  }

  if (isValidEmail(formData.email) && isValidPhone(formData.phone)) {
    paymentButton.disabled = true;
    paymentButton.style.opacity = 0.5;
    paymentButton.innerText = "Processing...";
    //creating a new order
    const order = await fetch(
      `${baseUrl}/api/payments/new/razorpay/createOrder/${clientName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      }
    );

    const result = await order.json();
    console.log(result.message);
    options.prefill = {
      email: form.email.value.trim(),
      contact: form.phone.value.trim(),
    };
    options.order_id = result.order.id;
    const rzp1 = new Razorpay(options);
    await postUserDetailsToWebhook();
    rzp1.open();
    paymentButton.style.opacity = 1;
    paymentButton.innerText = "Pay Now";
  } else {
    alert("Invalid email or phone");
  }
};
