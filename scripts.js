// getting all the elements
var body = document.querySelector('body');
var screen = document.querySelector('.screen');
var albumArt = document.querySelector('.album-art img');
var songTitle = document.querySelector('.song-title');
var scrollingText = document.querySelector('#scrolling-text');
var artistName = document.querySelector('.artist-name');

var shuffleButton = document.querySelector('.shuffle-btn');
var previousButton = document.querySelector('.previous-btn');
var playPauseButton = document.querySelector('.play-pause-btn');
var nextButton = document.querySelector('.next-btn');
var repeatButton = document.querySelector('.repeat-btn');

var audioPlayer = document.querySelector('#audio-player');
var slider = document.querySelector('#slider');
var currentTime = document.querySelector('.current-time');
var totalDuration = document.querySelector('.total-duration');

// declaring and initialising variables
var currentSongIndex = 0;
var SONGS = [];
var songSequence = [];
var isPlaying = false;
var shuffle = true;
var repeat = false;
var updateTimer;
var requestAnimation;

fetch('./songs.json')
  .then((response) => response.json())
  .then((songs) => {
    // initialising our global variables
    SONGS = songs;

    shuffleSongs();
    loadSong();

    // add event listeners
    // once the song ends
    audioPlayer.addEventListener('ended', onEnded);

    // slider when changing the position
    slider.addEventListener('mousedown', () =>
      cancelAnimationFrame(requestAnimation)
    );
    slider.addEventListener('touchstart', () =>
      cancelAnimationFrame(requestAnimation)
    );
    slider.addEventListener('change', moveTo);
    slider.addEventListener('mouseup', changeSongDetails);
    slider.addEventListener('touchend', changeSongDetails);

    // play & pause
    playPauseButton.addEventListener('click', playPauseSong);

    // previous
    previousButton.addEventListener('click', previousSong);

    // next
    nextButton.addEventListener('click', nextSong);

    // shuffle
    shuffleButton.addEventListener('click', shuffleSongs);

    // repeat
    repeatButton.addEventListener('click', repeatSongs);
  });

function loadSong() {
  audioPlayer.src = SONGS[songSequence[currentSongIndex]].src;
  audioPlayer.load();
  audioPlayer.onloadeddata = changeSongDetails;

  //   changing DOM
  playPauseButton.setAttribute('aria-active', 'play');
}

function playPauseSong() {
  isPlaying ? pauseSong() : playSong();
}

function playSong() {
  audioPlayer.play();
  isPlaying = true;

  //   changing DOM
  playPauseButton.setAttribute('aria-active', 'pause');
}

function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;

  //   changing DOM
  playPauseButton.setAttribute('aria-active', 'play');
}

function onEnded() {
  if (repeat === null) {
    playSong();
  } else if (
    repeat === true ||
    (repeat === false && currentSongIndex < SONGS.length - 1)
  ) {
    nextSong();
  } else {
    currentSongIndex = 0;
    loadSong();
    isPlaying = false;
  }
}

function nextSong() {
  if (currentSongIndex === SONGS.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex += 1;
  }

  loadSong();
  playSong();
}

function previousSong() {
  if (currentSongIndex === 0) {
    currentSongIndex = SONGS.length - 1;
  } else {
    currentSongIndex -= 1;
  }

  loadSong();
  playSong();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleSongs() {
  shuffle = !shuffle;
  songSequence = shuffle
    ? shuffleArray(songSequence)
    : Array.from(Array(SONGS.length), (num, index) => index);

  // changeDOM
  shuffleButton.setAttribute('aria-active', shuffle ? 'shuffle' : 'no-shuffle');
}

function repeatSongs() {
  repeat = repeat === false ? true : repeat === true ? null : false;

  //   changing DOM
  repeatButton.setAttribute(
    'aria-active',
    repeat === false ? 'no-repeat' : repeat === true ? 'repeat' : 'repeat-one'
  );
}

function seekTimerAnimation() {
  // Ensure we only change the numbers once the values are loaded
  if (!isNaN(audioPlayer.duration)) {
    //   calculating the current song time
    var songCurrentMinutes = Math.floor(audioPlayer.currentTime / 60);
    var songCurrentSeconds = Math.floor(
      audioPlayer.currentTime - songCurrentMinutes * 60
    );
    songCurrentSeconds =
      songCurrentSeconds < 10 ? '0' + songCurrentSeconds : songCurrentSeconds;

    //   calculating the current duration of the song
    var songDurationMinutes = Math.floor(audioPlayer.duration / 60);
    var songDurationSeconds = Math.floor(
      audioPlayer.duration - songDurationMinutes * 60
    );
    songDurationSeconds =
      songDurationSeconds < 10
        ? '0' + songDurationSeconds
        : songDurationSeconds;

    currentTime.innerText = `${songCurrentMinutes}:${songCurrentSeconds}`;
    totalDuration.innerText = `${songDurationMinutes}:${songDurationSeconds}`;
    slider.value = (audioPlayer.currentTime * 100) / audioPlayer.duration;

    requestAnimation = requestAnimationFrame(seekTimerAnimation);
  }
}

function moveTo() {
  audioPlayer.currentTime = (audioPlayer.duration * slider.value) / 100;
}

// changing the DOM
function changeSongDetails() {
  body.style.background = `linear-gradient(
    180deg,
    ${SONGS[songSequence[currentSongIndex]].backgroundColor}e2 0%,
    ${SONGS[songSequence[currentSongIndex]].backgroundColor} 80%
  )`;
  screen.style.background = `linear-gradient(
    180deg,
    ${SONGS[songSequence[currentSongIndex]].backgroundColor} 0%,
    #000000 80%
  )`;
  albumArt.src = SONGS[songSequence[currentSongIndex]].image;

  scrollingText.innerText = `${SONGS[songSequence[currentSongIndex]].name} - ${
    SONGS[songSequence[currentSongIndex]].artist
  }`;
  songTitle.innerText = SONGS[songSequence[currentSongIndex]].name;
  artistName.innerText = SONGS[songSequence[currentSongIndex]].artist;
  requestAnimation = requestAnimationFrame(seekTimerAnimation);
}

nodeMarquee({
  parent: 'h1',
  speed: 1,
});
