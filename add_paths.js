document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mapName = urlParams.get("mapName");
    const numPaths = parseInt(urlParams.get("numPaths"), 10);

    // Display the map name
    document.getElementById("mapTitle").textContent = mapName;

    const pathsContainer = document.getElementById("pathsContainer");

    // Generate input fields dynamically
    for (let i = 1; i <= numPaths; i++) {
        const div = document.createElement("div");
        div.innerHTML = `
            <label>Start Location ${i}:</label>
            <input type="text" id="start${i}" required>

            <label>End Location ${i}:</label>
            <input type="text" id="end${i}" required>

            <label>Distance ${i}:</label>
            <div class="distance-input">
                <input type="number" id="distance${i}" min="1" required>
                <span class="unit">meters</span>
            </div>
        `;
        pathsContainer.appendChild(div);
    }

    // Handle form submission
    document.getElementById("pathsForm").addEventListener("submit", function(event) {
        event.preventDefault();

        let paths = [];

        // Retrieve input values and store them
        for (let i = 1; i <= numPaths; i++) {
            let start = document.getElementById(`start${i}`).value.trim();
            let end = document.getElementById(`end${i}`).value.trim();
            let distance = parseInt(document.getElementById(`distance${i}`).value.trim(), 10);

            if (!start || !end || isNaN(distance) || distance <= 0) {
                alert("❌ Please enter valid path details.");
                return;
            }

            paths.push({ start, end, distance });
        }

        // Save map to LocalStorage
        let maps = JSON.parse(localStorage.getItem("maps")) || {};
        maps[mapName] = paths;
        localStorage.setItem("maps", JSON.stringify(maps));

        // Show success message on page instead of an alert
        document.getElementById("saveMessage").style.display = "block";

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    });
});