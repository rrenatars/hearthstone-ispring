document.getElementById("button-sign-in").addEventListener("click",
    function() {
        window.location.href = "/auth/sign-in"
        // Perform the GET request when the button is clicked
        fetch("/auth/sign-in", {
            method: "GET"
        })
            .then(response => response.text())
            .then(data => {
                // Redirect to the response URL
                window.location.href = data;
            })
            .catch(error => console.error("Error:", error));
    });

document.getElementById("button-sign-up").addEventListener("click",
    function() {
        window.location.href = "/auth/sign-up"
        // Perform the GET request when the button is clicked
        fetch("/auth/sign-up", {
            method: "GET"
        })
            .then(response => response.text())
            .then(data => {
                // Redirect to the response URL
                window.location.href = data;
            })
            .catch(error => console.error("Error:", error));
    });
