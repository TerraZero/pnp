import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/enemy/Entity/EnemyType.entity')} */
let _enemyTypeStorage = null;

export const state = () => ({

  types: null,

})

export const getters = {

  getType: (state) => (type) => {
    return (state.types && state.types[type]) ?? null;
  },

  getTypes: (state) => () => {
    return state.types ?? {};
  },

  getOptions: (state) => () => {
    const options = {};
    for (const type in state.types) {
      options[type] = state.types[type].label + ' (' + type + ')';
    }
    return options;
  },

}

export const mutations = {

  setTypes(state, types) {
    state.types ??= {};
    for (const type in types) {
      state.types[types[type].id] = types[type];
    }
  },

}

export const actions = {

  async fetchTypes({ state, commit }, force = false) {
    if (state.types === null || force) {
      _enemyTypeStorage ??= await RemoteSystem.get('entity.enemy_type');
      commit('setTypes', await _enemyTypeStorage.loadAllMapped());
    }
  },

}