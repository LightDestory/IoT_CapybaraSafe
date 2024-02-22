async function tryLogin() {
    let endpoint = document.getElementById("endpoint").value;
    let token = document.getElementById("token").value;
    let loginButton = document.getElementById("login_button");
    setCookie("endpoint", endpoint, 7);
    setCookie("token", token, 7);
    loginButton.disabled = true;
    let success = await checkAuth();
    if (success) {
        window.location.href = "/dashboard/index.html";
    } else {
        loginButton.disabled = false;
    }
}