import RemoteSystem from 'zero-system/src/RemoteSystem';
import Client from 'zero-system/src/Nuxt/Socket/Client';

import namespace from '../namespaces/remote.namespace';
import Logger from 'zero-system/src/Log/Logger';

// Logger.setDebug(true);
export default new RemoteSystem(new Client(), namespace);

/**
 * @param {RemoteSystem} rs
 * @param {Object} context 
 */
export function startup(rs, context) {

  rs.boot(context);

}