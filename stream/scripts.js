document.getElementById('streamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('codeInput').value;
    const streamUrl = `https://stream.revma.ihrhls.com/zc${code}`;
    const audioPlayer = document.getElementById('audioPlayer');
    const warningMessage = document.getElementById('warningMessage');

    // Show warning message if stream fails to load within 5 seconds
    const loadTimeout = setTimeout(() => {
        if (audioPlayer.networkState === HTMLMediaElement.NETWORK_LOADING) {
            warningMessage.classList.remove('hidden');
            audioPlayer.pause();
        }
    }, 5000);

    // Fetch the final redirected URL
    fetch(streamUrl, { method: 'HEAD', redirect: 'follow' })
        .then(response => {
            if (response.ok) {
                const finalUrl = response.url;
                audioPlayer.src = finalUrl;
                audioPlayer.play();

                audioPlayer.addEventListener('loadedmetadata', () => {
                    clearTimeout(loadTimeout);
                    warningMessage.classList.add('hidden');
                    document.querySelector('.stream-info').style.display = 'block';
                });

                audioPlayer.addEventListener('playing', () => {
                    // Assuming metadata is present in the final URL
                    const metadataString = finalUrl.split("?")[1]; // Extract the metadata from the URL

                    if (metadataString) {
                        const [artist, title] = metadataString.split(' - text="')[1].split('"')[0].split(' / ');
                        const artworkUrl = metadataString.split('amgArtworkURL="')[1].split('"')[0];

                        document.getElementById('streamName').innerText = `Stream Name: ${code}`;
                        document.getElementById('songName').innerText = `Song: ${title}`;
                        document.getElementById('artistName').innerText = `Artist: ${artist}`;
                        document.getElementById('artwork').src = artworkUrl;
                    }
                });

                audioPlayer.addEventListener('error', () => {
                    warningMessage.classList.remove('hidden');
                    document.querySelector('.stream-info').style.display = 'none';
                });
            } else {
                warningMessage.classList.remove('hidden');
            }
        })
        .catch(() => {
            warningMessage.classList.remove('hidden');
        });
});
