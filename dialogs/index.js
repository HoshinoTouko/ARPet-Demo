const fs = require("fs");
const modules_out = {};

for (let name of fs.readdirSync(__dirname)) {
    if (name === 'index.js')
        continue;
    let file = name.slice(0, name.length - 3);
    //  测试是否实现了接口
    let ImportClass = require('./' + file);
    modules_out[file] = ImportClass;
}

console.log("Loaded Dialogs");

module.exports = modules_out;
