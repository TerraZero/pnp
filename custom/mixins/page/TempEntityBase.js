const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;
/** @type {import('~/custom/server/temp/Remote/TempStorage.remote')} */
let _storage = null;

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
    _storage ??= await RemoteSystem.get('remote.tempstorage');
    this.entity_type = await _storage.getType(this.params_type);
    if (this.params.id || this.params_id) {
      this.entity = await _storage.load(this.params_type, this.params_id ?? this.params.id);
    }
    this.reload();
    await this.prepare();
  },

  data() {
    return {
      search: '',
      result: [],
      pager: {
        current: 0,
        count: 0,
        pages: 0,
      },
    };
  },

  computed: {

    type_label() {
      return this.entity_type?.label() || this.params_type;
    },

  },

  methods: {

    prepare() { },

    prepareList() { },

    route(route, params = {}) {
      return this.entity_type.route(route, this.entity ?? null, params);
    },

    async reload() {
      const list = await _storage.list(this.params_type, this.search, 100, this.pager.current);
      await this.prepareList(list);
      this.result = list.result;
      this.pager = list.pager;
    },

    async onAdd() {
      _router.goto(this.route('add'));
    },

    async onEdit(scope) {
      _router.goto(this.route('edit', { id: scope.row.id }));
    },

    async onDelete(scope) {
      await _temp.delete(this.params_type, scope.row.id);
      await this.reload();
    },

  },

}