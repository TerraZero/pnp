<template lang="pug">
LayoutEditor.page-control(adapt="page-control", :sidebarfix="sidebarsize + '%'", :bottomstate="bottomstate")
  template(#title)
    .page-control__title {{ title }}
  template(#topright)
    .page-control__topright
      .page-control__changes(v-if="change")
        font-awesome-icon.page-control__changes-icon(:icon="['fas', 'download']")
      .page-control__sidebar-btn(@click="sidebarsize === 0 ? sidebarsize = 33 : sidebarsize = 0")
        font-awesome-icon(:icon="['fas', 'bars']")
  template(#content)
    .page-control__map(ref="mapscreen", v-if="map && sidebartab === 'map'")
      EditorViewGrid(:config="map.value.config", mode="editor", :rooms="map.value.rooms", :active="roomIndex", :control="config", :size="mapsize")
        img(ref="mapimage", :src="map.value.config.image", @load="onMapImageLoad")
    .page-control__battle(v-if="sidebartab === 'battle'")
      CustomScreenUnits(:units="units", :turn="turn", :current="current", :select.sync="select", row)
      CustomScreenTurnUnit(:units="units", :turn="turn", :current.sync="current", :select.sync="select", @next-turn="setNextTurn", @update:current="onCurrentUpdate", @change="save")
    .page-control__music(v-if="sidebartab === 'config'")
      CustomEditorSoundBoard
  template(#sidebar)
    ElTabs(v-model="sidebartab", type="border-card", lazy)
      ElTabPane(name="map", label="Map")
        EditorToolSlot(label="Load Map", closable)
          EditorInputEntityList(storage="entity.map", :fields="['id', 'label']", label="Load map", control-label="Control")
            template(slot-scope="{ row }")
              ElButton(type="primary", size="mini", @click="onMapSelect(row.id, true)") Select
              ElButton(type="primary", size="mini", @click="onMapEdit(row.id)") Edit
        EditorToolSlot(v-if="map", label="Map", closable)
          ElButton(v-if="!config.value.screens.map", @click="onMapShow(true)", size="mini") Show Map
          ElButton(v-if="config.value.screens.map", @click="onMapShow(false)", size="mini") Hide Map
          ElButton(@click="onMapReset", size="mini") Reset Map
          EditorInputMultiSwitchBoard.page-control__room.std-margin(v-for="room, index in map.value.rooms", :key="room.label", :checkboxes="roomOptions", v-model="config", @input="save", :mount="'value.rooms.' + index", :open="index === roomIndex", @update:open="onRoomActive(index, $event)")
            | {{ room.label }}
      ElTabPane(name="battle", label="Kampf")
        EditorToolSlot(label="Control", closable)
          EditorInputButtons.std-margin(:buttons="[{ key: 'init', type: 'primary', label: 'Create Initiative' }, { key: 'init-reload', type: 'primary', label: 'Init Group Reload' }, { key: 'start', type: 'primary', label: 'Start battle' }, { key: 'stop-battle', type: 'danger', label: 'Stop' }]", @click="onBattleControl")
          .page-control__hero-wrapper.std-margin
            .page-control__hero-init(v-for="hero in heros", :key="hero.name")
              .page-control__hero-name {{ hero.name }}
              EditorInputSelect.page-control__hero-select(v-model="hero.battleInit", options="1-30")
          EditorToolActionWrap(:buttons="[{ key: 'next', icon: 'el-icon-right', type: 'primary' }]", label="Aktive Initiative", @click="onTurnControl")
            EditorInputSelect(v-model="turn", options="1-10")
        EditorToolSlot(label="Units", closable)
          EditorInputButtons.std-margin(:buttons="[{ key: 'add', type: 'primary', icon: 'el-icon-plus' }]", @click="onUnitControl")
          .page-control__battle(v-for="battle in battles", :key="battle.id") {{ battle.label }}
        EditorToolSlot(label="Helden", closable)
          EditorInputButtons.std-margin(:buttons="[{ key: 'add', type: 'primary', icon: 'el-icon-plus' }]", @click="onHeroControl")
          CustomPlugin.page-control__hero(v-if="config.value.heros", v-for="hero, index in config.value.heros", :key="index", :type="['unit', 'hero', 'form']", v-model="config.value.heros[index]", @item-change="onHeroChange")
            .page-control__quick-bar
              EditorInputSwitch(v-model="hero.props.show", label="Show", border)
              EditorInputButtons(:buttons="[{ key: 'delete', type: 'danger', icon: 'el-icon-delete' }]", @click="onHeroControl($event, hero, index)")
        EditorToolSlot(label="Gegner", closable)
          EditorInputButtons.std-margin(:buttons="[{ key: 'add', type: 'primary', icon: 'el-icon-plus' }, { key: 'reset', type: 'danger', icon: 'el-icon-refresh' }]", @click="onEnemyControl")
          CustomPlugin.page-control__enemy(v-if="config.value.enemy", v-for="enemy, index in config.value.enemy", :key="index", :type="['unit', 'enemy', 'form']", v-model="config.value.enemy[index]", @item-change="onEnemyChange", @reload="onReload")
            .page-control__quick-bar
              EditorInputSwitch(v-model="enemy.props.show", label="Show", border)
              EditorInputButtons(:buttons="[{ key: 'delete', type: 'danger', icon: 'el-icon-delete' }]", @click="onEnemyControl($event, enemy, index)")
      ElTabPane(name="config", label="Config")
        ElButton(type="danger", size="mini", @click="reset") Reset
        EditorToolSlot(label="Sounds", closable, @item-change="debounceSave")
          EditorInputSlider(v-model="sounds.volume", :min="0", :max="100", label="Master Volume")
  template(#bottomright, v-if="error")
    .page-control__error {{ error }}

</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import TimingUtil from 'zero-util/src/TimingUtil';
import ComputedUtil from '~/custom/util/ComputedUtil';
import RandomUtil from '~/custom/util/RandomUtil';

/** @type {import('~/custom/server/config/Entity/Config.entity')} */
let _configStorage = null;
/** @type {import('~/custom/server/map/Entity/Map.entity')} */
let _mapStorage = null;
/** @type {import('~/custom/server/enemy/Entity/EnemyType.entity')} */
let _enemyTypeStorage = null;
/** @type {import('~/custom/server/map/Remote/Map.remote')} */
let _mapRemote = null;
/** @type {import('~/custom/server/eldritch/Service/Eldritch.service')} */
let _EldritchService = null;
/** @type {import('~/custom/server/eldritch/Service/Sounds.service')} */
let _SoundsService = null;

export default {

  inject: ['zui'],

  async asyncData({ params }) {
    const data = { params };

    _configStorage ??= await RemoteSystem.get('entity.config');
    _mapStorage ??= await RemoteSystem.get('entity.map');
    _mapRemote ??= await RemoteSystem.get('remote.map');
    _enemyTypeStorage ??= await RemoteSystem.get('entity.enemy_type');
    _EldritchService ??= await RemoteSystem.get('service.eldritch');
    _SoundsService ??= await RemoteSystem.get('service.sounds');
    data.config = await _configStorage.loadByParams({ game: params.game, identify: 'control' });

    if (data.config === null) {
      await _configStorage.save({ identify: 'control', game: params.game, value: {} });
      data.config = await _configStorage.loadByParams({ game: params.game, identify: 'control' });
    }
    data.enemyTypes = {};
    for (const type of await _enemyTypeStorage.loadAll({ game: params.game })) {
      data.enemyTypes[type.id] = type;
    }
    return data;
  },

  async created() {
    this.init();
    window.addEventListener('resize', this.onMapImageLoad.bind(this));
  },

  data() {
    return {
      error: false,
      sidebarsize: 33,
      sidebartab: 'map',
      map: null,
      activeRoom: null,
      roomOptions: {
        show: 'Show',
      },
      roomIndex: null,
      change: false,
      turn: 1,
      current: 0,
      select: -1,
      mapsize: {
        width: 0,
        height: 0,
      },
      battles: [],
    };
  },

  computed: {

    title() {
      return 'Title';
    },

    bottomstate() {
      return this.error ? 'error' : 'default';
    },

    heros() {
      return (this.config.value.heros ?? [])
        .filter(hero => hero.props.show)
        .sort((a, b) => {
          return parseInt(a.pos ?? '0') - parseInt(b.pos ?? '0');
        });
    },

    enemies() {
      return (this.config.value.enemy ?? [])
        .filter(enemy => enemy.props.show)
        .sort((a, b) => {
          return parseInt(a.pos ?? '0') - parseInt(b.pos ?? '0');
        });
    },

    isEnemyTurn() {
      return this.enemies.find(v => v.init == this.turn) !== undefined;
    },

    units() {
      const units = [...(this.config.value.heros ?? []), ...(this.config.value.enemy ?? [])];

      units.sort((a, b) => {
        if (a.init === b.init) return parseInt(a.pos ?? '0') - parseInt(b.pos ?? '0');
        return a.init - b.init;
      });

      return units;
    },

    sounds: ComputedUtil.getDeepProp('config', 'value.sounds', { volume: 100 }, true),

  },

  methods: {

    init() {
      this.config.value.heros ??= [];
      this.config.value.enemy ??= [];
      if (this.config.value.map) {
        this.onMapSelect(this.config.value.map);
      }
      this.turn = this.config.value.turn ?? 1;
    },

    async onReload() {
      await this.save();
      this.config = await _configStorage.loadByParams({ game: this.params.game, identify: 'control' });
      this.init();
    },

    log(data, ...args) {
      console.log(data, ...args);
      return data;
    },

    getEnemyType(type) {
      return this.enemyTypes[type];
    },

    onMapEdit(id) {
      this.zui.open('/entity/map/' + id);
    },

    async onMapSelect(id, force = false) {
      this.map = await _mapStorage.load(id);
      if (this.config?.value?.map !== id) {
        this.config.value.map = id;
        this.config.value.rooms = [];
        for (const index in this.map.value.rooms) {
          this.config.value.rooms.push({});
        }
        await this.save();
      }
    },

    onRoomActive(index, open) {
      this.roomIndex = index;
    },

    async reset() {
      this.config.value = {
        screens: {
          logo: true,
          map: false,
          battle: false,
        },
        heros: [],
        enemy: [],
      };
      await this.save();
      this.$router.go(0);
    },

    async save() {
      console.log('save', this.config);
      await _configStorage.save(this.config);
      this.change = false;
    },

    async onUnitControl(button) {
      switch (button.key) {
        case 'add':
          (await this.zui.open('/unit/select')).addEvent('close', e => {
            if (e.data.unit) {
              if (this.battles.find(v => v.id === e.data.unit.id) === undefined) {
                this.battles.push(e.data.unit);
              } else {
                this.zui.debug({
                  type: 'error',
                  title: 'Error add battle unit',
                  message: 'The unit "' + e.data.unit.label + '" is already in battle.',
                  duration: 0,
                }, {
                  unit: e.data.unit,
                  battles: this.battles,
                });
              }
            }
          });
          break;
      }
    },

    onBattleControl(button) {
      switch (button.key) {
        case 'init':
          this.setTurn(1);

          for (const enemy of this.enemies) {
            enemy.battleInit = RandomUtil.getRandomInt(1, 20) + enemy.attrs.attrs.ges.bonus;
          }

          this.calculateInitGroup([...this.heros, ...this.enemies].sort((a, b) => a.battleInit - b.battleInit));
          break;
        case 'init-reload':
          this.calculateInitGroup([...this.heros, ...this.enemies].sort((a, b) => a.init - b.init));
          break;
        case 'start':
          this.config.value.screens ??= {};
          this.config.value.screens.battle = true;
          this.save();
          _SoundsService.play({
            id: 'sounds/combat-start',
          });
          break;
        case 'stop-battle':
          this.config.value.screens ??= {};
          this.config.value.screens.battle = false;
          this.save();
          break;
      }
      this.save();
    },

    async setTurn(turn) {
      this.turn = turn;
      this.config.value.turn = turn;
      for (const enemy of (this.config.value.enemy ?? [])) {
        if (enemy.init != turn) continue;
        enemy.props.turn = false;
      }
      await this.save();
    },

    calculateInitGroup(units) {
      let group = 1;
      let isHero = units[0].type === undefined;
      for (const unit of units) {
        if ((unit.type === undefined && !isHero) || (unit.type !== undefined && isHero)) {
          group++;
          isHero = unit.type === undefined;
        }
        unit.init = group + '';
      }
    },

    onHeroControl(button, enemy, index) {
      switch (button.key) {
        case 'add': 
          this.config.value.heros.push({
            init: 1,
            pos: 1,
            name: 'Hero ' + this.config.value.heros.length,
            props: {
              show: false,
              dead: false,
            },
            description: '',
            unit: 'hero',
          });
          break;
        case 'delete':
          this.config.value.heros.splice(index, 1);
          break;
      }
      this.save();
    },

    debounceSave: TimingUtil.debounce(function() {
      this.save();
    }, 1000, function() {
      this.change = true;
    }),

    onHeroChange: TimingUtil.debounce(function() {
      this.save();
    }, 1000, function() {
      this.change = true;
    }),

    onEnemyControl(button, enemy, index) {
      switch (button.key) {
        case 'add': 
          const newEnemy = {
            init: 0,
            pos: 1,
            type: '1',
            name: 'Enemy ' + this.config.value.enemy.length,
            description: '',
            unit: 'enemy',
          };
          this.$set(newEnemy, 'props', {
              show: false,
              dead: false,
          });
          this.config.value.enemy.push(newEnemy);
          break;
        case 'reset':
          this.config.value.enemy = [];
          break;
        case 'delete':
          this.config.value.enemy.splice(index, 1);
          break;
      }
      this.save();
    },

    onEnemyChange: TimingUtil.debounce(function() {
      this.save();
    }, 1000, function() {
      this.change = true;
    }),

    onTurnControl(button) {
      switch (button.key) {
        case 'next':
          this.setNextTurn();
          break;
      }
    },

    setNextTurn() {
      let max = 0;
      for (const enemy of this.enemies) {
        max = Math.max(enemy.init, max);
      }
      for (const hero of this.heros) {
        max = Math.max(hero.init, max);
      }
      if (this.turn >= max) {
        for (const enemy of this.enemies) {
          enemy.props.turn = false;
        }
        this.setTurn(1);
      } else {
        this.setTurn(this.turn + 1);
      }
      _SoundsService.play({
        id: 'sounds/combat-turn',
      });
      this.save();
    },

    onMapShow(show) {
      this.config.value.screens ??= {};
      this.config.value.screens.map = show;
      this.config.value.screens.logo = false;
      this.save();
    },

    onMapReset() {
      this.config.value.rooms = [];
      for (const index in this.map.value.rooms) {
        this.config.value.rooms.push({});
      }
      this.onReload();
    },

    onMapImageLoad() {
      if (this.$refs.mapscreen && this.$refs.mapimage) {
        this.mapsize = ComputedUtil.getObjectFitElementSize(this.$refs.mapscreen, this.$refs.mapimage);
      }
    },

    onCurrentUpdate(current) {
      _EldritchService.setCurrent(current);
    },

  },

}
</script>

<style lang="sass">
.page-control
  height: 100%

  &__title
    padding: .3em

  &__error
    padding: .2em
    font-size: .9em

  &__sidebar .el-tabs__content
    padding: 0

  &__changes
    height: 28px
    aspect-ratio: 1
    background: var(--warning)
    padding: 2px
    box-sizing: border-box

  &__changes-icon
    width: 100%
    height: 100%

  &__battle
    position: relative
    width: 100%
    height: 100%

  &__quick-bar
    display: flex
    gap: .5em
    align-items: center

  &__hero-wrapper
    display: grid
    grid-template-columns: repeat(4, 1fr)
    gap: 1em

  &__sidebar-btn
    aspect-ratio: 1
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    background: #00bdb5
    cursor: pointer

  &__topright
    display: flex
    height: 100%

  &__map
    width: 100%
    height: 100%

</style>