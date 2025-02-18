document.addEventListener("DOMContentLoaded", function () {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const email = document.querySelector('input[name="email"]');
    const checkbox = document.getElementById("agreeCheckbox");
    const submitButton = document.getElementById("submitButton");

    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const emailError = document.getElementById("emailError");

    let passwordTouched = false; // Flag to track if password field has been touched

    function validateUsername() {
        const usernameValue = username.value;
        if (usernameValue.includes(" ")) {
            usernameError.textContent = "Username cannot contain spaces!";
            return false;
        } else {
            usernameError.textContent = "";
            return true;
        }
    }

    function validatePassword() {
        if (!passwordTouched) return true; // Don't show error until the user interacts

        const passwordValue = password.value;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // 1 uppercase, 1 number, min 8 chars

        if (!passwordRegex.test(passwordValue)) {
            passwordError.textContent = "Password must be 8+ chars, include 1 uppercase and 1 number.";
            return false;
        } else {
            passwordError.textContent = "";
            return true;
        }
    }

    function validateEmail() {
        const emailValue = email.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Only @gmail.com allowed

        if (!emailRegex.test(emailValue)) {
            emailError.textContent = "Please enter a valid Gmail address (e.g., user@gmail.com)";
            return false;
        } else {
            emailError.textContent = "";
            return true;
        }
    }

    function validateForm() {
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        const isEmailValid = validateEmail();
        const isCheckboxChecked = checkbox.checked;

        submitButton.disabled = !(isUsernameValid && isPasswordValid && isEmailValid && isCheckboxChecked);
    }

    if (username && password && email && checkbox && submitButton) {
        username.addEventListener("input", validateForm);
        
        password.addEventListener("focus", function () {
            passwordTouched = true; // Mark password as "touched" when clicked
        });
        password.addEventListener("input", validateForm);

        email.addEventListener("input", validateForm);
        checkbox.addEventListener("change", validateForm);
    } else {
        console.error("One or more elements are missing!");
    }
});
