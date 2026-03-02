<template lang="pug">
.zero-window-stack(:class="classes", v-shortkey.once="['ctrl', 'k']", @shortkey="onShortkey")
  slot
  .zero-window-stack__overlay
    .zero-window-stack__contents
      .zero-window-stack__content(v-for="(component, index) in components", :key="component.key")
        ZeroWindowStackContent(:index="index", :component="component")
    .zero-window-stack__form
      .zero-window-stack__info(v-if="requestInfos.length")
        .zero-window-stack__info-line(v-for="line in requestInfos", :key="line") {{ line }}
      input.zero-window-stack__input(ref="input", v-model="search", @input="onInput", @keydown.esc.stop.prevent="onEscape", @keydown.down.prevent="onDown", @keydown.up.prevent="onUp", @keydown.enter.prevent="onEnter")
      .zero-window-stack__items(v-if="options.length > 0")
        .zero-window-stack__item(v-for="(option, index) in options", :key="index", :class="itemClass(index)")
          .zero-window-stack__title {{ option.name }}
          .zero-window-stack__tags
            .zero-window-stack__tag(v-for="tag in option.tags", :key="tag") {{ tag }}
          .zero-window-stack__description {{ option.description }}
          .zero-window-stack__command {{ option.command }}
</template>

<script>
import Handler from 'events';

import AsyncPromise from 'zero-util/src/AsyncPromise';

import ZERO from '~/custom/plugins/zero.plugin';

