const audio = document.getElementById('myAudioPlayer');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stop');
const volumeSlider = document.getElementById('volume');

// Formato de tiempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Play / Pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸ Pause';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶ Play';
    }
});

// Stop
stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    playPauseBtn.textContent = '▶ Play';
});

// Volumen
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Tiempo actual
audio.addEventListener('timeupdate', () => {
    document.getElementById('currentTime')
        .textContent = formatTime(audio.currentTime);
});

// Duración
audio.addEventListener('loadedmetadata', () => {
    document.getElementById('duration')
        .textContent = formatTime(audio.duration);
});

// Auto-reset al finalizar
audio.addEventListener('ended', () => {
    playPauseBtn.textContent = '▶ Play';
    audio.currentTime = 0;
});