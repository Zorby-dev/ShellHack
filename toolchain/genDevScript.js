const { spawn } = require("child_process")
const path = require("path")
const { readFileSync, writeFileSync, rmSync, mkdirSync } = require("fs")

module.exports = (cwd) => {
    console.log("Generating development script...")

    const header = readFileSync(path.resolve(cwd, "header.txt")).toString()
        .replace("ShellHack", "ShellHack Development")
        .replace("// ==/UserScript==", `// @require file://${path.resolve(cwd, "dist", "dev", "bundle.user.js")}\n// ==/UserScript==`)

    mkdirSync(path.resolve(cwd, "toolchain", "tmp"))
    writeFileSync(path.resolve(cwd, "toolchain", "tmp", "development.user.js"), header)

    spawn("chrome", [`file://${path.resolve(cwd, "toolchain", "tmp", "development.user.js")}`])

    setTimeout(() => {
        rmSync(path.resolve(cwd, "toolchain", "tmp"), { recursive: true, force: true });

        console.log("Generated development script")
    }, 1000)
}