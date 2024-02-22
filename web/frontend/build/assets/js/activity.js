let activities = {};
let activity_filter = "all";
let activity_search = "";

function onActivityFilterChange(event) {
    activity_filter = event.target.value;
    updateActivityTable();
}

function onActivitySearchChange(event) {
    activity_search = event.target.value;
    updateActivityTable();
}

function updateActivityTable() {
    const data_container = document.getElementById("dataTable_data_container");
    const isArray = Array.isArray(activities);
    if (!isArray || (isArray && activities.length === 0) || (typeof activities === 'string')) {
        return;
    }
    let appendContent = "";
    activities.forEach((activity) => {
        if (
            (activity_filter == "in_progress" && activity.status !== "in progress") ||
            (activity_filter == "to_be_completed" && activity.status !== "to be completed") ||
            (activity_filter == "completed" && activity.status !== "completed") ||
            (activity_filter == "scheduled" && activity.status !== "scheduled")) {
            return;
        }
        if (activity_search !== "" && !activity.text_description.toLowerCase().includes(activity_search.toLowerCase())) {
            return;
        }
        const num_of_alerts = activity.alerts.length;
        const num_of_workers = activity.workers.length;
        appendContent += `
        <tr>
            <td style="width: 25% !important">${activity.text_description}</td>
            <td>${activity.duration_minute} minutes</td>
            <td>${convertUnixToHuman(activity.scheduled_date)}</td>
            <td>${activity.status}</td>
            <td>${num_of_alerts}</td>
            <td>${num_of_workers}</td>
            <td><button class="btn btn-primary" type="button" onclick="showActivittDetails(${activity.id})">Show details</button></td>
        </tr>`
    });
    if (appendContent === "") {
        data_container.innerHTML = '<td class="text-center" colspan="7">No results found</td>';
        return;
    }
    data_container.innerHTML = appendContent;
}

function showActivittDetails(activity_id) {
    const details = document.getElementById("details_container");
    const isArray = Array.isArray(activities);
    const activity = isArray ? activities.find((activity) => activity["id"] === activity_id) : activities;
    const num_of_alerts = activity.alerts.length;
    const num_of_workers = activity.workers.length;
    let related_alerts_info = "";
    let related_workers_info = "";
    if (num_of_alerts > 0) {
        activity.alerts.forEach((alert) => {
            related_alerts_info += `<tr>
                <th class="table-secondary text-center" colspan="2">Alert</th>
            </tr>
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
                <td>${convertUnixToHuman(alert.send_date)} minutes</td>
            </tr>
            <tr>
                <th>Broadcast</th>
                <td>${alert.is_broadcast ? "Yes" : "No"}</td>
            </tr>`;
        });
    }
    if (num_of_workers > 0) {
        activity.workers.forEach((worker) => {
            related_alerts_info += `<tr>
                <th class="table-secondary text-center" colspan="2">Worker</th>
            </tr>
            <tr>
                <th>Internal ID</th>
                <td>${worker.id}</td>
            </tr>
            <tr>
                <th>Full Name</th>
                <td>${worker.first_name} ${worker.last_name}</td>
            </tr>
            <tr>
                <th>Role</th>
                <td>${worker.profession}</td>
            </tr>`;
        });
    }
    details.innerHTML = `
    <div class="table-responsive mt-2 card-body">
    <table class="table">
        <thead>
            <tr>
                <th class="table-info text-center" colspan="2">Activity Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Internal ID</th>
                <td>${activity.id}</td>
            </tr>
            <tr>
                <th>Title</th>
                <td>${activity.text_description}</td>
            </tr>
            <tr>
                <th>Duration</th>
                <td>${activity.duration_minute}</td>
            </tr>
            <tr>
                <th>Schedule Date</th>
                <td>${convertUnixToHuman(activity.scheduled_date)}</td>
            </tr>
            <tr>
                <th>Alerts</th>
                <td>${num_of_alerts}</td>
            </tr>
            <tr>
                <th>Workers</th>
                <td>${num_of_workers}</td>
            </tr>
            ${related_alerts_info}
            ${related_workers_info}
        </tbody>
    </table>
</div>`;
}

async function createActivity() {
    const durationSel = document.getElementById("durationSelector");
    const dateSel = document.getElementById("dateSelector");
    const descriptionBox = document.getElementById("activityDescription");
    const createActivityButton = document.getElementById("createActivitybtn");
    createActivityButton.setAttribute("disabled", true);
    createActivityButton.classList.add("disabled");
    let toast_text = "";
    if (descriptionBox.value.trim() === "") {
        toast_text = "The activity description cannot be empty";
    }
    else if (durationSel.value > 120 || durationSel.value < 1) {
        toast_text = "The duration must be between 1 and 120 minutes";
    }
    else if (dateSel.value === "") {
        toast_text = "The date must be selected";
    }
    else {
        const data = {
            "text_description": descriptionBox.value.trim(),
            "duration_minute": durationSel.value,
            "scheduled_date": dateSel.value,
            "status": "scheduled"
        }
        const response = await APICaller("/api/activity/", "POST", data);
        if (response.status === "success") {
            getActivities();
            descriptionBox.value = "";
            dateSel.value = "";
            durationSel.value = 50;
            toast_text = "The activity has been scheduled successfully";
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
    createActivityButton.removeAttribute("disabled");
    createActivityButton.classList.remove("disabled");
}

async function getActivities() {
    const response = await APICaller("/api/activity/all", "GET");
    activities = response.data;
    updateActivityTable();
}
getActivities();