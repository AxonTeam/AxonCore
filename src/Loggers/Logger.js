import { Console } from 'console';
import { format } from 'util';

/**
 * Default Logger with timestamps and custom methods. Doesn't use any dependencies.
 *
 * @author KhaaZ
 *
 * @class DefLogger
 * @extends {Console}
 */
class DefLogger extends Console {
    constructor() {
        super(process.stdout, process.stderr); // Create default Console instance - Node v8 support
    }

    /** CTX Object
     *
     * {
     *  guild: gObj || id|name
     *  cmd: label
     *  user: userObj || id|name
     * }
     *
     * replaced with id if no obj
     */

    /**
     * Major - Critical fault
     * Crashing bugs, unexpected errors...
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    emerg(input, opt) {
        const mess = `${this._parseTime()} - [ EMERG ] => ${this._addCtx(opt)}${input}`;
        super.error(mess);
    }

    /**
     * Major - critical error
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    error(input, opt) {
        const mess = `${this._parseTime()} - [ ERROR ] => ${this._addCtx(opt)}${input}`;
        super.error(mess);
    }

    /**
     * Warns - expected errors
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    warn(input, opt) {
        const mess = `${this._parseTime()} - [ WARN  ] => ${this._addCtx(opt)}${input}`;
        super.warn(mess);
    }

    /**
     * Eval - Debugging logs
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    debug(input, opt) {
        const mess = `${this._parseTime()} - [ DEBUG ] => ${this._addCtx(opt)}${input}`;
        this.log(mess);
    }

    /**
     * Important information
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    notice(input, opt) {
        const mess = `${this._parseTime()} - [NOTICE ] => ${this._addCtx(opt)}${input}`;
        this.log(mess);
    }

    /**
     * Default information
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    info(input, opt) {
        const mess = `${this._parseTime()} - [ INFO  ] => ${this._addCtx(opt)}${input}`;
        this.log(mess);
    }

    /**
     * Other Logging - executed commands, etc...
     *
     * @param {String} input
     * @param {Object} opt - context object
     * @memberof DefLogger
     */
    verbose(input, opt) {
        const mess = `${this._parseTime()} - [VERBOSE] => ${this._addCtx(opt)}${input}`;
        this.log(mess);
    }

    /**
     * AxonClient information
     *
     * @param {String} input
     * @memberof DefLogger
     */
    axon(input) {
        const mess = `${this._parseTime()} - [ AXON  ] => ${input}`;
        this.log(mess);
    }

    /**
     * Initialisation - Client info
     *
     * @param {String} input
     * @memberof DefLogger
     */
    init(input) {
        const mess = `${this._parseTime()} - [ INIT  ] => ${input}`;
        this.log(mess);
    }

    /**
     * Initialisation - Module info
     *
     * @param {Module} module
     * @memberof DefLogger
     */
    _initModule(module) {
        const mess = `${this._parseTime()} - [  MOD  ] => Initialised! | Commands loaded -${module.commands.size}- | [${module.label}]`;
        this.log(mess);
    }

    /**
     * Initialisation - Command info
     *
     * @param {Command} command
     * @memberof DefLogger
     */
    _initCommand(command) {
        let mess;
        if (command.hasSubcmd) {
            mess = `${this._parseTime()} - [  CMD  ] => Initialised! | SubCommands loaded -${command.subCommands.size}- | *${command.label}*`;
        } else {
            mess = `${this._parseTime()} - [  CMD  ] => Initialised! | *${command.label}*`;
        }
        this.log(mess);
    }

    /**
     * Initialisation - SubCommand info
     *
     * @param {Command} sub
     * @memberof DefLogger
     */
    _initSubCmd(sub) {
        let mess;
        if (sub.hasSubcmd) {
            mess = `${this._parseTime()} - [  SUB  ] => Initialised! | SubCommands loaded -${sub.subCommands.size}- | ${sub.label}`;
        } else {
            mess = `${this._parseTime()} - [  SUB  ] => Initialised! | ${sub.label}`;
        }
        this.log(mess);
    }

    /**
     * Initialisation - SubCommand info
     *
     * @param {Command} sub
     * @memberof DefLogger
     */
    _initEvent(bind, event) {
        let mess;
        if (bind) {
            mess = `${this._parseTime()} - [  EVT  ] => Bound ${event.size} listener${event.size > 1 ? 's' : ''} for ${event.name}`;
        } else {
            mess = `${this._parseTime()} - [  EVT  ] => Registered ${event.label} for ${event.eventName}`;
        }
        this.log(mess);
    }


    _addCtx(ctx = {} ) {
        let context = '';
        if (ctx.guild) {
            context += ctx.guild instanceof Object
                ? `[${ctx.guild.name} - ${ctx.guild.id}] `
                : `[Guild: ${ctx.guild}] `;
        }
        if (ctx.cmd) {
            context += `-${ctx.cmd}- `;
        }
        if (ctx.user) {
            context += ctx.user instanceof Object
                ? `${ctx.user.username}#${ctx.user.discriminator} - ${ctx.user.id} `
                : `[User: ${ctx.user}] `;
        }

        return context;
    }

    _parseTime() {
        const current = new Date();
        const formated = format('[ %s ]', `${current.getHours() < 10 ? `0${current.getHours()}` : current.getHours()}h`
            + `${current.getMinutes() < 10 ? `0${current.getMinutes()}` : current.getMinutes()}m`
            + `${current.getSeconds() < 10 ? `0${current.getSeconds()}` : current.getSeconds()}s`);
        return formated;
    }
}

export default new DefLogger();