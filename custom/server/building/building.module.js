const ZeroModule = require('zero-system/src/ZeroModule');
const SystemCollector = require('zero-system/src/SystemCollector');

const ContentEntityBase = require('../entity/src/ContentEntityBase');

module.exports = class BuildingModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('building');
  }

  async setupInit() {
    /** @type {import('~/custom/server/entity/Service/Storage.service')} */
    const storage = SystemCollector.get('service.storage');
    /** @type {import('./Entity/Tile.entity')} */
    const tileStorage = SystemCollector.get('entity.tile');

    ContentEntityBase.on(ContentEntityBase.EVENT__ENTITY_POSTSAVE, async ({ type, entity }) => {
      if (type.type === 'entity.floor') {
        const sum = await storage.database.tile.count({
          where: {
            floor: { some: { id: entity.id } },
          },
        });
        
        if (sum > entity.width * entity.height) {
          await storage.database.tile.deleteMany({
            where: {
              floor: { every: { id: entity.id } },
              OR: [
                { x: { gte: entity.width } },
                { y: { gte: entity.height } },
              ],
            },
          });
        } else if (sum < entity.width * entity.height) {
          for (let y = 0; y < entity.height; y++) {
            for (let x = 0; x < entity.width; x++) {
              if (!await tileStorage.exists(entity.id, x, y)) {
                await tileStorage.save({
                  floor: entity.id,
                  x,
                  y,
                  value: {},
                });
              }
            }
          }
        }
      }
    });
  }

}