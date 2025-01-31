const { PrismaClient } = require('@prisma/client');

const SystemCollector = require('zero-system/src/SystemCollector');

module.exports = class StorageService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('storage');
  }

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * @param {(EntityBase|string)} entity 
   * @param {Object} params
   */
  async load(entity, params) {
    if (typeof entity === 'string') {
      entity = SystemCollector.get('entity.' + entity);
    }
  }

}