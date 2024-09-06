const clientName = "AMARESH";
const baseUrl = "https://growthifymedia-services.onrender.com";

const form = document.getElementById("details");
const packageTypeRadios = form.packageType;
const packageFeaturesDiv = document.getElementById("packageFeatures");
const couponCodeInput = document.getElementById("couponCode");
const applyCouponButton = document.getElementById("applyCoupon");
const couponMessage = document.getElementById("couponMessage");
const discountRow = document.getElementById("discountRow");
const paymentButton = document.getElementById("payment");

// Coupon codes and their discount percentages
const coupons = {
    "SAVE10": 10,
    "SAVE20": 20,
    "HALFOFF": 50
};

const packageConfig = {
    classic: {
        amount: "197",
        purpose: "2 Days live workshop",
        redirectUrl: "https://webinar.ravirkumar.com/2days-ws-ty",
        userDetailWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc",
        paymentDetailWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc",
        checkPaymentWebhook: "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc",
        features: [
            "SAFAL BUSINESS MASTERY VIDEO COURSE WORTH Rs.5000/_",
            "Action workbook Hard copy worth Rs.5000/_",
            "Basic Study Materials"
        ]
    }
};

let currentConfig = packageConfig.classic; // Default to classic package
let appliedDiscount = 0;
let appliedCouponCode = "";

const updateUIForPackage = (config) => {
    const originalAmount = parseFloat(config.amount);
    const discountedAmount = originalAmount - appliedDiscount;
    const gst = Number(originalAmount) * 0.18;

    document.getElementsByClassName("gst")[0].innerText = `+₹${gst.toFixed(2)}`;
    document.getElementsByClassName("amount")[0].innerText = `₹${originalAmount.toFixed(2)}`;
    document.getElementsByClassName("total-amount")[0].innerText = `₹${(discountedAmount + gst).toFixed(2)}`;
    paymentButton.innerText = `Pay ₹${discountedAmount.toFixed(2)}`;

    if (appliedDiscount > 0) {
        discountRow.classList.remove("hidden");
        document.getElementsByClassName("discount-amount")[0].innerText = `-₹${appliedDiscount.toFixed(2)}`;
    } else {
        discountRow.classList.add("hidden");
    }

    packageFeaturesDiv.innerHTML = `
    <h3 class="font-semibold mb-2">${config === packageConfig.classic ? 'Classic' : 'Premium'} Package Features:</h3>
    <ul class="list-disc pl-5">
      ${config.features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
  `;
};

const setPackageType = (packageType) => {
    if (packageConfig[packageType]) {
        document.getElementById(packageType).checked = true;
        currentConfig = packageConfig[packageType];
        updateUIForPackage(currentConfig);
    } else {
        console.error(`Invalid package type: ${packageType}`);
    }
};

Array.from(packageTypeRadios).forEach(radio => {
    radio.addEventListener('change', (event) => {
        setPackageType(event.target.value);
        applyCoupon(); // Reapply coupon when package changes
    });
});

setPackageType('classic');

const getInput = (name) => document.getElementById(name);

const setBorder = (input, value) => {
    input.style.border = value;
};

const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return name.trim() !== "" && nameRegex.test(name.trim());
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^[5-9][0-9]{9}$/;
    const sequentialPattern = /(.)\1{9}/;
    return phoneRegex.test(phone) && !sequentialPattern.test(phone);
};

const validateField = (fieldName, validationFunc, errorMessage) => {
    const field = getInput(fieldName);
    const errorElement = getInput(`${fieldName}Error`);
    const value = field.value.trim();

    if (!validationFunc(value)) {
        errorElement.style.display = "flex";
        setBorder(field, "1px solid red");
        field.oninput = () => {
            errorElement.style.display = "none";
            setBorder(field, "");
        };
        return false;
    }
    return true;
};

const applyCoupon = () => {
    const couponCode = couponCodeInput.value.trim().toUpperCase();
    const originalAmount = parseFloat(currentConfig.amount);

    if (coupons.hasOwnProperty(couponCode)) {
        const discountPercentage = coupons[couponCode];
        appliedDiscount = (originalAmount * discountPercentage) / 100;
        appliedCouponCode = couponCode;
        couponMessage.textContent = `Coupon applied! You saved ₹${appliedDiscount.toFixed(2)}`;
        couponMessage.className = "text-green-500 text-sm mt-1";
    } else if (couponCode === "") {
        appliedDiscount = 0;
        appliedCouponCode = "";
        couponMessage.textContent = "";
    } else {
        appliedDiscount = 0;
        appliedCouponCode = "";
        couponMessage.textContent = "Invalid coupon code.";
        couponMessage.className = "text-red-500 text-sm mt-1";
    }

    updateUIForPackage(currentConfig);
};

applyCouponButton.addEventListener("click", applyCoupon);

paymentButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const isValid = [
        validateField("name", isValidName, "Please enter a valid name"),
        validateField("email", isValidEmail, "Please enter a valid email"),
        validateField("phone", isValidPhone, "Please enter a valid 10-digit phone number")
    ].every(Boolean);

    if (isValid) {
        paymentButton.disabled = true;
        paymentButton.style.opacity = 0.7;
        paymentButton.innerText = "Submitting...";

        const urlParams = new URLSearchParams(window.location.search);
        const formData = {
            name: form.name.value.trim(),
            amount: (parseFloat(currentConfig.amount) - appliedDiscount + gst).toFixed(2),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            purpose: currentConfig.purpose,
            redirectUrl: currentConfig.redirectUrl,
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
            couponCode: appliedCouponCode,
            discountAmount: appliedDiscount
        };

        const updatedData = {
            formData,
            userDetailWebhook: currentConfig.userDetailWebhook,
            paymentDetailWebhook: currentConfig.paymentDetailWebhook,
            checkPaymentWebhook: currentConfig.checkPaymentWebhook,
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            console.log(jsonData);
            window.location.href = jsonData.data;
        } catch (error) {
            console.error("Error during payment processing:", error);
            alert("An error occurred while processing your payment. Please try again.");
        } finally {
            paymentButton.style.opacity = 1;
            paymentButton.innerText = `Pay ₹${(parseFloat(currentConfig.amount) - appliedDiscount).toFixed(2)}`;
            paymentButton.disabled = false;
        }
    }
});