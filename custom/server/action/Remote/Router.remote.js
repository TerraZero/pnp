const RemoteSystem = require('zero-system/src/RemoteSystem');

module.exports = class RouterRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('router');
  }

  windowStack() {
    return RemoteSystem.getComponent('window.stack');
  }

  router() {
    return this.windowStack().$router;
  }

  goto(path) {
    this.router().push(path);
  }

  async wsgoto(path) {
    path = path.replace(/\\/g, '/');

    const placeholders = {};
    const options = [...path.matchAll(/_([a-z_]+)/g)].map(v => v[1]);
    
    try {
      if (options.length) {
        for (const option of options) {
          placeholders[option] = (await this.windowStack().getRequestOption(['Path: ' + path, `Select for option "${option}":`], {
            key: option,
            placeholders,
            path,
            action: 'wsgoto',
          })).value;
          path = path.replace('_' + option, placeholders[option]);
        }
        this.goto(path);
      } else {
        this.goto(path);
      }
    } catch (e) {
      this.windowStack().notify({
        type: 'info',
        title: 'Router: Abort request',
        message: 'Goto: `' + path + '`',
      });
    }
  }

  open(component, params = [], info = {}, parent = null) {
    return this.windowStack().addComponent(component, params, info, parent);
  }

  close(key) {
    this.windowStack().closeComponent(key);
  }

  get(key) {
    return this.windowStack().getComponent(key);
  }

}