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
      menu: {
        label: 'Audio Menu',
        icon: {
          id: 'el-icon-picture',
        },
        size: 'big',
      },
    };
  }

  config() {
    return [
      {
        name:  'start',
        label: 'Start',
      },
      {
        name: 'end',
        label: 'Ende',
      },
      {
        name: 'volume',
        label: 'Volume',
        value: '100',
      },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: {
          sound: 'Sound',
          music: 'Music',
        },
      }
    ];
  }

}