document.getElementById('streamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('codeInput').value;
    const streamUrl = `https://stream.revma.ihrhls.com/zc${code}`;
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = streamUrl;
    audioPlayer.play();

    fetch(`https://stream.revma.ihrhls.com/zc${code}/metadata`)
        .then(response => response.json())
        .then(data => {
            const metadata = data.title;
            const [artist, title] = metadata.split(' - text="')[1].split('"')[0].split(' / ');
            const artworkUrl = metadata.split('amgArtworkURL="')[1].split('"')[0];

            document.getElementById('streamName').innerText = `Stream Name: ${data.streamName}`;
            document.getElementById('songName').innerText = `Song: ${title}`;
            document.getElementById('artistName').innerText = `Artist: ${artist}`;
            document.getElementById('artwork').src = artworkUrl;

            document.querySelector('.stream-info').style.display = 'block';
        })
        .catch(error => console.error('Error fetching metadata:', error));
});

document.getElementById('playButton').addEventListener('click', function() {
    document.getElementById('audioPlayer').play();
});

document.getElementById('pauseButton').addEventListener('click', function() {
    document.getElementById('audioPlayer').pause();
});

document.getElementById('rewindButton').addEventListener('click', function() {
    document.getElementById('audioPlayer').currentTime = 0;
});

document.getElementById('volumeSlider').addEventListener('input', function() {
    document.getElementById('audioPlayer').volume = this.value;
});
