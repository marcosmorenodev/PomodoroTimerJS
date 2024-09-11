//DOM Related Variables

import { playResumeSound } from "./app.js";

const headerEl = document.getElementsByTagName("header");
const mainEl = document.getElementsByTagName("main");
const settingsContainer = document.getElementById("settings__container");
const settingsBtn = document.getElementById("settings-btn");

const activeMinutesEl = document.getElementById("active-minutes-input");
const activeMinutesTag = document.getElementById("active-minutes-tag");
const breakMinutesEl = document.getElementById("break-minutes-input");
const breakMinutesTag = document.getElementById("break-minutes-tag");
const longBreakEl = document.getElementById("long-break-minutes-input");
const longBreakTag = document.getElementById("long-break-minutes-tag");

const themeBtns = document.querySelectorAll(".theme__btn");
const closeBtn = document.getElementById("close-btn");
const saveBtn = document.getElementById("save-btn");
const returnToDefaultBtn = document.getElementById("default-settings-btn");
const saveSettingsPopup = document.getElementById("save-popup");
const defaultSettingsPopup = document.getElementById("default-settings-popup");

//=============================//

let hasBeenModified = false;
let hasBeenSaved = false;

const storedSettings = JSON.parse(localStorage.getItem("userSettings")) || null;

let userSettings = {
    activeMinutes: storedSettings?.activeMinutes ?? null,
    breakMinutes: storedSettings?.breakMinutes ?? null,
    longBreakMinutes: storedSettings?.longBreakMinutes ?? null,
    theme: storedSettings?.theme ?? "default-theme"
};

function changeMinutes(target) {
    switch (target) {
        case activeMinutesEl: {
            hasBeenModified = true;
            
            activeMinutesTag.textContent = activeMinutesEl.value;
            let newActiveMinutes = Number(activeMinutesEl.value);
            
            const newSettings = {...userSettings, activeMinutes: newActiveMinutes};
            userSettings = newSettings;
            break;
        }

        case breakMinutesEl: {
            hasBeenModified = true;

            breakMinutesTag.textContent = breakMinutesEl.value;
            let newBreakMinutes = Number(breakMinutesEl.value);

            const newSettings = {...userSettings, breakMinutes: newBreakMinutes};
            userSettings = newSettings;
            break;
        }

        default: {
            hasBeenModified = true;

            longBreakTag.textContent = longBreakEl.value;
            let newLongBreakMinutes = Number(longBreakEl.value);

            const newSettings = {...userSettings, longBreakMinutes: newLongBreakMinutes};
            userSettings = newSettings;
            break;
        }
    }
}

function changeTheme(selectedTheme) {
    switch (selectedTheme) {
        case "green-theme": {
            hasBeenModified = true;

            let newTheme = selectedTheme;
            const newSettings = {...userSettings, theme: newTheme};
            userSettings = newSettings;

            replaceTheme(newTheme);
            mainEl[0].classList.add("uncover-settings");
            
            break;
        }

        case "pink-theme": {
            hasBeenModified = true;

            let newTheme = selectedTheme;
            const newSettings = {...userSettings, theme: newTheme};
            userSettings = newSettings;

            replaceTheme(newTheme);
            mainEl[0].classList.add("uncover-settings");

            break;
        }

        case "beige-theme": {
            hasBeenModified = true;

            let newTheme = selectedTheme;
            const newSettings = {...userSettings, theme: newTheme};
            userSettings = newSettings;

            replaceTheme(newTheme);
            mainEl[0].classList.add("uncover-settings");

            break;
        }
    }
}

export function replaceTheme(theme) {
    switch(theme) {
        case "green-theme": { 
            mainEl[0].className = "green-theme";
            headerEl[0].className = "green-theme";
            
            break;
        }

        case "pink-theme": { 
            mainEl[0].className = "pink-theme";
            headerEl[0].className = "pink-theme";

            break;
        }

        case "beige-theme": { 
            mainEl[0].className = "beige-theme";
            headerEl[0].className = "beige-theme";

            break;
        }

        case "default-theme": {
            mainEl[0].className = "default-theme";
            headerEl[0].className = "default-theme";

            break;
        }
    }
}

async function saveUserSettings() {
    if (hasBeenModified === false) { return; } //* If nothing has been changed at all, this allows the user to close the settings tab without performing a "safety reload".

    else {
        hasBeenSaved = true;
        mainEl[0].classList.add("uncover-settings");

        localStorage.setItem("userSettings", JSON.stringify(userSettings));
        
        saveSettingsPopup.classList.remove("hidden");
        playResumeSound();
        
        setTimeout(() => { 
            saveSettingsPopup.classList.add("hidden"); 

            (window.location).reload();
        }, 2500);
    }
}

async function returnToDefaultSettings() {
    localStorage.clear();

    mainEl[0].className = "default-theme";
    headerEl[0].className = "default-theme";
    mainEl[0].classList.add("uncover-settings");

    defaultSettingsPopup.classList.remove("hidden");
    playResumeSound();

    setTimeout(() => {
        defaultSettingsPopup.classList.add("hidden");

        (window.location).reload();
    }, 2500);
}

activeMinutesEl.addEventListener("change", () => changeMinutes(activeMinutesEl));

breakMinutesEl.addEventListener("change", () => changeMinutes(breakMinutesEl));

longBreakEl.addEventListener("change", () => changeMinutes(longBreakEl));

themeBtns.forEach(btn => {    
    btn.addEventListener("click", () => { changeTheme((btn.dataset).theme); });
});

saveBtn.addEventListener("click", saveUserSettings);

closeBtn.addEventListener("click", () => { 
    if (hasBeenModified === true && hasBeenSaved === false) { (window.location).reload(); }
    
    settingsContainer.classList.add("hidden");
    settingsBtn.classList.remove("hidden"); 
    
    mainEl[0].classList.remove("uncover-settings");
});

returnToDefaultBtn.addEventListener("click", returnToDefaultSettings);