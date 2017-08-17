'use strict';

let LUISModules = require("./luis_modules");
const util = require('util');
const rp = require('request-promise');
const fs = require('fs');
const QNA_THRESHOLD = 40, LUIS_THRESHOLD = 0.5;

// Debug 方便， 这里先屏蔽掉一下Console输出
// let console = {
//     log: function(){},
//     error: function(){},
// };

class Responder {
	// 抽象函数的作用
	getAnswer(userMessage){
		throw "Not Implemented Error";
	}
}

function hasImageAttachment(session) {
    return (
        session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf("image") !== -1
    );
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}


class LUIS extends Responder {
	async getAnswer(userMessage, session) {
		var LUISClient = require("./other_modules/luis_sdk");
		var APPID = process.env.LUIS_ID;
		var APPKEY = process.env.LUIS_KEY;
		var LUISclient = LUISClient({
			appId: APPID,
			appKey: APPKEY,
			verbose: true
		});
		if (!userMessage)
		    return "";
		console.log('LUIS module receive message:"' + userMessage + '"');

		let promise = new Promise(function(resolve, reject) {
			console.log(userMessage);
            LUISclient.predict(userMessage, {
                //On success of prediction
                onSuccess: function (LUISresponse) {
                    let intent = LUISresponse.topScoringIntent;
                    console.log("LUIS Score:", intent.score);
                    if (intent.score < LUIS_THRESHOLD) {
                        resolve('');
                        return;
                    }
                    let {query, entities} = LUISresponse;
                    for (let entity of entities){
                        entity['entity'] = entity.entity.replace(/ /g, '');
                    }
                    console.log("onSuccess!");
                    resolve({query, intent, entities, session});
                },
                //On failure of prediction
                onFailure: function (err) {
                    resolve("");
                    console.error(err);
                }
            });
        });
		let ans = promise.then(function (value) {
		    let {query, intent, entities, session} = value;
		    console.log("LUISModules receive " + query + " Intent: " + intent.intent);
		    console.log(intent);
		    console.log(entities);
		    if(typeof LUISModules[intent.intent] !== "undefined"){
		        return LUISModules[intent.intent].interaction(query, intent, entities, session);
            }
            let ans = "Intent: " + intent.intent + " \nEntities: ";
		    for(let entity of entities)
		        ans += entity.entity + ", ";
            return Promise.resolve(ans);
		}).catch(function (error) {
		    console.error(error);
        }).then(function (v) {
		    return v;
        }).catch(function (error) {
            console.error(error);
        });
		return await ans;
	}

}

class Hello extends Responder {
	async getAnswer(userMessage, session) {
        return await new Promise(function(resolve, reject){
            console.log('Hello module receive message:"' + userMessage + '"');
            console.log('Hello module.');
            if (userMessage === "你好") {
            	resolve("hello")
            } else {
                resolve("");
            }
        });
	}
}

class QnAmaker extends Responder {
	async getAnswer(userMessage) {
	    if (!userMessage)
	        return "";
	    // FIXME 目前先暴力去掉是谁的这个部分，留给LUIS判断

		var qna_id = process.env.QNA_ID;
		var qna_key = process.env.QNA_KEY;
		var postData = JSON.stringify({
			"question": userMessage,
			top: 5
		});
		var postInfo = {
			uri: 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/' + qna_id + '/generateAnswer',
			method: 'POST',
			headers: {
				'Ocp-Apim-Subscription-Key': qna_key,
				'Content-Type': 'application/json'
			},
			body: postData
		};
		console.log('QnA module receive message:"' + userMessage + '"');

		let {answer, score} = await rp(postInfo)
			.then(function (body) {
				// 返回的第一条记录应该就是Score最高的
				let result = JSON.parse(body);
				result = result['answers'];
				let answer = "", maxScore = 0;
                answer = result[0]["answer"];
                maxScore = result[0]["score"];
                console.log('Max answer and score: ' + answer + ' & ' + maxScore);
                return {"answer":answer, score:maxScore}
			}).catch(function (err) {
				console.error('QnAMaker error: ' + err);
                return {answer:"", score:0};
			});


		if (score > QNA_THRESHOLD) {
			console.log('QnA Success');
            return answer;
		}
		console.log('QnA Score too low');
		return "";
	}
}

module.exports = {
	Responder,
	Hello,
	QnAmaker,
	LUIS
};