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

    audioPlayer.addEventListener('playing', () => {
        setInterval(() => {
            const metadata = audioPlayer.src.split("?")[1]; // Attempting to get metadata from the stream
            if (metadata) {
                const [artist, title] = metadata.split(' - text="')[1].split('"')[0].split(' / ');
                const artworkUrl = metadata.split('amgArtworkURL="')[1].split('"')[0];

                document.getElementById('streamName').innerText = `Stream Name: ${code}`;
                document.getElementById('songName').innerText = `Song: ${title}`;
                document.getElementById('artistName').innerText = `Artist: ${artist}`;
                document.getElementById('artwork').src = artworkUrl;
            }
        }, 10000); // Check metadata every 10 seconds
    });

    audioPlayer.addEventListener('error', () => {
        warningMessage.classList.remove('hidden');
        document.querySelector('.stream-info').style.display = 'none';
    });
});
