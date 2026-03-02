const RemoteSystem = require('zero-system/src/RemoteSystem');
const Util = require('~/custom/server/Util');

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;

export default {

  async asyncData({ params }) {
    _router ??= await RemoteSystem.get('remote.router');
    _temp ??= await RemoteSystem.get('service.temp');

    return { params, entity: null, entity_type: null };
  },

  async mounted() {
    if (!this.params_type) {
      throw new Error('Please set a computed field "params_type"');
    }
    /** @type {import('~/custom/server/temp/Remote/TempStorage.remote')} */
    const storage = await RemoteSystem.get('remote.tempstorage');
    this.entity_type = await storage.getType(this.params_type);
    if (this.params.id || this.params_id) {
      this.entity = await storage.load(this.params_type, this.params_id ?? this.params.id);
    } else if (this.params_create) {
      this.entity = await storage.create(this.params_type);
    }
    await this.prepare();
  },

  computed: {

    values() {
      return this.entity?.data ?? {};
    },

    type_label() {
      return this.entity_type?.label() || this.params_type;
    },

  },

  methods: {

    prepare() { },

    route(route, params = {}) {
      return this.entity_type?.route(route, this.entity ?? null, params);
    },

    async goto(route, params = {}) {
      await this.entity_type?.goto(route, this.entity ?? null, params);
    },

    async onSave() {
      await this.entity.save();
      this.goto('base');
    },

    async onDelete() {
      await this.entity.delete();
      this.goto('base');
    },

    getValues(keyFilter = null) {
      if (keyFilter === null) return this.values;
      return Util.keyFilter(this.values, keyFilter);
    },

  },

}