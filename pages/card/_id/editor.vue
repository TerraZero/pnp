<template lang="pug">
LayoutEditor.page-card-id-editor(adapt="page-card-id-editor", sidebarfix="33%", :bottomstate="bottomstate")
  template(#title)
    .page-card-id-editor__title {{ title }}
  template(#topright)
    CustomEditorToolbar(:items="toolbar", @tool="onTool")
  template(#content)
    .page-card-id-editor__content(:style="contentStyles")
      CustomPlugin.page-card-id-editor__card-view(v-if="type", :type="['card', type, 'view']", :config="config")
  template(#sidebar)
    ElButton(@click="onPrev") <<
    ElButton(@click="onSave") Save
    ElButton(@click="onClone") Clone
    ElButton(@click="onNext") >>
    ElTabs(v-model="sidebartab", type="border-card", lazy)
      ElTabPane(name="card", label="Card")
        EditorToolSlot(label="Card", closable)
          EditorInputTextfield.std-margin(v-model="card.label", label="Label")
          EditorInputTextfield.std-margin(v-model="card.search", label="Search")
          EditorInputSelect.std-margin(v-model="type", label="Template", :options="{ Attack: 'Attack', Custom: 'Custom', Chem: 'Chem' }")
          ElButton(@click="onReset") Reset
        CustomPlugin(v-if="type", :type="['card', type, 'form']", v-model="config")
      ElTabPane(name="config", label="Config")
        EditorToolSlot(label="Transform")
          EditorInputSlider(label="Scale", v-model="scale", :min="0.5", :max="5", :step="0.1")
        pre {{ config }}
  template(#bottomright, v-if="error")
    .page-card-id-editor__error {{ error }}

</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/card/Entity/Card.entity')} */
let _cardStorage = null;
/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;

export default {

  async asyncData({ params }) {
    const data = { params };

    _cardStorage ??= await RemoteSystem.get('entity.card');
    _router ??= await RemoteSystem.get('remote.router');
    data.card = await _cardStorage.load(params.id);

    if (data.card === null) {
      data.error = 'ERROR: Card ' + params.id + ' not found.';
    }

    return data;
  },

  watch: {

    card: {
      handler(value) {
        this.prepare(value);
      },
      immediate: true,
    },

  },

  data() {
    return {
      error: false,
      sidebartab: 'card',
      toolbar: [
        {
          id: 'edit',
          icon: 'edit',
        },
      ],
      type: 'Attack',
      config: {},
      scale: 2,
    };
  },

  computed: {

    title() {
      return this.card?.label ?? 'ERROR: Card not found';
    },

    bottomstate() {
      return this.error ? 'error' : 'default';
    },

    contentStyles() {
      const styles = {};

      styles.transform = 'scale(' + this.scale + ')';
      return styles;
    },

  },

  methods: {

    async onTool(item) {
      if (item.id === 'edit') {
        const url = await _cardStorage.route('edit', this.params);
        _router.goto(url);
      }
    },

    onRoomButton(button) {
      if (button.icon === 'el-icon-plus') {
        this.rooms.push({
          _action: 'add',
          _open: false,
          label: 'Room ' + this.rooms.length,
          items: [],
        });
      }
    },

    onRoomSelect(index) {
      this.activeRoom = index;
      for (const roomIndex in this.rooms) {
        this.rooms[roomIndex]._open = roomIndex === index;
      }
    },

    onHoverItem({ point }) {
      this.itemhover = point;
    },

    onClickItem({ point }) {
      if (this.activeRoom !== null && this.rooms[this.activeRoom]._action === 'area') {
        if (this.itemselect === null) {
          this.itemselect = point;
        } else {
          const points = _mapRemote.getPointsArray([this.itemselect, point]);
          for (const point of points) {
            this.addToRoom(point);
          }
          this.itemselect = null;
        }
      }
      if (this.activeRoom !== null && this.rooms[this.activeRoom]._action === 'add') {
        this.addToRoom(point);
      }
      if (this.activeRoom !== null && this.rooms[this.activeRoom]._action === 'sub') {
        this.removeFromRoom(point);
      }
    },

    addToRoom(point) {
      const index = _mapRemote.findIndex(this.rooms[this.activeRoom].items, point);

      if (index === -1) {
        this.rooms[this.activeRoom].items.push(point);
        _mapRemote.sortPoints(this.rooms[this.activeRoom].items);
      }
    },

    removeFromRoom(point) {
      const index = _mapRemote.findIndex(this.rooms[this.activeRoom].items, point);

      if (index !== -1) {
        this.rooms[this.activeRoom].items.splice(index, 1);
      }
    },

    onSave() {
      this.card.type = this.type;
      this.card.value = {
        config: this.config,
      };
      _cardStorage.save(this.card);
    },

    async onClone() {
      const clone = await _cardStorage.clone(this.card);
      const url = await _cardStorage.route('editor', clone);
      _router.goto(url);
    },

    prepare(card) {
      this.type = card.type;
      this.config = card.value?.config ?? {};
    },

    async onPrev() {
      const prev = await _cardStorage.loadPrev(this.card.id);
      if (prev) {
        const url = await _cardStorage.route('editor', prev);
        _router.goto(url);
      }
    },

    async onNext() {
      const next = await _cardStorage.loadNext(this.card.id);
      if (next) {
        const url = await _cardStorage.route('editor', next);
        _router.goto(url);
      }
    },

    onReset() {
      this.config = {};
    },

  },

}
</script>

<style lang="sass">
.page-card-id-editor
  height: 100%

  &__title
    padding: .3em

  &__error
    padding: .2em
    font-size: .9em

  &__sidebar .el-tabs__content
    padding: 0

  &__content
    display: flex
    justify-content: center
    align-items: center
    height: 100%
    background: grey

  &__card-view
    width: 6.6cm !important
    height: 9.3cm !important
    border: 1px solid black

</style>