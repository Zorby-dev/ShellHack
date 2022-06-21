import sceneRenderMixin from "./mixin/sceneRender.mixin";

export default function inject() {
    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        open(method, url) {
            if (url.indexOf("shellshock.js") > -1) {
                this.isScript = true;
            }
    
            return super.open(...arguments);
        }
    
        get response() {
            if (this.isScript) {
                const code = super.response;

                const babylonVar = /new ([a-zA-Z]+)\.Vector3/.exec(code)[1];
                const playersVar = /([^,]+)=\[\],{}/.exec(code)[1];
                const localPlayerVar =
                    /"fire":document.pointerLockElement&&([^&]+)&&/.exec(code)[1];
                const sceneVar = /createMapCells\(([^,]+),/.exec(code)[1];
                const cullFuncVar = /=([a-zA-Z]+)\(this\.mesh,\.[0-9]+\)/.exec(
                    code
                )[1];
                const eventDispacherVar =
                    /class\s+([\S]+)\s*\{\s*static\s+init\s*\(\s*\)\s*\{[\S]+\.inputs/.exec(
                        code
                    )[1];
                const adBlockerErrorHandlerVar = /const (\S+)=\S+=>\{\S+\("F79520","Shell Shockers AIP","AIP video error/.exec(code)[1];
    
                console.log("%cShellHack by Zorby", "color: red; font-size: 3em;");
                console.log(
                    "%cInjecting code...",
                    "color: gray; font-size: 1.2em;"
                );
                console.log({
                    babylonVar,
                    playersVar,
                    localPlayerVar,
                    sceneVar,
                    cullFuncVar,
                    eventDispacherVar,
                    adBlockerErrorHandlerVar
                });
    
                return code
                    .replace(
                        sceneVar + ".render()",
                        `(${sceneRenderMixin.toString()})(${playersVar}, ${localPlayerVar}, ${babylonVar}, ${eventDispacherVar}); ${sceneVar}.render()`
                    )
                    .replace(
                        `function ${cullFuncVar}`,
                        `
                            function ${cullFuncVar}() {
                                return true;
                            }
    
                            function someFunctionWhichWillNeverBeUsedNow
                        `
                    )
                    .replace(/((\w)=JSON\.parse\(\w\.data\))/, (a, b) => {
                        const out = `${a};shellHack.log("WS MESSAGE", ${b})`;
                        return out;
                    });
            }
    
            return super.response;
        }
    };
}