const audio = document.getElementById('myAudioPlayer');
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

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlayPauseButton() {
    if (audio.paused) {
        playPauseBtn.textContent = '▶ Play';
    } else {
        playPauseBtn.textContent = '⏸ Pause';
    }
}

// Play / Pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayPauseButton();
});

// Stop
stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayPauseButton();
});

// Volumen
volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    audio.volume = value;
    if (value === 0) {
        muteBtn.textContent = '🔇 Unmute';
    } else {
        muteBtn.textContent = '🔊 Mute';
    }
});

// Botón de mute
muteBtn.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = previousVolume || 1;
        volumeSlider.value = audio.volume * 100;
        muteBtn.textContent = '🔊 Mute';
    } else {
        previousVolume = audio.volume;
        audio.muted = true;
        audio.volume = 0;
        volumeSlider.value = 0;
        muteBtn.textContent = '🔇 Unmute';
    }
});

// Velocidad de reproducción
playbackRateSelect.addEventListener('change', (e) => {
    const rate = parseFloat(e.target.value);
    audio.playbackRate = rate;
});

// Salto adelante
backwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
});

// Salto atrás
forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || audio.currentTime + 10);
});

// Actualización de tiempo y barra de progreso
audio.addEventListener('timeupdate', () => {
    document.getElementById('currentTime').textContent = formatTime(audio.currentTime);

    if (!isNaN(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }

    if (!audio.paused) {
        localStorage.setItem(CURRENT_TIME_KEY, audio.currentTime.toString());
    }
});

// Duración total
audio.addEventListener('loadedmetadata', () => {
    document.getElementById('duration').textContent = formatTime(audio.duration);

    const savedTime = localStorage.getItem(CURRENT_TIME_KEY);
    if (savedTime !== null) {
        const time = parseFloat(savedTime);
        if (!isNaN(time) && time < audio.duration) {
            audio.currentTime = time;
        }
    }
});

// Auto-reset
audio.addEventListener('ended', () => {
    updatePlayPauseButton();
});

// Click en la barra de progreso para cambiar currentTime
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;

    if (!isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = percent * audio.duration;
    }
});
