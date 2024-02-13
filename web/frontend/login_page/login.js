document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verifica delle credenziali
        if (username === 'root' && password === 'root') {
            // Credenziali corrette, reindirizza all'app delle attività
            window.location.href = '../activities/index.html';

        } else {
            // Credenziali errate, mostra un messaggio di errore
            loginError.textContent = 'Invalid username or password';
        }
    });
});
