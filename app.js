require('dotenv-extended').load();
const restify = require("restify");
const builder = require("botbuilder");

// 设置restify服务器
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log("%s listening to %s", server.name, server.url);
});
// 创建聊天bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
global.bot = bot;

// Initialize & load modules
const { Hello, QnAmaker, LUIS, tuling123 } = require("./bot_modules/modules");

bot.dialog('/', [
    async function(session){
        //初次见面
        if (!session.userData.isGreret){
            session.userData.isGreret = 1;
            session.send('Hi~');
            session.beginDialog('help');
        }
        let userMessage = session.message.text;
        // responders 为响应userMassage的对象，其中必须包含getAnswer的函数

        let responders = [new Hello(), new QnAmaker(), new LUIS(), new tuling123()];
        let promises = responders.map(function(responder) {
            return responder.getAnswer(userMessage, session);
        });
        let hasAnswer = false;
        for (let promise of promises) {
            let response = await promise.then(function (res) {
                return res;
            }).catch(function (error) {
                console.error(error);
            });
            if (response) {
                hasAnswer = true;
                // responder 返回'#Solved' 代表在之前已经处理完整个事务
                if (response !== '#Solved') {
                    console.log(response);
                    session.send(response);
                }
                break;
            }
        }
        if (!hasAnswer) {
            // TODO 进入闲聊模式
            console.log("没有匹配答案");
            session.send("dontunderstand");
        }
    }
]);
const dialogs = require('./dialogs');
server.post("/api/messages", connector.listen());

