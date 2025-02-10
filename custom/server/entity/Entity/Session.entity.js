const EntityBase = require('../src/EntityBase');

module.exports = class SessionEntity extends EntityBase {

  /**
   * @param {import('../Collector/Entity.collector')} collector 
   */
  static define(collector) {
    collector.add('session');
  }

  init() {
    this.expire = 5 * 24 * 60 * 60;
  }

  /**
   * @param {number} seconds 
   * @returns {this}
   */
  setExpire(seconds) {
    this.expire = seconds;
    return this;
  }

  /**
   * @param {string} session 
   * @param {number} timestamp 
   * @returns {boolean}
   */
  async hasSession(session, timestamp = null) {
    const result = await this.storage.database.session.count({
      where: {
        session,
        timestamp: { gte: (timestamp ?? this.storage.timestamp) - this.expire },
      },
    });
    return result > 0;
  }

  /**
   * @param {string} session 
   * @param {timestamp} timestamp 
   * @returns {void}
   */
  async prepareSession(session, timestamp = null) {
    if (!await this.hasSession(session, timestamp)) {
      await this.delete(session);
    }
  }

  /**
   * @param {string} session 
   * @param {string} key 
   * @param {number} timestamp 
   * @returns {import('prisma/prisma-client').Session}
   */
  async getObject(session, key, timestamp = null) {
    await this.prepareSession(session, timestamp);
    return this.storage.database.session.findFirst({
      where: { session, key },
    });
  }

  /**
   * @param {string} session 
   * @param {string} key 
   * @param {timestamp} timestamp 
   * @returns {any}
   */
  async get(session, key, timestamp = null) {
    const values = await this.getObject(session, key);
    return values ? JSON.parse(values.value) : null;
  }

  /**
   * @param {string} session 
   * @param {string} key 
   * @param {any} value 
   * @param {number} timestamp 
   * @returns {void}
   */
  async set(session, key, value, timestamp = null) {
    timestamp ??= this.storage.timestamp;
    value = JSON.stringify(value);
    return this.storage.inTransaction(async tx => {
      await this.prepareSession();
      const { count } = await tx.session.updateMany({
        where: { session, key },
        data: { value },
      });
      if (count === 0) {
        await tx.session.create({
          data: {
            session,
            key,
            value,
            timestamp,
          },
        });
      }
      await this.update(session, timestamp);
    });
  }

  /**
   * @param {string} session 
   * @param {number} timestamp 
   * @returns {{ count: number }}
   */
  async update(session, timestamp = null) {
    return this.storage.database.session.updateMany({
      where: { session },
      data: { 
        timestamp: timestamp ?? this.storage.timestamp,
      },
    });
  }

  /**
   * @param {string} session 
   * @returns {{ count: number }}
   */
  async delete(session) {
    return this.storage.database.session.deleteMany({
      where: { session },
    });
  }

}