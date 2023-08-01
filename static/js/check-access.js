async function fetchProtectedMenu() {
    try {
        function getCookie() {
            const value = document.cookie;
            const tokenValue = value.split('=')[1];
            return tokenValue;
        }

        console.log("cookie", getCookie())

        let token = localStorage.getItem('token')

        const request = new Request('/protected/', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const response = await fetch(request);

        if (response.ok) {

        } else {
            console.error('Не удалось получить защищенное меню:', response.statusText);
            // Обработайте ошибку здесь.
            window.location.href = "/"
        }
    } catch (error) {
        console.error('Ошибка при получении защищенного меню:', error);
        // Обработайте ошибку здесь.
    }
}

fetchProtectedMenu();
