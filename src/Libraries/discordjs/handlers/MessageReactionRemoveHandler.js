import AHandler from '../../../Structures/Event/AHandler';

class MessageReactionRemoveHandler extends AHandler {
    handle(messageReaction) {
        return messageReaction.message.guild ? messageReaction.message.guild.id : null;
    }
}

export default MessageReactionRemoveHandler;
