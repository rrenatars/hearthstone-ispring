document.getElementById("form").addEventListener("submit", function (event) {
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
            localStorage.setItem('id', data.id);
            localStorage.setItem("token", data.token);
            // Переход на другую страницу после успешного входа
            window.location.href = "/menu";
        })
        .catch(error => {
            document.getElementById("errorMessage").innerText = "Sign-in failed. Please check your credentials.";
            document.getElementById("errorMessage").style.display = "block";
            console.error("Error:", error);
        });
});
const button = document.getElementById("sign-up-button");
button.addEventListener("click", () => {
    window.location.href = 'sign-up';
})