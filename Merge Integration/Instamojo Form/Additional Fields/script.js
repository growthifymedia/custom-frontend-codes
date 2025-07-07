  const clientName = "GEETHA";
  const amount = "9";
  const purpose = "Confident Queen Community";
  const redirectUrl = "https://link.geethamikkilineni.in/ty-page";
  const userDetailWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZiMDYzMDA0M2Q1MjY4NTUzMDUxMzMi_pc";
  const paymentDetailWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZiMDYzMDA0M2Q1MjZhNTUzMjUxMzYi_pc";
  const checkPaymentWebhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZjMDYzZTA0MzA1MjY4NTUzMjUxMzIi_pc";
  const baseUrl = "https://growthifymedia-services.onrender.com";

  const form = document.getElementById("details");
  const paymentButton = document.getElementById("payment");
  const genderSelect = document.getElementById("gender");
  const additionalFields = document.getElementById("additional-fields");

  genderSelect.addEventListener("change", () => {
    if (genderSelect.value === "Male" || genderSelect.value === "Female") {
      additionalFields.style.display = "block";
    } else {
      additionalFields.style.display = "none";
    }
  });

  const getInput = (name) => document.getElementById(name);
  const setBorder = (input, value) => input.style.border = value;

  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[5-9][0-9]{9}$/.test(phone) && !/(.)\1{9}/.test(phone);
  const isValidAge = (age) => age >= 18 && age <= 100;
  const isValidOccupation = (occupation) => occupation.trim() !== "";
  const isValidCity = (city) => city.trim() !== "";
  const isValidInvestment = (investment) => investment !== "";

  paymentButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      gender: form.gender.value.trim(),
      age: form.age?.value.trim(),
      occupation: form.occupation?.value.trim(),
      city: form.city?.value.trim(),
      investment: form.investment?.value.trim(),
    };

    let isValid = true;

    if (!isValidName(formData.name)) {
      const input = getInput("name");
      getInput("nameError").style.display = "flex";
      input.oninput = () => { getInput("nameError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidEmail(formData.email)) {
      const input = getInput("email");
      getInput("emailError").style.display = "flex";
      input.oninput = () => { getInput("emailError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidPhone(formData.phone)) {
      const input = getInput("phone");
      getInput("phoneError").style.display = "flex";
      input.oninput = () => { getInput("phoneError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidAge(formData.age)) {
      const input = getInput("age");
      getInput("ageError").style.display = "flex";
      input.oninput = () => { getInput("ageError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidOccupation(formData.occupation)) {
      const input = getInput("occupation");
      getInput("occupationError").style.display = "flex";
      input.oninput = () => { getInput("occupationError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidCity(formData.city)) {
      const input = getInput("city");
      getInput("cityError").style.display = "flex";
      input.oninput = () => { getInput("cityError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (!isValidInvestment(formData.investment)) {
      const input = getInput("investment");
      getInput("investmentError").style.display = "flex";
      input.oninput = () => { getInput("investmentError").style.display = "none"; setBorder(input, ""); };
      setBorder(input, "1px solid red");
      isValid = false;
    }

    if (isValid) {
      paymentButton.disabled = true;
      paymentButton.style.opacity = 0.7;
      paymentButton.innerText = "Submitting...";

      const urlParams = new URLSearchParams(window.location.search);
      const data = {
        ...formData,
        amount,
        purpose,
        redirectUrl,
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        utm_adgroup: urlParams.get("utm_adgroup"),
        utm_content: urlParams.get("utm_content"),
        utm_term: `gender=${formData.gender}&age=${formData.age}&occupation=${formData.occupation}&city=${formData.city}&investment=${formData.investment}`,
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
        const jsonData = await response.json();
        window.location.href = jsonData.data;
      } catch (error) {
        alert("Some error occurred! Please retry");
        console.error(error);
        paymentButton.disabled = false;
        paymentButton.style.opacity = 1;
        paymentButton.innerText = `Pay ₹${amount}`;
      }
    }
  });
