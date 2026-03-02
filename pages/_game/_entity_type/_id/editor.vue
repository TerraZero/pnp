<template lang="pug">
.page-editor(:class="classes")
  .page-editor__topbar
    .page-editor__left
      .page-editor__title {{ topbar }}
    .page-editor__actions
      .page-editor__button(v-for="action in actions", :key="action.key", :class="buttonClass(action)", @click="onAction(action)")
        span(:class="action.icon")
    .page-editor__right
      .page-editor__button(@click="onSidebarOpen")
        span.el-icon-s-fold
  .page-editor__wrapper
    .page-editor__content
      BuildingFloorGrid(ref="grid", @tileselect="onTileSelect")
      //-.page-editor__tile-type-selected(v-if="toolSelected")
        BuildingTileLayer(:type="getTileType(toolSelected)", mode="edit")
    .page-editor__sidebar
      ElTabs(v-model="tab", type="border-card", lazy)
        ElTabPane(name="tools", label="Tools")
          ZeroAccordion.page-editor__tools(v-model="toolset")
            ZeroAccordionItem(label="Base", name="base")
              .page-editor__tile-wrapper
                BuildingEditorTileType(v-for="layer, index in getTileTypeGroup('base')", :key="index", :layer="layer", @click.native="selectedTileType = layer")
            ZeroAccordionItem(label="Inner", name="inner")
              | Inner
            ZeroAccordionItem(label="Outer", name="outer")
              | Outer
        ElTabPane(name="building", label="Building")
          BuildingForm
        ElTabPane(name="floor", label="Floor")
          BuildingFloorForm
        ElTabPane(name="config", label="Config")
          ZeroAccordion.page-editor__tools(v-model="configset")
            ZeroAccordionItem(label="Grid", name="grid")
              .page-editor__form
                .page-editor__field
                  .page-editor__label Gap
                  ElInput.page-editor__input(v-model="gap", controls-position="right", size="mini", v-zero:debounce:input="() => onConfigChange('editor.gap', 'gap')")
          
</template>

<script>
const Handler = require('events');
const RemoteSystem = require('zero-system/src/RemoteSystem');

/** @type {import('~/custom/server/building/Remote/Editor.remote')} */
let _editorRemote = null;
/** @type {import('~/custom/server/building/Entity/Building.entity')} */
let _buildingStorage = null;
/** @type {import('~/custom/server/building/Entity/Floor.entity')} */
let _floorStorage = null;
/** @type {import('~/custom/server/building/Entity/Tile.entity')} */
let _tileStorage = null;

const DefaultActions = [
  {
    key: 'reset',
    icon: 'el-icon-refresh',
  },
  {
    key: 'insert',
    icon: 'el-icon-position',
  },
  {
    key: 'edge',
    icon: 'el-icon-full-screen',
  },
  {
    key: 'fill',
    icon: 'el-icon-menu',
  },
];

export default {

  middleware({ params, error }) {
    if (params.entity_type !== 'building') {
      return error({ statusCode: 400, message: 'Only entity building is allowed.' });
    }
  },

  async asyncData({ params }) {
    const data = { params };

    _editorRemote = await RemoteSystem.get('remote.editor');
    _buildingStorage = await RemoteSystem.get('entity.building');
    _floorStorage = await RemoteSystem.get('entity.floor');
    _tileStorage = await RemoteSystem.get('entity.tile');

    data.tiletypes = await _editorRemote.getTileTypes();
    data.building = await _buildingStorage.load(params.id, true);
    data.floors = await _floorStorage.multi(data.building.floors.map(v => v.id), true);

    data.selectFloor = data.floors[0].id;

    return data;
  },

  async mounted() {
    this.gap = await this.getConfig('building', this.building, 'editor.gap', this.gap);
    await this.update();
  },

  beforeDestroy() {
    this.events = null;
    clearInterval(this.interval);
  },

  provide() {
    return {
      page: this,
      editor: this,
    };
  },

  data() {
    return {
      events: new Handler(),
      interval: null,
      tab: 'tools',
      open: false,
      selectFloor: null,
      grid: null,
      toolset: 'base',
      configset: 'grid',
      actions: DefaultActions,
      actionMode: null,
      gap: 10,
      selectedTileType: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.open) classes.push('open');
      return 'page-editor--' + classes.join(' page-editor--');
    },

    topbar() {
      const parts = [`${this.building.name} [${this.building.id}]`];
      if (this.floor) {
        parts.push(`${this.floor.name} [${this.floor.floor}]`);
      }
      return parts.join(' / ');
    },

    floor() {
      return this.floors.find(v => v.id === this.selectFloor);
    },

  },

  methods: {

    /**
     * @param {string} type
     * @returns {import('~/custom/server/entity/src/ContentEntityBase')}
     */
    getStorage(type) {
      switch (type) {
        case 'building':
          return _buildingStorage;
        case 'floor':
          return _floorStorage;
        case 'tile':
          return _tileStorage;
      }
      return null;
    },

    onConfigChange(key, field = null) {
      if (field === null) field = key;
      this.setConfig('building', this.building, key, this[field]);
    },

    onSidebarOpen() {
      this.open = !this.open;
    },

    onAction(action) {
      switch (action.key) {
        case 'reset':
          this.$refs.grid.doReset();
          break;
        case 'insert':
        case 'edge':
        case 'fill':
          this.actionMode = action.key;
          break;
      }
    },

    getTileType(key) {
      return this.tiletypes.find(v => v.info.key === key);
    },

    getTileTypeGroup(group) {
      return this.tiletypes.filter(v => v.info.group === group)
        .flatMap(item => (item.predefine ?? [{}]).map(v => ({...item.info, ...v})));
    },

    setSelectFloor(select) {
      this.selectFloor = select;
      this.update();
    },

    async update() {
      this.grid = await _tileStorage.multi(this.floor.tiles.map(v => v.id));
    },

    async getConfig(type, entity, key, fallback = null) {
      const storage = this.getStorage(type);
      return (await storage.getConfig(entity, key)) ?? fallback;
    },

    async setConfig(type, entity, key, value) {
      const storage = this.getStorage(type);
      return storage.setConfig(entity, key, value);
    },

    buttonClass(action) {
      const classes = [];

      if (action.key === this.actionMode) classes.push('active');
      return classes.map(v => 'page-editor__button--' + v);
    },

    onTileSelect(tile) {
      if (tile && this.selectedTileType) {
        tile.value.layers ??= [];
        tile.value.layers.push(this.selectedTileType);
        _tileStorage.save(tile);
      }
    },

  },

}
</script>

