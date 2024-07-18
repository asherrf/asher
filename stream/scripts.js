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
