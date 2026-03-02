// const RandomUtil = require('~/custom/util/RandomUtil');

/**
 * @typedef {Object} T_EnemyAttr
 * @property {number} min
 * @property {number} max
 * @property {number} value
 * @property {number} manuel
 * @property {number} bonus
 */

/**
 * @typedef {Object} T_EnemyProps
 * @property {number} level
 * @property {Object<string, T_EnemyAttr>} attrs
 * @property {Object} live
 * @property {number} live.base
 * @property {number} live.die
 * @property {number} live.plain
 * @property {number} live.manuel
 * @property {number} live.max
 * @property {number} live.current
 */

module.exports = class EnemyRemote {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('enemy');
  }

  /**
   * @param {import('prisma/prisma-client').EnemyType} enemy_type 
   * @param {number} level
   * @returns {T_EnemyProps}
   */
  createEnemyProps(enemy_type, level) {
    const props = {
      level,
      attrs: {},
      live: {},
    };

    for (const attr in enemy_type.value.attrs) {
      const [ min, max ] = enemy_type.value.attrs[attr].split('-').map(v => parseInt(v));
      const sectors = RandomUtil.generateSectorsInt(max - min + 1, 100, RandomUtil.levelToBias(level));
      props.attrs[attr] = { 
        min, 
        max,
        manuel: 0,
        value: min + RandomUtil.getRandomSector(sectors),
        bonus: 0,
      };
    }

    const [ base, die ] = enemy_type.value.live.split('+').map(v => parseInt(v));
    props.live = { 
      base, 
      die,
      plain: base,
      manuel: 0,
    };
    for (let i = 0; i < level; i++) {
      props.live.plain += RandomUtil.getRandomInt(1, die);
    }
    props.live.max = props.live.plain;
    props.live.current = props.live.plain;
    return this.calcBonus(props);
  }

  /**
   * @param {T_EnemyProps} props 
   * @returns {T_EnemyProps}
   */
  calcBonus(props) {
    for (const attr in props.attrs) {
      props.attrs[attr].bonus = this.getBonus(props.attrs[attr].value + props.attrs[attr].manuel);
    }
    const liveLink = props.live.max === props.live.current;
    props.live.max = props.live.plain + props.live.manuel + props.level * props.attrs.con.bonus;
    if (liveLink) props.live.current = props.live.max;
    return props;
  }

  /**
   * @param {number} value 
   * @returns {number}
   */
  getBonus(value) {
    const bonus = (value - 10) / 2;
    return Math[bonus > 0 ? 'floor' : 'ceil'](bonus);
  }

}