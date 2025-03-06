const MethodProxy = require('zero-util/src/MethodProxy');
const StringUtil = require('zero-util/src/StringUtil');
const SystemCollector = require('zero-system/src/SystemCollector');
const JSONUtil = require('zero-util/src/JSONUtil');

const EntityBase = require('./EntityBase');

/**
 * @typedef {Object} T_ContentEntityInfo
 * @property {string} type
 * @property {string} label
 * @property {string} form
 * @property {string} table
 * @property {Object<string, string>} routes
 * @property {Object<string, string>} keys
 */

/**
 * @typedef {Object} E_ContentEntityEvent
 * @property {import('./ContentEntityBase')<G_Entity, G_Prisma>} type
 * @property {Object} bag
 * @property {G_Entity} [entity]
 * @property {any} [result]
 * @property {number} [id]
 * @property {boolean} [ref]
 * @property {G_Prisma} [query]
 */

/**
 * @template G_Entity
 * @template G_Prisma
 */
module.exports = class ContentEntityBase extends EntityBase {

  static EVENT__ENTITY_PRESAVE = 'entity:presave';
  static EVENT__ENTITY_PREUPDATE = 'entity:update';
  static EVENT__ENTITY_PRECREATE = 'entity:precreate';
  static EVENT__ENTITY_POSTSAVE = 'entity:postsave';

  static EVENT__ENTITY_PRELOAD = 'entity:preload';
  static EVENT__ENTITY_POSTLOAD = 'entity:postload';

  static TAG_ENTITY_CONTENT = 'entity.content';

  /**
   * @param {string} event 
   * @param {(event: E_ContentEntityEvent) => void} listener 
   */
  static on(event, listener) {
    SystemCollector.get('root').events.on(event, listener);
  }

  /**
   * @param {import('zero-system/src/SystemItem')} item
   * @param {import('../Service/Storage.service')} storage 
   */
  constructor(item, storage) {
    super(item, storage);
    this._keys = null;
    /** @type {import('zero-system/src/ZeroRoot')} */
    this._root = SystemCollector.get('root');
  }

  /** @returns {G_Prisma} */
  get query() {
    return this.storage.database[this.info().type];
  }

  model() {
    return this.storage.models[this.info().table ?? this.info().type];
  }

  /** @returns {import('../Service/Storage.service').T_ModelSchema} */
  schema() {
    return this.storage.getSchema(this.info().table ?? this.info().type);
  }

  /**
   * @param {G_Entity} value 
   * @param {boolean} isNew
   * @returns {G_Prisma}
   */
  convert(value, isNew = false) {
    for (const field of this.schema().fields) {
      switch (field.type) {
        case 'Int':
          if (typeof value[field.name] === 'string') {
            value[field.name] = parseInt(value[field.name]);
          }
          break;
        case 'Json':
          if (typeof value[field.name] !== 'string') {
            value[field.name] = JSON.stringify(value[field.name]);
          }
          break;
      }
      if (field.reference && value[field.name]) {
        const method = (isNew ? 'connect' : 'set');
        if (field.options.single) {
          if (typeof value[field.name] === 'string') {
            value[field.name] = {
              [method]: [{ id: parseInt(value[field.name]) }],
            };
          } else if (typeof value[field.name] === 'number') {
            value[field.name] = {
              [method]: [{ id: value[field.name] }],
            };
          } else {
            value[field.name] = {
              [method]: [value[field.name]],
            };
          }
        } else {
          value[field.name] = {
            [method]: value[field.name],
          };
        }
      }
    }
    return value;
  }

  /**
   * @param {G_Entity} value 
   * @returns {G_Entity}
   */
  prepare(value) {
    for (const field of this.schema().fields) {
      if (field.type === 'Json' && typeof value[field.name] === 'string') {
        value[field.name] = JSON.parse(value[field.name]);
      }
      if (field.reference && field.options.single && Array.isArray(value[field.name])) {
        value[field.name] = value[field.name][0];
      }
    }
    return value;
  }

  /**
   * @param {G_Entity} entity 
   * @returns {G_Entity}
   */
  async save(entity) {
    const bag = {};
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_PRESAVE, { type: this, entity, bag });
    entity = this.convert(entity, !entity.id);
    let result = null;
    if (entity.id) {
      const query = {
        data: entity,
        where: {
          id: entity.id,
        },
      };
      await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_PREUPDATE, { type: this, entity, bag, query });
      result = await this.query.update(query);
    } else {
      const query = {
        data: entity,
      };
      await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_PRECREATE, { type: this, entity, bag, query });
      result = await this.query.create(query);
    }
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_POSTSAVE, { type: this, entity, result, bag });
    return result;
  }

  /**
   * @param {number} id 
   * @param {boolean} ref
   * @returns {?G_Entity}
   */
  async load(id, ref = false) {
    if (typeof id === 'string') id = parseInt(id);
    const query = {
      where: { id },
    };

    if (ref) {
      for (const field of this.schema().fields) {
        if (field.reference) {
          query.include ??= {};
          query.include[field.name] = { select: { id: true } };
        }
      }
    }
    const bag = {};
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_PRELOAD, { type: this, id, ref, query, bag });
    const entity = this.prepare(await this.query.findFirst(query));
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_POSTLOAD, { type: this, entity, query, bag });
    return entity;
  }

  /**
   * @param {number[]} ids 
   * @param {boolean} ref 
   * @returns {G_Entity[]}
   */
  async multi(ids, ref = false) {
    const entites = [];
    for (const id of ids) {
      const item = await this.load(id, ref);
      if (item) entites.push(item);
    }
    return entites;
  }

  /**
   * @param {(string|Object<string,string>)} search 
   * @param {number} take
   * @param {number} page
   * @returns {G_Entity[]}
   */
  async list(search, take = 100, page = 0) {
    if (typeof search === 'string') {
      if (this.key('label') === null) return [];
      search = { 
        [this.key('label')]: { contains: search },
      };
    }

    return this.query.findMany({
      where: search,
      take,
      skip: take * page,
    });
  }

  /**
   * @param {(string|Object<string,string>)} search 
   * @returns {number}
   */
  async count(search) {
    if (typeof search === 'string') {
      if (this.key('label') === null) return 0;
      search = { 
        [this.key('label')]: { contains: search },
      };
    }

    return this.query.count({
      where: search,
    });
  }

  async getEntityActions(items, query) {
    for (const item of await this.list(query.filter, 5)) {
      items.push({
        name: `Edit: ${item.name}`,
        description: `Edit the ${this.info().label} "${item.id}"`,
        tags: ['entity', this.info().type],
        commands: new MethodProxy({ service: 'remote.form' })
          .open(this.info().form ?? 'form.generate.edit', { game: item.game, id: item.id, generate: this._item.name }, { title: `${this.info().label} - ${item.name} [${item.id}]` })
          .chain,
      });
    }
  }

  /**
   * @param {string} route 
   * @param {G_Entity} data
   * @returns {?string} 
   */
  async route(route, data) {
    const placeholder = await this.getRouteData(route, data);
    if (this.info().routes && this.info().routes[route]) {  
      return StringUtil.replaceObject(this.info().routes[route], placeholder, '');
    }
    return null;
  }

  /**
   * @param {string} route 
   * @param {G_Entity} data 
   * @returns {G_Entity}
   */
  async getRouteData(route, data) {
    return data;
  }

  /**
   * @param {G_Entity} entity 
   * @param {string} key 
   * @param {any} value 
   * @returns {G_Entity}
   */
  async setConfig(entity, key, value) {
    const configkey = this.key('config');
    if (configkey === null) throw new Error(`This entity "${this._item.name}" has no config key defined.`);
    const config = JSONUtil.getDeep(entity, configkey, {});
    JSONUtil.setDeep(config, key, value);
    JSONUtil.setDeep(entity, configkey, config);
    const firstkey = configkey.split('.').shift();
    await this.query.update({
      where: {
        id: entity.id,
      },
      data: {
        [firstkey]: JSON.stringify(entity[firstkey]),
      },
    });
    return entity;
  }

  /**
   * @param {G_Entity} entity 
   * @param {string} key 
   * @returns {any}
   */
  getConfig(entity, key) {
    const configkey = this.key('config');
    if (configkey === null) throw new Error(`This entity "${this._item.name}" has no config key defined.`);
    const config = JSONUtil.getDeep(entity, configkey, {});
    return JSONUtil.getDeep(config, key);
  }

  /**
   * @returns {Object<string, string>}
   */
  keys() {
    if (this._keys === null) {
      this._keys = {};
      for (const field of this.schema().fields) {
        if (field.options?.key) {
          this._keys[field.options.key] = field.name;
        } else if (field.primary) {
          this._keys['id'] = field.name;
        }
      }
      if (this.info().keys) {
        for (const key in this.info().keys) {
          this._keys[key] = this.info().keys[key];
        }
      }
    }
    return this._keys;
  }

  /**
   * @param {string} key 
   * @returns {?string}
   */
  key(key) {
    return this.keys()[key] ?? null;
  }

  /** 
   * @returns {T_ContentEntityInfo} 
   */
  info() { }

}