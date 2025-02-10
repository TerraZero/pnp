const MethodProxy = require('zero-util/src/MethodProxy');

module.exports = class ActionBase {

  constructor() {
    this._actions = null;
  }

  async getActions() {
    if (this._actions === null) {
      this._actions = [];
      this._actions = await this.actions(this._actions);
    }
    return this._actions;
  }

  async actions(items) { 
    return items;
  }

}