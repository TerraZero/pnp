const Path = require('path');

const StringUtil = require('zero-util/src/StringUtil');
const MethodProxy = require('zero-util/src/MethodProxy');

const ActionBase = require('../src/ActionBase');

module.exports = class PagesAction extends ActionBase {

  static Pages() {
    return require('../../../namespaces/pages.namespace');
  }

  /**
   * @param {import('../Collector/Action.collector')} collector 
   */
  static define(collector) {
    collector.add('pages');
  }

  async getActions(items) {
    const pages = PagesAction.Pages();

    for (const page in pages) {
      let path = StringUtil.removeExtension(page);
      if (path.endsWith('index')) {
        path = Path.join(path, '..');
      }
      if (path === '.') path = '/';
      items.push({
        name: 'Page: ' + (path === '/' ? '[FRONT]' : Path.basename(path)) + ' >',
        description: 'Goto page "' + path + '"',
        tags: ['goto'],
        commands: new MethodProxy({ service: 'remote.router' }).goto(path).chain,
      });
    }
  }

}