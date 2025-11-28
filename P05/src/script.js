const video = document.getElementById('myVideoPlayer');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stop');
const volumeSlider = document.getElementById('volume');
const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');
const muteBtn = document.getElementById('mute');
const playbackRateSelect = document.getElementById('playbackRate');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');

const CURRENT_TIME_KEY = 'current_time';

let previousVolume = 1;

const videos = [
    "./assets/video1.mp4",
    "./assets/video2.mp4",
    "./assets/video3.mp4",
];

let currentIndex = 0;
let isScrolling = false;

function loadVideo(index) {
    if (index < 0 || index >= videos.length) return;
    currentIndex = index;
    video.src = videos[currentIndex];
    video.play();
}

window.addEventListener("wheel", (event) => {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) {
        loadVideo(currentIndex + 1);
    } else if (event.deltaY < 0) {
        loadVideo(currentIndex - 1);
    }

    setTimeout(() => isScrolling = false, 500);
});

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayPauseButton() {
    if (video.paused) {
        playPauseBtn.textContent = '▶ Play';
    } else {
        playPauseBtn.textContent = '⏸ Pause';
    }
}

// Play / Pause
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    updatePlayPauseButton();
});

// Stop
stopBtn.addEventListener('click', () => {
    video.pause();
    video.currentTime = 0;
    updatePlayPauseButton();
});

// Volumen
volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    video.volume = value;
    if (value === 0) {
        muteBtn.textContent = '🔇';
    } else {
        muteBtn.textContent = '🔊';
    }
});

// Botón de mute
muteBtn.addEventListener('click', () => {
    if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = previousVolume || 1;
        volumeSlider.value = video.volume * 100;
        muteBtn.textContent = '🔊';
    } else {
        previousVolume = video.volume;
        video.muted = true;
        video.volume = 0;
        volumeSlider.value = 0;
        muteBtn.textContent = '🔇';
    }
});

// Velocidad de reproducción
playbackRateSelect.addEventListener('change', (e) => {
    const rate = parseFloat(e.target.value);
    video.playbackRate = rate;
});

// Salto atrás
backwardBtn.addEventListener('click', () => {
    video.currentTime = Math.max(video.currentTime - 5, 0);
});

// Salto adelante
forwardBtn.addEventListener('click', () => {
    video.currentTime = Math.min(video.currentTime + 5, video.duration);
});

// Actualización de tiempo y barra de progreso
video.addEventListener('timeupdate', () => {
    document.getElementById('currentTime').textContent = formatTime(video.currentTime);

    if (!isNaN(video.duration) && video.duration > 0) {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }

    if (!video.paused) {
        localStorage.setItem(CURRENT_TIME_KEY, video.currentTime.toString());
    }
});

// Duración total
video.addEventListener('loadedmetadata', () => {
    document.getElementById('duration').textContent = formatTime(video.duration);

    const savedTime = localStorage.getItem(CURRENT_TIME_KEY);
    if (savedTime !== null) {
        const time = parseFloat(savedTime);
        if (!isNaN(time) && time < video.duration) {
            video.currentTime = time;
        }
    }
});

// reset
video.addEventListener('ended', () => {
    updatePlayPauseButton();
});

// Click en la barra de progreso para cambiar currentTime
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;

    if (!isNaN(video.duration) && video.duration > 0) {
        video.currentTime = percent * video.duration;
    }
});
