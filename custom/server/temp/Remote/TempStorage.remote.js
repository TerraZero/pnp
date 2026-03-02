const RemoteSystem = require('zero-system/src/RemoteSystem');

const TempEntity = require('../src/TempEntity');
const TempEntityType = require('../src/TempEntityType');
const ScreenRemote = require('../src/ScreenRemote');
const ControlRemote = require('../src/ControlRemote');
const Util = require('~/custom/server/Util');

/**
 * @typedef {Object} T_ListResultEntities
 * @property {Object} result
 * @property {Object} pager
 * @property {number} pager.current
 * @property {number} pager.count
 * @property {number} pager.pages
 * @property {TempEntity[]} entities
 */

/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;
const _types = {};
let _types_loaded = false;

module.exports = class TempStorage {

  /**
   * @param {import('zero-system/src/Collector/RemoteCollector')} collector 
   */
  static define(collector) {
    collector.add('tempstorage');
  }

  /**
   * @param {import('zero-system/src/RemoteSystem')} system 
   */
  static async setupInit(system) {
    _temp = await system.get('service.temp');
  }

  constructor() {
    this._screen = new ScreenRemote();
    this._control = new ControlRemote();
  }

  /**
   * @returns {ScreenRemote}
   */
  screen() {
    return this._screen;
  }

  /**
   * @returns {ControlRemote}
   */
  control() {
    return this._control;
  }

  /**
   * @param {string} type 
   * @returns {TempEntityType}
   */
  async getType(type) {
    const _type = type.toLowerCase();
    if (_types[_type] === undefined) {
      _temp ??= await RemoteSystem.get('service.temp');
      const definition = await _temp.getType(_type);
      _types[_type] = new TempEntityType(this, definition);
    }
    return _types[_type];
  }

  /**
   * @returns {Object<string, TempEntityType>}
   */
  async getTypes() {
    if (!_types_loaded) {
      _temp ??= await RemoteSystem.get('service.temp');
      _types_loaded = true;
      for (const key of await _temp.getTypeKeys()) {
        await this.getType(key);
      }
    }
    return _types;
  }

  /**
   * @param {string} type 
   * @returns {TempEntity}
   */ 
  async create(type) {
    _temp ??= await RemoteSystem.get('service.temp');
    const entity_type = await this.getType(type);
    const data = await _temp.create(type, {});
    return new TempEntity(entity_type, data);
  }

  /**
   * @param {string} type 
   * @param {(number|string)} id 
   * @returns {TempEntity}
   */
  async load(type, id) {
    _temp ??= await RemoteSystem.get('service.temp');
    const entity_type = await this.getType(type);
    const data = await _temp.load(type, id);
    return new TempEntity(entity_type, data);
  }

  /**
   * @param {string} type
   * @param {(string|G_Prisma)} search 
   * @param {number} take
   * @param {number} page
   * @returns {T_ListResultEntities}
   */
  async list(type, search, take = 100, page = 0) {
    _temp ??= await RemoteSystem.get('service.temp');
    const entity_type = await this.getType(type);
    const items = [];
    const list = await _temp.list(type, search, take, page);
    for (const item of list.result) {
      items.push(new TempEntity(entity_type, item));
    }
    list.entities = items;
    return list;
  }

  /**
   * @param {TempEntity} entity 
   */
  async save(entity) {
    await _temp.save(entity.pack());
  }

  /**
   * @param {TempEntity} entity 
   * @returns 
   */
  async delete(entity) {
    return await _temp.delete(entity.pack());
  }

  async getState(key, defaults = {}) {
    const state = await _temp.find('tstate', { label: key });
    return Util.deepMergeOptions(defaults, state?.value ?? {});
  }

  async setState(key, settings) {
    let state = await _temp.find('tstate', { label: key });
    if (state === null) {
      state = await _temp.create('tstate', {
        label: key,
      });
    }
    state.value = settings;
    await _temp.save(state);
  }

}