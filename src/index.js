import inject from "./injector";
import { HSBToRGB } from "./util";

class ShellHack {
    static defaultConfig = {
        aimbot: {
            enabled: false
        },
        esp: {
            enabled: false,
            rainbowSpheres: false,
            raysEnabled: true,
            rainbowRays: false
        },
        general: {
            hideAimingOverlay: true
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
        window.shellHack.hue = window.shellHack.hue === 360 ? 0 : window.shellHack.hue + 1;
    }

    getRainbow() {
        let rgb = HSBToRGB(window.shellHack.hue, 100, 100);
        return {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255
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
            window.shellHack.config.aimbot.enabled
        )}</span></button>
        <button class="ss_button btn_sm btn_blue bevel_blue esp-toggle" style="width: 90%;">ESP: <span>${toggle(
            window.shellHack.config.esp.enabled
        )}</span></button>`;
        parent.appendChild(menu);
        parent
            .querySelector(".hackmenu .aimbot-toggle")
            .addEventListener("click", () => {
                window.shellHack.config.aimbot.enabled =
                    !window.shellHack.config.aimbot.enabled;
                window.shellHack.update();
            });
        parent
            .querySelector(".hackmenu .esp-toggle")
            .addEventListener("click", () => {
                window.shellHack.config.esp.enabled =
                    !window.shellHack.config.esp.enabled;
                window.shellHack.update();
            });
        this.menu = menu;
        window.shellHack.menus.push(this);
    }

    update() {
        this.menu.querySelector(".aimbot-toggle > span").innerText = toggle(
            window.shellHack.config.aimbot.enabled
        );
        this.menu.querySelector(".esp-toggle > span").innerText = toggle(
            window.shellHack.config.esp.enabled
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

        this.layout = {
            esp: {
                name: "ESP",
                names: {
                    raysEnabled: "Show rays",
                    rainbowSpheres: "Rainbow hitboxes",
                    rainbowRays: "Rainbow rays"
                },
                config: window.shellHack.config.esp
            },
            general: {
                name: "General",
                names: {
                    hideAimingOverlay: "Hide aiming overlay"
                },
                config: window.shellHack.config.general
            }
        }

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
        `
        for (const category in this.layout) {
            const title = document.createElement("span")
            title.className = "category " + category
            let config = this.layout[category].config

            if (config.enabled != null) {
                const enabled = toggle(config.enabled)
                title.innerHTML = `${this.layout[category].name} - <button class="${enabled}">${enabled}</button>`

                title.querySelector("button").addEventListener("click", () => {
                    config.enabled =
                        !config.enabled;
                    window.shellHack.update();
                })
            } else {
                title.innerHTML = `${this.layout[category].name}`
            }

            settings.appendChild(title)

            const settingsList = document.createElement("ul")
            settingsList.className = "config " + category

            for (const setting in config) {
                if (setting !== "enabled") {
                    const settingItem = document.createElement("li")
                    settingItem.className = setting
                    const settingName = this.layout[category].names[setting]
                    const settingEnabled = toggle(config[setting])
                    settingItem.innerHTML = `${settingName ? settingName : setting} - <button class="${settingEnabled}">${settingEnabled}</button>`

                    settingItem.querySelector("button").addEventListener("click", () => {
                        config[setting] = !config[setting]
                        window.shellHack.update();
                    })

                    settingsList.appendChild(settingItem)
                }
            }

            settings.appendChild(settingsList)
        }

        settings.querySelector(".title button").addEventListener("click", () => {
            const overlay = document.getElementById("SHOverlay");
            const settings = document.getElementById("SHSettings")
            overlay.style.display = "none";
            settings.style = "display: none;";
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
        
        for (const category of settings.querySelectorAll(".category")) {
            const categoryName = category.classList.item(1)
            if (this.layout[categoryName].config.enabled != null) {
                const categoryEnabled = toggle(this.layout[categoryName].config.enabled)
                const enabledButton = category.querySelector("button")
                enabledButton.innerText = categoryEnabled
                enabledButton.className = categoryEnabled
            }
        }

        for (const config of settings.querySelectorAll(".config")) {
            const configName = config.classList.item(1)

            for (const settingItem of config.childNodes) {
                const setting = settingItem.className
                const settingEnabled = toggle(this.layout[configName].config[setting])
                const settingEnabledButton = settingItem.querySelector("button")
                settingEnabledButton.innerText = settingEnabled
                settingEnabledButton.className = settingEnabled
            }
        }
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
