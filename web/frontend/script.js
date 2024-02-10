// Mock data JSON per simulare il riempimento della tabella
var mockData = [
    { "ID": 1, "description": "Task 1", "duration": 60, "date": "2024-02-10", "status": "in progress" },
    { "ID": 2, "description": "Task 2", "duration": 45, "date": "2024-02-11", "status": "to be completed" },
    { "ID": 3, "description": "Task 3", "duration": 30, "date": "2024-02-12", "status": "scheduled" },
    { "ID": 4, "description": "Task 4", "duration": 90, "date": "2024-02-13", "status": "completed" }
];


//  metodo insertRow e insertCell per creare dinamicamente righe e celle della tabella.
function populateTable(data) {
    var tableBody = document.getElementById("activities");

    tableBody.innerHTML = ""; //altrimenti la pagina non si "ripulisce", ma aggiunge solo righe ai filtri 
    //nella mia testa ha senso questa frase

    // Populate table with mock data
    data.forEach(function (activity) {
        var row = tableBody.insertRow();
        row.insertCell(0).textContent = activity.ID;
        row.insertCell(1).textContent = activity.description;
        row.insertCell(2).textContent = activity.duration;
        row.insertCell(3).textContent = activity.date;
        row.insertCell(4).textContent = activity.status;
    });
}

function filterTable() {
    var statusFilter = document.getElementById("statusFilter").value;
    var filteredData;

    if (statusFilter === "all") {
        filteredData = mockData;
    } else {
        filteredData = [];
        for (var i = 0; i < mockData.length; i++) {
            if (mockData[i].status === statusFilter) {
                filteredData.push(mockData[i]);
            }
        }
    }


    populateTable(filteredData);
}

// Inizializzo la tabella all'inizio altrimenti non si vede appena apro la pagina
populateTable(mockData);