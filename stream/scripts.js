document.getElementById('streamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('codeInput').value;
    const streamUrl = `https://stream.revma.ihrhls.com/zc${code}`;
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = streamUrl;
    audioPlayer.play();

    const warningMessage = document.getElementById('warningMessage');
    warningMessage.classList.add('hidden');

    // Show warning message if stream fails to load within 5 seconds
    const loadTimeout = setTimeout(() => {
        if (audioPlayer.networkState === HTMLMediaElement.NETWORK_LOADING) {
            warningMessage.classList.remove('hidden');
            audioPlayer.pause();
        }
    }, 5000);

    audioPlayer.addEventListener('loadedmetadata', () => {
        clearTimeout(loadTimeout);
        warningMessage.classList.add('hidden');
        document.querySelector('.stream-info').style.display = 'block';
    });

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function() { audioPlayer.play(); });
        navigator.mediaSession.setActionHandler('pause', function() { audioPlayer.pause(); });
        navigator.mediaSession.setActionHandler('seekbackward', function() { audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0); });
        navigator.mediaSession.setActionHandler('seekforward', function() { audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 10, audioPlayer.duration); });

        audioPlayer.addEventListener('playing', () => {
            const metadata = navigator.mediaSession.metadata;
            if (metadata) {
                const artist = metadata.artist;
                const title = metadata.title;
                const artwork = metadata.artwork[0].src;

                document.getElementById('streamName').innerText = `Stream Name: ${code}`;
                document.getElementById('songName').innerText = `Song: ${title}`;
                document.getElementById('artistName').innerText = `Artist: ${artist}`;
                document.getElementById('artwork').src = artwork;
            }
        });
    }

    audioPlayer.addEventListener('error', () => {
        warningMessage.classList.remove('hidden');
        document.querySelector('.stream-info').style.display = 'none';
    });
});
