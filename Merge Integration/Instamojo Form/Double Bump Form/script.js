// Put this whole code in Custom Javascript Footer, before pasting this add a <script>paste your code in between this</script>

const clientName = "RAVI";
let amount = "199";
let bumpAmount = "199";
let bumpAmount2 = "299";
const purpose = "test";
const redirectUrl = "https://google.com";
const redirectUrlBump = "https://google1.com"
const redirectUrlBump2 = "https://google2.com"
const userDetailWebhook =
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNTUxMzUi_pc";
const paymentDetailWebhook =
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzEi_pc";
const checkPaymentWebhook =
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTZhMDYzMjA0MzY1MjY1NTUzNjUxMzQi_pc";
const userImage = "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg";
const baseUrl = "https://growthifymedia-services.onrender.com";
let data;

const form = document.getElementById("details");
const paymentButton = document.getElementById("payment");
const bump = document.getElementById("bump");
const bump2 = document.getElementById("bump2");
const addOn = document.getElementById("addOn");
const addOn2 = document.getElementById("addOn2");
const amountValue = document.getElementsByClassName("amount")[0];
const totalAmountValue = document.getElementsByClassName("total-amount")[0];

amountValue.innerText = `₹${amount}.00`;
totalAmountValue.innerText = `₹${amount}.00`;
paymentButton.innerText = `Pay ₹${amount}`;

const updateAmount = () => {
    let newAmount = Number(amount);

    if (addOn.checked) {
        newAmount += Number(bumpAmount);
    }

    if (addOn2.checked) {
        newAmount += Number(bumpAmount2);
    }

    amountValue.innerText = `₹${newAmount}.00`;
    totalAmountValue.innerText = `₹${newAmount}.00`;
    paymentButton.innerText = `Pay ₹${newAmount}`;
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
        amount: Number(totalAmountValue.innerText.split("₹")[1].split(".")[0]),
        purpose,
        redirectUrl: addOn.checked && addOn2.checked ? redirectUrlBump2 :
            addOn.checked ? redirectUrlBump :
                addOn2.checked ? redirectUrlBump2 : redirectUrl,
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

    console.log(data);

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

bump2.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.id !== "addOn2") {
        addOn2.checked = !addOn2.checked;
        updateAmount();
    }
})

addOn2.addEventListener("click", (e) => {
    e.stopPropagation();
    addOn2.checked = !addOn2.checked;
    updateAmount();
})