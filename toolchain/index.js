const genDevScript = require("./genDevScript")
const downloadSource = require("./downloadSource")
const clean = require("./clean")
const path = require("path")

let args = process.argv
args.splice(0, 2)
let cwd = args.shift()

const has = (x, y) => {
    return x.find((z) => y.includes(z))
}

if (args[0] == "init") {
    console.log("Initializing toolchain...")
    downloadSource(cwd)
    genDevScript(cwd)
} else if (args[0] == "clean") {
    clean(cwd)
}

if (has(args, ["--download-source", "-s"])) {
    downloadSource(cwd)
}

if (has(args, ["--gen-script", "-g"])) {
    genDevScript(cwd)
}

if (has(args, ["--var-names", "-v"])) {
    const getVariableNames = require("../src/getVariableNames")
    const fs = require("fs")

    const variableNames = getVariableNames(fs.readFileSync(path.resolve(cwd, "res", "rawSource.js")).toString())
    
    console.log(variableNames)
}