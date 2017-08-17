/**
 * Created by Administrator on 2017/8/12.
 */
const fs = require("fs");
const modules_out = {};

for (let name of fs.readdirSync(__dirname)) {
    if (name === 'index.js')
        continue;
    let file = name.slice(0, name.length - 3);
    let ImportClass = require('./' + file);
    modules_out[file] = ImportClass;
}

console.log("Loaded Dialogs");

module.exports = modules_out;
