// Check if Auth cookies exist and handle redirections
async function checkAuth() {
    const endpointCookie = getCookie("endpoint");
    const tokenCookie = getCookie("token");
    const current_location = window.location.pathname;
    if ((!endpointCookie || !tokenCookie) && current_location  !== "/index.html") {
        console.log("The 'endpoint' and/or 'token' cookies are not set. Redicting to the login page...");
        eraseCookie("endpoint");
        eraseCookie("token");
        window.location.href = "/index.html";
        return;
    }
    if (endpointCookie && tokenCookie) {
        console.log("The 'endpoint' and 'token' cookies are set. Checking authorization...");
        let response = await APICaller(endpointCookie, "/api/ping", "GET");
        if (response.status === "success") {
            if(current_location === "/index.html") {
                window.location.href = "/activities";
            }
            return true;
        } else {
            let unauth_text = `Authorization failed, returning to login page...`
            let do_redirect = true;
            if (current_location === "/index.html") {
                do_redirect = false;
                unauth_text = `Authorization failed`
            }
            Toastify({
                text: unauth_text,
                duration: 3000,
                gravity: "top",
                position: "center",
            }).showToast();
            if (do_redirect) {
                eraseCookie("endpoint");
                eraseCookie("token");
                await new Promise((resolve) => setTimeout(resolve, 3200));
                window.location.href = "/index.html";
            }
        }
    }
}

// Function to save a data in a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to search for a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Function to force the deletion of a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// API Caller function
async function APICaller(endpoint, route, method, params = {}) {
    let fetch_error = false;
    if (!endpoint.startsWith("http://") || !endpoint.startsWith("https://")) {
        endpoint = "http://" + endpoint;
    }
    const url = new URL(endpoint + route);
    if (method === 'GET') {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }
    const response = await fetch(url,
        {
            method: method,
            headers: { 'Authorization': getCookie("token") },
            body: method !== 'GET' ? JSON.stringify(params) : null
        })
        .then(response => response.json())
        .catch(() => { fetch_error = true; });
    if (fetch_error) {
        console.error('Unable to contact endpoint!');
        Toastify({
            text: "Unable to contact endpoint, returning to login page...",
            duration: 3000,
            gravity: "top",
            position: "center",
        }).showToast();
        eraseCookie("endpoint");
        eraseCookie("token");
        await new Promise((resolve) => setTimeout(resolve, 3200));
        window.location.href = "/index.html";
    }
    return response;
}

// Check authorization
checkAuth();
