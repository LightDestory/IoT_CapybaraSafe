const sendButton = document.getElementById("sendAlertbtn");
const alertMessageBox = document.getElementById("alertmessage");
const broadcastToggle = document.getElementById("boradcastselector");
const activitySelector = document.getElementById("activitySelector");
const broadcast_info = document.getElementById("broadcast_info");

let workers = {};
let worker_filter = "all";
let worker_search = "";

function onWorkerFilterChange(event) {
    worker_filter = event.target.value;
    updateWorkersTable();
}

function onWorkertSearchChange(event) {
    worker_search = event.target.value;
    updateWorkersTable();
}

function updateWorkersTable() {
    const data_container = document.getElementById("dataTable_data_container");
    const isArray = Array.isArray(workers);
    if (!isArray || (isArray && workers.length === 0) || (typeof workers === 'string')) {
        return;
    }
    let appendContent = "";
    workers.forEach((worker) => {
        const is_working = worker.activities.findIndex((activity) => activity.status == "in progress") !== -1;
        if ((worker_filter == "working" && !is_working) ||
            (worker_filter == "available" && is_working)) {
            return;
        }
        if (worker_search !== "" && (!worker.first_name.toLowerCase().includes(worker_search.toLowerCase()) || !worker.last_name.toLowerCase().includes(worker_search.toLowerCase()))) {
            return;
        }
        appendContent += `
        <tr>
            <td>${worker.first_name}</td>
            <td>${worker.last_name}</td>
            <td>${worker.profession}</td>
            <td>${is_working ? "Yes" : "No"}</td>
            <td>${worker.activities.length}</td>
            <td><button class="btn btn-primary" type="button" onclick="showWorkerDetails(${worker.id})">Show details</button></td>
        </tr>`
    });
    if (appendContent === "") {
        data_container.innerHTML = '<td class="text-center" colspan="5">No results found</td>';
        return;
    }
    data_container.innerHTML = appendContent;
}

