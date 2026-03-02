const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Config, import('prisma/prisma-client').Prisma.ConfigDelegate>
 */
module.exports = class ConfigEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('config');
  }

  /** 
   * @returns {T_ContentEntityInfo}
   */
  info() {
    return {
      type: 'config',
      label: 'Config',
      routes: {
        edit: '/{game}/config/{id}/edit',
      },
    };
  }

}