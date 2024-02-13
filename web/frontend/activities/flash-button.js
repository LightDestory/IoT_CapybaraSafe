// Funzione per far lampeggiare il bottone
function flashButton() {
    const flashButton = document.getElementById('flashButton');
    setInterval(() => {
        flashButton.classList.toggle('btn-outline-danger');
    }, 500);
}

// Chiamata alla funzione quando il documento è pronto
document.addEventListener('DOMContentLoaded', function () {
    flashButton();
});
