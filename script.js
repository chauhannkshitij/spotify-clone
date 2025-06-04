let currentSong = new Audio();

function formatSecondsToMinutes(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
}

async function getsongs() {
  try {
    const response = await fetch("http://127.0.0.1:3000/songs/");
    if (!response.ok) throw new Error("Failed to fetch songs list.");
    const text = await response.text();

    const div = document.createElement("div");
    div.innerHTML = text;
    const links = Array.from(div.getElementsByTagName("a"));

    return links
      .filter((link) => link.href.endsWith(".mp3"))
      .map((link) => link.href.split("/songs/")[1]);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
  const songs = await getsongs();
  const songUL = document.querySelector(".songList ul");

  if (songs.length === 0) {
    songUL.innerHTML = "<li>No songs available</li>";
    return;
  }

  const songItems = songs
    .map(
      (song) => `
        <li>
            <img class="invert" src="img/music.svg" alt="Music">
            <div class="info">
                <div class="songname">${song.replaceAll("%20", " ")}</div>
                <div class="songartist">Kshitij</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play-button-svgrepo-com.svg" alt="Play">
            </div>
        </li>
    `
    )
    .join("");

  songUL.innerHTML = songItems;

  // Play the first song by default
  //if (songs.length > 0) {
    //playMusic(songs[0].replaceAll("%20", " "));
  //}

  //attach an event to listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  //attach an event listener to play, next and previous 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play1.svg";
    }
  });

  //listen for time 
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatSecondsToMinutes(currentSong.currentTime)}/${formatSecondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
 
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = currentSong.duration * percent / 100;
  });

  // previous next
  previous.addEventListener("click", ()=>{
     let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    console.log(songs, index);
    if((index - 1)>0)
    playMusic(songs[index-1])
  })
  next.addEventListener("click", ()=>{
    console.log("next")

    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index + 1)> length)
    playMusic(songs[index+1])
    
  })

  //volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume = parseInt(e.target.value)/100
  })


}

main();