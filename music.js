let globalAudio = null;

function initializeMusic() {
    if (globalAudio) return;

    globalAudio = new Audio('https://stream.zeno.fm/0r0xa792kwzuv');
    globalAudio.loop = true;
    globalAudio.style.display = 'none';
    document.body.appendChild(globalAudio);

    const savedVol = localStorage.getItem('catgirlVolume');
    globalAudio.volume = savedVol !== null ? parseFloat(savedVol) : 0.5;

    globalAudio.muted = true;
    globalAudio.play().then(() => {
        globalAudio.muted = false;
    }).catch((err) => {
        console.log('Ошибка музыки:', err);
    });

    function unmute() {
        if (globalAudio && globalAudio.muted) {
            globalAudio.muted = false;
            globalAudio.play().catch(() => {});
        }
        document.removeEventListener('click', unmute);
        document.removeEventListener('keydown', unmute);
        document.removeEventListener('touchstart', unmute);
    }
    document.addEventListener('click', unmute);
    document.addEventListener('keydown', unmute);
    document.addEventListener('touchstart', unmute);
}

function setVolumeUI(volumeSlider, volumeBtn) {
    if (!globalAudio) initializeMusic();

    const savedVol = localStorage.getItem('catgirlVolume');
    const initVol = savedVol !== null ? parseFloat(savedVol) : 0.5;
    globalAudio.volume = initVol;
    volumeSlider.value = initVol * 100;
    volumeBtn.textContent = initVol === 0 ? '✕' : '♪';

    volumeSlider.addEventListener('input', () => {
        const v = volumeSlider.value / 100;
        globalAudio.volume = v;
        localStorage.setItem('catgirlVolume', v);
        volumeBtn.textContent = v === 0 ? '✕' : '♪';
    });

    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        globalAudio.muted = false;
        globalAudio.play().catch(() => {});
        volumeSlider.classList.toggle('show');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMusic);
} else {
    initializeMusic();
}
