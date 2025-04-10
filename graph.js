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
        if (!this.adjList.has(u)) this.adjList.set(u, []);
        if (!this.adjList.has(v)) this.adjList.set(v, []);

        this.adjList.get(u).push({ node: v, weight });
        this.adjList.get(v).push({ node: u, weight });
    }

    dijkstra(src, dest) {
        let dist = new Map();
        let prev = new Map();
        let pq = new PriorityQueue();

        for (let node of this.adjList.keys()) {
            dist.set(node, Infinity);
        }
        dist.set(src, 0);
        pq.enqueue(src, 0);

        while (!pq.isEmpty()) {
            let { element: u } = pq.dequeue();

            if (u === dest) break;

            for (let { node: v, weight }
                of this.adjList.get(u) || []) {
                let alt = dist.get(u) + weight;
                if (alt < dist.get(v)) {
                    dist.set(v, alt);
                    prev.set(v, u);
                    pq.enqueue(v, alt);
                }
            }
        }

        let path = [];
        for (let at = dest; at !== undefined; at = prev.get(at)) {
            path.unshift(at);
        }

        return { distance: dist.get(dest), path: path.length > 1 ? path : null };
    }
}