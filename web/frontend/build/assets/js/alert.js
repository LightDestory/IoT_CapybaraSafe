const sendButton = document.getElementById("sendAlertbtn");
const alertMessageBox = document.getElementById("alertmessage");
const broadcastToggle = document.getElementById("boradcastselector");
const activitySelector = document.getElementById("activitySelector");
const broadcast_info = document.getElementById("broadcast_info");
const data_container = document.getElementById("dataTable_data_container");
const details = document.getElementById("details_container");

let alerts = {};
let alert_filter = "all";
let alert_search = "";
let on_going_acitivities = {};

function onAlertFilterChange(event) {
    alert_filter = event.target.value;
    updateAlertsTable();
}

function onAlertSearchChange(event) {
    alert_search = event.target.value;
    updateAlertsTable();
}

function updateAlertsTable() {
    const isArray = Array.isArray(alerts);
    if (!isArray || (isArray && alerts.length === 0) || (typeof alerts === 'string')) {
        return;
    }
    let appendContent = "";
    alerts.forEach((alert) => {
        if ((alert_filter == "broadcast" && !alert.is_broadcast) ||
            (alert_filter == "no_broadcast" && alert.is_broadcast)) {
            return;
        }
        if (alert_search !== "" && !alert.text_description.toLowerCase().includes(alert_search.toLowerCase())) {
            return;
        }
        appendContent += `
        <tr>
            <td style="width: 33% !important">${alert.text_description}</td>
            <td>${convertUnixToHuman(alert.send_date)}</td>
            <td>${alert.is_broadcast ? "Yes" : "No"}</td>
            <td><button class="btn btn-primary" type="button" onclick="showAlertDetails(${alert.id})">Show details</button></td>
        </tr>`
    });
    if (appendContent === "") {
        data_container.innerHTML = '<td class="text-center" colspan="4">No results found</td>';
        return;
    }
    data_container.innerHTML = appendContent;
}

function updateGoingActivitiesSelector() {
    const isArray = Array.isArray(on_going_acitivities);
    if (!isArray || (isArray && alerts.length === 0) || (typeof on_going_acitivities === 'string')) {
        return;
    }
    let appendContent = "";
    on_going_acitivities.forEach((activity) => {
        appendContent += `<option value="${activity.id}">${activity.text_description}</option>`;
    });
    if (appendContent !== "") {
        activitySelector.innerHTML = appendContent;
        sendButton.removeAttribute("disabled");
        sendButton.classList.remove("disabled");
    }
}

function showAlertDetails(alert_id) {
    const isArray = Array.isArray(alerts);
    const alert = isArray ? alerts.find((alert) => alert["id"] === alert_id) : alerts;
    let related_activity_info = "";
    if (alert["activity_id"]) {
        const activity = alert["activity"];
        related_activity_info = `<tr>
                <th class="table-secondary text-center" colspan="2">Related Activity</th>
            </tr>
            <tr>
                <th>Internal ID</th>
                <td>${activity.id}</td>
            </tr>
            <tr>
                <th>Message</th>
                <td>${activity.text_description}</td>
            </tr>
            <tr>
                <th>Duration</th>
                <td>${activity.duration_minute} minutes</td>
            </tr>
            <tr>
                <th>Scheduled Date</th>
                <td>${convertUnixToHuman(activity.scheduled_date)}</td>
            </tr>
            <tr>
                <th>Status</th>
                <td>${activity.status}</td>
            </tr>`;
    }
    details.innerHTML = `
    <div class="table-responsive mt-2 card-body">
    <table class="table">
        <thead>
            <tr>
                <th class="table-info text-center" colspan="2">Alert Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Internal ID</th>
                <td>${alert.id}</td>
            </tr>
            <tr>
                <th>Message</th>
                <td>${alert.text_description}</td>
            </tr>
            <tr>
                <th>Send Date</th>
                <td>${convertUnixToHuman(alert.send_date)}</td>
            </tr>
            <tr>
                <th>Broadcast</th>
                <td>${alert.is_broadcast ? "Yes" : "No"}</td>
            </tr>
            ${related_activity_info}
        </tbody>
    </table>
</div>`;
}

function updateBroadcastAlert(event) {
    if (!event.target.checked) {
        broadcast_info.style.opacity = 0;
        activitySelector.removeAttribute("disabled");
        return;
    }
    else {
        activitySelector.setAttribute("disabled", true);
        broadcast_info.style.opacity = 1;
    }

}

async function sendAlert() {
    const alert_text = alertMessageBox.value.trim();
    sendButton.setAttribute("disabled", true);
    sendButton.classList.add("disabled");
    let toast_text = "";
    if (alert_text === "") {
        toast_text = "The alert message cannot be empty";
    } else {
        const data = {
            text_description: alert_text,
            is_broadcast: broadcastToggle.checked,
            activity_id: broadcastToggle.checked ? null : activitySelector.value
        }
        const response = await APICaller("/api/alert/", "POST", data);
        if (response.status === "success") {
            getAlerts();
            alertMessageBox.value = "";
            broadcastToggle.checked = false;
            document.getElementById("broadcast_info").style.opacity = 0;
            activitySelector.removeAttribute("disabled");
            toast_text = "The alert was sent successfully";
        }
        else {
            toast_text = response.data;
        }
    }
    Toastify({
        text: toast_text,
        duration: 3000,
        gravity: "top",
        position: "center",
    }).showToast();
    sendButton.removeAttribute("disabled");
    sendButton.classList.remove("disabled");
}

async function getAlerts() {
    const response = await APICaller("/api/alert/all", "GET");
    alerts = response.data;
    updateAlertsTable();
}

async function getOnGoingActivities() {
    const response = await APICaller("/api/activity/all?status=in progress", "GET");
    on_going_acitivities = response.data;
    updateGoingActivitiesSelector();
}

getAlerts();
getOnGoingActivities();