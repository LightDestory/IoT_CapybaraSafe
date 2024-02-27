const sendButton = document.getElementById("sendAlertbtn");
const alertMessageBox = document.getElementById("alertmessage");
const broadcastToggle = document.getElementById("boradcastselector");
const activitySelector = document.getElementById("activitySelector");
const broadcast_info = document.getElementById("broadcast_info");
const data_container = document.getElementById("dataTable_data_container");
const details = document.getElementById("details_container");
const first_nameSel = document.getElementById("firstNameSelector");
const last_nameSel = document.getElementById("lastNameSelector");
const professionSel = document.getElementById("professionSelector");
const hireButton = document.getElementById("hirebtn");
const activitySel = document.getElementById("activitySelector");
const workerSel = document.getElementById("workerSelector");
const assignButton = document.getElementById("assignBtn");
const deviceStartSel = document.getElementById("deviceStartSelector");
const activityStartSel = document.getElementById("startActivitySelector");
const workerStartSel = document.getElementById("workerStartSelector");
const startButton = document.getElementById("startBtn");

let pendingPairing = [];

let workers = {};
let activities = {};
let devices = {};

let worker_filter = "all";
let worker_search = "";

async function updateLocalData() {
    activities = (await APICaller("/api/activity/all", "GET")).data;
    workers = (await APICaller("/api/worker/all", "GET")).data;
    devices = (await APICaller("/api/tracking_device/all?status=available", "GET")).data;
    updateWorkersTable();
    populateActivityAssign();
    populateDevicePairing();
    populateWorkerPairing();
}


// WORKER TABLE VIEW

function onWorkerFilterChange(event) {
    worker_filter = event.target.value;
    updateWorkersTable();
}

function onWorkertSearchChange(event) {
    worker_search = event.target.value;
    updateWorkersTable();
}

