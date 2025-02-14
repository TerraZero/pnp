const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Floor, import('prisma/prisma-client').Prisma.FloorDelegate>
 */
module.exports = class FloorEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('floor').setTag('rmi').setTag(this.TAG_ENTITY_ACTIONS);
  }

  /**
   * @param {number} id 
   * @returns {import('prisma/prisma-client').Floor[]}
   */
  async getFloorsFromBuilding(id) {
    return this.query.findMany({
      where: {
        building: {
          some: { id },
        },
      },
    });
  }

  /**
   * @param {number} id 
   * @returns {string}
   */
  async getGame(id) {
    const result = await this.query.findFirst({
      include: {
        building: true,
      },
      where: { id }
    });
    
    return result?.building[0]?.game ?? null;
  }

  /**
   * @param {string} route 
   * @param {import('prisma/prisma-client').Floor} data 
   * @returns {import('prisma/prisma-client').Floor}
   */
  async getRouteData(route, data) {
    data.game = await this.getGame(data.id);
    return data;
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() {
    return {
      type: 'floor',
      label: 'Floor',
      routes: {
        edit: '/{game}/floor/{id}/edit',
      },
    };
  }

}