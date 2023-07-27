document.getElementById("signupForm").addEventListener("submit",
    function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

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
                window.location.href = "/auth/sign-in"
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error("Error occurred during signup:", error);
            });
    });