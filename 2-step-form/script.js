const sellerName = "STOCKTUTOR";
const redirectUrl = "https://google.com";
const webhook =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZhMDYzNjA0M2Q1MjZmNTUzMDUxM2Ii_pc";
function openModal() {
  document.getElementById("popupModal").style.display = "flex";
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("stepIndicator").innerHTML = `
    <span id="stepLabel1" class="step-label">Step 1</span>
    <i id="stepLock2" class="fas fa-lock step-icon"></i>
  `;
  document.getElementById("nextBtn").classList.remove("hidden");
}
function goToStep2() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !phone || !password) {
    alert("Please fill all fields.");
    return;
  }
  fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  })
    .then(() => {
      document.getElementById("step1").classList.add("hidden");
      document.getElementById("step2").classList.remove("hidden");
      document.getElementById("stepIndicator").innerHTML = `
      <i id="stepLock1" class="fas fa-lock step-icon"></i>
      <span id="stepLabel2" class="step-label">Step 2</span>
    `;
      document.getElementById("nextBtn").classList.add("hidden");
    })
    .catch((err) => {
      alert("Something went wrong. Please try again.");
    });
}
function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    dob: "",
    city: "",
    purpose: "",
    favorite_food: "",
    revenue: "",
    challenge: "",
    profitable: "",
  };
}
async function submitStep2() {
  const payload = getFormData();
  const urlParams = new URLSearchParams(window.location.search);
  payload.utmParams = {
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_adgroup: urlParams.get("utm_adgroup"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
    adsetName: urlParams.get("adset name"),
    adName: urlParams.get("ad name"),
  };
  try {
    const res = await fetch(
      `https://growthifymedia-services.onrender.com/api/free-lead/${sellerName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (result.success) {
      alert("Your form is Submitted");
    } else {
      alert(result.message || "Something went wrong. Try again.");
    }
  } catch (err) {
    alert("Submission failed. Try again.");
  }
}
