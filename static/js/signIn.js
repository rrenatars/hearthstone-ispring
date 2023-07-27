import {fetchProtectedMenu} from "./checkAccess.js";

document.getElementById("signinForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    fetch("/auth/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data here (e.g., save the token in cookie, redirect to another page, etc.)
            console.log("Token:", data.token);
            document.cookie = `token=${data.token}; path=/`; // Установка cookie со значением токена

            // Переход на другую страницу после успешного входа
            fetchProtectedMenu()
            // window.location.href = "/protected/menu"; // Укажите URL страницы, на которую хотите перенаправить пользователя после успешного входа
        })
        .catch(error => {
            document.getElementById("errorMessage").innerText = "Sign-in failed. Please check your credentials.";
            document.getElementById("errorMessage").style.display = "block";
            console.error("Error:", error);
        });
});
