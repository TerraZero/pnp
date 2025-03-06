const ContentEntityBase = require('../../entity/src/ContentEntityBase');

/**
 * @extends ContentEntityBase<import('prisma/prisma-client').Tile, import('prisma/prisma-client').Prisma.TileDelegate>
 */
module.exports = class TileEntity extends ContentEntityBase {

  /**
   * @param {import('../../entity/Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.addContentEntity('tile');
  }

  /** 
   * @returns {T_ContentEntityInfo}
   */
  info() {
    return {
      type: 'tile',
      label: 'Tile',
      routes: {
        edit: '/{game}/tile/{id}/edit',
      },
      keys: {
        config: 'value.config',
      },
    };
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
   * @param {number} id 
   * @returns {string}
   */
  async getGame(id) {
    const result = await this.query.findFirst({
      include: {
        floor: {
          include: {
            building: true,
          },
        },
      },
      where: { id }
    });
    
    return result?.floor[0]?.building[0]?.game ?? null;
  }

  /**
   * @param {number} floor 
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean}
   */
  async exists(floor, x, y) {
    return (await this.query.count({
      where: {
        floor: { some: { id: floor } },
        x,
        y,
      },
    })) > 0;
  }

}