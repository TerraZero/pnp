const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Audio, import('prisma/prisma-client').Prisma.AudioDelegate>
 */
module.exports = class AudioEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('audio');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'audio',
      label: 'Audio',
      routes: {
        edit: '/{game}/audio/{id}/edit',
      },
    };
  }

}