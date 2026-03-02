<template lang="pug">
.page-entity-edit
  CustomEditorActions(v-if="actions.length", :items="actions", @action="onAction")
  ZeroFormulate(form="form.generate.edit", :info="{ params }", @entity="onEntity")
    template(#top="{ schema, values }")
      EntityZUIButtons(v-if="values", :entity="values", :params="params")
    template(slot-scope="{ schema, values }")
      CustomPlugin(:type="['entity', 'form', params.entity_type]", v-model="values", :schema="schema", :params="params")
</template>

<script>
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
let _entity = null;
let _form = null;

export default {

  async asyncData({ params }) {
    params.generate = 'entity.' + params.entity_type;
    _router ??= await RemoteSystem.get('remote.router');
    return { params };
  },

  data() {
    return {
      actions: [],
    };
  },

  methods: {

    async onEntity({ entity, form }) {
      _entity = entity;
      _form = form;

      this.actions = [];
      const info = await form.storage.info();
      for (const route in info.routes) {
        const action = await form.storage.getRouteInfo(route);
        if (action.label || action.icon) {
          action.id = route;
          if (action.id === 'edit') {
            action.active = true;
          }
          this.actions.push(action);
        }
      }
    },

    async onAction(item) {
      const url = await _form.storage.route(item.id, _entity);
      _router.goto(url);
    },

  },

};
</script>