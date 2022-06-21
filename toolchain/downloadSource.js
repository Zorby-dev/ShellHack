const https = require('https');
const fs = require('fs');
const path = require("path")
const prettier = require("prettier")


module.exports = (cwd) => {
    console.log("Downloading source code...")

    const rawSourcePath = path.resolve(cwd, "res", "rawSource.js")
    const prettySourcePath = path.resolve(cwd, "res", "prettySource.js")

    if (!fs.existsSync(path.resolve(cwd, "res"))) fs.mkdirSync(path.resolve(cwd, "res"))
    const file = fs.createWriteStream(rawSourcePath);
    const request = https.get("https://shellshock.io/src/shellshock.js", function(response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Downloaded source code");
            const src = fs.readFileSync(rawSourcePath).toString()
            console.log("Beautifying source code...")
            fs.writeFileSync(prettySourcePath, prettier.format(src, {
                filepath: rawSourcePath
            }))
            console.log("Beautified source code")
        });
    });
}