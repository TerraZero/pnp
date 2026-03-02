<template lang="pug">
.page-temp-admin-logs
  TempBreadcrumb(top)
    ElBreadcrumbItem(:to="{ path: '/temp/admin' }") Admin
    ElBreadcrumbItem Logs
  .page-temp-admin-logs__content
    h1 Logs
    ElTable(:data="transformed")
      ElTableColumn(prop="type", label="Type")
      ElTableColumn(prop="action", label="Action")
        template(slot-scope="{ row }")
          span.page-temp-admin-logs__tag(:class="['page-temp-admin-logs__tag-' + row.action]")
            | {{ row.action.toUpperCase() }}
      ElTableColumn(prop="message", label="Message")
      ElTableColumn(label="Context")
        template(slot-scope="{ row, $index }")
          pre.page-temp-admin-logs__pre(v-if="select === $index") {{ row.context }}
          ElButton(v-else, type="primary", size="small", icon="el-icon-plus", @click="select = $index")
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/temp/Service/Temp.service')} */
let _temp = null;
/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;

export default {

  async asyncData({ params }) {
    _temp ??= await RemoteSystem.get('service.temp');
    _router ??= await RemoteSystem.get('remote.router');
    
    const logs = await _temp.list('tlog', '', 100, 0, {
      id: 'desc',
    });

    return { params, logs };
  },

  data() {
    return {
      select: -1,
    };
  },

  computed: {

    transformed() {
      const rows = [];

      for (const log of this.logs.result) {
        rows.push({
          message: log.label,
          type: log.type.toUpperCase(),
          action: log.value.action ?? '-',
          context: log.value,
        });
      }
      return rows;
    },

  },

  methods: {

    onList(scope) {
      _router.goto(scope.row.type.route('base'));
    },

    onAdd(scope) {
      _router.goto(scope.row.type.route('add'));
    },

  },

};
</script>

<style lang="sass">
.page-temp-admin-logs

  &__content
    padding: 1em

  &__tag
    padding: .5em 1em
    border-radius: 3px
    background: #AAA
    display: inline-block
    color: black
    font-weight: bold

  &__tag-delete
    background: var(--error)
    color: white

  &__tag-update
    background: var(--warning)
    color: white

  &__tag-create
    background: var(--success)
    color: white

  &__pre
    padding: .5em
    border-radius: 3px
    background: #111
    max-height: 60vh
    overflow: auto
    
</style>