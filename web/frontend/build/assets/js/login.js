async function tryLogin() {
    const endpoint = document.getElementById("endpoint").value;
    const token = document.getElementById("token").value;
    const loginButton = document.getElementById("login_button");
    setCookie("endpoint", endpoint, 7);
    setCookie("token", token, 7);
    loginButton.disabled = true;
    const success = await checkAuth();
    if (success) {
        window.location.href = "/dashboard/index.html";
    } else {
        loginButton.disabled = false;
    }
}