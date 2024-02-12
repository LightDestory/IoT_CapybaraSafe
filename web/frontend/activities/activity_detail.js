document.addEventListener('DOMContentLoaded', function () {
    // Recupera l'ID dell'attività dalla query string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const activityId = urlParams.get('activityId');

    // Mock data per simulare i dettagli dell'attività
    const mockActivityDetails = {
        id: 1,
        text_description: "Task 1",
        duration_minute: 60,
        scheduled_date: "2024-02-10",
        status: "in progress"
        // Altri dettagli dell'attività possono essere aggiunti qui
    };

    // Fetch activity details from the server (puoi usare AJAX, fetch o altri metodi)
    // In questo caso, useremo i mock data al posto di una richiesta al server
    const activityDetails = mockActivityDetails;


    const activityDetailsContainer = document.getElementById('activity-details');
    activityDetailsContainer.innerHTML = `
        <h2>${activityDetails.text_description}</h2>
        <p><strong>Duration:</strong> ${activityDetails.duration_minute} minutes</p>
        <p><strong>Scheduled Date:</strong> ${activityDetails.scheduled_date}</p>
        <p><strong>Status:</strong> ${activityDetails.status}</p>
        <!-- Altri dettagli dell'attività possono essere aggiunti qui -->
    `;
});
