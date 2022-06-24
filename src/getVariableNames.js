function getVariableNames(code) {
    return {
        babylonVar: /new ([a-zA-Z]+)\.Vector3/.exec(code)[1],
        playersVar: /([^,]+)=\[\],{}/.exec(code)[1],
        localPlayerVar: /"fire":document.pointerLockElement&&([^&]+)&&/.exec(code)[1],
        sceneVar: /createMapCells\(([^,]+),/.exec(code)[1],
        cullFuncVar: /=([a-zA-Z]+)\(this\.mesh,\.[0-9]+\)/.exec(
            code
        )[1],
        eventDispacherVar: /class\s+([\S]+)\s*\{\s*static\s+init\s*\(\s*\)\s*\{[\S]+\.inputs/.exec(
            code
        )[1],
        adBlockerErrorHandlerVar: /const (\S+)=\S+=>\{\S+\("F79520","Shell Shockers AIP","AIP video error/.exec(code)[1]
    }
}

module.exports = getVariableNames;