/**
 * @typedef {Object} T_ContentEntityInfo
 * @property {string} type
 * @property {string} label
 * @property {string} form
 * @property {string} table
 * @property {Object<string, string>} routes
 * @property {Object<string, string>} keys
 * @property {Object<string, string>} paramsMap
 * @property {Object<string, string>} list
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
 * @typedef {Object} T_EntityRouteInfo
 * @property {string} url
 * @property {string} icon
 * @property {string} label
 */

/**
 * @typedef {Object} T_EntitySearchResult
 * @property {G_Entity[]} items
 * @property {Object} pager
 * @property {number} pager.current
 * @property {number} pager.items
 * @property {number} pager.pages
 */

/**
 * @template G_Entity
 * @template G_Prisma
 */

const MethodProxy = require('zero-util/src/MethodProxy');
const StringUtil = require('zero-util/src/StringUtil');
const SystemCollector = require('zero-system/src/SystemCollector');
const JSONUtil = require('zero-util/src/JSONUtil');

const EntityBase = require('./EntityBase');

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

  get type() {
    return this.info().type;
  }

  /** @returns {G_Prisma} */
  get query() {
    return this.storage.database[this.info().table ?? this.type];
  }

  model() {
    return this.storage.models[this.info().table ?? this.type];
  }

  /** @returns {import('../Service/Storage.service').T_ModelSchema} */
  schema() {
    return this.storage.getSchema(this.info().table ?? this.type);
  }

  /** @returns {Object<string, string>} */
  getInfoList() {
    let keys = this.info().list;
    if (!keys) {
      keys = {
        [this.key('id')]: 'ID',
        [this.key('label')]: 'Label',
      };
    }
    return keys;
  }

  /**
   * @param {G_Entity} value 
   * @param {boolean} isNew
   * @returns {G_Prisma}
   */
  convert(value, isNew = false) {
    delete value.meta;
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
   * @param {?G_Entity} value 
   * @returns {G_Entity}
   */
  prepare(value) {
    if (!value) return value;
    for (const field of this.schema().fields) {
      if (field.type === 'Json' && typeof value[field.name] === 'string') {
        value[field.name] = JSON.parse(value[field.name]);
      }
      if (field.reference && field.options.single && Array.isArray(value[field.name])) {
        value[field.name] = value[field.name][0];
      }
    }
    value.meta = {
      type: this._item.getAttribute('entity_type'),
    };
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
      delete query.data.id;
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
   * @param {G_Entity} entity 
   * @returns {G_Entity}
   */
  async clone(entity) {
    entity = JSON.parse(JSON.stringify(entity));
    delete entity.id;
    return await this.save(entity);
  }

  /**
   * @param {number} id 
   * @param {boolean} ref
   * @returns {?G_Entity}
   */
  async loadNext(id, ref = false) {
    const next = await this.query.findFirst({
      select: {
        id: true,
      },
      where: {
        id: { gt: id },
      },
      orderBy: {
        id: 'asc',
      },
    });
    if (next && next.id) {
      return await this.load(next.id, ref);
    }
    return null;
  }

  /**
   * @param {number} id 
   * @param {boolean} ref
   * @returns {?G_Entity}
   */
  async loadPrev(id, ref = false) {
    const prev = await this.query.findFirst({
      select: {
        id: true,
      },
      where: {
        id: { lt: id },
      },
      orderBy: {
        id: 'desc',
      },
    });
    if (prev && prev.id) {
      return await this.load(prev.id, ref);
    }
    return null;
  }

  /**
   * @param {Object<string, string>} params 
   * @param {Object<string, string>} additional 
   * @returns {Object<string, string>}
   */
  getParams(params, additional = {}) {
    const map = this.info().paramsMap ?? null;

    if (map === null) {
      return {...params, ...additional};
    } else {
      const object = {};

      for (const field in map) {
        if (params[field]) object[map[field]] = params[field];
      }
      return {...object, ...additional};
    }
  }

  /**
   * @param {Object<string, string>} params 
   * @param {Object<string, string>} additional 
   * @returns {Object<string, string>}
   */
  getParamsReverse(params, additional = {}) {
    const map = this.info().paramsMap ?? null;

    if (map === null) {
      return {...params, ...additional};
    } else {
      const object = {};

      for (const field in map) {
        if (params[map[field]]) object[field] = params[map[field]];
      }
      return {...object, ...additional};
    }
  }

  /**
   * @param {Object<string, string>} params 
   * @param {boolean} ref
   * @returns {?G_Entity}
   */
  async loadByParams(params, ref = false) {
    if (this.info().paramsMap) {
      return await this.loadFirst(this.getParams(params), ref);
    } else {
      return await this.load(params.id, ref);
    }
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
   * @param {Object} where 
   * @param {boolean} ref 
   * @returns {?G_Entity}
   */
  async loadFirst(where, ref = false) {
    const query = {
      where,
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
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_PRELOAD, { type: this, where, ref, query, bag });
    const entity = this.prepare(await this.query.findFirst(query));
    await this._root.events.trigger(ContentEntityBase.EVENT__ENTITY_POSTLOAD, { type: this, entity, query, bag });
    return entity;
  }

  /**
   * @param {G_Prisma} params 
   * @param {?number} take 
   * @param {number} page 
   * @returns {G_Entity[]}
   */
  async loadAll(params = {}, take = null, page = 0) {
    const query = {
      select: {
        [this.key('id')]: true,
      },
      where: this.getParams(params),
    };
    if (take !== null) {
      query.take = take;
      query.skip = take * page;
    }
    console.log(query);
    const ids = await this.query.findMany(query);
    return await this.multi(ids.map(v => v.id));
  }

  /**
   * @param {G_Prisma} params 
   * @param {?number} take 
   * @param {number} page 
   * @returns {Object<number, G_Entity>}
   */
  async loadAllMapped(params = {}, take = null, page = 0) {
    const mapped = {};
    for (const entity of await this.loadAll(params, take, page)) {
      mapped[entity.id] = entity;
    }
    return mapped;
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
   * @param {(string|G_Prisma)} search 
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
   * @param {Object<string, string>} search 
   * @param {number} take 
   * @param {number} page 
   * @returns {T_EntitySearchResult}
   */
  async search(search, take = 100, page = 0) {
    const ids = await this.query.findMany({
      select: {
        [this.key('id')]: true,
      },
      where: this.buildSearchWhere(search),
      take,
      skip: take * page,
    });
    const items = await this.count(search);
    return {
      items: await this.multi(ids.map(v => v.id)),
      pager: {
        current: page,
        items,
        pages: Math.ceil(items / take),
      },
    };
  }

  /**
   * @param {(string|Object<string, string>)} search 
   * @returns {Object}
   */
  buildSearchWhere(search) {
    const and = [];
    const or = [];

    if (typeof search === 'string') {
      search = {
        '*': search,
      };
    }

    for (const condition in search) {
      if (search[condition] === '') continue;
      if (condition === '*') {
        const splitConditions = search[condition].split(/\s/).filter(v => v);
        for (const field of this.schema().fields) {
          if (field.type === 'String' || field.type === 'Json') {
            const extra = [];
            for (const split of splitConditions) {
              extra.push({
                [field.name]: { contains: split.trim() },
              });
            }
            if (extra.length === 1) {
              or.push(extra[0]);
            } else {
              or.push({
                AND: extra,
              });
            }
          }
        }
      } else if (typeof search[condition] === 'string') {
        and.push({
          [condition]: { contains: search[condition] },
        });
      } else {
        and.push({
          [condition]: search[condition],
        });
      }
    }
    const where = {};
    if (or.length) where.OR = or;
    if (and.length) where.AND = and;
    console.log('search build', where);
    return or.length || and.length ? where : undefined;
  }

  /**
   * @param {string} method 
   * @param {Object} query 
   * @returns {Object}
   */
  async execute(method, query) {
    return this.query[method](query);
  }

  /**
   * @param {Object<string, string>} params 
   * @param {?Number} take 
   * @returns {Object<string, string>}
   */
  async getOptions(params = {}, take = null, page = 0) {
    const idKey = this.key('id');
    const labelKey = this.key('label');
    const query = {};
    query.select ??= {};
    query.select[idKey] = true;
    query.select[labelKey] = true;
    if (take !== null) {
      query.take = take;
      query.skip = take * page;
    }
    query.where = this.getParams(params);
    const data = await this.query.findMany(query);
    const options = {};
    for (const item of data) {
      options[item[idKey]] = item[labelKey] + ' (' + item[idKey] + ')';
    }
    return options;
  }

  /**
   * @param {(string|Object<string,string>)} search 
   * @returns {number}
   */
  async count(search) {
    return this.query.count({
      where: this.buildSearchWhere(search),
    });
  }

  async getEntityActions(items, query) {
    for (const item of await this.list(query.filter, 5)) {
      items.push({
        name: `Edit: ${item[this.key('label')]}`,
        description: `Edit the ${this.info().label} "${item.id}"`,
        tags: ['entity', this.type],
        commands: new MethodProxy({ service: 'remote.form' })
          .open(this.info().form ?? 'form.generate.edit', this.getParamsReverse(item, { game: item.game, generate: this._item.name }), { title: `${this.info().label} - ${item.name} [${item.id}]` })
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
    const info = this.getRouteInfo(route);
    if (info === null) return null;
    const placeholder = await this.getRouteData(route, data);
    return StringUtil.replaceObject(info.url, placeholder, '');
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
   * @param {string} route 
   * @returns {?T_EntityRouteInfo}
   */
  getRouteInfo(route) {
    if (this.info().routes && this.info().routes[route]) {
      const routeInfo = this.info().routes[route];
      if (typeof routeInfo === 'string') {
        return {
          url: routeInfo,
        };
      } 
      return routeInfo;
    } 
    return null;
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

  config() { return []; }

}