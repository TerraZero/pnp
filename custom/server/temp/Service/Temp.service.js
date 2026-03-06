const SystemCollector = require('zero-system/src/SystemCollector');
const Util = require('../../Util');

/**
 * @typedef {Object} T_ListResult
 * @property {Object} result
 * @property {Object} pager
 * @property {number} pager.current
 * @property {number} pager.count
 * @property {number} pager.pages
 */

module.exports = class TempService {

  /**
   * @param {import('zero-system/src/Collector/Service.collector')} collector 
   */
  static define(collector) {
    collector.add('temp').setTag('rmi');
  }

  constructor() {
    /** @type {import('../../entity/Service/Storage.service')} */
    this.storage = SystemCollector.get('service.storage');
  }

  /**
   * @param {string} type 
   * @returns {import('../../entity/Service/Storage.service').T_ModelSchema}
   */
  getType(type) {
    return this.storage.getSchema(type);
  }

  /**
   * @returns {string[]}
   */
  getTypeKeys() {
    return this.storage.getSchemaKeys();
  }

  /**
   * @param {string} type 
   * @param {Object} data 
   */
  async create(type, data) {
    type = this.getType(type);
    return this.unpack(type, data);
  }

  /**
   * @param {string} type 
   * @param {Object<string, string>} conditions 
   * @returns {Object}
   */
  async find(type, conditions) {
    type = this.getType(type);
    const query = {
      select: {
        id: true,
      },
      where: conditions,
    };
    const data = await this.storage.database[type.name].findFirst(query);
    if (data === null) return null;
    return await this.load(type.name, data.id);
  }

  /**
   * @param {string} type 
   * @param {int} id 
   * @returns {Object}
   */
  async load(type, id) {
    if (typeof id === 'string') id = parseInt(id);
    const query = {
      where: { id },
    };
    type = this.getType(type);

    for (const field of type.fields) {
      if (field.reference) {
        query.include ??= {};
        query.include[field.name] = { select: { id: true } };
      }
    }
    let data = await this.storage.database[type.name].findFirst(query);
    if (data === null) return null;
    console.log('load plain', data);
    data = await this.unpack(type, data);
    console.log('load format', data);
    return data;
  }

  /**
   * @param {string} type 
   * @param {string} message 
   * @param {Object} context 
   * @returns 
   */
  async log(type, message, context = {}) {
    return this.storage.database.tlog.create({
      data: {
        label: message,
        type,
        value: JSON.stringify(context),
      },
    });
  }

  /**
   * @param {Object} data 
   */
  async save(data) {
    const type = this.getType(data._meta.type.toLowerCase());
    data = await this.pack(type, data);
    let result = null;
    if (data.id) {
      const query = {
        data,
        where: {
          id: data.id,
        },
      };
      delete query.data.id;
      result = await this.storage.database[type.name].update(query);
      await this.log('note', 'Create "' + type.name + '" with id ' + result.id, { action: 'update', query });
    } else {
      const query = {
        data,
      };
      result = await this.storage.database[type.name].create(query);
      await this.log('note', 'Update "' + type.name + '" with id ' + result.id, { action: 'create', query });
    }
    return await this.load(type.name.toLowerCase(), result.id);
  }

  /**
   * @param {(string|object)} type 
   * @param {number} id 
   */
  async delete(type, id) {
    if (typeof type !== 'string') {
      id = type.id;
      type = type._meta.type;
    }
    type = this.getType(type.toLowerCase());
    const query = {
      where: {
        id,
      },
    };
    const entity = await this.storage.database[type.name].findFirst(query);
    await this.log('note', 'Delete "' + type.name + '" with id ' + id, { action: 'delete', query, entity });
    return await this.storage.database[type.name].delete(query);
  }

  /**
   * @param {string} type
   * @param {(string|G_Prisma)} search 
   * @param {number} take
   * @param {number} page
   * @param {Object} order
   * @returns {T_ListResult}
   */
  async list(type, search, take = 100, page = 0, order = null) {
    type = this.getType(type);
    if (typeof search === 'string') {
      search = { 
        label: { contains: search },
      };
    }

    const query = {
      select: {
        id: true,
      },
      where: search,
      take,
      skip: take * page,
    };
    if (order) query.orderBy = order;

    const result = await this.storage.database[type.name].findMany(query);
    const count = await this.storage.database[type.name].count({
      where: search,
    });
    for (const index in result) {
      result[index] = await this.load(type.name, result[index].id);
    }
    return {
      result,
      pager: {
        current: page,
        count,
        pages: Math.ceil(count / take),
      },
    };
  }

  /**
   * @param {import('../../entity/Service/Storage.service').T_ModelSchema} type 
   * @param {Object} data 
   * @returns {Object}
   */
  async pack(type, data) {
    const value = {};
    for (const field of type.fields) {
      if (field.reference) {
        const method = (data.id ? 'set' : 'connect');
        
        const items = [];
        for (const item of data._refs[field.name]) {
          if (typeof item === 'string') {
            items.push({id: parseInt(item)});
          } else if (typeof item === 'number') {
            items.push({ id: item });
          } else if (typeof item === 'object') {
            const result = await this.save(item);
            items.push({ id: result.id });
          }
        }
        value[field.name] = {
          [method]: items,
        };
        console.log(field.name, value[field.name]);
      } else {
        switch (field.type) {
          case 'Int':
            if (typeof data[field.name] === 'string') {
              value[field.name] = parseInt(data[field.name]);
            }
            break;
          case 'Json':
            if (typeof data[field.name] !== 'string') {
              value[field.name] = JSON.stringify(data[field.name]);
            }
            break;
        }
        if (value[field.name] === undefined && data[field.name] !== undefined) {
          value[field.name] = data[field.name];
        }
      }
    }
    return value;
  }

  /**
   * @param {import('../../entity/Service/Storage.service').T_ModelSchema} type 
   * @param {Object} data 
   * @returns {Object}
   */
  async unpack(type, data) {
    const value = {};
    value._meta = data._meta ?? {};
    value._meta.type = type.name;

    for (const field of type.fields) {
      if (field.reference) {
        value._refs ??= {};
        value._refs[field.name] = (data[field.name] ?? []).map(v => {
          if (Object.keys(v).length === 1 && v.id) {
            return v.id;
          } else {
            return v;
          }
        });
      } else {
        switch (field.type) {
          case 'Int':
            if (typeof data[field.name] === 'string') {
              value[field.name] = parseInt(data[field.name]);
            } else if (typeof data[field.name] === 'number') {
              value[field.name] = data[field.name];
            }
            break;
          case 'Json':
            if (typeof data[field.name] === 'string') {
              value[field.name] = JSON.parse(data[field.name]);
            }
            break;
        }
        if (value[field.name] === undefined) {
          if (data[field.name]) {
            value[field.name] = data[field.name];
          } else {
            const fallback = this.getFallback(field);
            if (fallback !== undefined) {
              value[field.name] = fallback;
            }
          }
        }
      }
    }
    return value;
  }

  /**
   * @returns {string[]}
   */
  async getTagCategories() {
    return (
      await this.storage.database.ttag.findMany({
        distinct: ['cat'],
        select: { cat: true },
      })
    ).map(v => v.cat);
  }

  /**
   * @typedef {Object} T_TagQuery
   * @property {string} [cat]
   * @property {number[]} [ids]
   * @property {string} [search]
   * @property {number[]} [selected]
   */

  /**
   * @param {T_TagQuery} query 
   */
  async getTags(query, take = 20) {
    const where = {};
  
    if (query.cat) {
      where.cat = query.cat;
    }
    if (query.ids) {
      where.id = { in: Util.filterIds(query.ids) };
    }
    if (query.search) {
      where.label = { contains: query.search };
    }

    if (query.selected) {
      return await this.storage.database.ttag.findMany({ where: {
        OR: [
          { id: { in: Util.filterIds(query.selected) } },
          where,
        ],
      } });
    } else {
      return await this.storage.database.ttag.findMany({ where });
    }
  }

  /**
   * @param {string} category 
   * @param {string} label 
   * @returns {Object}
   */
  async setTag(category, label) {
    return await this.storage.database.ttag.create({
      data: {
        cat: category,
        label: label,
        value: '{}',
      },
    });
  }

  /**
   * @param {import('../../entity/Service/Storage.service').T_ModelFieldSchema} field 
   */
  getFallback(field) {
    if (field.options.fallback !== undefined) {
      return field.options.fallback;
    }
    if (field.real.isId) {
      return undefined;
    }
    if (field.real.hasDefaultValue) {
      if (field.type === 'Json') {
        return JSON.parse(field.real.default);
      } else {
        return field.real.default;
      }
    }
    switch (field.options.type ?? field.type) {
      case 'String':
        return '';
      case 'Int':
        return 0;
      case 'Float':
        return 0.0;
      case 'Boolean':
        return false;
      case 'Json': 
        return {};
    }
  }

}