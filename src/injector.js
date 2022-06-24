import sceneRenderMixin from "./mixin/sceneRender.mixin";
import getVariableNames from "./getVariableNames";

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

                const { babylonVar, playersVar, localPlayerVar, sceneVar, cullFuncVar, eventDispacherVar, adBlockerErrorHandlerVar } = getVariableNames(code)
    
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
                    /*.replace(/((\w)=JSON\.parse\(\w\.data\))/, (a, b) => {
                        const out = `${a};shellHack.log("WS MESSAGE", ${b})`;
                        return out;
                    })
                    .replace("ct.prototype.fire = function () {", "ct.prototype.fire = function () {console.log(\"!!!Fired!!!\");console.log(this.actor);")*/;
            }
    
            return super.response;
        }
    };
}