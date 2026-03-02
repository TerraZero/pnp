<template lang="pug">
.custom-card-view-icons
  ElButton(size="mini", @click="onClick") {{ label || 'Icons' }}
  ElDialog(:visible.sync="open", width="90%", :close-on-click-modal="false", append-to-body)
    | Search
    ElInput(v-model="filter")
    ElTable.editor-input-entity-list__table(:data="icons", empty-text="No Data")
      ElTableColumn(prop="key", label="Key")
      ElTableColumn(prop="label", label="Label")
      ElTableColumn(prop="description", label="Description")
      ElTableColumn(label="Type")
        template(slot-scope="{ row }")
          | {{ row.type.join(', ') }}
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/card/Remote/Card.remote')} */
let _cardRemote = null;

export default {

  props: ['label'],

  created() {
    _cardRemote = RemoteSystem.getSync('remote.card');
  },

  data() {
    return {
      filter: '',
      open: false,
    };
  },

  computed: {

    icons() {
      const items = [];
      for (const key in _cardRemote.icons) {
        if (key.toLowerCase().includes(this.filter) || [...Object.values(_cardRemote.icons[key])].find(v => {
          if (typeof v === 'string') {
            return v.toLowerCase().includes(this.filter);
          } else {
            return v.find(vv => typeof vv === 'string' && vv.toLowerCase().includes(this.filter));
          }
        })) {
          items.push({
            key: '{' + key + '}',
            ..._cardRemote.icons[key],
          });
        }
      }
      return items;
    },

  },

  methods: {

    onClick() {
      this.open = true;
    },

  },

}
</script>

<style lang="sass">
.custom-card-view-text

  &--strong
    font-weight: bold

  &--odd
    font-size: 2em
    vertical-align: -4px

  &--rift > &__icon
    transform: rotate(45deg)

  &__unicode
    filter: brightness(0) saturate(100%)
</style>