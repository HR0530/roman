let map;
let markers = [];

window.initMap = function () {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.681236, lng: 139.767125 },
        zoom: 10,
    });

    document.getElementById("csvFile").addEventListener("change", handleFile);
};

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const csvText = e.target.result;
        loadMarkersFromCSV(csvText);
    };
    reader.readAsText(file, "UTF-8");
}

function loadMarkersFromCSV(csvText) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const rows = csvText.trim().split("\n").slice(1);
    rows.forEach(row => {
        const cols = row.split(",");
        const name = cols[0]?.trim();
        const lng = parseFloat(cols[1]);
        const lat = parseFloat(cols[2]);

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = new google.maps.Marker({
                position: { lat, lng },
                map,
                title: name
            });

            const infowindow = new google.maps.InfoWindow({
                content: `<strong>${name}</strong>`
            });

            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });

            markers.push(marker);
        }
    });
}
