let previous = document.getElementById("prev");
let nexts = document.getElementById("next");
let albums = document.querySelectorAll(".card");
let plybtn = document.querySelectorAll(".add");
let song_info = document.querySelector(".song-info");
let song_bar_two = document.querySelector(".song-bar-two");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let song_duration = document.querySelector(".song-duration");
let song_bar = document.querySelector(".song-bar");
let dot = document.querySelector(".dot");
let pause = document.querySelector(".p");
let songBox = document.querySelector(".left .two .content");
let close = document.querySelector(".close");
let one = document.querySelector(".one");
let two = document.querySelector(".two");
let menu = document.querySelector(".menu");
let left = document.querySelector(".left");
let twoo=document.querySelector(".twoo");
let onee=document.querySelector(".song-dot-bar .song-bar");
let volrange=document.getElementById("volrange");
let songcontrols=document.querySelector(".song-controls");
let albumscroll=document.querySelector(".albums-scroll");
let volmute=document.querySelector(".vol img");

let songs = [];
let crrIndex = "";
let moviename = "";
let crrSong = new Audio();
let src;
let a;
let songsnames = [];

albums.forEach((album, i) => {
    album.addEventListener("mouseenter", () => {
        plybtn[i].style.opacity = '1';
        plybtn[i].style.cursor = "pointer";
    });

    album.addEventListener("mouseleave", () => {
        plybtn[i].style.opacity = '0';
    });

    album.addEventListener("click", async () => {
        songs = [];
        songBox.innerHTML = "";

        moviename = album.getAttribute("id").split("http://127.0.0.1:5501/files/")[1].replace("/", "");
        songs = await getSongs(album.getAttribute("id"));
        await main();
        console.log(songsnames);
        console.log(songs);
    });
});

previous.addEventListener("click", () => {
    playPreviousSong();
});

nexts.addEventListener("click", () => {
    playnexts();
});

pause.addEventListener("click", () => {
    if (crrSong.paused) {
        pause.innerText = "pause";
        crrSong.play();
    } else {
        pause.innerText = "play_arrow";
        crrSong.pause();
    }
});

menu.addEventListener("click", () => {
    adjustMenuDisplay();
});

close.addEventListener("click", () => {
    closeMenu();
});

window.addEventListener("load", () => {
    let songboxx = document.querySelector(".two .content")
    let divi=document.createElement("div");
    divi.setAttribute("id","idisplay");
    divi.style.height="10vh";
    divi.style.width="100%";
    songBox.append(divi);
    divi.innerText="Click On Any Album To Load Songs";
    divi.style.paddingTop="20vh";
    divi.style.textAlign="justify";

    let screenWidth =window.innerWidth;
    if (screenWidth <= 480) {
        songcontrols.style.width="40%";
        vol.removeChild(volimg);
        vol.removeChild(inputrange);}
});


crrSong.addEventListener("timeupdate", () => {
    setTimeout(()=>{
        song_duration.innerText = `${formatTime(crrSong.currentTime)}/${formatTime(crrSong.duration)}`;
    dot.style.left = (crrSong.currentTime / crrSong.duration) * 100 + "%";
    twoo.style.width = (crrSong.currentTime / crrSong.duration) * 100 + "%";
    },100)
});

volrange.addEventListener("click",()=>{
    let volumee=volrange.value/100;
    console.log(volumee)
    crrSong.volume=volumee;
})


crrSong.addEventListener("ended", () => {
    playnexts();
});
volmute.addEventListener("click",()=>{
   
    if(volrange.value=="0"){
        volimg.src="svgs/vol.svg";
         crrSong.volume="0.5";
         volrange.value="50";
    }
    else{
        volmute.src="svgs/mute.svg";
        crrSong.volume="0";
        volrange.value="0";
    }
})
song_bar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    dot.style.left = percent + "%";
    crrSong.currentTime = percent * crrSong.duration / 100;
    song_duration.innerText = `${formatTime(crrSong.currentTime)}/${formatTime(crrSong.duration)}`;
});

