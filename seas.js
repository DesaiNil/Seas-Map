const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift();
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

class Graph {
    constructor() {
        this.adjList = new Map();
    }

    addEdge(u, v, weight) {
        if (!this.adjList.has(u)) {
            this.adjList.set(u, []);
        }
        if (!this.adjList.has(v)) {
            this.adjList.set(v, []);
        }
        this.adjList.get(u).push({ node: v, weight });
        this.adjList.get(v).push({ node: u, weight });
    }

    hasNode(node) {
        return this.adjList.has(node);
    }

    dijkstra(src, dest) {
        if (!this.hasNode(src) || !this.hasNode(dest)) {
            console.log("Invalid locations! One or both locations do not exist in the map.");
            return;
        }

        const dist = new Map();
        const store = new Map();
        const visited = new Set();
        const priorityQueue = new PriorityQueue();

        for (const node of this.adjList.keys()) {
            dist.set(node, Infinity);
        }
        dist.set(src, 0);
        priorityQueue.enqueue(src, 0);

        while (!priorityQueue.isEmpty()) {
            const { element: parent, priority: parentDist } = priorityQueue.dequeue();

            if (parent === dest) break;

            if (visited.has(parent)) continue;
            visited.add(parent);

            const neighbors = this.adjList.get(parent) || [];
            for (const { node: child, weight: childDist }
                of neighbors) {
                const newDist = parentDist + childDist;
                if (newDist < dist.get(child)) {
                    dist.set(child, newDist);
                    store.set(child, parent);
                    priorityQueue.enqueue(child, newDist);
                }
            }
        }

        const path = [];
        let current = dest;
        while (current !== src) {
            path.unshift(current);
            current = store.get(current);
            if (!current) {
                console.log("No path found from " + src + " to " + dest);
                return;
            }
        }
        path.unshift(src);

        console.log("Shortest path distance in meters: " + dist.get(dest));
        console.log("Path: " + path.join(" -> "));
    }
}

const savedMaps = new Map();

async function askQuestion(question) {
    return new Promise(resolve => {
        readline.question(question, answer => {
            resolve(answer);
        });
    });
}

async function initializeDefaultMap() {
    const wce = new Graph();
    wce.addEdge("FrontGate", "Cyber", 100);
    wce.addEdge("Cyber", "StudyRoom", 100);
    wce.addEdge("Ground", "GovermentCanteen", 20);
    wce.addEdge("Cyber", "CCF", 50);
    wce.addEdge("StudyRoom", "GirlsHostel", 200);
    wce.addEdge("StudyRoom", "Libary", 100);
    wce.addEdge("StudyRoom", "GaneshMandir", 50);
    wce.addEdge("Libary", "BoysHostel", 200);
    wce.addEdge("Libary", "Ground", 150);
    wce.addEdge("Libary", "GaneshMandir", 100);
    wce.addEdge("Ground", "BoysHostel", 200);
    wce.addEdge("Ground", "AcademicArea", 300);
    wce.addEdge("CCF", "GaneshMandir", 50);
    wce.addEdge("CCF", "CSDept", 50);
    wce.addEdge("GaneshMandir", "CSDept", 70);
    wce.addEdge("GaneshMandir", "AcademicArea", 50);
    wce.addEdge("CSDept", "ELNDept", 50);
    wce.addEdge("CSDept", "AcademicArea", 150);
    wce.addEdge("AcademicArea", "ELEDept", 50);
    wce.addEdge("ELNDept", "ITDept", 50);
    wce.addEdge("ELNDept", "ELEDept", 50);
    wce.addEdge("ITDept", "BackGate", 700);
    wce.addEdge("ITDept", "MECHDept", 50);
    wce.addEdge("ELEDept", "MECHDept", 50);
    wce.addEdge("MECHDept", "Civil", 50);
    wce.addEdge("MECHDept", "CanteenKatta", 50);
    wce.addEdge("MECHDept", "BackGate", 600);
    wce.addEdge("CanteenKatta", "BackGate", 550);
    wce.addEdge("CivilDept", "BackGate", 500);
    wce.addEdge("BackGate", "GaneshMandir", 900);

    savedMaps.set("wce", wce);
    console.log("Default map 'wce' initialized.");
}

async function createCustomMap() {
    const g = new Graph();
    const mapName = await askQuestion("Enter map name: ");

    const edges = parseInt(await askQuestion("Enter number of paths: "));

    for (let i = 0; i < edges; i++) {
        const startLocation = await askQuestion("Enter start location: ");
        const endLocation = await askQuestion("Enter end location: ");
        const distance = parseInt(await askQuestion("Enter distance in meters: "));

        g.addEdge(startLocation, endLocation, distance);
    }

    savedMaps.set(mapName, g);
    console.log("Map '" + mapName + "' saved successfully!");
}

async function navigateExistingMap() {
    const mapName = await askQuestion("Enter map name: ");

    if (!savedMaps.has(mapName)) {
        console.log("Map not found! Please create it first.");
        return;
    }

    const g = savedMaps.get(mapName);
    const start = await askQuestion("Enter start location: ");
    const end = await askQuestion("Enter destination: ");

    g.dijkstra(start, end);
}

async function main() {
    await initializeDefaultMap();

    while (true) {
        console.log("\nChoose an option:");
        console.log("1. Create your own map");
        console.log("2. Navigate an existing map");
        console.log("3. Exit");

        const choice = await askQuestion("Enter choice: ");

        if (choice === "1") {
            await createCustomMap();
        } else if (choice === "2") {
            await navigateExistingMap();
        } else if (choice === "3") {
            console.log("EXIT");
            readline.close();
            break;
        } else {
            console.log("Invalid choice, try again.");
        }
    }
}

main().catch(err => {
    console.error("An error occurred:", err);
    readline.close();
});