function updateWorkersTable() {
    const isArray = Array.isArray(workers);
    if (!isArray || (isArray && workers.length === 0) || (typeof workers === 'string')) {
        return;
    }
    let appendContent = "";
    workers.forEach((worker) => {
        const is_working = worker.remote_trackings.findIndex((tracking) => tracking.activity.status == "in progress") !== -1;
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
    const isArray = Array.isArray(workers);
    const worker = isArray ? workers.find((worker) => worker["id"] === worker_id) : workers;
    let related_activity_info = "";
    if (worker.activities.length > 0) {
        worker.activities.forEach((activity) => {
            related_activity_info += `<tr>
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
                <td>${(worker.remote_trackings.findIndex((tracking) => tracking.activity.status == "in progress") !== -1)
            ? "Yes" : "No"}</td>
            </tr>
            ${related_activity_info}
        </tbody>
    </table>
</div>`;
}

// WORKER CREATION

async function hire() {
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
            await updateLocalData();
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

// ASSIGNMENT

function onAssignActivityChange(event) {
    populateWorkerAssign(event.target.value);
}

function populateActivityAssign() {
    const isActivityArray = Array.isArray(activities);
    const isWorkerArray = Array.isArray(workers);
    if (!isActivityArray || (typeof activities === 'string') ||
        !isWorkerArray || (typeof workers === 'string')) {
        return;
    }
    let pending_activities = activities.filter((activity) => activity.status !== "completed");
    if (pending_activities.length === 0) {
        activitySel.innerHTML = `<option value="no_activity">No activity</option>`;
    } else {
        activitySel.innerHTML = "";
        pending_activities.forEach((activity) => {
            activitySel.innerHTML += `<option value="${activity.id}">${activity.text_description}</option>`;
        });
    }
    populateWorkerAssign(pending_activities[0].id);
}

function populateWorkerAssign(activity_id) {
    const workerNotAssigned = workers.filter((worker) => worker.activities.findIndex((activity) => activity.id == activity_id) === -1);
    if (workerNotAssigned.length === 0) {
        workerSel.innerHTML = `<option value="no_worker">No worker</option>`;
    } else {
        workerSel.innerHTML = "";
        workerNotAssigned.forEach((worker) => {
            workerSel.innerHTML += `<option value="${worker.id}">${worker.first_name} ${worker.last_name} (${worker.profession})</option>`;
        });
    }
}

async function assign() {
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
            await updateLocalData();
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

// START

function onWorkerPairingChange(event) {
    populateActivityPairing(event.target.value);
}

async function populateDevicePairing() {
    const isArray = Array.isArray(devices);
    if (!isArray || (typeof devices === 'string')) {
        return;
    }
    deviceStartSel.innerHTML = `<option value="no_device">No device</option>`;
    if (devices.length === 0) {
        return;
    }
    deviceStartSel.innerHTML = "";
    devices.forEach((device) => {
        deviceStartSel.innerHTML += `<option value="${device.id}">Device ${device.id}</option>`;
    });
}

function populateWorkerPairing() {
    let availableWorkers = workers.filter(worker => worker.remote_trackings.findIndex(tracking => tracking.activity.status === "in progress") === -1);
    const isArray = Array.isArray(availableWorkers);
    if (!isArray || (typeof availableWorkers === 'string')) {
        return;
    }
    workerStartSel.innerHTML = "";
    if (availableWorkers.length === 0) {
        workerStartSel.innerHTML = `<option value="no_worker">No worker</option>`;
        return;
    }
    availableWorkers.forEach((worker) => {
        workerStartSel.innerHTML += `<option value="${worker.id}">${worker.first_name} ${worker.last_name} (${worker.profession})</option>`;
    });
    populateActivityPairing(availableWorkers[0].id);
}

function populateActivityPairing(worker_id) {
    const selectedWorker = workers.find(worker => worker.id == worker_id);
    let pendingActivities = selectedWorker.activities.filter(activity => activity.status !== "completed");
    activityStartSel.innerHTML = `<option value="no_activity">No activity possible</option>`;
    if (pendingActivities.length === 0) {
        return;
    }
    activityStartSel.innerHTML = "";
    pendingActivities.forEach((activity) => {
        if(activity.status === "in progress") {
            if(selectedWorker.remote_trackings.findIndex(tracking => tracking.activity_id === activity.id) !== -1) {
                return;
            }
        }
        activityStartSel.innerHTML += `<option value="${activity.id}">${activity.text_description}</option>`;
    });
}

async function start() {
    startButton.setAttribute("disabled", true);
    startButton.classList.add("disabled");
    let toast_text = "";
    if (activityStartSel.value == "no_activity" || workerStartSel.value == "no_worker" || deviceStartSel.value == "no_device") {
        toast_text = "Some resources are missing...";
    } else {
        const response = await APICaller(`/api/tracking_device/pair_request?data=${activityStartSel.value}-${workerStartSel.value}-${deviceStartSel.value}`, "GET");
        toast_text = response.data;
    }
    Toastify({
        text: toast_text,
        duration: 3000,
        gravity: "top",
        position: "center",
    }).showToast();
    startButton.removeAttribute("disabled");
    startButton.classList.remove("disabled");
    pendingPairing.push({
        activity_id: activityStartSel.value,
        worker_id: workerStartSel.value,
        device_id: deviceStartSel.value,
        timeout: setTimeout(() => {
            Toastify({
                text: "Unable to pair the device, please try again...",
                duration: 3000,
                gravity: "top",
                position: "center",
            }).showToast();
        }, 10000)
    });
}


async function executePair(activity_id, worker_id, device_id) {
    const response = await APICaller(`/api/activity/start?data=${activity_id}-${worker_id}-${device_id}`, "GET");
    Toastify({
        text: response.data,
        duration: 3000,
        gravity: "top",
        position: "center",
    }).showToast();
    updateLocalData();
    let request_index = pendingPairing.findIndex(req => req.activity_id == activity_id && req.worker_id == worker_id && req.device_id == device_id);
    clearTimeout(pendingPairing[request_index].timeout);
    pendingPairing.splice(request_index, 1);
}

socketIO.on("pairing_request", (message) => {
    req = JSON.parse(message);
    executePair(req.activity_id, req.worker_id, req.device_id);
  });


updateLocalData();