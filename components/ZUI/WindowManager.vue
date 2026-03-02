<template lang="pug">
.zui-window-manager(:class="classes", v-shortkey.once="['ctrl', 'p']", @shortkey="onShortkey")
  .zui-window-manager__content
    slot
  .zui-window-manager__windows(ref="frame")
    ZUIWindow(ref="windows", v-for="window in windows", :key="window.uuid", :window="window", :uuid="window.uuid")
  .zui-window-manager__tasks
    .zui-window-manager__tasks-new-window(v-if="showInternalWindow")
      ElInput.zui-window-manager__internal(v-model="newInternal", @keyup.enter.native="onNewSubmit", size="mini")
    .zui-window-manager__task.zui-window-manager__task-primary(@click="onDocumentClick")
      .zui-window-manager__task-content
        span.el-icon-folder-opened(v-if="focusTrigger")
        span.el-icon-folder(v-if="!focusTrigger")
    .zui-window-manager__task.zui-window-manager__task-primary(@click="onNewWindow")
      .zui-window-manager__task-content
        span.el-icon-search
    .zui-window-manager__task(v-for="window in windows", :key="window.uuid", :class="getTaskClass(window)", @click="onTaskClick(window)", @click.right.prevent.stop="onTaskClick(window, true)", @mouseleave="onTaskLeave(window)")
      .zui-window-manager__task-content
        span {{ getWindowTitle(window.uuid) }}
        .zui-window-manager__task-menu(:class="getTaskMenuClass(window)")
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'reset')") ⊕
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'left')") ◀
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'right')") ▶
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'min')") 🗕
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'max')") 🗖
          .zui-window-manager__task-control(@click.stop="onTaskControl(window, 'close')") 🗙
  ElDialog(:visible.sync="dialogOpen", width="90%", :close-on-click-modal="false", append-to-body)
    template(v-if="dialogOpen", #title)
      .zui-window-manager__title(v-html="dialog.title")
    template(#footer)
      ElTabs.zui-window-manager__tabs(v-if="dialog?.tabs", v-model="dialog.tabs", type="border-card", lazy)
        ElTabPane(v-for="tab, key in dialog.values", :key="key", :name="key", :label="key")
          pre {{ tab }}
</template>

<script>
import RemoteSystem from 'zero-system/src/RemoteSystem';
import { v4 } from 'uuid';
import StringUtil from 'zero-util/src/StringUtil';
import JSONUtil from 'zero-util/src/JSONUtil';

let _windowModule = null;
let _menuModule = null;

/**
 * @typedef {Object} T_WindowBuild
 * @property {string} uuid
 * @property {string} component
 * @property {Object} params
 * @property {Object} frame
 * @property {string} frame.title
 * @property {(string|float)} frame.width
 * @property {(string|float)} frame.height
 * @property {string} frame.position
 * @property {Object<string, function[]>} events
 */

export default {

  provide() {
    return {
      zui: this,
    };
  },

  async created() {
    _windowModule ??= await RemoteSystem.get('module.window');
    _menuModule ??= await RemoteSystem.get('module.menu');

    this.menus = await _menuModule.getMenuData();
    console.log(this.menus);
  },

  data() {
    return {
      windows: [],
      dialog: null,
      dialogOpen: false,
      focusWindow: null,
      focusTrigger: false,
      taskMenu: null,
      newInternal: '',
      showInternalWindow: false,
      forceShow: false,
      menus: null,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.forceShow || this.windows.length) {
        classes.push('tasks');
      }
      return classes.map(v => 'zui-window-manager--' + v);
    },

  },

  methods: {

    onShortkey() {
      this.forceShow = !this.forceShow;
    },

    getWindowTitle(uuid) {
      return this.$refs.windows?.find(v => v.uuid === uuid)?.title ?? this.windows.find(v => v.uuid === uuid)?.frame.title ?? '[NO TITLE]';
    },

    getTaskClass(window) {
      return {'zui-window-manager__task--focus': window.uuid === this.focusWindow};
    },

    getTaskMenuClass(window) {
      return {'zui-window-manager__task-menu--show': window.uuid === this.taskMenu};
    },

    onTaskClick(window, task = false) {
      if (task) {
        if (this.taskMenu === window.uuid) {
          this.taskMenu = null; 
        } else {
          this.taskMenu = window.uuid;
        }
      } else {
        this.focus(window.uuid);
        this.getWindow(window.uuid)?.instance.setShow(true);
      }
    },

    onTaskLeave(window) {
      this.taskMenu = null;
    },

    getMax() {
      return this.$refs.frame.getBoundingClientRect();
    },

    async open(internal, routeParams = {}, params = {}) {
      const result = await _windowModule.open(internal, routeParams);
      if (!result) {
        return null;
      }
      return this.inline(result);
    },

    /**
     * @param {T_WindowBuild} build 
     * @param {function} prepare
     * @returns {T_WindowBuild}
     */
    inline(build, prepare = null) {
      build.uuid = v4();
      build.frame ??= {};
      build.frame.title ??= '[NO TITLE]';
      build.frame.width ??= '50%';
      build.frame.height ??= '50%';
      build.frame.position ??= 'center';
      build.params ??= {};
      if (typeof prepare === 'function') prepare(build);
      build.frame.title = StringUtil.replaceCallback(build.frame.title, match => {
        return JSONUtil.getDeep(build, match);
      });
      this.windows.push(build);
      this.$nextTick(() => {
        const window = this.getWindow(build.uuid);
        window.instance.open();
        this.trigger(build.uuid, 'open', {}, this);
      });
      build.addEvent = (event, listener) => {
        build.events ??= {};
        build.events[event] ??= [];
        build.events[event].push(listener);
        return build;
      };
      build.on = build.addEvent;
      return build;
    }, 
    
    /**
     * @param {string} entity_type 
     * @param {string} window_id 
     * @param {Object} params
     * @param {function} prepare
     * @returns {T_WindowBuild}
     */
    async inlineEntity(entity_type, window_id, params = {}, prepare = null) {
      const storage = await RemoteSystem.get('entity.' + entity_type);
      const info = await storage.info();
      const build = info.windows[window_id].build;
      for (const param in params) {
        build.params[param] = params[param];
      }
      return this.inline(build, prepare);
    },

    close(uuid, eventdata) {
      const event = this.trigger(uuid, 'close', eventdata, this);

      this.focusNext(uuid);

      const index = this.windows.findIndex(v => v.uuid === uuid);
      this.windows.splice(index, 1);
      return event;
    },

    focusNext(uuid) {
      const startindex = this.windows.findIndex(v => v.uuid === uuid);
      let index = startindex - 1;
      if (index === -1) index = this.$refs.windows.length - 1;

      while (index !== startindex && this.$refs.windows[index]) {
        if (!this.$refs.windows[index].minimal) {
          this.focus(this.$refs.windows[index].uuid);
          return index;
        }
        if (index-- === 0) index = this.$refs.windows.length - 1;
      }
      this.focus(null);
      return null;
    },

    focus(uuid) {
      for (const key in this.$refs.windows) {
        this.$refs.windows[key].focus = this.$refs.windows[key].uuid === uuid;
      }
      this.focusWindow = uuid;
    },

    getWindow(uuid) {
      const window = this.windows.find(v => v.uuid === uuid);
      for (const key in this.$refs.windows) {
        if (this.$refs.windows[key].uuid === uuid) {
          window.instance = this.$refs.windows[key];
        }
      }
      return window;
    },

    getWindowByPos(x, y, range = 10, ignore = []) {
      for (const key in this.$refs.windows) {
        const window = this.$refs.windows[key];
        if (ignore.includes(window.uuid)) continue;
        if (window.x - range < x && window.x + range > x && window.y - range < y && window.y + range > y) {
          return window.uuid;
        }
      }
      return null;
    },

    trigger(uuid, event, eventdata = {}, ...args) {
      const index = this.windows.findIndex(v => v.uuid === uuid);

      const eventObject = {
        type: event,
        uuid,
        target: this.windows[index],
        data: eventdata,
        args,
      };

      if (this.windows[index]?.events && this.windows[index]?.events[event]) {
        for (const listener of this.windows[index].events[event]) {
          listener(eventObject, ...args);
        }
      }
      return eventObject;
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

    onNewWindow() {
      this.showInternalWindow = !this.showInternalWindow;
      this.newInternal = '';
    },

    onDocumentClick() {
      for (const index in this.$refs.windows) {
        this.$refs.windows[index].onMinimal(this.focusTrigger, false);
      }
      this.focusTrigger = !this.focusTrigger;
      this.focus(null);
    },

    onTaskControl(window, control) {
      const _window = this.getWindow(window.uuid).instance;
      switch (control) {
        case 'left':
        case 'right':
        case 'reset':
          _window.onLayout(control);
          break;
        case 'min':
          _window.onMinimal(!_window.minimal);
          break;
        case 'max':
          _window.onMaximal();
          break;
        case 'close':
          _window.onClose();
          break;
      }
      this.taskMenu = null;
    }, 

    async onNewSubmit() {
      const window = await this.open(this.newInternal);
      if (window) {
        this.showInternalWindow = false;
      }
    },

    debug(message, params) {
      this.prepareMessage(message);
      console.log('debug:', message.title ?? message.message, params);
      let tabs = null;
      const values = {};
      for (const field in params) {
        tabs ??= field;
        values[field] = JSON.stringify(params[field], (key, value) => {
          if (Object.getPrototypeOf(value) === Object.prototype || Array.isArray(value)) {
            return value;
          }
          if (typeof value === 'object') {
            console.log(value, value.constructor);
            return '[COMPLEX ' + value.constructor.name + ']';
          }
          return value;
        }, 2);
      }
      message.onClick = () => {
        this.dialog = {
          title: message.message,
          values,
          tabs,
        };
        this.dialogOpen = true;
      };
      this.$notify(message);
    },

  },

};
</script>

<style lang="sass">
.zui-window-manager
  
  &__windows
    position: fixed
    inset: 0
    bottom: 3em
    pointer-events: none
    z-index: 1000

  &__tabs pre
    text-align: initial

  &__tasks
    position: absolute
    z-index: 1000000
    left: 0
    bottom: 0
    width: 100%
    height: 3em
    background: var(--color--side)
    border-top: 2px solid #111
    display: none

  &__tasks-new-window
    position: absolute
    bottom: 100%
    left: 0
    padding: .5em 1em
    background: var(--color--side)

  &__internal
    width: 400px

  &--tasks &__tasks
    display: flex

  &__task
    padding: 2px 2px 0 2px

  &__task-content
    color: white
    height: calc(100% - 2px)
    display: inline-flex
    justify-content: center
    align-items: center
    padding: 0 1em
    border-top-left-radius: .5em
    border-top-right-radius: .5em
    background: var(--color--main-light)
    transition: background .2s ease-in-out
    cursor: pointer
    position: relative

  &__task--focus &__task-content
    background: var(--background--ui)

  &__task:hover &__task-content
    background: var(--color--ui-main-light)

  &__task-primary &__task-content
    background: var(--color--highlight)

  &__task-primary:hover &__task-content
    background: var(--color--highlight-light)

  &__task-menu
    position: absolute
    bottom: 100%
    right: 0
    background: var(--background--ui)
    transition: background .2s ease-in-out
    display: none

  &__task-menu--show
    display: flex
  
  &__task-control
    padding: .4em .5em

  &__task-control:hover
    background: var(--color--ui-main-light)

  &__content
    background: var(--background--ui-background)
    color: var(--color--font-main)

  &__menus
    position: fixed
    bottom: 3em
    left: 0
    background: var(--color--side)
    padding: 1em
    min-width: 40%
    min-height: 40%
    perspective: 1200px
    display: none

  &__menu
    color: white
    min-width: 150px
    min-height: 150px
    background-color: var(--color--main-light)
    display: inline-block
    box-shadow: 0px 0px 10px #000A
    padding: 1em

</style>