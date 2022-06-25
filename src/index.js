import inject from "./injector";
import { HSVtoRGB } from "./util";

class ShellHack {
    static defaultConfig = {
        aimbotEnabled: false,
        espEnabled: false,
        esp: {
            raysEnabled: true
        }
    };

    constructor() {
        this.config = {...ShellHack.defaultConfig, ...JSON.parse(localStorage.getItem("shellHackConfig") || "{}")};
        console.log(this.config);
        this.menus = [];
        this.rays = [];
        this.hue = 0;
    }

    log(title, message) {
        console.log("%c%s", "color: red;", title);
        console.log(message);
    }

    update() {
        for (const menu of this.menus) {
            menu.update();
        }
        this.settings.update();
        localStorage.setItem("shellHackConfig", JSON.stringify(this.config));
    }

    onRender() {
        window.shellHack.hue = window.shellHack.hue === 1 ? 0 : window.shellHack.hue + 0.01;
    }

    getRainbow() {
        let rgb = HSVtoRGB(window.shellHack.hue, 1, 1);
        return {
            r: rgb.r / 255,
            g: rgb.g / 255,
            g: rgb.b / 255
        }
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

    createOpenButton() {
        let button = document.createElement("input");
        button.setAttribute("type", "image");
        button.setAttribute("src", "img/ico_nav_settings.png");
        button.className = "account_icon roundme_sm";
        button.style.color = "red";
        button.style.backgroundColor = "black";
        
        button.addEventListener("click", () => {
            const overlay = document.getElementById("SHOverlay");
            const settings = document.getElementById("SHSettings")
            overlay.style.display = "block";
            settings.style = "";
        })

        this.openButtons.push(button)

        return button;
    }

    constructor() {
        window.shellHack.settings = this;

        let overlay = document.createElement("div")
        overlay.id = "SHOverlay"
        overlay.style.position = "absolute"
        overlay.style.top = "0"
        overlay.style.left = "0"
        overlay.style.right = "0"
        overlay.style.bottom = "0"
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
        overlay.style.zIndex = "42069"
        overlay.style.display = "none"
        document.body.appendChild(overlay)

        let settings = document.createElement("div")
        settings.id = "SHSettings"
        settings.style = "display: none;"

        const espEnabled = toggle(window.shellHack.config.espEnabled);
        const espRaysEnabled = toggle(window.shellHack.config.esp.raysEnabled);
        settings.innerHTML = `
            <style>
                #SHSettings {
                    display: flex;
                    flex-direction: column;

                    width: 70%;
                    height: 70%;
                    margin: auto;
                    margin-top: 100px;
                    padding: 20px;

                    background-color: black;
                    color: white;
                }
                
                #SHSettings .title {
                    width: 100%;
                    margin-bottom: 50px;
                    text-align: center;
                    font-size: 3em;
                    font-weight: bold;
                    color: red;
                }

                #SHSettings .category {
                    font-size: 2em;
                    margin-bottom: 10px;
                }

                #SHSettings button {
                    border-radius: 5px;
                    font-size: 1em;
                }

                #SHSettings button.ON {
                    background-color: green;
                }

                #SHSettings button.OFF {
                    background-color: red;
                }
            </style>
            <span class="title">ShellHack Settings <button>[X]</button></span>
            <span class="category esp">ESP - <button class="${espEnabled}">${espEnabled}</button></span>
            <ul>
                <li class="esp-rays">Show rays - <button class="${espRaysEnabled}">${espRaysEnabled}</button></li>
            </ul>
        `
        settings.querySelector(".title button").addEventListener("click", () => {
            const overlay = document.getElementById("SHOverlay");
            const settings = document.getElementById("SHSettings")
            overlay.style.display = "none";
            settings.style = "display: none;";
        })
        settings.querySelector(".category.esp button").addEventListener("click", () => {
            window.shellHack.config.espEnabled =
                !window.shellHack.config.espEnabled;
            window.shellHack.update();
        })
        settings.querySelector(".esp-rays button").addEventListener("click", () => {
            window.shellHack.config.esp.raysEnabled =
                !window.shellHack.config.esp.raysEnabled;
            window.shellHack.update();
        })
        overlay.appendChild(settings)

        this.openButtons = [];
        const cornerButtons = document.querySelectorAll("#corner-buttons");
        for (const x of cornerButtons) {
            const button = this.createOpenButton()
            x.appendChild(button)
        }
    }

    update() {
        const settings = document.getElementById("SHSettings")
        
        const espEnableButton = settings.querySelector(".category.esp button")
        espEnableButton.className = toggle(window.shellHack.config.espEnabled)
        espEnableButton.innerText = toggle(window.shellHack.config.espEnabled)

        const espRaysEnableButton = settings.querySelector(".esp-rays button")
        espRaysEnableButton.className = toggle(window.shellHack.config.esp.raysEnabled)
        espRaysEnableButton.innerText = toggle(window.shellHack.config.esp.raysEnabled)
    }
}

function onLoad() {
    document.querySelector("#panel_front_news .house-small").remove();
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
