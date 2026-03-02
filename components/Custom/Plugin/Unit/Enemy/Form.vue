<template lang="pug">
EditorToolSlot.custom-plugin-unit-hero-form(:label="value.name + ' | ' + value.mark", group, closable, @item-change="onItemChange")
  template(#mark)
    slot
  EditorToolActionWrap(:buttons="[{ key: 'execute', icon: 'el-icon-right', type: 'primary' }, { key: 'edit', icon: 'el-icon-edit' }, { key: 'reload', icon: 'el-icon-refresh' }]", label="Type | Level", @click="onTypeAction", size="mini", grid="1fr 60px")
    EditorInputSelect(v-model="value.type", :options="types", size="mini")
    EditorInputSelect(v-model="value.level", options="1-20", size="mini")
  EditorToolActionWrap(label="Name | Mark", grid="1fr 60px")
    EditorInputTextfield(v-model="value.name")
    EditorInputTextfield(v-model="value.mark")
  .std-grid-half
    EditorInputSelect(v-model="value.init", options="1-10", label="Initiative")
    EditorInputSelect(v-model="value.pos", options="1-15", label="Position")
  EditorInputSwitches(v-model="value.props", :options="{ show: 'Show', dead: 'Dead', turn: 'Turn', reaction: 'Reaction' }", size="200px")
  EditorInputTextarea(v-model="value.description", label="Description")
  EditorToolSlot(v-if="value.attrs", label="Attributes", closable, @item-change="onItemChange")
    CustomEditorEnemyAttrs(v-model="value.attrs")
    CustomEditorEnemyActions(v-if="type", :type="type")
    CustomEditorEnemySkills(v-if="type", :type="type")
  EditorToolSlot(v-if="type", label="Image (TYPE)", closable, @item-change="onEnemyTypeChange")
    EditorInputImageSelect(v-model="type.value.img", prefix="/eldritch/", label="Image")
    EditorInputSlider(v-model="displayDefault.width", :min="0", :max="200", label="Width (vw)")
    EditorInputSwitches(v-model="displayDefault.props", :options="{ mirror: 'Mirror' }")
    EditorToolSlot(label="Avatar", closable, @item-change="onEnemyTypeChange")
      EditorInputSlider(v-model="displayAvatar.width", :min="0", :max="200", label="Width (vw)")
      EditorInputSlider(v-model="displayAvatar.top", :min="-100", :max="100", label="Top (vh)")
      EditorInputSlider(v-model="displayAvatar.left", :min="-100", :max="100", label="Left (vw)")
      EditorInputSwitches(v-model="displayAvatar.props", :options="{ mirror: 'Mirror' }")
</template>

<script>
import ComputedUtil from '~/custom/util/ComputedUtil';
import TimingUtil from 'zero-util/src/TimingUtil';
import RemoteSystem from 'zero-system/src/RemoteSystem';
import StoreUtil from '~/custom/util/StoreUtil';

const EnemyStore = StoreUtil.get('EnemyStore');

/** @type {import('~/custom/server/enemy/Entity/EnemyType.entity')} */
let _enemyTypeStorage = null;
/** @type {import('~/custom/server/enemy/Remote/Enemy.remote')} */
let _enemyRemote = null;

export default {

  inject: ['zui'],

  props: ['value'],

  async created() {
    EnemyStore.fetchTypes();
    _enemyTypeStorage ??= await RemoteSystem.get('entity.enemy_type');
    _enemyRemote ??= RemoteSystem.getSync('remote.enemy');
  },

  computed: {

    displayDefault: ComputedUtil.getDeepProp('type', 'value.displays.default', {}, true),
    displayAvatar: ComputedUtil.getDeepProp('type', 'value.displays.avatar', {}, true),

    type: ComputedUtil.getLazyStoreValue(EnemyStore, 'getType', 'fetchTypes', function() {
      return [this.value.type];
    }),

    types: ComputedUtil.getLazyStoreValue(EnemyStore, 'getOptions', 'fetchTypes'),

  },

  methods: {

    onEnemyTypeChange: TimingUtil.debounce(async function() {
      await _enemyTypeStorage.save(this.type);
      await EnemyStore.fetchTypes(true);
    }, 1000),

    async onItemChange(...args) {
      this.$emit('item-change', ...args);
      if (_enemyRemote && this.value.attrs) {
        this.value.attrs = _enemyRemote.calcBonus(this.value.attrs);
      }
    },

    async onTypeAction(button) {
      if (this.value.type) {
        switch (button.key) {
          case 'execute':
            this.value.attrs = _enemyRemote.createEnemyProps(this.type, parseInt(this.value.level) ?? 1);
            this.onItemChange(this.value);
            this.$emit('reload', this);
            break;
          case 'edit':
            const window = await this.zui.open('/entity/enemy_type/' + this.value.type);
            window.addEvent('close', () => {
              EnemyStore.fetchTypes(true);
            });
            break;
          case 'reload':
            EnemyStore.fetchTypes(true);
            break;
        }
      }
    },

  },

}
</script>