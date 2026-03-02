const FormBase = require('../../form/src/FormBase');

module.exports = class MediaRemote {

  /**
   * @param {import('zero-system/src/Collector/Remote.collector')} collector 
   */
  static define(collector) {
    collector.add('media');
  }

}