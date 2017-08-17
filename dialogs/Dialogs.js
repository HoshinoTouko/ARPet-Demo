"use strict";
var bot = global.bot;
const builder = require("botbuilder");
const fs = require('fs');
const util = require('util');
const rp = require('request-promise');
const cards = require('../cards');

bot.dialog("help", [
    function(session) {
        let msg = '这是一条帮助语句';
        session.send(msg);
        session.endDialog();
    }
]).triggerAction({
    matches: /^帮助|Help|求助$/i
});

// Have name
bot.dialog("welcome", [
    function(session) {
        return session.endDialog("你好呀");
    }
]);

// System function
bot.dialog("resetAll", [
    function(session, results, next){
        builder.Prompts.text(session, '确认请扣1');
    },
    function(session, results, next) {
        if (results.response == "1") {
            sendInline(session, './images/resetAll.jpg', 'image/jpg', 'forgive.jpg');
            setTimeout(function() {
                next();  
            }, 500);  
        } else {
            session.endDialog("看来我们还是继续吧");
        }
    },
    function(session, results) {
        session.userData = {};
        session.privateConversationData = {};
        session.conversationData = {};
        session.dialogData = {};
        delete results.response;
        session.replaceDialog("/");
    }
])
.triggerAction({
    matches: /^让我们重新开始吧$/i
});



// Other functions
function randList(list){
    return list[randInt(length(list))];
}

function randInt(num){
    return Math.floor(Math.random() * num);
}

function length(list){
    var stat = 0;
    for(var i in list){
        stat++;
    }
    return stat;
}

function sendInline(session, filePath, contentType, attachmentFileName) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return session.send('Oops. Error reading file.');
        }

        var base64 = Buffer.from(data).toString('base64');

        var msg = new builder.Message(session)
            .addAttachment({
                contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                contentType: contentType,
                name: attachmentFileName
            });

        session.send(msg);
    });
}
