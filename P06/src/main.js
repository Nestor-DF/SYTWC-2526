import "./style.css";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 15; // tamaño de cada celda en píxeles
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);

let grid = createEmptyGrid();
let running = false;

let lastTime = 0;
let accumulator = 0;

// Velocidad en ms entre generaciones
let stepInterval = 200;

const btnPlayPause = document.getElementById("btn-play-pause");
const btnStep = document.getElementById("btn-step");
const btnClear = document.getElementById("btn-clear");
const btnRandom = document.getElementById("btn-random");
const speedRange = document.getElementById("speed-range");
const speedLabel = document.getElementById("speed-label");

speedLabel.textContent = stepInterval;

btnPlayPause.addEventListener("click", () => {
    running = !running;
    btnPlayPause.textContent = running ? "⏸ Pausar" : "▶ Iniciar";
});

btnStep.addEventListener("click", () => {
    if (!running) {
        grid = computeNextGeneration(grid);
        draw();
    }
});

btnClear.addEventListener("click", () => {
    grid = createEmptyGrid();
    draw();
});

btnRandom.addEventListener("click", () => {
    randomizeGrid(grid);
    draw();
});

speedRange.addEventListener("input", (e) => {
    stepInterval = Number(e.target.value);
    speedLabel.textContent = stepInterval;
});

// Permitir clicks en el canvas para activar/desactivar celdas
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    // Comprobar que está dentro del grid
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        grid[row][col] = grid[row][col] ? 0 : 1;
        draw();
    }
});

function createEmptyGrid() {
    const g = [];
    for (let row = 0; row < ROWS; row++) {
        const rowArr = [];
        for (let col = 0; col < COLS; col++) {
            rowArr.push(0); // 0 = muerta, 1 = viva
        }
        g.push(rowArr);
    }
    return g;
}

function randomizeGrid(g) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            g[row][col] = Math.random() < 0.2 ? 1 : 0; // 20% prob de estar viva
        }
    }
}

function computeNextGeneration(current) {
    const next = createEmptyGrid();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const alive = current[row][col] === 1;
            const neighbors = countAliveNeighbors(current, row, col);

            if (alive) {
                if (neighbors === 2 || neighbors === 3) {
                    next[row][col] = 1;
                } else {
                    next[row][col] = 0;
                }
            } else {
                if (neighbors === 3) {
                    next[row][col] = 1;
                } else {
                    next[row][col] = 0;
                }
            }
        }
    }

    return next;
}

function countAliveNeighbors(g, row, col) {
    let count = 0;

    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (y === 0 && x === 0) continue; // ignorar la propia célula

            const newRow = row + y;
            const newCol = col + x;

            // ignorar células fuera de los márgenes
            if (
                newRow >= 0 &&
                newRow < ROWS &&
                newCol >= 0 &&
                newCol < COLS &&
                g[newRow][newCol] === 1
            ) {
                count++;
            }
        }
    }

    return count;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ea005e";
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col] === 1) {
                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;

    for (let col = 0; col <= COLS; col++) {
        const x = col * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let row = 0; row <= ROWS; row++) {
        const y = row * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    // Acumulamos tiempo para decidir cuándo pasar a la siguiente generación
    if (running) {
        accumulator += delta;

        if (accumulator >= stepInterval) {
            grid = computeNextGeneration(grid);
            accumulator = 0;
        }
    }

    draw();
    requestAnimationFrame(gameLoop);
}

draw();
requestAnimationFrame(gameLoop);
