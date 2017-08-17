let fs = require("fs");
let modules_out = {};

// 加载本文件夹下的所有其他文件，并exports
for (let name of fs.readdirSync(__dirname)) {
    if (name === 'index.js')
        continue;
    let file = name.slice(0, name.length - 3);
    //  测试是否实现了接口
    let ImportClass = require('./' + file);
    if (!ImportClass.interaction) {
        throw "Class [" + file + "] in did NOT implement the BasicInteraction interface";
    }
    modules_out[file] = ImportClass;
}

// 该文件夹下所有其他的类应当实现该接口(JS没有自带接口功能，还是需要靠自觉)
class BasicInteraction{

    /* @param message 用户所提出的问题
     * @param intents LUIS识别出的intent数组
     * @param entities 识别出的实体列表
     */
    async interaction(message, intent, entities){
    }

}
console.log("Loaded LUIS Modules");

module.exports = modules_out;
