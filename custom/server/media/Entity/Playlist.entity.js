const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Playlist, import('prisma/prisma-client').Prisma.PlaylistDelegate>
 */
module.exports = class PlaylistEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('playlist');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'playlist',
      label: 'Playlist',
      routes: {
        edit: '/{game}/playlist/{id}/edit',
      },
    };
  }

}