export default {

  mounted() {
    ZERO.setComponent('window.stack', this);
  },

  provide() {
    return {
      ws: this,
    };
  },

  data() {
    return {
      open: false,
      form: false,
      search: '',
      suggestions: [],
      select: 0,
      components: [],
      key: 0,
      request: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.open || this.components.length) classes.push('open');
      if (this.open) classes.push('form');
      return 'zero-window-stack--' + classes.join(' zero-window-stack--');
    },

    options() {
      const closeSuggestions = [];

      for (const index in this.components) {
        closeSuggestions.push({
          name: 'CLOSE: ' + (this.components[index].info.title ?? this.components[index].component),
          tags: ['close'],
          commands: [
            {
              service: 'remote.router',
              method: 'close',
              args: [this.components[index].key],
            }
          ],
        });
      }
      return [...this.suggestions, ...closeSuggestions];
    },

    requestInfos() {
      if (!this.request) return []; 
      if (Array.isArray(this.request.info)) {
        return this.request.info;
      } else if (typeof this.request.info === 'string') {
        return [this.request.info];
      }
      return [];
    },

  },

  methods: {

    onShortkey() {
      this.open = !this.open;
      if (this.open) {
        this.search = '';
        this.suggestions = [];
        this.request = null;
      }
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    onEscape() {
      this.open = false;
      if (this.request) {
        this.request.timing.reject({
          event: 'user.escape',
        });
        this.request = null;
      }
    },

    async onInput() {
      this.select = 0;
      /** @type {import('~/custom/server/action/Service/Action.service')} */
      const actions = await ZERO.get('service.action');

      if (this.request) {
        this.suggestions = await actions.getActionOptions(this.request.option, this.search);
      } else {
        this.suggestions = await actions.getActions(this.search);
      }
    },

    onDown() {
      this.select++;
      if (this.select >= this.options.length) {
        this.select = 0;
      }
    },

    onUp() {
      this.select--;
      if (this.select < 0) {
        this.select = this.options.length - 1;
      }
    },

    async onEnter() {
      if (this.request) {
        if (this.options.length) {
          this.request.timing.resolve(this.options[this.select]);
        } else {
          this.request.timing.resolve({
            value: this.search,
            custom: true,
          });
        }
        this.request = null;
      } else {
        await ZERO.executeActions(this.options[this.select]?.commands ?? []);
      }
      this.open = false;
    },

    itemClass(index) {
      return {
        'zero-window-stack__item--select': index === this.select,
      };
    },

    addComponent(component, params = {}, info = {}, parent = null) {
      const item = { component, params, parent: parent ?? this, key: this.key++, info, events: new Handler() };
      this.components.push(item);
      return item;
    },

    closeComponent(key, result = null) {
      const component = this.getComponent(key);
      component.events.emit('close', { component, key, result });
      this.components.splice(this.getComponentIndex(key), 1);
      component.events.emit('resolve', { component, key, result });
    },

    getComponent(key) {
      return this.components.find(v => v.key === key);
    },

    getComponentIndex(key) {
      return this.components.findIndex(v => v.key === key);
    },

    async getRequestOption(info, option) {
      this.open = true;
      this.search = '';
      this.request = {
        info,
        option,
        timing: new AsyncPromise(),
      };
      this.onInput();
      return this.request.timing.promise;
    },

    getReplaceMessageMatches(text) {
      const preRegex = /<pre>([\s\S]*?)<\/pre>/g; // Finde <pre>-Blöcke
      const quoteRegex = /"([^"]+)"/g; // Strings außerhalb von <pre>
      const backtickRegex = /`([^`]+)`/g; // Strings innerhalb von <pre>

      let matches = [];
      let lastIndex = 0;

      text.replace(preRegex, (match, code, index) => {
        let beforePre = text.slice(lastIndex, index);
        matches.push(...beforePre.matchAll(quoteRegex));
        matches.push(...code.matchAll(backtickRegex));
        lastIndex = index + match.length;
      });
      matches.push(...text.slice(lastIndex).matchAll(quoteRegex));
      return matches;
    },

    prepareMessage(message) {
      const matches = this.getReplaceMessageMatches(message.message);
      for (const match of matches) {
        message.message = message.message.replace(match[0], '<strong>' + match[1] + '</strong>');
      }
      message.dangerouslyUseHTMLString = true;
      message.customClass ??= '';
      message.customClass += ' zero-note--' + (message.type ?? 'note');
      if (message.onClick) {
        message.customClass += ' zero-note--clickable';
      }
      return message;
    },

    message(message) {
      this.prepareMessage(message);
      this.$message(message);
    },

    notify(notify) {
      this.prepareMessage(notify);
      this.$notify(notify);
    },

    popup(message) {
      this.prepareMessage(message);
      message.showClose ??= false;
      message.confirmButtonText ??= 'OK';
      message.closeOnClickModal ??= false;
      if (message.wide) {
        message.customClass ??= '';
        message.customClass += ' zero-note--wide';
      }
      this.$msgbox(message);
    },

  },

};
</script>

<style lang="sass">
.zero-window-stack
  --window-stack--content-margin: 2em
  position: relative
  width: 100vw
  height: 100vh
  overflow: auto

  &__overlay
    display: none
    position: absolute
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    overflow: hidden
    background: rgba(0, 0, 0, .1)
    pointer-events: all
    z-index: 1000

  &--open &__overlay
    display: block

  &__form
    display: none
    position: absolute
    top: 0
    left: 50%
    transform: translateX(-50%)
    max-width: 600px
    width: 50vw
    background: #b2b2b2

  &--form &__form
    display: block

  &__input
    width: 100%
    border: 0
    border-radius: 0
    padding: .5em 1em
    background: transparent
    box-sizing: border-box
    font-size: 1.2em

  &__items
    border-top: 2px solid black

  &__item
    display: grid
    grid-template-columns: auto minmax(min-content, 33%)
    padding: .2em
    cursor: pointer
  
  &__item--select,
  &__item:hover
    background: #ccc

  &__tags
    display: inline-flex
    gap: .5em
    margin: .2em
    justify-content: right

  &__tag
    display: inline-block
    padding: .2em .3em
    color: white
    background: black
    border-radius: 3px

  &__title
    font-size: 1.2em
    font-weight: bold

  &__description
    grid-column: span 2
    font-size: .9em
    color: rgba(0, 0, 0, .8)

  &__command
    grid-column: span 2

  &__item + &__item
    border-top: 1px solid black

  &__contents
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    
  &__content
    position: absolute
    top: var(--window-stack--content-margin)
    left: var(--window-stack--content-margin)
    bottom: var(--window-stack--content-margin)
    right: var(--window-stack--content-margin)
    background: white
    overflow: auto

  &__info
    padding: 4px 8px
    background: var(--primary)
    color: var(--pen-secondary)
    font-weight: bold
    font-style: italic

  &__info-line + &__info-line
    padding: 2px 0
    border-top: 2px solid var(--pen-secondary)

</style>
  