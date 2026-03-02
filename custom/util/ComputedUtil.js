/**
 * @typedef {Object} T_ObjectSize
 * @property {number} width
 * @property {number} height
 */

const JSONUtil = require('zero-util/src/JSONUtil');
const Vue = require('vue');

module.exports = class ComputedUtil {

  static getDeepProp(mount, path, fallback = '', createByGet = false) {
    return {
      get() {
        if (createByGet && !JSONUtil.hasDeep(this[mount], path)) {
          JSONUtil.setDeep(this[mount], path, fallback, (data, key, value) => {
            this.$set(data, key, value);
          });
        }
        return JSONUtil.getDeep(this[mount], path, fallback);
      },
      set(value) {
        JSONUtil.setDeep(this[mount], path, value, (data, key, value) => {
          this.$set(data, key, value);
        });
      },
    };
  }

  static setDeepVueDefault(mount, path, value = {}) {
    if (!JSONUtil.hasDeep(mount, path)) {
      return this.setDeepVue(mount, path, value);
    }
    return mount;
  }

  static setDeepVue(mount, path, value = {}) {
    if (typeof value === 'function') value = value();
    JSONUtil.setDeep(mount, path, value, (data, key, value) => {
      Vue.set(data, key, value);
    });
    return mount;
  }

  static getLazyStoreValue(store, getter, fetcher, params = []) {
    return function() {
      let args = params;
      if (typeof params === 'function') {
        args = params.call(this);
      }
      const result = store[getter](...args);
      if (!result) {
        store[fetcher](...args);
      }
      return result;
    };
  }

  /**
   * @param {Element} container 
   * @param {Element} image 
   */
  static getObjectFitElementSize(container, image) {
    return this.getObjectFitSize(container.getBoundingClientRect(), { width: image.naturalWidth, height: image.naturalHeight });
  }

  /**
   * @param {T_ObjectSize} container 
   * @param {T_ObjectSize} child 
   * @returns {T_ObjectSize}
   */
  static getObjectFitSize(container, child) {
    const ir = child.width / child.height;
    const cr = container.width / container.height;

    return {
      width: ir > cr ? container.width : container.height * ir,
      height: ir > cr ? container.width / ir : container.height,
    };
  }

}