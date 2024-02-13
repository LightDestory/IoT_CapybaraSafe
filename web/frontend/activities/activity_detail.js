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
    // In questo caso, useremo i mock data al posto di una richiesta al server
    const activityDetails = mockActivityDetails;


    const activityDetailsContainer = document.getElementById('activity-details');
    activityDetailsContainer.innerHTML = `
        <h2>${activityDetails.text_description}</h2>
        <p><strong>Duration:</strong> ${activityDetails.duration_minute} minutes</p>
        <p><strong>Scheduled Date:</strong> ${activityDetails.scheduled_date}</p>
       <p><strong>Status:</strong> 
            <select id="statusDropdown">
                <option value="in progress">In Progress</option>
                <option value="to be completed">To be Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
            </select>
        </p>
        <button class="btn btn-primary" id="updateButton">Aggiorna</button>       
    `;
    // Imposta il valore iniziale del menu a tendina con lo stato corrente dell'attività
    document.getElementById('statusDropdown').value = activityDetails.status;

    // Aggiungi un listener per il pulsante "Aggiorna"
    document.getElementById('updateButton').addEventListener('click', function () {
        // Recupera il nuovo stato selezionato dal menu a tendina
        const selectedStatus = document.getElementById('statusDropdown').value;

        // Aggiorna lo stato dell'attività 
        console.log("Nuovo stato selezionato:", selectedStatus);
        window.location.href = '../activities/index.html';
    });
});
