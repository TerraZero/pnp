const RouteMatcher = require('route-parser');

const SystemCollector = require('zero-system/src/SystemCollector');
const ZeroModule = require('zero-system/src/ZeroModule');

module.exports = class WindowModule extends ZeroModule {

  /**
   * @param {import('zero-system/src/Collector/ModuleCollector')} collector 
   */
  static define(collector) {
    collector.add('window').setTag('rmi');
  }

  constructor() {
    super();
    this.routes = null;
  }

  /**
   * @param {string} internal 
   */
  match(internal) {
    if (this.routes === null) {
      this.routes = {};
      SystemCollector.finds(v => v.hasTag('window')).forEach(v => {
        const windows = v.getObject().windows();
        for (const id in windows) {
          windows[id].id = id;
          windows[id].matcher = new RouteMatcher(windows[id].path);
          windows[id].info = {
            id,
            path: windows[id].path,
            component: windows[id].component,
            defaults: windows[id].defaults,
            params: windows[id].params,
            zui: windows[id].zui,
          };
          this.routes[id] = windows[id];
        }
      });
    }
    let route = null;
    let match = null;
    for (route in this.routes) {
      match = this.routes[route].matcher.match(internal);
      console.log(this.routes[route].path, internal, match);
      if (match) return { route: this.routes[route], match };
    }
    return null;
  }

  /**
   * @param {string} internal 
   * @param {Object} params 
   */
  open(internal, params = {}) {
    const build = {};
    const item = this.match(internal);

    if (item) {
      build.info = item;
      build.info.params = params;

      build.component = build.info.route.component;
      build.params = {...build.info.route.defaults, ...build.info.route.params};
      for (const key in build.info.match) {
        if (build.info.match[key] !== undefined) {
          build.params[key] = build.info.match[key];
        }
      }
      build.frame = {
        title: build.info.route.title ?? build.info.route.id,
      };
      if (build.info.route.zui?.width) {
        build.frame.width = build.info.route.zui.width;
      }
      if (build.info.route.zui?.height) {
        build.frame.height = build.info.route.zui.height;
      }
      if (build.info.route.zui?.position) {
        build.frame.position = build.info.route.zui.position;
      }

      let realBuild = {  
        info: {
          route: build.info.route.info,
          match: build.info.match,
        },
        component: build.component,
        params: build.params,
        frame: build.frame,
      };

      if (typeof build.info.route.prepare === 'function') {
        realBuild = build.info.route.prepare(realBuild, build);
      }
      return realBuild;
    }
  }

}