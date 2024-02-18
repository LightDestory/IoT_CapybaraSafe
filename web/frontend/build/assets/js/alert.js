/*<tr>
    <td>tttttttttsadsadasdadsa</td>
    <td>dssssssssssssssssdsss</td>
    <td>Ciaosadsadss</td>
    <td><button class="btn btn-primary" type="button">Button</button></td>
</tr>*/
let alerts = {};
let alert_filter = "all";
let alert_search = "";

function onAlertFilterChange(event) {
    console.log(event.target.value);
    alert_filter = event.target.value;
    updateAlertsTable();
}

function updateAlertsTable() {
    const data_container = document.getElementById("dataTable_data_container");
    data_container.innerHTML = "";
    if (alerts.length === 0) {
        data_container.innerHTML = "<tr><td colspan='4'>No alerts found</td></tr>";
        return;
    }
    alerts.forEach((alert) => {
        if ((alert_filter == "broadcast" && !alert["is_broadcast"]) ||
            (alert_filter == "no_broadcast" && alert["is_broadcast"])) {
            return;
        }
        if (alert_search !== "" && alert["text_description"].toLowerCase().includes(alert_search.toLowerCase())) {
            console.log("skipped");
        }
        data_container.innerHTML += `
        <tr>
            <td style="width: 33% !important">${alert['text_description']}</td>
            <td>${alert['send_date']}</td>
            <td>${alert['is_broadcast'] ? "Yes" : "No"}</td>
            <td><button class="btn btn-primary" type="button">Button</button></td>
        </tr>`
    });
}


async function getAlerts() {
    const response = await APICaller("/api/alert/all", "GET");
    alerts = response.data;
    updateAlertsTable();
}

getAlerts();