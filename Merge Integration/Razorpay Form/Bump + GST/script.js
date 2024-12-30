// Configuration
const clientName = "STOCKTUTOR";
let amount = "199";
let bumpAmount = "199";
const purpose = "test";
const redirectUrl = "https://google.com";
const redirectUrlBump = "https://google.com";
const formSubmissionWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMDA0MzI1MjY1NTUzNjUxM2Ei_pc";
const paymentDetailsWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMDA0MzM1MjZhNTUzNjUxM2Ii_pc";
const apiKey = "rzp_live_zT6qxWnoCMD9tU";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";
const baseUrl = "https://growthifymedia-services.onrender.com";
const GST_RATE = 0.18; // Made GST rate a constant for easier maintenance

// DOM Elements
const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");
const bump = document.getElementById("bump");
const addOn = document.getElementById("addOn");
const amountValue = document.getElementsByClassName("amount")[0];
const totalAmountValue = document.getElementsByClassName("total-amount")[0];
const gstValue = document.getElementsByClassName("gst")[0];

// Calculate initial GST
let gst = Number(amount) * GST_RATE;

// Helper function to format currency
const formatCurrency = (value) => `₹${Number(value).toFixed(2)}`;

// Helper function to calculate total with GST
const calculateTotalWithGST = (baseAmount) => {
    const gstAmount = Number(baseAmount) * GST_RATE;
    return Number(baseAmount) + gstAmount;
};

// Initialize display values
const updateDisplayValues = (baseAmt, withGST = true) => {
    const gstAmount = withGST ? Number(baseAmt) * GST_RATE : 0;
    const total = Number(baseAmt) + gstAmount;
    
    amountValue.innerText = formatCurrency(baseAmt);
    gstValue.innerText = formatCurrency(gstAmount);
    totalAmountValue.innerText = formatCurrency(total);
    paymentButton.innerText = `Pay ${formatCurrency(total)}`;
    
    return total;
};

// Initial display update
updateDisplayValues(amount);

// Update amounts when bump offer is toggled
const updateAmount = () => {
    const baseAmount = addOn.checked ? Number(amount) + Number(bumpAmount) : Number(amount);
    const total = updateDisplayValues(baseAmount);
    return total;
};

// Payment gateway options
let options = {
    key: apiKey,
    amount: (Number(amount) * 100).toFixed(0),
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
        try {
            const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = response;
            
            form.style.display = "none";
            document.getElementById("loader-container").style.display = "flex";

            const verification = await fetch(
                `${baseUrl}/api/payments/new/razorpay/verify/${clientName}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature }),
                }
            );

            const verificationData = await verification.json();
            console.log(verificationData);
            
            window.location.href = addOn.checked ? redirectUrlBump : redirectUrl;
        } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
        } finally {
            paymentButton.disabled = false;
            paymentButton.style.opacity = 1;
            updateAmount();
        }
    },
    modal: {
        ondismiss: function () {
            paymentButton.disabled = false;
            paymentButton.style.opacity = 1;
            updateAmount();
        },
    },
};

// Form validation helpers
const isValidName = (name) => {
    return name.trim() !== "" && /^[a-zA-Z\s]+$/.test(name.trim());
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
};

// Form submission handler
const onSubmitHandler = async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");

    // Validation
    const validations = [
        { isValid: isValidName(name), error: nameError },
        { isValid: isValidEmail(email), error: emailError },
        { isValid: isValidPhone(phone), error: phoneError }
    ];

    const isValid = validations.every(({ isValid, error }) => {
        error.classList.toggle("hidden", isValid);
        return isValid;
    });

    if (!isValid) return;

    try {
        paymentButton.disabled = true;
        paymentButton.style.opacity = 0.7;
        paymentButton.innerText = "Submitting...";

        const urlParams = new URLSearchParams(window.location.search);
        const currentTotal = calculateTotalWithGST(addOn.checked ? Number(amount) + Number(bumpAmount) : Number(amount));

        const data = {
            name,
            email,
            phone,
            amount: Math.round(currentTotal * 100), // Convert to paise and include GST
            purpose,
            utm_source: urlParams.get("utm_source"),
            utm_medium: urlParams.get("utm_medium"),
            utm_campaign: urlParams.get("utm_campaign"),
            utm_adgroup: urlParams.get("utm_adgroup"),
            utm_content: urlParams.get("utm_content"),
            utm_term: urlParams.get("utm_term"),
            utm_id: urlParams.get("utm_id"),
            adsetname: urlParams.get("adset name"),
            adname: urlParams.get("ad name"),
            landingPageUrl: window.location.href.split("?")[0],
        };

        const response = await fetch(
            `${baseUrl}/api/payments/new/razorpay/createOrder/${clientName}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formData: data,
                    userWebhook: formSubmissionWebhook,
                    paymentWebhook: paymentDetailsWebhook,
                }),
            }
        );

        const result = await response.json();
        if (result?.order?.id) {
            options.prefill = {
                email: email,
                contact: phone,
            };
            options.amount = data.amount;
            options.order_id = result.order.id;
            const rzp1 = new Razorpay(options);
            rzp1.open();
        } else {
            throw new Error("Unable to retrieve order ID");
        }
    } catch (error) {
        console.error("Payment initiation failed:", error);
        alert("Unable to initiate payment. Please try again.");
    } finally {
        paymentButton.disabled = false;
        paymentButton.style.opacity = 1;
        updateAmount();
    }
};

// Event Listeners
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