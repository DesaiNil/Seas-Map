console.log("script.js loaded successfully");

document.getElementById("pathForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const mapName = document.getElementById("mapName").value.trim();
    const start = document.getElementById("startLocation").value.trim();
    const destination = document.getElementById("destination").value.trim();

    let savedMaps = JSON.parse(localStorage.getItem("maps")) || {};

    if (!savedMaps[mapName]) {
        document.getElementById("output").innerHTML = "<p>❌ Map not found!</p>";
        return;
    }

    const graph = new Graph();
    savedMaps[mapName].forEach(edge => graph.addEdge(edge.start, edge.end, edge.distance));

    let result = graph.dijkstra(start, destination);

    if (result.path === null) {
        document.getElementById("output").innerHTML = "<p>❌ No path found.</p>";
    } else {
        document.getElementById("output").innerHTML = `<p>✅ Shortest Path Distance: ${result.distance} meters</p>
            <p>📍 Path: ${result.path.join(" → ")}</p>`;
    }
});