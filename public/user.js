setInterval(() => {
    let storiesEl = [...document.querySelectorAll(".story").values()];
    storiesEl.forEach(storyEl => {
        storyEl.style.height = `${storyEl.scrollWidth}px`;
    });
}, 100);

let stview = document.querySelector("body#user .showstory .viewcon");
let videoEl = stview.querySelector("video");
stview.addEventListener('mousedown', function () { stview.querySelector("video").pause(); });
stview.addEventListener('mouseup', function () { stview.querySelector("video").play(); });

videoEl.addEventListener('timeupdate', function () {
    const progress = (videoEl.currentTime / videoEl.duration) * 100;
    document.querySelector("body#user .showstory .viewcon .pbar .prog").style.width = `${progress}%`;
});

function showStory(videoURL, type) {
    let stviewcon = document.querySelector("body#user .showstory");
    let stview = document.querySelector(`body#user .showstory ${type == "photo" ? "img" : "video"}`);
    stview.src = videoURL;

    loadingScreen(true);

    stview[type == "photo" ? "onload" : "onloadedmetadata"] = function () {
        loadingScreen(false);

        stviewcon.style.display = "flex";
        document.body.style.overflow = "hidden";
        if (!/(iPhone|iPad|iPod)/.test(navigator.userAgent)) document.documentElement.requestFullscreen();
        document.querySelector(`body#user .showstory .opbts a#ds`).href = videoURL;
        if (type == "photo") {
            document.querySelector(`body#user .showstory .opbts i#svx`).style.display = "none";
            document.querySelector(`body#user .showstory .pbar`).style.display = "none";
        }
        stview.style.display = "flex";
        if (type == "video") {
            stview.play();
        }
    }
}

function exitShow() {
    let stviewcon = document.querySelector("body#user .showstory");
    stviewcon.style.display = "none";
    document.body.style.overflow = "";
    if (!/(iPhone|iPad|iPod)/.test(navigator.userAgent)) document.exitFullscreen();
    document.querySelector(`body#user .showstory .opbts a#ds`).href = "";
    document.querySelector(`body#user .showstory .opbts i#svx`).style.color = "#eee";
    document.querySelector(`body#user .showstory .opbts i#svx`).style.display = "block";
    document.querySelector(`body#user .showstory .pbar`).style.display = "flex";

    let stviewimg = document.querySelector("body#user .showstory img");
    stviewimg.style.display = "none";
    stviewimg.src = '';
    let stviewvideo = document.querySelector("body#user .showstory video");
    stviewvideo.muted = false;
    stviewvideo.style.display = "none";
    stviewvideo.src = '';
}

function muteToggleVideo() {
    let stviewvideo = document.querySelector("body#user .showstory video");
    stviewvideo.muted = !stviewvideo.muted;
    document.querySelector(`body#user .showstory .opbts i#svx`).style.color = stviewvideo.muted ? "red" : "#eee";
}

function loadingScreen(display) {
    if (display) {
        document.body.style.overflow = "hidden";
        document.querySelector("body#user .loadingScreen").style.display = "flex";
    } else {
        document.body.style.overflow = "";
        document.querySelector("body#user .loadingScreen").style.display = "none";
    }
}