const MethodProxy = require('zero-util/src/MethodProxy');

const EntityBase = require('./EntityBase');
const StringUtil = require('zero-util/src/StringUtil');

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
 * @template G_Entity
 * @template G_Prisma
 */
module.exports = class ContentEntityBase extends EntityBase {

  /**
   * @param {import('zero-system/src/SystemItem')} item
   * @param {import('../Service/Storage.service')} storage 
   */
  constructor(item, storage) {
    super(item, storage);
    this._keys = null;
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
        if (isNew) {
          value[field.name] = {
            connect: value[field.name],
          };
        } else {
          value[field.name] = {
            set: value[field.name],
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
    }
    return value;
  }

  /**
   * @param {G_Entity} entity 
   * @returns {G_Entity}
   */
  async save(entity) {
    // TODO reference felder speichern
    entity = this.convert(entity, !entity.id);
    if (entity.id) {
      return this.query.update({
        data: entity,
        where: {
          id: entity.id,
        },
      });
    } else {
      return this.query.create({
        data: entity,
      });
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

    return this.prepare(await this.query.findFirst(query));
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