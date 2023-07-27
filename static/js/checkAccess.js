// // Функция для проверки доступа пользователя к защищенной странице
// let value
// function checkAccessToProtectedPage() {
//     // Функция для чтения значения из cookie по его имени
//     function getCookie(name) {
//         value = "; " + document.cookie;
//         const parts = value.split("; " + name + "=");
//         if (parts.length === 2) return parts.pop().split(";").shift().trim();
//         return "";
//     }
//
//     // Функция для добавления токена в заголовок "Authorization"
//     function addAuthorizationHeader() {
//         const token = getCookie("token");
//         if (token) {
//             return {
//                 "Authorization": "Bearer " + token
//             };
//         }
//         return {};
//     }
//
//     console.log(addAuthorizationHeader())
//     // Используем функцию addAuthorizationHeader() для добавления токена в заголовок
//     fetch("/protected/menu", {
//         headers: addAuthorizationHeader()
//     })
//         .then(response => {
//             if (!response.ok) {
//                 // Перенаправляем пользователя на страницу "/" или "/auth/"
//                 // window.location.href = "/";
//                 // или
//                 window.location.href = "/";
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Response:", data);
//             // Доступ разрешен - выполните дополнительные действия, если необходимо
//         })
//         .catch(error => {
//             console.log("fjajfa")
//             console.error("Error:", error);
//         });
// }
//
// // Вызываем функцию проверки доступа при загрузке страницы
// checkAccessToProtectedPage();

// Замените 'YOUR_TOKEN_HERE' на фактический токен, который вы хотите использовать для аутентификации.
// Функция для получения защищенной страницы '/menu' с аутентификацией.
export async function fetchProtectedMenu() {
    try {
        function getCookie(name) {
            const value = document.cookie;
            console.log(value, "cookie")
            // const parts = value.split("; " + name + "=");
            // console.log("parts", parts)
            // if (value) return value.pop().split(";").shift().trim();
            const tokenValue = value.split('=')[1];
            return tokenValue;
        }

        // Функция для добавления токена в заголовок "Authorization"
        // function addAuthorizationHeader() {
        //     const token = getCookie("token");
        //     if (token) {
        //         return {
        //              + token
        //         };
        //     }
        //     return {};
        // }

        const token = {
            token: "Authorization: Bearer " + getCookie()
        }

        console.log("token.token", token)

        const request = new Request('/protected/menu', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(token)
        });

        console.log(request, "request")

        // Затем выполните запрос с использованием объекта запроса
        const response = await fetch(request);

        if (response.ok) {
            const data = await response.json();
            console.log("fjdajf", data); // Обработайте данные ответа здесь.
        } else {
            console.error('Не удалось получить защищенное меню:', response.statusText);
            // Обработайте ошибку здесь.
        }
    } catch (error) {
        console.error('Ошибка при получении защищенного меню:', error);
        // Обработайте ошибку здесь.
    }
}