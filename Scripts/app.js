//DOM Related Variables

import { replaceTheme } from "./settings.js";

let time = document.getElementById("time");
const headerEl = document.getElementsByTagName("header");
const mainEl = document.getElementsByTagName("main");

const doneSessionEl = document.getElementById("done-session");
const currentCycleEl = document.getElementById("current-cycle");
const popupContainer = document.querySelector(".popup__container");
const popup = document.getElementById("popup");

const startBtn = document.getElementById("start-btn");
const resumeBtn = document.getElementById("resume-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const settingsBtn = document.getElementById("settings-btn");
const settingsContainer = document.getElementById("settings__container");

//======================//

let doneSessionCounter = 0;
let cycleCount = 0;
let clickedFirstTime = false; //Flag used to display one time the used settings popup. This will prevent from showing the popup whenever the user unpauses the timer

const storedSettings = JSON.parse( localStorage.getItem("userSettings") ) || null;

//* Please feel free to modify this object as you see fit if you want to test the app as quickly as possible.

const defaultSettings = {
    activeMinutes: 24,
    breakMinutes: 5,
    longBreakMinutes: 10,
    theme: "default-theme"
};

const settingsToUse = {
    localActiveMinutes: storedSettings?.activeMinutes ?? defaultSettings.activeMinutes,
    
    localBreakMinutes: storedSettings?.breakMinutes ?? defaultSettings.breakMinutes,
    
    localLongBreakMinutes: storedSettings?.longBreakMinutes ?? defaultSettings.longBreakMinutes,
    
    localTheme: storedSettings?.theme ?? defaultSettings.theme,
};

let currentMode = null;
let timer = null;

let usedMinutes = null;
let activeSeconds = 60;
let pausedSeconds = 0;

const makeDeepCopy = () => { return JSON.parse( JSON.stringify(settingsToUse) ); }

const settingsCopy = makeDeepCopy();

console.log(settingsCopy);

function runTimer(settings) {
    playStartSound();

    switch (currentMode) {
        case "activeSession": {
            if (usedMinutes !== null) { usedMinutes = usedMinutes; } //* Avoids resetting the "usedMinutes" if already has an assigned value

            else { usedMinutes = settings.localActiveMinutes; }
    
            break;
        }

        case "breakSession": {
            if (usedMinutes !== null) { usedMinutes = usedMinutes; }

            else { usedMinutes = settings.localBreakMinutes; }

            break;
        }

        case "longBreakSession": {
            if (usedMinutes !== null) { usedMinutes = usedMinutes; }

            else { usedMinutes = settings.localLongBreakMinutes; }

            break;
        }
    }

    timer = setInterval(() => {
        --activeSeconds;
    
        if (activeSeconds < 0) {
            usedMinutes--;
            activeSeconds = 59;
        }
    
        //* =====DOM Updating Section===== *//
    
        let currentMinutes = usedMinutes < 10 ? "0" + usedMinutes : usedMinutes;
        let currentSeconds = activeSeconds < 10 ? "0" + activeSeconds : activeSeconds;
    
        time.textContent = `${currentMinutes}:${currentSeconds}`;
    
        //* ============================== *//
    
        if (usedMinutes === 0 && activeSeconds === 10) { play10SecsLeftSound(); }
    
        if (usedMinutes === 0 && activeSeconds === 0) {
            playResumeSound(); //Asset recycled on purpose

            switch (currentMode) {
                case "activeSession": {
                    headerEl[0].className = "break-theme";
                    mainEl[0].className = "break-theme";

                    currentMode = "breakSession";
                    usedMinutes = settings.localBreakMinutes;
                    
                    break;
                }

                case "breakSession": {
                    //Reverts back to the selected theme
                    headerEl[0].className = settings.localTheme;
                    mainEl[0].className = settings.localTheme;

                    currentMode = "activeSession";
                    usedMinutes = settings.localActiveMinutes;

                    cycleCount++;
                    currentCycleEl.textContent = `Current Session: ${cycleCount}`;
        
                    if (cycleCount === 4) { 
                        headerEl[0].className = "break-theme";
                        mainEl[0].className = "break-theme";

                        currentMode = "longBreakSession";
                        usedMinutes = settings.localLongBreakMinutes;
                    }

                    break;
                }

                case "longBreakSession": {
                    headerEl[0].className = settings.localTheme;
                    mainEl[0].className = settings.localTheme;
                    
                    doneSessionCounter++;
                    cycleCount = 0; //* Resets the cycle counter.
                    currentMode = "activeSession";

                    doneSessionEl.textContent = `Done Sessions: ${doneSessionCounter}`;
                    currentCycleEl.textContent = `Current Session: ${cycleCount}`;
        
                    break;
                }
            }
            
            activeSeconds = 60;
        }        
    }, 1000);
}

function appPause() {
    pausedSeconds = activeSeconds; //* Makes a "back-up" of the current seconds.
    clearInterval(timer);

    pauseBtn.classList.add("hidden");
    resumeBtn.classList.remove("hidden");
}

function resumeTimer(settings) {
    resumeBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");

    activeSeconds = pausedSeconds; //* Restores the secs from where it left off
    runTimer(settings);
}

startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden"); //Hides itself to let the "resume button" take its place
    pauseBtn.classList.remove("hidden");
    resetBtn.classList.remove("hidden");

    if (clickedFirstTime === false) {
        popup.textContent = storedSettings ? "Custom Settings used!" : "Default settings used!";
        popupContainer.classList.remove("hidden");
        setTimeout(() => { popupContainer.classList.add("hidden"); }, 3000);

        clickedFirstTime = true;
    }
        
    currentMode = "activeSession";

    runTimer(settingsCopy);
});

resumeBtn.addEventListener("click", () => { resumeTimer(settingsCopy); });

pauseBtn.addEventListener("click", appPause);

resetBtn.addEventListener("click", () => { location.reload(); });

settingsBtn.addEventListener("click", () => {
    settingsBtn.classList.add("hidden");

    settingsContainer.classList.toggle("hidden");
    mainEl[0].classList.add("uncover-settings");
});

//================================//

currentCycleEl.textContent = `Current Session: ${cycleCount}`;

if (storedSettings) { replaceTheme(storedSettings.theme); } //Has to run on start-up to properly change the theme before anything else

else { replaceTheme("default-theme"); }

function playStartSound() {
    const playStartSound = new Audio("./Sounds/start.wav");
    playStartSound.play();
}

function play10SecsLeftSound() {
    const play10SecsLeftSound = new Audio("./Sounds/10secsleft.wav");
    play10SecsLeftSound.play();
}

export function playResumeSound() {
    const playResumeSound = new Audio("./Sounds/resume.wav");
    playResumeSound.play();
}

tippy(currentCycleEl, {
    content: "This indicates how many full sessions you've done so far (max. 4 sessions)",
    placement: "top",
    animation: "perspective-extreme",
    followCursor: "horizontal"
});

tippy(resetBtn, {
    content: "Resets the app (as well as the current session count & sessions done so far)",
    placement: "bottom",
    animation: "perspective-extreme",
});

tippy(settingsBtn, {
    content: "Customize the settings",
    placement: "left",
    animation: "perspective-extreme",
});