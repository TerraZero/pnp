const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').EnemyType, import('prisma/prisma-client').Prisma.EnemyTypeDelegate>
 */
module.exports = class EnemyTypeEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('enemy_type');
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'enemy_type',
      label: 'Enemy Type',
      table: 'enemyType',
      routes: {
        edit: {
          url: '/{game}/enemy_type/{id}/edit',
          icon: 'edit',
          label: 'Edit',
        },
      },
    };
  }

}