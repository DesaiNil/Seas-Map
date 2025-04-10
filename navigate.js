document.getElementById("pathForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const mapName = document.getElementById("mapName").value.trim();
    const start = document.getElementById("startLocation").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const output = document.getElementById("output");

    let maps = JSON.parse(localStorage.getItem("maps")) || {};

    // 🛑 Check if the map exists
    if (!maps[mapName]) {
        output.innerHTML = `<p>❌ First create the map "<strong>${mapName}</strong>".</p>`;
        return;
    }

    const graphData = maps[mapName];
    let graph = new Graph();

    // 🏗️ Build the Graph from saved data
    for (let node in graphData) {
        graphData[node].forEach(edge => {
            graph.addEdge(node, edge.end, edge.distance);
        });
    }

    const result = graph.dijkstra(start, destination);

    // 🛑 No valid path found
    if (result.path.length === 0) {
        output.innerHTML = "<p>❌ No valid path found.</p>";
    } else {
        // 🚶 Walking Speed: 75 meters/min  |  🚲 Bike/Car Speed: 325 meters/min
        const walkingTime = Math.round(result.distance / 75);
        const bikeCarTime = Math.round(result.distance / 325);
        output.innerHTML = `
            <p><strong>✅ Shortest Path Distance:</strong> ${result.distance} meters</p>
            <p><strong>📍 Path:</strong> ${result.path.join(" → ")}</p>
            <p>🚶 <strong>Walking Time:</strong> ${walkingTime} minutes</p>
            <p>🚲 <strong>Bike/Car Time:</strong> ${bikeCarTime} minutes</p>
        `;
    }
});