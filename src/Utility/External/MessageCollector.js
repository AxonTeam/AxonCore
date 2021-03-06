import { EventEmitter } from 'eventemitter3';

// For collection
import Collection from '../Collection';

/**
 * Collect bunch of message object according to choosen options
 *
 * @author VoidNulll
 *
 * @class MessageCollector
 * @extends EventEmitter
 */
class MessageCollector extends EventEmitter {
    /**
     * @param {AxonClient} client - The axon client object
     *
     * @param {Object} [options] - The default options for the message collector instance
     * @param {Number} [options.timeout=60000] - The time before the collector times out in milliseconds
     * @param {Number} [options.count=100] - The amount of messages to collect before automatically ending
     * @param {Boolean} [options.ignoreBots=true] - Whether or not to ignore bots
     * @param {String} [options.uID] - The user id to listen for (listens to all messages if not specified)
     * @param {Boolean} [options.caseSensitive=false] - Whether or not to return messages with content lowercased. Default: content unchanged
     *
     * @example
     * const collector = new MessageCollector(this.axon, { count: 10, ignoreBots: false });
     */
    constructor(client, options = {} ) {
        super();
        this._options = {
            timeout: options.timeout || 60000, // eslint-disable-line no-magic-numbers
            count: options.count || 100,
            ignoreBots: options.ignoreBots === undefined ? true : !!options.ignoreBots, // Ignore bots by default
            caseSensitive: options.caseSensitive === undefined ? true : !!options.caseSensitive, // Be case sensitive by default
        };
        this._axon = client;

        this._actualOptions = {};

        this._boundMsgEvent = this._onMsgCreate.bind(this);
        this._boundDelEvent = this._onMsgDelete.bind(this);
        this._boundEditEvent = this._onMsgEdit.bind(this);
        this._boundCollectEvent = this._onCollectEvent.bind(this);

        this.messages = new Collection();
    }

    get axon() {
        return this._axon;
    }

    get client() {
        return this._axon.botClient;
    }

    /**
     * Runs the message collector
     *
     * @param {Channel} channel The channel object to listen to
     *
     * @param {Object} [options] The options for the message collector
     * @param {Number} [options.timeout=60000] The time before the collector times out in milliseconds
     * @param {Number} [options.count=100] The amount of messages to collect before automatically ending
     * @param {Boolean} [options.ignoreBots=true] Whether or not to ignore bots
     * @param {String} [options.uID] The user id to listen for (listens to all messages if not specified)
     * @param {Boolean} [options.caseSensitive=true] Whether or not to return messages with content lowercased. Default: content not changed
     *
     * @returns {Promise} Map of messages collected.
     *
     * @example
     * const messages = await collector.run(msg.channel, { caseInsensitive: false });
     */
    run(channel, options = {} ) {
        return new Promise( (resolve, reject) => {
            this._channel = channel;
            this._actualOptions = options;
            for (const value in this._options) {
                if (this._actualOptions[value] === null || this._actualOptions[value] === undefined) {
                    this._actualOptions[value] = this._options[value];
                }
            }

            // Bind events
            this.client.on('messageCreate', this._boundMsgEvent);
            this.client.on('messageUpdate', this._boundEditEvent);
            this.client.on('messageDelete', this._boundDelEvent);

            this.on('collect', this._boundCollectEvent);

            this.once('end', () => {
                this._onEnd();
                return resolve(this.messages); // Resolve with a collection of messages
            } );

            this.once('timedOut', () => {
                this._onEnd();
                return reject('TIMEOUT');
            } );

            this._startTimeout();
        } );
    }

    _onEnd() {
        this.client.off('messageCreate', this._boundMsgEvent); // Stop listening to the eris message events
        this.client.off('messageUpdate', this._boundEditEvent);
        this.client.off('messageDelete', this._boundDelEvent);
        this.off('collect', this._boundCollectEvent); // Stop listening to the collect event in this class
    }

    _startTimeout() {
        setTimeout( () => {
            this.emit('timedOut');
        }, this._actualOptions.timeout);
    }

    _onMsgDelete(msg) {
        if (this.messages.has(msg.id) ) {
            this.messages.remove(msg.id);
            this.emit('delete', msg);
        }
    }

    async _onMsgEdit(oldMsg, msg) {
        if (!oldMsg) {
            return;
        }
        if (this.messages.has(oldMsg.id) ) {
            this.emit('edit', oldMsg, msg);
            await this.axon.utils.sleep(500); // eslint-disable-line no-magic-numbers
            this.messages.update(msg.id, msg);
        }
    }

    _onCollectEvent() {
        if (this.messages.size >= this._actualOptions.count) {
            this.end();
        }
    }

    end() {
        this.emit('end');
    }

    _onMsgCreate(msg) {
        // Checks for values to match up before continuing.
        if (msg.channel.id !== this._channel.id) {
            return;
        } if (msg.author.id === this.client.user.id) {
            return;
        } if (this._actualOptions.ignoreBots && msg.author.bot) {
            return;
        } if (this._actualOptions.uID && msg.author.id !== this._actualOptions.uID) {
            return;
        }
        if (!this._actualOptions.caseSensitive) { // If caseSensitive
            msg.content = msg.content.toLowerCase(); // Make the content lowercased
        }
        this.messages.add(msg.id, msg);
        this.emit('collect', msg);
    }


    /**
     * Removes a message from the messages collected
     *
     * @param {String} mID The id of the message you want to remove
     *
     * @returns {Collection} Collection of messages collected, now excluding the removed message.
     *
     * @example
     *
     * collector.delete('542164538347225118')
     */
    delete(mID) {
        if (!this.axon.utils.id.test(mID) ) {
            throw new Error(`Value ${mID} is NOT a ID`);
        }
        if (!this.messages.has(mID) ) { // If messages does not contain the message id
            throw new Error(`MESSAGE ${mID} NOT FOUND`);
        }
        this.messages.remove(mID); // Remove the message
        return this.messages; // Return the new map
    }
}

export default MessageCollector;
