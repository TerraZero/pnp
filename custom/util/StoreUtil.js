let _store = null;

module.exports = class StoreUtil {

  static setStore(store) {
    _store = store;
  }

  static get(storename) {
    return new Proxy(new StoreUtil(storename), {

      get(target, prop, receiver) {
        if (_store.state[target.storename][prop] !== undefined) {
          return _store.state[target.storename][prop];
        }
        if (_store.getters[target.storename + '/' + prop]) {
          return (...args) => {
            return _store.getters[target.storename + '/' + prop](...args);
          };
        }
        if (_store._mutations[target.storename + '/' + prop]) {
          return (...args) => {
            return _store.commit(target.storename + '/' + prop, ...args);
          };
        }
        if (_store._actions[target.storename + '/' + prop]) {
          return (...args) => {
            return _store.dispatch(target.storename + '/' + prop, ...args);
          };
        }
        return undefined;
      },

    });
  }

  constructor(storename) {
    this.storename = storename;
  }

}