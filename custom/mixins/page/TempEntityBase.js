const RemoteSystem = require('zero-system/src/RemoteSystem');

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
    }
  },

  async fetch() {
    this.reload();
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

    route(route, params = {}) {
      return this.entity_type.route(route, this.entity ?? null, params);
    },

    async reload() {
      const list = await _temp.list(this.params_type, this.search, 100, this.pager.current);
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