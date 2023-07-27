// Функция для проверки доступа пользователя к защищенной странице
let value
function checkAccessToProtectedPage() {
    // Функция для чтения значения из cookie по его имени
    function getCookie(name) {
        value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift().trim();
        return "";
    }

    // Функция для добавления токена в заголовок "Authorization"
    function addAuthorizationHeader() {
        const token = getCookie("token");
        if (token) {
            return {
                "Authorization": "Bearer " + token
            };
        }
        return {};
    }

    console.log(addAuthorizationHeader())
    // Используем функцию addAuthorizationHeader() для добавления токена в заголовок
    fetch("/protected/menu", {
        headers: addAuthorizationHeader()
    })
        .then(response => {
            if (!response.ok) {
                // Перенаправляем пользователя на страницу "/" или "/auth/"
                // window.location.href = "/";
                // или
                window.location.href = "/";
            }
            return response.json();
        })
        .then(data => {
            console.log("Response:", data);
            // Доступ разрешен - выполните дополнительные действия, если необходимо
        })
        .catch(error => {
            console.log("fjajfa")
            console.error("Error:", error);
        });
}

// Вызываем функцию проверки доступа при загрузке страницы
checkAccessToProtectedPage();