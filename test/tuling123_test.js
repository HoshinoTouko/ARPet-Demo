require('../node_modules/dotenv-extended').load();
const tl123 = require('../bot_modules/other_modules/tuling123_bot');

var tl = new tl123();
tl.getAns('你好呀');
