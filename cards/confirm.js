/**
 * Created by Administrator on 2017/8/12.
 */
const builder = require('botbuilder');
function confirm(session, text, confirm_text="是|否", title='', subtitle=''){
    text = session.localizer.gettext(session.preferredLocale(), text);
    let msg = new builder.Message(session);
    confirm_text = confirm_text.split('|');
    let buttons = [
        builder.CardAction.imBack(session, 'yes', confirm_text[0]),
        builder.CardAction.imBack(session, 'no', confirm_text[1])
    ];
    let card = new builder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(text)
        .buttons(buttons);
    msg.addAttachment(card);
    builder.Prompts.confirm(session, msg);
}

module.exports = confirm;
