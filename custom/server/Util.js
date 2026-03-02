module.exports = class Util {

  /**
   * @param  {...any} sources last has prio over previous
   * @returns {Object}
   */
  static deepMergeOptions(...sources) {
    const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);

    return sources.reduceRight((acc, source) => {
      if (!isObject(source)) return acc;

      for (const key of Object.keys(source)) {
        const existing = acc[key];
        const incoming = source[key];

        if (existing === undefined) {
          acc[key] = structuredClone(incoming);
          continue;
        }
        if (isObject(existing) && isObject(incoming)) {
          acc[key] = Util.deepMergeOptions(existing, incoming);
        }
      }

      return acc;
    }, {});
  }

  /**
   * @param {Object} object 
   * @param {string[]} keys 
   * @returns {Object}
   */
  static keyFilter(object, keys = []) {
    const newObject = {};
    for (const key of keys) {
      if (object[key] === undefined) continue;
      newObject[key] = object[key];
    }
    return newObject;
  }

}