let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 1.5,
    });

    (async function() {
        const data = await (await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")).json()
        if (data.metadata.status !== 200) alert("Earthquake API has failed. Please try again later.")

        // Create an info window to share between markers.
        const infoWindow = new google.maps.InfoWindow();

        data.features.forEach(function(feature) {
            if (feature.properties.type !== "earthquake") return;

            console.log(`Place: ${feature.properties.place}\nLat: ${feature.geometry.coordinates[1]}, Lng: ${feature.geometry.coordinates[0]}\nMagnitude: ${feature.properties.mag}`);

            var marker = new google.maps.Marker({
                position: { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] },
                animation: google.maps.Animation.DROP,
                title: `Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Info: <a href="${feature.properties.url}"" target="_blank">${feature.properties.url}</a>`,
                map: map,
            });

            // Add a mouseover listener for each marker, and set up the info window.
            marker.addListener("mouseover", () => {
                infoWindow.close();
                infoWindow.setContent(marker.getTitle());
                infoWindow.open(marker.getMap(), marker);
            });

            // Add a mouseout listener for each marker to close the info window.
            marker.addListener("mouseout", () => {
                infoWindow.close();
            });
        })
    })()
}