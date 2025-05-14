const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const errorText = document.getElementById("error");
const successText = document.getElementById("success");
const submitBtn = document.getElementById("submit-btn");

const API_URL = window.API_URL;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const phone = phoneInput.value.trim();

  errorText.textContent = "";
  successText.textContent = "";
  errorText.style.display = "none";
  successText.style.display = "none";

  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    const response = await fetch(`${API_URL}/userRoutes.php?action=add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone }), // no 'role'
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Signup failed");
    }

    successText.textContent = "Signup successful! Redirecting...";
    successText.style.display = "block";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 2000);
  } catch (error) {
    errorText.textContent = error.message;
    errorText.style.display = "block";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
  }
});