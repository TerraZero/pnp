const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Image, import('prisma/prisma-client').Prisma.ImageDelegate>
 */
module.exports = class ImageEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('image');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'image',
      label: 'Image',
      routes: {
        edit: '/{game}/image/{id}/edit',
      },
    };
  }

}