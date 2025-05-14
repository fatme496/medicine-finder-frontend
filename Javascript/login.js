document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorMsg = document.getElementById("error");
    const successMsg = document.getElementById("success");
    errorMsg.textContent = "";
    successMsg.textContent = "";

    const API_URL = window.API_URL;

    try {
        const response = await fetch(`${API_URL}/userRoutes.php?action=login`, {
            method: "POST",
            credentials: "include", // send and receive cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok) {
            errorMsg.textContent = result.error || "Login failed";
        } else {
            successMsg.textContent = result.message || "Login successful";

            // Optional: if token is returned in response body
            if (result.token) {
                localStorage.setItem("token", result.token);
            }

            // Redirect after success (optional)
            setTimeout(() => {
                window.location.href = "/html/dashboard.html"; // change as needed
            }, 1000);
        }
    } catch (err) {
        console.error("Login error:", err);
        errorMsg.textContent = "Something went wrong. Please try again.";
    }
});  