function showWorkerDetails(worker_id) {
    const details = document.getElementById("details_container");
    const isArray = Array.isArray(workers);
    const worker = isArray ? workers.find((worker) => worker["id"] === worker_id) : workers;
    let related_activity_info = "";
    if (worker.activities.length > 0) {
        worker.activities.forEach((activity) => {
            related_activity_info = `<tr>
                <th class="table-secondary text-center" colspan="2">Activity</th>
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
        });
    }
    details.innerHTML = `
    <div class="table-responsive mt-2 card-body">
    <table class="table">
        <thead>
            <tr>
                <th class="table-info text-center" colspan="2">Worker Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>Internal ID</th>
                <td>${worker.id}</td>
            </tr>
            <tr>
                <th>Full Name</th>
                <td>${worker.first_name} ${worker.last_name}</td>
            </tr>
            <tr>
                <th>Profession</th>
                <td>${worker.profession}</td>
            </tr>
            <tr>
                <th>Operations</th>
                <td>${worker.activities.length}</td>
            </tr>
            <tr>
                <th>Working</th>
                <td>${(worker.activities.findIndex((activity) => activity.status == "in progress") !== -1)
            ? "Yes" : "No"}</td>
            </tr>
            ${related_activity_info}
        </tbody>
    </table>
</div>`;
}

async function hire() {
    const first_nameSel = document.getElementById("firstNameSelector");
    const last_nameSel = document.getElementById("lastNameSelector");
    const professionSel = document.getElementById("professionSelector");
    const hireButton = document.getElementById("hirebtn");
    hireButton.setAttribute("disabled", true);
    hireButton.classList.add("disabled");
    let toast_text = "";
    if (first_nameSel.value.trim() === "" || last_nameSel.value.trim() === "" || professionSel.value.trim() === "") {
        toast_text = "You must compile all fields";
    } else {
        const data = {
            first_name: first_nameSel.value.trim(),
            last_name: last_nameSel.value.trim(),
            profession: professionSel.value.trim()
        }
        const response = await APICaller("/api/worker/", "POST", data);
        if (response.status === "success") {
            getWorkers();
            getAssignData();
            first_nameSel.value = "";
            last_nameSel.value = "";
            professionSel.value = "";
            toast_text = "The worker has been hired successfully";
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
    hireButton.removeAttribute("disabled");
    hireButton.classList.remove("disabled");
}

async function assign() {
    const activitySel = document.getElementById("activitySelector");
    const workerSel = document.getElementById("workerSelector");
    const assignButton = document.getElementById("assignBtn");
    assignButton.setAttribute("disabled", true);
    assignButton.classList.add("disabled");
    let toast_text = "";
    if (activitySel.value == "no_activity" || workerSel.value == "no_worker") {
        toast_text = "Some resources are missing...";
    } else {
        const data = {
            activity_id: activitySel.value,
            worker_id: workerSel.value
        }
        const response = await APICaller("/api/assign/", "POST", data);
        if (response.status === "success") {
            getWorkers();
            toast_text = "The activity has been assigned successfully";
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
    assignButton.removeAttribute("disabled");
    assignButton.classList.remove("disabled");
}

async function start() {
    const activitySel = document.getElementById("startActivitySelector");
    const workerSel = document.getElementById("workerStartSelector");
    const startButton = document.getElementById("startBtn");
    startButton.setAttribute("disabled", true);
    startButton.classList.add("disabled");
    let toast_text = "";
    if (activitySel.value == "no_activity" || workerSel.value == "no_worker") {
        toast_text = "Some resources are missing...";
    } else {
        const response = await APICaller(`/api/activity/start?data=${activitySel.value}-${workerSel.value}`, "GET");
        if (response.status === "success") {
            getWorkers();
            toast_text = "The activity has been started successfully";
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
    startButton.removeAttribute("disabled");
    startButton.classList.remove("disabled");
}

async function getWorkers() {
    const response = await APICaller("/api/worker/all", "GET");
    workers = response.data;
    updateWorkersTable();
    updateWorkerStartActivity();
}

async function getAssignData() {
    const activitySel = document.getElementById("activitySelector");
    const workerSel = document.getElementById("workerSelector");
    let activities = (await APICaller("/api/activity/all", "GET")).data;
    let workers = (await APICaller("/api/worker/all", "GET")).data;
    const isActivityArray = Array.isArray(activities);
    const isWorkerArray = Array.isArray(workers);
    if (!isActivityArray || (isActivityArray && activities.length === 0) || (typeof activities === 'string') ||
        !isWorkerArray || (isWorkerArray && workers.length === 0) || (typeof workers === 'string')) {
        return;
    }
    activities = activities.filter((activity) => activity.status !== "completed");
    if (activities.length === 0) {
        activitySel.innerHTML = `<option value="no_activity">No activity</option>`;
    } else {
        activitySel.innerHTML = "";
        activities.forEach((activity) => {
            activitySel.innerHTML += `<option value="${activity.id}">${activity.text_description}</option>`;
        });
    }
    if (workers.length === 0) {
        workerSel.innerHTML = `<option value="no_worker">No worker</option>`;
    } else {
        workerSel.innerHTML = "";
        workers.forEach((worker) => {
            workerSel.innerHTML += `<option value="${worker.id}">${worker.first_name} ${worker.last_name} (${worker.profession})</option>`;
        });
    }
}

function updateWorkerStartActivity() {
    const activitySel = document.getElementById("startActivitySelector");
    const workerSel = document.getElementById("workerStartSelector");
    workerSel.innerHTML = `<option value="no_worker">No worker</option>`;
    const isWorkerArray = Array.isArray(workers);
    if (!isWorkerArray || (isWorkerArray && workers.length === 0) || (typeof workers === 'string')) {
        return;
    }
    workerSel.innerHTML = "";
    workers.forEach((worker) => {
        workerSel.innerHTML += `<option value="${worker.id}">${worker.first_name} ${worker.last_name} (${worker.profession})</option>`;
    });
    updateActivityStartActivity();
}

function updateActivityStartActivity() {
    const activitySel = document.getElementById("startActivitySelector");
    const selected_worker = workers.find(worker => worker.id == document.getElementById("workerStartSelector").value);
    const compatible_activities = selected_worker.activities.filter(activity => activity.status === "scheduled" || activity.status === "to be completed");
    activitySel.innerHTML = `<option value="no_activity">No activity possible</option>`;
    if (compatible_activities.length === 0) {
        return;
    }
    activitySel.innerHTML = "";
    compatible_activities.forEach((activity) => {
        activitySel.innerHTML += `<option value="${activity.id}">${activity.text_description}</option>`;
    });
}

getWorkers();
getAssignData();