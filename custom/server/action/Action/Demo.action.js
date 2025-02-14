const MethodProxy = require('zero-util/src/MethodProxy');

const ActionBase = require('../src/ActionBase');

module.exports = class PagesAction extends ActionBase {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('demo');
  }

  async getActions(items) {
    items.push({
      name: 'OPEN: Grid',
      tags: ['open'],
      commands: new MethodProxy({ service: 'remote.router' }).open('CustomGrid', {}, {title: 'Cool Oder'}).chain,
    });
    items.push({
      name: 'TEST: Edit building',
      tags: ['edit', 'test'],
      commands: new MethodProxy({ service: 'remote.router' })
        .open('ZeroFormulate', { info: { params: { game: 'paycyber', building: 1 } }, form: 'form.building.edit' })
        .chain,
    });
  }

}