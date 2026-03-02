module.exports = class PlaylistWindow {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('eldritch.playlist');
  }

  windows() {
    return {
      'playlist.transmit': {
        path: '/transmit/playlist/:id',
        title: 'Playlist Transmit',
        component: 'Entity/ZUI/PlaylistTransmit',
        zui: {
          width: '800px',
          height: '50%',
          center: true,
        },
      },
    };
  }

}