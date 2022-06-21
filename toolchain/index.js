const genDevScript = require("./genDevScript")
const downloadSource = require("./downloadSource")
const clean = require("./clean")

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