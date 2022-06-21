const fs = require('fs');
const path = require("path")

module.exports = (cwd) => {
    console.log("Cleaning toolchain...")
    try {
        fs.rmSync(path.resolve(cwd, "res"), { recursive: true, force: true })
    } catch (e) { }
    console.log("Cleaned toolchain")
}