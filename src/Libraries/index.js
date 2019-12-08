import ErisInterface from './eris/ErisInterface';
import DjsInterface from './discordjs/DjsInterface';

import { LIBRARY_TYPES } from '../Utility/Constants/AxonEnums';

/**
 * Library Handler
 * Use eris or discord.js.
 *
 * @author KhaaZ
 *
 * @class LibraryHandler
 */
class LibraryHandler {
    static pickLibrary(axon, axonOptions) {
        let libraryInterface;

        // eslint-disable-next-line no-shadow
        const lib = axonOptions.botConfig ? axonOptions.botConfig.library : 0;

        switch (lib) {
            // Eris
            case LIBRARY_TYPES.ERIS: {
                libraryInterface = new ErisInterface(axon);
                axon.logger.info('Selected Library Interface: ERIS.');
                break;
            }

            // Discordjs
            case LIBRARY_TYPES.DISCORDJS: {
                libraryInterface = new DjsInterface(axon, axonOptions._token);
                axon.logger.info('Selected Library Interface: DISCORD.JS.');
                break;
            }

            default: {
                axon.logger.error('No Selected Library Interface.');
                libraryInterface = new ErisInterface(axon);
                axon.logger.info('[DEFAULT] Selected Library Interface: ERIS.');
            }
        }

        axon.logger.axon('Library Interface ready.');
        return libraryInterface;
    }
}

export default LibraryHandler;