function playPreviousSong() {
    song_info.innerText = "";
    let psrc = ``;
    let prevIndex = crrIndex - 1;
    if (prevIndex < 0) {
        crrIndex = (songs.length) - 1;
        psrc = `http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200${songs[crrIndex]}`;
        song_info.innerText = formatSongInfo(songs[crrIndex]);
    } else {
        crrIndex = prevIndex;
        psrc = `http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200${songs[prevIndex]}`;
        song_info.innerText = formatSongInfo(songs[prevIndex]);
    }
    playSong(psrc);
}

function playnexts() {
    song_info.innerText = "";
    let nsrc = ``;
    let nIndex = crrIndex + 1;
    if (nIndex === songs.length) {
        crrIndex = 0;
        nsrc = `http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200${songs[crrIndex]}`;
        song_info.innerText = formatSongInfo(songs[crrIndex]);
    } else {
        crrIndex = nIndex;
        nsrc = `http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200${songs[nIndex]}`;
        song_info.innerText = formatSongInfo(songs[nIndex]);
    }
    playSong(nsrc);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');
    return `${minutesStr}:${secondsStr}`;
}

async function getSongs(basesource) {
    let response = await fetch(basesource);
    let data = await response.text();
    let div = document.createElement("div");
    div.innerHTML = data;
    let wrapper = div.querySelector("#wrapper").getElementsByTagName("a");
    for (let a of wrapper) {
        if (a.href.endsWith(".mp3") && a.href.includes("%5BiSongs")) {
            songs.push(a.href.split(`http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200`)[1]);
        }
    }
    return songs;
}

function playSong(audioSrc) {
    crrSong.src = audioSrc;
    crrSong.play();
}

function stopSong(audioSrc) {
    crrSong.src = audioSrc;
    crrSong.pause();
}

function formatSongInfo(song) {
    return song.replaceAll("%20-%20", " ").replaceAll(".mp3", "").replaceAll("%20", " ").slice(2);
}

async function main() {
    for (let s of songs) {
        let p = s.replaceAll("%20", " ");
        a = p.replaceAll("-", "");
        songsnames.push(a);
        let r = a.replace(".mp3", "");
        let div = document.createElement("div");
        div.setAttribute("class", "w");
        div.innerHTML = ` <div class="img"><span class="material-symbols-outlined">
                            music_note
                            </span></div>
        <ul><li class="font2">${r}</li></ul>`;
        songBox.append(div);
        div.addEventListener("click", () => {
            crrIndex = songs.indexOf(s);
            src = `http://127.0.0.1:5501/files/${moviename}/%5BiSongs.info%5D%200${s}`;
            song_info.innerText = r.slice(2);
            playSong(src);
            if (pause.innerText === "play_arrow") {
                pause.innerText = "pause";
            }
        });
    }
}
let vol=document.querySelector(".vol");
let volimg=document.querySelector(".vol img");
let inputrange=document.querySelector(".vol input");
function adjustMenuDisplay() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth <= 480) {
        vol.removeChild(volimg);
        vol.removeChild(inputrange);
        left.style.width = '100%';
        left.style.height = '100vh';
        close.style.left = "72%";
        one.style.height = "auto";
        two.style.height = "auto";
    } else if (screenWidth <= 768) {
        left.style.width = '70%';
        left.style.height = '100vh';
        close.style.left = "90%";
        one.style.height = "auto";
        two.style.height = "auto";
    } else if (screenWidth > 1400) {
        left.style.width = "23%";
    } else {
        left.style.width = '45%';
        left.style.height = '100vh';
        close.style.left = "70%";
        one.style.height = "auto";
        two.style.height = "auto";
    }

    left.style.left = "0";
}

function closeMenu() {
    left.style.left = "-200%";
    left.style.width = "23%";
    left.style.height = "98vh";
}

main();
console.log(crrIndex);
