import JsonProvider from './JsonProvider';

import { DB_TYPES } from './../Utility/Constants/AxonEnums';

/**
 * Database Handler
 * Use require to dynamically load a Database Provider depending on installed dependencies.
 *
 * @author KhaaZ
 *
 * @class DBHandler
 */
class DBHandler {
    static pickDBProvider(axonOptions, axon) {
        let DBProvider;

        // eslint-disable-next-line no-shadow
        const { db } = axonOptions.settings;

        switch (db) {
            // Json Database
            case DB_TYPES.JSON:
            default: {
                DBProvider = new JsonProvider(axon);
                axon.logger.info('Selected Database: JSON DB.');
                break;
            }

            // MongoDB Database
            case DB_TYPES.MONGO: {
                try {
                    const MongoService = require('./MongoProvider').default;
                    DBProvider = new MongoService(axon);
                    axon.logger.info('Selected Database: MongoDB.');
                } catch (err) {
                    DBProvider = new JsonProvider(axon);
                    axon.logger.warn('Mongoose wasn\'t found, using JSON DB instead.');
                    axon.logger.info('Selected Database: JSON DB.');
                }
                break;
            }
        }

        DBProvider.init(axonOptions);
        axon.logger.axon('DB ready.');
        return DBProvider;
    }
}

export default DBHandler;