<style lang="sass">
.page-editor
  --editor-primary: #2F3E67
  --editor-pen: white
  --editor-pen-contrast: black
  --editor-element: #737D96
  --editor-active: #93A6DA
  --editor-dark: #0A0D14
  --editor-accent: #05133B
  --editor-high: #987B3B
  --editor-high-light: #FFE1A3
  --editor-high-dark: #573B00

  --pen: var(--editor-pen)
  --pen-contrast: var(--editor-pen-contrast)
  --border: var(--editor-accent)

  --zero-accordion-color-label: var(--editor-element)
  --zero-accordion-color-content: var(--editor-primary)
  --zero-accordion-color-active: var(--editor-active)

  width: 100vw
  height: 100vh
  position: relative
  overflow: hidden
  display: grid
  grid-template-rows: 35px 1fr

  &__topbar
    display: flex
    justify-content: left
    background: var(--editor-primary)
    color: var(--editor-pen)
    gap: .5em

  &__title
    display: flex
    align-items: center
    height: 100%
    margin-left: 1em

  &__wrapper
    position: relative

  &__right
    margin-left: auto

  &__content
    width: 100%
    height: 100%

  &__sidebar
    position: absolute
    top: 0
    right: 0
    width: 50%
    max-width: 700px
    height: 100%
    overflow: hidden
    transition: transform .2s ease-in-out
    border-left: 2px solid var(--editor-color-border)
    box-sizing: border-box
    transform: translateX(100%)
    background: var(--editor-color-dark)

  &--open &__sidebar
    transform: translateX(0)

  &__button
    padding: 0 .5em
    display: flex
    align-items: center
    height: 100%
    box-sizing: border-box
    border-left: 1px solid black
    cursor: pointer
    background: var(--editor-element)
    transition: background .3s ease-in-out

  &__button--active,
  &__button:hover
    background: var(--editor-active)

  &__tools
    height: 100%

  &__actions
    display: flex
    align-items: center
    gap: .2em

  &__form
    display: grid
    gap: .5em
    padding: .5em

  &__field
    display: flex
    background: var(--editor-element)
    border-radius: 4px

  &__label
    padding: 0 1em
    height: 100%
    display: flex
    align-items: center

  &__input
    width: 100%

  &__tile-wrapper
    display: grid
    grid-template-columns: repeat(auto-fit, 100px)
    gap: .4em
    margin: .4em

  &__tile-type
    width: 100px
    height: 121px

  &__tile-type-selected
    position: absolute
    top: 2em
    left: 0
    width: 50px
    height: 71px
    padding: .5em
    background: var(--editor-active)

  & .el-tabs
    height: 100%

  & .el-tabs__content
    height: calc(100% - 45px)
    padding: 0
    padding-top: 5px
    background: var(--editor-primary)

  & .el-tab-pane
    height: 100%

  & .el-tabs__header
    background: var(--editor-active)

  & .el-tabs__item
    color: var(--editor-pen) !important

  & .el-tabs__item.is-active
    background: var(--editor-primary) !important

</style>