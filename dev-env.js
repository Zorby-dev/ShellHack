const { spawn } = require("child_process")
const path = require("path")
const { readFileSync, writeFileSync, unlinkSync } = require("fs")

const header = readFileSync(path.resolve(__dirname, "header.txt")).toString()
    .replace("ShellHack", "ShellHack Development")
    .replace("// ==/UserScript==", `// @require file://${path.resolve(__dirname, "dist", "dev", "bundle.user.js")}\n// ==/UserScript==`)

writeFileSync(path.resolve(__dirname, "TEMP.user.js"), header)

spawn("chrome", [`file://${path.resolve(__dirname, "TEMP.user.js")}`])

setTimeout(() => {
    unlinkSync(path.resolve(__dirname, "TEMP.user.js"))
}, 1000)
