import Handler from '../../../Structures/Event/Handler';

class ChannelDeleteHandler extends Handler {
    handle(channel) {
        return channel.guild ? channel.guild.id : null;
    }
}

export default ChannelDeleteHandler;
