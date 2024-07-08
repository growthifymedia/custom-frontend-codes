const redirectUrl = "https://google.com"
const webhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzNDA0MzI1MjY1NTUzMzUxMzMi_pc"
const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");

const getInput = (name) => {
    return document.getElementById(name);
};

const setBorder = (input, value) => {
    input.style.border = value;
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

paymentButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        reference: form.reference.value.trim(),
    };

    let isValid = true;

    if(formData.reference === "default") {
        const referenceError = getInput("referenceError");
        referenceError.style.display = "flex";
        const input = getInput("reference");
        input.oninput = function () {
            referenceError.style.display = "none";
            setBorder(input, "");
        }
        setBorder(input, "1px solid red");
        isValid = false;
    }


    if (!formData.name) {
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
        paymentButton.innerText = "Submitting...";
        paymentButton.style.cursor = "not-allowed";
        paymentButton.style.backgroundColor = "#ccc";
        const urlParams = new URLSearchParams(window.location.search);

        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            reference: formData.reference,
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

        try {
            const response = await fetch(
                webhook,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            console.log(
                "Sent request to webhook for posting data at: ",
                new Date()
            );
            console.log("Response status:", response);
            console.log("Response text:", await response.text());
            paymentButton.disabled = false;
            paymentButton.innerText = "Submit";
            paymentButton.style.cursor = "pointer";
            paymentButton.style.backgroundColor = "black";
            window.location.href = redirectUrl
            // window.location.href = `https://pages.razorpay.com/pl_O5Xf3LtT0Orjcx/view?full_name_you_are_using=${formData.name}&email=${formData.email}&phone=${formData.phone}&select=Numerology%20Report`;
        } catch (error) {
            console.log(error);
        }
    }
});