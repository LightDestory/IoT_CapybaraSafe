const deviceContainer = document.getElementById("device_row_container");
const current_page = window.location.pathname.split("/")[1];

let devices = {};
let device_filter = "all";

function onDeviceFilterChange(event) {
    device_filter = event.target.value;
    updateDeviceContainer();
}

function updateDeviceContainer() {
    const isArray = Array.isArray(devices);
    if (!isArray || (isArray && devices.length === 0) || (typeof alerts === 'string')) {
        return;
    }
    let appendContent = current_page === "trackingdevice" ? parseTrackingDevices() : parseAnchors();
    if (appendContent === "") {
        data_container.innerHTML = '<div class="col"><p>No Device Found</p></div>';
        return;
    }
    deviceContainer.innerHTML = appendContent;
}

function parseTrackingDevices() {
    let parsedItems = "";
    devices.forEach((device) => {
        const in_use = device.remote_trackings.findIndex((tracking) => tracking.activity.status == "in progress") !== -1;
        if ((device_filter == "available" && in_use) ||
            (device_filter == "in_use" && !in_use)) {
            return;
        }
        parsedItems += `
        <div class="col item">
    <div class="card shadow">
        <div class="card-body text-center"><img src="../assets/img/tracking_devices/smartwatch.webp" width="50%" height="50%" />
            <div class="table-responsive mt-2 card">
                <table class="table" style="margin-bottom: 0 !important">
                    <thead>
                        <tr>
                            <th colspan="2">Device ${device.id}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>MAC</th>
                            <td>${device.mac_address}</td>
                        </tr>
                        <tr>
                            <th>FW</th>
                            <td>${device.firmware_version}</td>
                        </tr>
                        <tr>
                            <th>Last Check</th>
                            <td>${convertUnixToHuman(device.last_maintenance)}</td>
                        </tr>
                        <tr>
                            <th>In Use</th>
                            <td>${in_use ? "Yes" : "No"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>`
    });
    return parsedItems;
}

function parseAnchors() {
    let parsedItems = "";
    devices.forEach((device) => {
        if ((device_filter == "working" && device.status !== "working") ||
            (device_filter == "anomaly" && device.status === "working")) {
            return;
        }
        parsedItems += `
        <div class="col item">
    <div class="card shadow">
        <div class="card-body text-center"><img src="../assets/img/anchors/trackbox.webp" width="70%" height="70%" />
            <div class="table-responsive mt-2 card">
                <table class="table" style="margin-bottom: 0 !important">
                    <thead>
                        <tr>
                            <th colspan="2">Device ${device.id}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>MAC</th>
                            <td>${device.mac_address}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>${device.status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>`
    });
    return parsedItems;
}

async function getDevices() {
    const endpoint = current_page === "trackingdevice" ? "tracking_device" : "anchor";
    const response = await APICaller(`/api/${endpoint}/all`, "GET");
    devices = response.data;
    updateDeviceContainer();
}

getDevices();