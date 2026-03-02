<template lang="pug">
LayoutEditor.page-map-map(adapt="page-map-map", sidebarfix="33%", :bottomstate="bottomstate")
  template(#title)
    .page-map-map__title {{ title }}
  template(#topright)
    CustomEditorToolbar(:items="toolbar", @tool="onTool")
  template(#content)
    .page-map-map__map-wrapper(ref="screen")
      EditorViewGrid(:config="config", mode="editor", :rooms="rooms", :active="activeRoom", :select="gridSelectArea", :size="mapsize", @hover-item="onHoverItem", @click-item="onClickItem")
        img(ref="mapimage", :src="config.image", @load="onMapImageLoad")
  template(#sidebar)
    ElButton(@click="onSave") Save
    ElTabs(v-model="sidebartab", type="border-card", lazy)
      ElTabPane(name="map", label="Map")
        EditorToolSlot(label="Base", closable)
          EditorInputTextfield(v-model="config.image", label="Image")
          EditorInputImageSelect(v-model="config.image", prefix="/eldritch/", label="Image")
        EditorToolSlot(label="Room", closable)
          EditorInputButtons(:buttons="roomButtons", @click="onRoomButton", gap)
          EditorToolSlot(v-for="room, index in rooms", :key="index", :label="room.label", closable, :open.sync="room._open", @opened="onRoomSelect(index)")
            EditorInputMultiSwitch(v-model="room._action", :buttons="[{key: 'add', icon: 'el-icon-plus', description: 'Add item'}, {key: 'area', icon: 'el-icon-crop', description: 'Add area'}, {key: 'sub', icon: 'el-icon-minus', description: 'Remove item'}]", gap)
            EditorInputTextfield(v-model="room.label", label="Label")
            EditorViewPillGrid.std-margin
              .page-map-map__pill-item(v-for="item in room.items")
                .page-map-map__pill
                  .page-map-map__pill-x {{ item.x }}
                  .page-map-map__pill-y {{ item.y }}
      ElTabPane(name="config", label="Config")
        EditorToolSlot(label="Grid", closable)
          EditorInputSlider(v-model="grid.x", label="X", :min="0", :max="20")
          EditorInputSlider(v-model="grid.y", label="Y", :min="0", :max="20")
        EditorToolSlot(label="Offset", closable)
          EditorInputSlider(v-model="offset.left", label="Left", :min="0", :max="200")
          EditorInputSlider(v-model="offset.top", label="Top", :min="0", :max="200")
          EditorInputSlider(v-model="offset.right", label="Right", :min="0", :max="200")
          EditorInputSlider(v-model="offset.bottom", label="Bottom", :min="0", :max="200")

  template(#bottomright, v-if="error")
    .page-map-map__error {{ error }}

</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import ComputedUtil from '~/custom/util/ComputedUtil';

/** @type {import('~/custom/server/map/Entity/Map.entity')} */
let _mapStorage = null;
/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;
/** @type {import('~/custom/server/map/Remote/Map.remote')} */
let _mapRemote = null;

export default {

  async asyncData({ params }) {
    const data = { params };

    _mapStorage ??= await RemoteSystem.get('entity.map');
    _router ??= await RemoteSystem.get('remote.router');
    _mapRemote ??= await RemoteSystem.get('remote.map');
    data.map = await _mapStorage.load(params.id);

    if (data.map === null) {
      data.error = 'ERROR: Map ' + params.id + ' not found.';
    } else {
      data.rooms = _mapRemote.addPrivateProps((data.map.value.rooms ?? []), {
        _action: 'add',
        _open: false,
      });
      data.config = data.map.value.config ?? {};
      data.entities = data.map.value.entities ?? [];
    }

    return data;
  },

  data() {
    return {
      error: false,
      sidebartab: 'map',
      toolbar: [
        {
          id: 'edit',
          icon: 'edit',
        },
      ],
      roomButtons: [
        {
          icon: 'el-icon-plus',
          type: 'primary',
        }
      ],
      config: {
        grid: {
          x: 8,
          y: 8,
        },
        offset: {
          left: 0, 
          top: 0,
          right: 0,
          bottom: 364,
        },
      },
      rooms: [],
      activeRoom: null,
      itemselect: null,
      itemhover: null,
      mapsize: {
        width: 100,
        height: 100,
      },
    };
  },

  computed: {

    title() {
      return this.map?.label ?? 'ERROR: Map not found';
    },

    bottomstate() {
      return this.error ? 'error' : 'default';
    },

    gridSelectArea() {
      if (this.itemselect === null) return null;
      if (this.itemhover === null) return [this.itemselect, this.itemselect];
      return [this.itemselect, this.itemhover];
    },

    grid: ComputedUtil.getDeepProp('config', 'grid', { x: 1, y: 1 }, true),
    offset: ComputedUtil.getDeepProp('config', 'offset', { top: 0, left: 0, right: 0, bottom: 0 }, true),

  },

  methods: {

    async onTool(item) {
      if (item.id === 'edit') {
        const url = await _mapStorage.route('edit', this.params);
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
      this.map.value = {
        rooms: _mapRemote.removePrivateProps(this.rooms),
        config: this.config,
      };
      _mapStorage.save(this.map);
    },

    onMapImageLoad() {
      const rect = this.$refs.screen.getBoundingClientRect();
      const ir = this.$refs.mapimage.naturalWidth / this.$refs.mapimage.naturalHeight;
      const cr = rect.width / rect.height;

      this.mapsize = {
        width: ir > cr ? rect.width : rect.height * ir,
        height: ir > cr ? rect.width / ir : rect.height,
      };
    },

  },

}
</script>

<style lang="sass">
.page-map-map
  height: 100%

  &__map-wrapper
    width: 100%
    height: 100%

  &__title
    padding: .3em

  &__error
    padding: .2em
    font-size: .9em

  &__sidebar .el-tabs__content
    padding: 0

  &__pill
    display: inline-grid
    grid-template-columns: max-content max-content
    background: #181818
    border-radius: 4px
  
  &__pill-x,
  &__pill-y
    padding: .2em .5em

  &__pill-y  
    border-left: 1px solid white

</style>