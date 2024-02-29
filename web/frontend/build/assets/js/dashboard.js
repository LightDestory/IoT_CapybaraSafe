const deviceContainer = document.getElementById("device_row_container");
let trackings = {};
let filter = "all";

function onFilterChange(event) {
    filter = event.target.value;
    updateContainer();
}

function updateContainer() {
    const isArray = Array.isArray(trackings);
    if (!isArray || (isArray && trackings.length === 0) || (typeof trackings === 'string')) {
        return;
    }
    let appendContent = "";
    trackings.forEach((tracking) => {
        if ((filter == "normal" && tracking.emergency) ||
            (filter == "emergency" && !tracking.emergency)) {
            return;
        }
        appendContent += `
        <div class="col item">
    <div class="card shadow ${tracking.emergency ? "bg-danger" : "bg-info"}">
        <div class="card-body text-center"><img src="../assets/img/dashboard/worker_tracking.webp" width="40%" height="40%" />
            <div class="table-responsive mt-2 card">
                <table class="table" style="margin-bottom: 0 !important">
                    <tbody>
                        <tr>
                            <th>Worker</th>
                            <td>${tracking.worker.first_name} ${tracking.worker.last_name}<br/>(${tracking.worker.profession})</td>
                        </tr>
                        <tr>
                            <th>Activity</th>
                            <td>${tracking.activity.text_description}<br/>(It takes ${tracking.activity.duration_minute} minutes)</td>
                        </tr>
                        <tr>
                            <th>Last Seen on</th>
                            <td>Anchor ${tracking.anchor_id}<br/>On ${convertUnixToHuman(tracking.timestamp)}</td>
                        </tr>
                        <tr>
                            <td colspan=2>
                            <div class="row gx-2 gy-2 row-cols-3">
                            <div class="col text-center">
                            <i class="fas fa-heartbeat fa-2x"></i>
                                <p>${tracking.heart_rate}/bpm</p>
                            </div>
                            <div class="col">
                            <i class="fas fa-thermometer-half fa-2x"></i>
                                <p>${tracking.temperature}°C</p>
                            </div>
                            <div class="col">
                            <i class="fas fa-diagnoses fa-2x"></i>
                                <p>${tracking.saturation}%</p>
                            </div>
                        </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>`
    });
    if (appendContent === "") {
        data_container.innerHTML = '<div class="col"><p>No Device Found</p></div>';
        return;
    }
    deviceContainer.innerHTML = appendContent;
}

async function getTrackings() {
    const response = await APICaller(`/api/remote_tracking/all`, "GET");
    trackings = (response.data).filter((tracking) => tracking.activity.status === "in progress");
    updateContainer();
}

socketIO.on("tracking_system", (message) => {
    req = JSON.parse(message);
    trackings.forEach((tracking, index) => {
        if (tracking.worker.id === req.worker_id) {
            trackings[index]["timestamp"] = convertUnixToHuman(req.timestamp);
            trackings[index]["anchor_id"] = req.anchor_id;
            trackings[index]["anchor_signal_strength"] = req.anchor_signal_strength;
            trackings[index]["communication_progressive"] = req.communication_progressive;
            trackings[index]["emergency"] = req.emergency;
            trackings[index]["heart_rate"] = req.heart_rate;
            trackings[index]["temperature"] = req.temperature;
            trackings[index]["saturation"] = req.saturation;
        }
    });
    updateContainer();
  });

getTrackings();