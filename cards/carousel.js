/**
 * Created by Administrator on 2017/8/12.
 */

const builder = require('botbuilder');
function carousel(session, titles, textes, images){

    let msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    let cards = [];
    for (let i = 0; i < titles.length; i++){
        text = textes[i];
        title = titles[i];
        image = images[i];
        text = session.localizer.gettext(session.preferredLocale(), text);
        let card = new builder.HeroCard(session)
            .title(title)
            .text(text)
            .images(
                builder.CardImage.create(session, image)
            );
        cards.push(card);
    }
    msg.attachments(cards);
    session.send(msg);
}

module.exports = carousel;
