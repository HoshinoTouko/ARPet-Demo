/**
 * Created by Administrator on 2017/8/12.
 */
const builder = require('botbuilder');
function choice(session, text, choices, title='', subtitle=''){
    text = session.localizer.gettext(session.preferredLocale(), text);
    let msg = new builder.Message(session);
    choices = choices.split('|');
    let buttons = choices.map(function(v, index){
        return builder.CardAction.imBack(session, v, v);
    });
    let card = new builder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(text)
        .buttons(buttons);
    msg.addAttachment(card);
    builder.Prompts.choice(session, msg, choices);
}

module.exports = choice;

