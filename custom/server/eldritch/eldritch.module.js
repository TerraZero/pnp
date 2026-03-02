const ZeroModule = require('zero-system/src/ZeroModule');
const ContentEntityBase = require('../entity/src/ContentEntityBase');
const ConfigEntity = require('../config/Entity/Config.entity');

module.exports = class EldritchModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('eldritch');
  }

  /**
   * @param {import('zero-system/src/Nuxt/Socket/Server')} server 
   */
  setupModuleSocket(server) {
    ContentEntityBase.on(ContentEntityBase.EVENT__ENTITY_POSTSAVE, async ({ type, entity }) => {
      if (type instanceof ConfigEntity) {
        const loaded = await type.load(entity.id);
      
        server.broadcast('update.screen', 'update', { entity: loaded });
      }
    });

    server.addHandler('eldritch.ident', (request, mount, answer) => {
      mount.info.ident = request.data.ident;
      answer();
    });
  }

}
