import inject from "./injector";

class ShellHack {
    static defaultConfig = {
        aimbotEnabled: false,
        espEnabled: false,
    };

    constructor() {
        this.config = {...ShellHack.defaultConfig, ...JSON.parse(localStorage.getItem("shellHackConfig") || "{}")};
        console.log(this.config);
        this.menus = [];
        this.rays = [];
    }

    log(title, message) {
        console.log("%c%s", "color: red;", title);
        console.log(message);
    }

    update() {
        for (const menu of this.menus) {
            menu.update();
        }
        localStorage.setItem("shellHackConfig", JSON.stringify(this.config));
    }
}

window.shellHack = new ShellHack();

inject();

let loadObserver = new MutationObserver((mutations, self) => {
    mutations.forEach((mutation) => {
        if (!mutation.removedNodes) return;

        for (let i = 0; i < mutation.removedNodes.length; i++) {
            let node = mutation.removedNodes[i];
            if (node.id === "progress-container") {
                onLoad();
                self.disconnect();
                return;
            }
        }
    });
});

loadObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
});

let shellHackLoadingScreen = document.createElement("div");
shellHackLoadingScreen.id = "shellhack-loading";
shellHackLoadingScreen.innerHTML = `
<style>
#shellhack-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: black;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
}
#shellhack-loading > h1 {
    color: red;
    font-size: 5em;
}
#shellhack-loading > .name {
    margin-top: 100px;
    margin-bottom: 0;
}
#shellhack-loading > .author {
    color: grey;
    font-size: 1.2em;
}
</style>
<h1 class="name">ShellHack</h1>
<span class="author">by Zorby</span>
<h1>LOADING...</h1>`;

window.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(shellHackLoadingScreen);
});

window.addEventListener("keyup", (event) => {
    if (event.code === "KeyU") {
    }
});

function toggle(bool) {
    return bool ? "ON" : "OFF";
}

class HackMenu {
    constructor(parent) {
        let menu = document.createElement("div");
        menu.className = "front_panel roundme_md hackmenu";
        menu.innerHTML = `
        <button class="ss_button btn_sm btn_blue bevel_blue aimbot-toggle" style="width: 90%;">AIMBOT: <span>${toggle(
            window.shellHack.config.aimbotEnabled
        )}</span></button>
        <button class="ss_button btn_sm btn_blue bevel_blue esp-toggle" style="width: 90%;">ESP: <span>${toggle(
            window.shellHack.config.espEnabled
        )}</span></button>`;
        parent.appendChild(menu);
        parent
            .querySelector(".hackmenu .aimbot-toggle")
            .addEventListener("click", () => {
                window.shellHack.config.aimbotEnabled =
                    !window.shellHack.config.aimbotEnabled;
                window.shellHack.update();
            });
        parent
            .querySelector(".hackmenu .esp-toggle")
            .addEventListener("click", () => {
                window.shellHack.config.espEnabled =
                    !window.shellHack.config.espEnabled;
                window.shellHack.update();
            });
        this.menu = menu;
        window.shellHack.menus.push(this);
    }

    update() {
        this.menu.querySelector(".aimbot-toggle > span").innerText = toggle(
            window.shellHack.config.aimbotEnabled
        );
        this.menu.querySelector(".esp-toggle > span").innerText = toggle(
            window.shellHack.config.espEnabled
        );
    }
}

class HackSettings {
    constructor() {
        const hackButton = document.createElement("button");
        hackButton.id = "hack_button";
        hackButton.className = "ss_bigtab bevel_blue ss_marginright";
        hackButton.innerHTML = `
            <style>
                #hack_button h3
            </style>
            <h3 style="margin: 0; padding: 0; color: var(--ss-blue2)">HACK</h3>
        `
        hackButton.onclick = () => {
            for (const button of document.getElementById("horizontalTabs").children) {
                button.classList.remove("selected");
            }
            hackButton.classList.add("selected");
            hackButton.querySelector("h3").style.color = "var(--ss-white)"
        }
        document.getElementById("horizontalTabs").prepend(hackButton);
    }
}

function onLoad() {
    document.getElementById("panel_front_news").remove();
    document.getElementById("adBlockerVideo").remove();
    document.getElementById("spinnerOverlay").lastChild.remove();
    document.getElementById("videoAdContainer").remove();
    document.getElementById("onesignal-bell-container")?.remove();
    document.querySelector("#social_panel .tool-tip--bubble").remove();
    document.querySelector("#panel_front_play .vip-club-cta").remove();
    document.querySelector("#inGameScaler .respawn-one").remove();
    document.querySelector("#inGameScaler .respawn-two").remove();

    new HackSettings();

    new HackMenu(document.getElementById("panel_front_play"));
    const pauseHackMenu = new HackMenu(
        document.querySelector("#inGameScaler > .pause-popup--container")
    );
    pauseHackMenu.menu.style = "grid-column: 3; z-index: 7;";

    let pauseObserver = new MutationObserver((mutations, self) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName == "style") {
                console.log(document.getElementById("pausePopup").style);
                document.getElementById("inGameScaler").style.display =
                    document.getElementById("pausePopup").style.display;
            }
        });
    });

    pauseObserver.observe(document.getElementById("pausePopup"), {
        childList: false,
        attributes: true,
        characterData: false,
    });

    shellHackLoadingScreen.remove();
}
