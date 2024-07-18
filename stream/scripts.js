async function loadStream() {
    const stationCode = document.getElementById('stationCode').value;
    if (!stationCode) {
        alert('Please enter a station code.');
        return;
    }

    const streamUrl = `https://stream.revma.ihrhls.com/zc${stationCode}`;
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = streamUrl;
    audioPlayer.play();

    document.getElementById('playerContainer').style.display = 'block';

    // Fetch metadata
    try {
        const response = await fetch(streamUrl, { method: 'GET' });
        const metadata = response.headers.get('icy-description');
        updateMetadata(metadata);
    } catch (error) {
        console.error('Error fetching stream metadata:', error);
    }
}

function updateMetadata(metadata) {
    if (!metadata) return;

    const [artistInfo, songInfo, ...rest] = metadata.split(' - ');
    const artist = artistInfo.split(' / ').join(', ');
    const song = songInfo.split('text="')[1].split('"')[0];
    const artworkUrl = metadata.split('amgArtworkURL="')[1].split('"')[0];

    document.getElementById('streamName').innerText = artist;
    document.getElementById('songInfo').innerText = song;
    const artworkElement = document.getElementById('artwork');
    artworkElement.src = artworkUrl;
    artworkElement.style.display = 'block';
}
