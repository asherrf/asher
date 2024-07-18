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
        const metadata = audioPlayer.currentSrc; // Assuming metadata is in the currentSrc
        const metadataString = audioPlayer.src.split("?")[1]; // Extract the metadata from the URL

        const [artist, title] = metadataString.split(' - text="')[1].split('"')[0].split(' / ');
        const artworkUrl = metadataString.split('amgArtworkURL="')[1].split('"')[0];

        document.getElementById('streamName').innerText = `Stream Name: ${metadata}`;
        document.getElementById('songName').innerText = `Song: ${title}`;
        document.getElementById('artistName').innerText = `Artist: ${artist}`;
        document.getElementById('artwork').src = artworkUrl;
    });

    audioPlayer.addEventListener('error', () => {
        warningMessage.classList.remove('hidden');
        document.querySelector('.stream-info').style.display = 'none';
    });
});
