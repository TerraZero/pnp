const RouteMatcher = require('route-parser');
const RemoteSystem = require('zero-system/src/RemoteSystem');

const Util = require('../../Util');

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;

module.exports = class TempEntityType {

  /**
   * @param {*} storage 
   * @param {import('../../entity/Service/Storage.service').T_ModelSchema} definition
   */
  constructor(storage, definition) {
    this.storage = storage;
    this.definition = definition;
    this._routes = {};
  }

  /**
   * @returns {string}
   */
  id() {
    return this.name().toLowerCase();
  }

  /**
   * @returns {string}
   */
  name() {
    return this.definition.name;
  }

  /**
   * @returns {string}
   */
  label() {
    return this.definition.options?.meta?.label ?? this.name();
  }

  /**
   * @param {string} field 
   * @returns {import('../../entity/Service/Storage.service').T_ModelFieldSchema}
   */
  field(field) {
    return this.fields().find(v => v.name === field);
  }

  /**
   * @returns {import('../../entity/Service/Storage.service').T_ModelFieldSchema[]}
   */
  fields() {
    return this.definition.fields;
  }

  /**
   * @param {string} field 
   * @returns {import('./TempEntityType')}
   */
  async getRefType(field) {
    return await this.storage.getType(this.field(field).real.type);
  }

  /**
   * @param {(string|G_Prisma)} search 
   * @param {number} take
   * @param {number} page
   * @returns {Object[]}
   */
  async list(search, take = 100, page = 0) {
    return await this.storage.list(this.id(), search, take, page);
  }

  /**
   * @param {string} route
   * @param {import('./TempEntity')} entity
   * @param {Object} params
   * @returns {string}
   */
  route(route, entity = null, params = {}) {
    route = this.getRoute(route);
    params = Util.deepMergeOptions((entity ? entity.values() : {}), params);
    return route.reverse(params);
  }

  /**
   * @param {string} route
   * @param {import('./TempEntity')} entity
   * @param {Object} params
   */
  async goto(route, entity = null, params = {}) {
    _router ??= await RemoteSystem.get('remote.router');
    _router.goto(this.route(route, entity, params));
  }

  /**
   * @param {string} route
   * @returns {RouteMatcher}
   */
  getRoute(route) {
    if (this._routes[route] === undefined) {
      this._routes[route] = new RouteMatcher(this.definition.options.routes[route]);
    }
    return this._routes[route];
  }

}