import "./style.css";

// ---------- Configuración del grid ----------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 10; // tamaño de cada celda en píxeles
const COLS = Math.floor(canvas.width / CELL_SIZE);
const ROWS = Math.floor(canvas.height / CELL_SIZE);

let grid = createEmptyGrid();
let running = false;

// Para el game loop con deltaTime
let lastTime = 0;
let accumulator = 0;

// Velocidad en ms entre generaciones (controlada con el slider)
let stepInterval = 200;

// ---------- Inicialización de UI ----------
const btnPlayPause = document.getElementById("btn-play-pause");
const btnStep = document.getElementById("btn-step");
const btnClear = document.getElementById("btn-clear");
const btnRandom = document.getElementById("btn-random");
const speedRange = document.getElementById("speed-range");
const speedLabel = document.getElementById("speed-label");

// Mostrar valor inicial del slider
speedLabel.textContent = stepInterval;

// Eventos de botones
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

    // Comprobamos que está dentro del grid
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        grid[row][col] = grid[row][col] ? 0 : 1;
        draw();
    }
});

// ---------- Funciones de grid ----------
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
            g[row][col] = Math.random() < 0.3 ? 1 : 0; // 30% prob de estar viva
        }
    }
}

// Calcula la siguiente generación a partir de una grid dada
function computeNextGeneration(current) {
    const next = createEmptyGrid();

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const alive = current[row][col] === 1;
            const neighbors = countAliveNeighbors(current, row, col);

            if (alive) {
                // Reglas para células vivas
                if (neighbors === 2 || neighbors === 3) {
                    next[row][col] = 1; // sobrevive
                } else {
                    next[row][col] = 0; // muere
                }
            } else {
                // Reglas para células muertas
                if (neighbors === 3) {
                    next[row][col] = 1; // nace
                } else {
                    next[row][col] = 0; // sigue muerta
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

            // Modo sin wrapping: ignoramos celdas fuera del board
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

// ---------- Render (dibujado) ----------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar celdas vivas
    ctx.fillStyle = "#00e676"; // color de células vivas
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (grid[row][col] === 1) {
                const x = col * CELL_SIZE;
                const y = row * CELL_SIZE;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Dibujar grid
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;

    // Líneas verticales
    for (let col = 0; col <= COLS; col++) {
        const x = col * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Líneas horizontales
    for (let row = 0; row <= ROWS; row++) {
        const y = row * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// ---------- Game Loop con requestAnimationFrame y deltaTime ----------
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

    // Redibujar siempre, aunque esté en pausa, para reflejar cambios por clicks
    draw();

    requestAnimationFrame(gameLoop);
}

// Iniciar el loop
randomizeGrid(grid); // si quieres empezar con algo aleatorio, si no, comenta esta línea
draw();
requestAnimationFrame(gameLoop);
