module.exports = class BaseWindow {

  /**
   * @param {import('../Collector/Window.collector')} collector 
   */
  static define(collector) {
    collector.add('window');
  }

  windows() {
    return {
      'window.empty': {
        path: '/window/empty',
        title: 'Empty Window',
        component: 'ZUI/Page/Empty',
        zui: {
          width: '70%',
          height: '70%',
          position: 'center',
        },
      },
    };
  }

}