const rp = require('request-promise');

class tuling123 {
    constructor(tuling123_id) {
        this.tuling123_id = tuling123_id;
    }

    async getAns(userMessage, session) {
        const tuling123_id = process.env.TULING123_KEY;
        var postData = JSON.stringify({
            key: tuling123_id,
            info: encodeURIComponent(userMessage),
            userid: '1234'
        });
        var postInfo = {
            uri: 'http://www.tuling123.com/openapi/api',
            method: 'POST',
            body: postData
        };
        console.log('TULING123 module receive message:"' + userMessage + '"');

        let answer = await rp(postInfo)
            .then(function (body) {
                // 返回的第一条记录应该就是Score最高的
                let result = JSON.parse(body);
                console.log(result);
                return result;
            }).catch(function (err) {
                console.error('QnAMaker error: ' + err);
                return '';
            });

        return answer;
    }
}

module.exports = tuling123;
