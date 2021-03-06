import ARegistry from './ARegistry';

import Listener from '../Event/Listener';
import AxonError from '../../Errors/AxonError';

/**
 * Registry that holds all Commands.
 *
 * @author KhaaZ
 *
 * @class ListenerRegistry
 * @extends ARegistry
 */
class ListenerRegistry extends ARegistry {
    constructor(axon) {
        super(axon, Listener);
    }

    /**
     * Register a Listener inside the ListenerRegistry
     *
     * @param {String} label - The listener label
     * @param {Listener} listener - The listener object
     *
     * @memberof ListenerRegistry
     */
    register(label, listener) {
        if (this.registry.has(label) ) {
            throw new AxonError(`Register [${label}]: Already registered!`, 'LISTENER-REGISTRY', listener.module.label);
        }

        this.add(label, listener);
        this.axon.eventManager.registerListener(listener);
    }

    /**
     * Unregister a Listener from the ListenerRegistry
     *
     * @param {String} label - The listener label
     * @param {Listener} [listener=null] - The listener object
     * @memberof ListenerRegistry
     */
    unregister(label, listener = null) {
        if (!listener) {
            listener = this.get(label);
        }
        if (!listener) {
            throw new AxonError(`Unregister: Not registered!`, 'LISTENER-REGISTRY', listener.module.label);
        }
        this.remove(label);
        this.axon.eventManager.unregisterListener(listener.eventName, listener.label);
        
        this.axon.log('INFO', `LISTENER-REGISTRY - [Module(${listener.module.label})] Listener: ${label} unregistered!`);
    }
}

export default ListenerRegistry;
