<template lang="pug">
LayoutEditor.page-card-all(adapt="page-card-all", sidebarfix="33%")
  template(#title)
    .page-card-all__title {{ title }}
  template(#content)
    .page-card-all__content
      .page-card-all__grid
        .page-card-all__card-item(v-for="card in cards", :key="card.id")
          CustomPlugin.page-card-all__card-view(:type="['card', card.type, 'view']", :config="card.value.config")
          .page-card-all__card-control
            ElButton(@click="onEdit(card)", size="mini") Edit
  template(#sidebar)
    EditorToolSlot(label="Search", @item-change="onItemChange")
      EditorInputTextfield.std-margin(v-model="filter.search", label="Search")
      EditorInputSelect.std-margin(v-model="filter.type", :options="{ '': 'All', Attack: 'Attack', Custom: 'Custom', Chem: 'Chem' }", label="Type")
      EditorInputSelect.std-margin(v-model="filter.cost", :options="options.cost", label="Cost")
      EditorInputSelect.std-margin(v-model="filter.icon", :options="options.icons", label="Icons")
      EditorInputTextfield.std-margin(v-model="filter.first", label="First")
      EditorInputTextfield.std-margin(v-model="filter.second", label="Second")
    pre {{ where }}
  template(#bottomright, v-if="error")
    .page-card-all__error {{ error }}

</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';

/** @type {import('~/custom/server/card/Entity/Card.entity')} */
let _cardStorage = null;
/** @type {import('~/custom/server/card/Remote/Card.remote')} */
let _cardRemote = null;
/** @type {import('~/custom/server/action/Remote/Router.remote')} */
let _router = null;

export default {

  async asyncData({ params }) {
    const data = { params };

    _cardStorage ??= await RemoteSystem.get('entity.card');
    _router ??= await RemoteSystem.get('remote.router');

    data.cards = await _cardStorage.loadAll();

    return data;
  },

  data() {
    _cardRemote ??= RemoteSystem.getSync('remote.card');
    const iconoptions = {
      '': 'All',
    };
    const icons = _cardRemote.getIcons();
    for (const icon in icons) {
      iconoptions[icon] = icons[icon].label + ' (' + icon + ')';
    }

    return {
      error: false,
      filter: {
        search: '',
        type: '',
        cost: '',
        icon: '',
        first: '',
        second: '',
      },
      options: {
        cost: {
          '': 'All',
          blood: 'Blut',
          rift: 'Rift',
          prepare: 'Prepare',
          plant: 'Pflanze',
          fire: 'Feuer',
          noactions: 'No Actions',
          perm: 'Permanent',
          light: 'Leicht',
          ki: 'KI',
          free: 'Frei',
          bonus: 'Bonus',
          braue: 'Braue',
        },
        icons: iconoptions,
      },
      where: {},
    };
  },

  computed: {

    title() {
      return 'All Cards';
    },

    bottomstate() {
      return this.error ? 'error' : 'default';
    },

  },

  methods: {

    async onEdit(card) {
      const url = await _cardStorage.route('editor', card);
      _router.goto(url);
    },

    onItemChange() {
      this.search();
    },

    search() {
      this.$nextTick(async () => {
        const search = [this.filter.search];
        if (this.filter.cost) search.push('"' + this.filter.cost + '":true');
        if (this.filter.first) search.push(',"first":"' + this.filter.first + '",');
        if (this.filter.second) search.push(',"second":"' + this.filter.second + '",');
        if (this.filter.icon) search.push('{' + this.filter.icon + '}');
        const where = {
          '*': search.join(' '),
          type: this.filter.type || undefined,
        };
        this.where = await _cardStorage.buildSearchWhere(where);
        const result = await _cardStorage.search(where);
        this.cards = result.items;
      });
    },

  },

}
</script>

<style lang="sass">
.page-card-all
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
    height: 100%
    background: grey
    overflow: auto
    box-sizing: border-box
    padding: 1em

  &__grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(252px, 252px))
    gap: 1em
    width: 100%
    justify-content: center
    align-items: start

  &__card-view
    width: 6.6cm !important
    height: 9.3cm !important
    border: 1px solid black
    text-align: initial

  &__card-item
    text-align: right
    background-color: rgba(0, 0, 0, .5)
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .5)

  &__card-control
    padding: .5em .2em .2em

</style>