document.getElementById("form").addEventListener("submit",
    function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        console.log("form data", formData)

        fetch("/auth/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the backend (e.g., show a success message or redirect to a new page)
                console.log("User registered successfully:", data);
                localStorage.setItem('id', data.id);
                window.location.href = "/auth/sign-in"
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error("Error occurred during signup:", error);
            });
    });

const button = document.getElementById("sign-in-button");
button.addEventListener("click", () => {
    window.location.href = '/auth/sign-in';
})