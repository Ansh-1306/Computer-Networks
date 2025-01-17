const nodes = [];
const edges = [];
let selectedNode = null;

const graphContainer = document.getElementById('graph-container');
const outputLog = document.getElementById('output-log');

document.getElementById('add-node').addEventListener('click', () => {
    const nodeId = nodes.length + 1;
    const containerRect = graphContainer.getBoundingClientRect();
    nodes.push({
        id: nodeId,
        x: Math.random() * (containerRect.width - 50) + 25,
        y: Math.random() * (containerRect.height - 50) + 25,
    });
    renderGraph();
});

document.getElementById('add-edge').addEventListener('click', () => {
    if (nodes.length < 2) {
        alert('Add at least 2 nodes first!');
        return;
    }

    const fromNode = prompt('Enter start node ID:');
    const toNode = prompt('Enter end node ID:');
    const weight = parseInt(prompt('Enter weight:'), 10);

    if (fromNode && toNode && !isNaN(weight)) {
        edges.push({ from: parseInt(fromNode), to: parseInt(toNode), weight });
        renderGraph();
    } else {
        alert('Invalid input!');
    }
});

document.getElementById('reset').addEventListener('click', () => {
    nodes.length = 0;
    edges.length = 0;
    outputLog.textContent = '';
    renderGraph();
});

document.getElementById('run-algorithm').addEventListener('click', () => {
    if (nodes.length === 0) {
        alert('No nodes to process!');
        return;
    }

    const sourceId = prompt('Enter source node ID:');
    if (!sourceId || isNaN(sourceId)) {
        alert('Invalid source node ID!');
        return;
    }

    const { distances, predecessors, hasNegativeCycle } = bellmanFord(parseInt(sourceId));
    let output = 'Shortest distances from source node ' + sourceId + ':\n';
    for (const node of nodes) {
        output += `Node ${node.id}: ${distances[node.id]}\n`;
    }

    output += '\nShortest paths:\n';
    for (const node of nodes) {
        if (node.id !== parseInt(sourceId)) {
            output += `Path to Node ${node.id}: `;
            const path = [];
            let currentNode = node.id;
            while (currentNode) {
                path.unshift(currentNode);
                currentNode = predecessors[currentNode];
            }
            output += path.join(' -> ') + '\n';
        }
    }

    if (hasNegativeCycle) {
        output += '\nGraph contains a negative weight cycle!';
    }

    outputLog.textContent = output;
});


function bellmanFord(source) {
    const distances = {};
    const predecessors = {};
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        predecessors[node.id] = null;
    });
    distances[source] = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
        edges.forEach(({ from, to, weight }) => {
            if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
                distances[to] = distances[from] + weight;
                predecessors[to] = from;
            }
        });
    }

    let hasNegativeCycle = false;
    edges.forEach(({ from, to, weight }) => {
        if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
            hasNegativeCycle = true;
        }
    });

    return { distances, predecessors, hasNegativeCycle };
}


function renderGraph() {
    graphContainer.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const arrowhead = document.createElementNS(svgNS, 'marker');
    arrowhead.setAttribute('id', 'arrowhead');
    arrowhead.setAttribute('viewBox', '0 0 10 10');
    arrowhead.setAttribute('refX', '25');
    arrowhead.setAttribute('refY', '5');
    arrowhead.setAttribute('markerWidth', '6');
    arrowhead.setAttribute('markerHeight', '6');
    arrowhead.setAttribute('orient', 'auto');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 Z');
    path.setAttribute('fill', '#6c757d');
    arrowhead.appendChild(path);
    svg.appendChild(arrowhead);

    edges.forEach(edge => {
        const fromNode = nodes.find(node => node.id === edge.from);
        const toNode = nodes.find(node => node.id === edge.to);

        if (fromNode && toNode) {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', fromNode.x);
            line.setAttribute('y1', fromNode.y);
            line.setAttribute('x2', toNode.x);
            line.setAttribute('y2', toNode.y);
            line.setAttribute('class', 'edge');
            svg.appendChild(line);

            // const midX =  (fromNode.x + 2 * toNode.x) / 3;
            // const midY =  (fromNode.y + 2 * toNode.y) / 3;

            const midX = fromNode.x + 0.9 * (toNode.x - fromNode.x);
            const midY = fromNode.y + 0.9 * (toNode.y - fromNode.y);
            const weightLabel = document.createElementNS(svgNS, 'text');
            weightLabel.setAttribute('x', midX);
            weightLabel.setAttribute('y', midY);
            weightLabel.setAttribute('class', 'edge-weight');
            weightLabel.textContent = edge.weight;
            svg.appendChild(weightLabel);
        }
    });

    nodes.forEach(node => {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 10);
        circle.setAttribute('class', 'node');
        svg.appendChild(circle);

        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('class', 'node-label');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.textContent = node.id;
        svg.appendChild(text);
    });

    graphContainer.appendChild(svg);
}

function generateRandomGraph() {
    const numberOfNodes = Math.floor(Math.random() * 4) + 3;
    const maxEdges = numberOfNodes * (numberOfNodes - 1); 
    const numberOfEdges = Math.min(Math.floor(Math.random() * (numberOfNodes * 2)) + numberOfNodes, maxEdges);

    nodes.length = 0;
    edges.length = 0;
    const existingEdges = new Set();

    for (let i = 1; i <= numberOfNodes; i++) {
        const containerRect = graphContainer.getBoundingClientRect();
        nodes.push({
            id: i,
            x: Math.random() * (containerRect.width - 50) + 25,
            y: Math.random() * (containerRect.height - 50) + 25,
        });
    }

    while (edges.length < numberOfEdges) {
        const fromNode = Math.floor(Math.random() * numberOfNodes) + 1;
        const toNode = Math.floor(Math.random() * numberOfNodes) + 1;

        if (fromNode !== toNode) {
            const edgeKey = `${fromNode}-${toNode}`;
            if (!existingEdges.has(edgeKey)) {
                const weight = Math.floor(Math.random() * 10) + 1;
                edges.push({ from: fromNode, to: toNode, weight });
                existingEdges.add(edgeKey);     
            }
        }
    }

    renderGraph();
}

document.getElementById('generate-random-graph').addEventListener('click', () => {
    generateRandomGraph();
});