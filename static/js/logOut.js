function clearAllUserData() {
    // Очистка кук
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // Очистка localStorage
    localStorage.clear();
}

// Обработчик для кнопки "Log Out"
document.getElementById("openLogOutPageButton").addEventListener("click", function () {
    clearAllUserData();
    window.location.href = "/auth/sign-in"; // Перенаправляем пользователя на страницу входа после логаута
});
