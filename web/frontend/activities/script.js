// Mock data JSON per simulare il riempimento della tabella
var mockData = [
    { "ID": 1, "description": "Task 1", "duration": 60, "date": "2024-02-10", "status": "in progress" },
    { "ID": 2, "description": "Task 2", "duration": 45, "date": "2024-02-11", "status": "to be completed" },
    { "ID": 3, "description": "Task 3", "duration": 30, "date": "2024-02-12", "status": "scheduled" },
    { "ID": 4, "description": "Task 4", "duration": 90, "date": "2024-02-13", "status": "completed" }
];

// Metodo insertRow e insertCell per creare dinamicamente righe e celle della tabella.
function populateTable(data) {
    var tableBody = document.getElementById("activities");

    tableBody.innerHTML = "";

    // Populate table with mock data
    data.forEach(function (activity) {
        var row = tableBody.insertRow();
        row.insertCell(0).textContent = activity.ID;
        row.insertCell(1).textContent = activity.description;
        row.insertCell(2).textContent = activity.duration;
        row.insertCell(3).textContent = activity.date;
        row.insertCell(4).textContent = activity.status;

        // Aggiungi un pulsante "View Details" con un evento click associato
        var detailsButton = document.createElement("button");
        detailsButton.textContent = "View Details";
        detailsButton.classList.add("btn", "btn-primary");
        detailsButton.addEventListener("click", function () {
            viewDetails(activity.ID);
        });

        // Inserisci il pulsante nella colonna "Action"
        row.insertCell(5).appendChild(detailsButton);
    });
}

function viewDetails(activityId) {
    // Reindirizza l'utente alla pagina di dettaglio dell'attività
    window.location.href = `activity_detail.html?activityId=${activityId}`;
}

function filterTable() {
    var statusFilter = document.getElementById("statusFilter").value;
    var filteredData;

    if (statusFilter === "all") {
        filteredData = mockData;
    } else {
        filteredData = mockData.filter(function (activity) {
            return activity.status === statusFilter;
        });
    }

    populateTable(filteredData);
}

// Creazione di un'istanza di Vue.js
var app = new Vue({
    el: '#app',
    data: {
        selectedStatus: 'all'
    },
    methods: {
        filterTable: filterTable
    },
    mounted: function () {
        // Popolazione iniziale della tabella
        populateTable(mockData);
    }
});
