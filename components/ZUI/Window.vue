<template lang="pug">
transition(name="fade")
  .zui-window(v-if="show", :class="classes", :style="styles")
    .zui-window__header
      .zui-window__handle(@mousedown="onDragStart")
        .zui-window__title(v-if="title", :title="title") {{ title }}
      .zui-window__controls
        .zui-window__left(@click.stop="onLayout('reset')") ⊕
        .zui-window__left(@click.stop="onLayout('left')") ◀
        .zui-window__right(@click.stop="onLayout('right')") ▶
        .zui-window__min(@click="onMinimal") 🗕
        .zui-window__max(@click="onMaximal") 🗖
        .zui-window__close(@click="onClose") 🗙
    .zui-window__content-frame(v-loading="loading")
      .zui-window__content
        ZeroComponent(v-if="comp", :comps="comp", v-bind="window.params")
          | [NO COMPONENT FOUND '{{ comp }}']
      .zui-window__resize-handle(@mousedown="onResizeStart")
    .zui-window__focus(v-if="!focus", @click="onFocus")
</template>

<script>
export default {

  props: ['window', 'uuid'],

  inject: ['zui'],

  provide() {
    return {
      zuiw: this,
    };
  },

  data() {
    return {
      title: '',
      show: false,
      width: 200,
      widthSave: 200,
      height: 200,
      heightSave: 200,
      x: 100,
      xSave: 100,
      y: 100,
      ySave: 100,
      minWidth: 100,
      minHeight: 100,
      minimal: false,
      animation: false,
      maximal: false,
      focus: false,
      loading: false,
    };
  },

  computed: {

    classes() {
      const classes = [];

      if (this.focus) classes.push('focus');
      if (this.minimal) classes.push('minimal');
      if (this.animation) classes.push('animation');
      if (this.maximal) classes.push('maximal');
      return 'zui-window--' + classes.join(' zui-window--');
    },

    styles() {
      const styles = {};

      if (!this.maximal) {
        styles['--zui-window--width'] = this.width + 'px';
        styles['--zui-window--height'] = this.height + 'px';
        styles['--zui-window--x'] = this.x + 'px';
        styles['--zui-window--y'] = this.y + 'px';
      }

      return styles;
    },

    comp() {
      return this.window.component.split('/').join('');
    },

  },

  methods: {

    open() {
      this.reposition();
      this.title = this.window.frame.title;
      this.show = true;
      this.zui.focus(this.uuid);
    },

    reposition() {
      this.maximal = false;
      this.minimal = false;
      let width = 200;
      let height = 200;
      const max = this.zui.getMax();
      if (this.window.frame.width) {
        if (this.window.frame.width.endsWith('%')) {
          width = max.width * parseFloat(this.window.frame.width) / 100;
        } else {
          width = parseFloat(this.window.frame.width);
        }
      }
      if (this.window.frame.height) {
        if (this.window.frame.height.endsWith('%')) {
          height = max.height * parseFloat(this.window.frame.height) / 100;
        } else {
          height = parseFloat(this.window.frame.height);
        }
      }
      this.width = width;
      this.height = height;
      if (this.window.frame.position === 'center') {
        this.x = (max.width - this.width) / 2;
        this.y = (max.height - this.height) / 2;
      }
      
      let other = null;
      do {
        other = this.zui.getWindowByPos(this.x, this.y, 5, [this.uuid]);
        if (other !== null) {
          this.x += 20;
          this.y += 20;
        }
      } while (other !== null);
    },

    close(eventdata) {
      return this.zui.close(this.uuid, eventdata);
    },

    setLoading(loading = true) {
      this.loading = loading;
    },

    setTitle(title) {
      this.title = title;
    },

    setShow(show) {
      this.show = show;
      if (this.show && this.minimal) {
        this.minimal = false;
        this.animation = true;
        setTimeout(() => {
          this.animation = false;
        }, 400);
      }
    },

    onLayout(layout) {
      if (this.minimal) {
        this.onMinimal(false);
      }
      this.animation = true;
      if (layout === 'reset') {
        this.reposition();
      } else {
        this.widthSave = this.width;
        this.heightSave = this.height;
        const bounding = this.zui.getMax();
        this.width = bounding.width / 2;
        this.height = bounding.height;
        switch (layout) {
          case 'left':
            this.maximal = false;
            this.xSave = this.x;
            this.x = 0;
            this.ySave = this.y;
            this.y = 0;
            break;
          case 'right':
            this.maximal = false;
            this.xSave = this.x;
            this.x = bounding.width / 2;
            this.ySave = this.y;
            this.y = 0;
            break;
        }
      }

      setTimeout(() => {
        this.animation = false;
      }, 400);
    },

    onMinimal(minimal = true, focus = true) {
      this.animation = true;
      this.minimal = minimal;
      setTimeout(() => {
        this.animation = false;
      }, 400);
      if (minimal && focus) this.zui.focusNext(this.uuid);
    },

    onMaximal() {
      if (this.minimal) {
        this.onMinimal(false);
        if (!this.maximal) {
          this.onMaximal();
        }
      } else {
        this.maximal = !this.maximal;
        this.animation = true;
        if (this.maximal) {
          this.widthSave = this.width;
          this.heightSave = this.height;
          const bounding = this.zui.getMax();
          this.width = bounding.width;
          this.height = bounding.height;
        } else {
          this.width = this.widthSave;
          this.height = this.heightSave;
        }
        setTimeout(() => {
          this.animation = false;
        }, 400);
      }
    },

    onClose() {
      this.close();
    },

    onDragStart(e) {
      if (this.maximal) return;
      const startX = e.clientX;
      const startY = e.clientY;
      const initialX = this.x;
      const initialY = this.y;

      const onMouseMove = (event) => {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        this.x = initialX + dx;
        this.y = initialY + dy;
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },

    onResizeStart(e) {
      if (this.maximal) return;
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const initialWidth = this.width;
      const initialHeight = this.height;

      const onMouseMove = (event) => {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        this.width = Math.max(this.minWidth, initialWidth + dx);
        this.height = Math.max(this.minHeight, initialHeight + dy);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },

    onFocus() {
      this.zui.focus(this.uuid);
    },

  },

};
</script>

<style lang="sass">
.zui-window
  --zui-window--content-delta: 0px
  pointer-events: all
  position: absolute
  top: var(--zui-window--y)
  left: var(--zui-window--x)
  color: white
  width: var(--zui-window--width)
  height: var(--zui-window--height)
  z-index: 1000

  &--focus
    box-shadow: rgba(255, 255, 255, 0.75) 0px 0px 6pt
    z-index: 2000

  &--maximal
    top: 0
    left: 0
    --zui-window--width: 100% !important
    --zui-window--height: calc(100% - 3em) !important
    --zui-window--content-delta: 3em

  &--minimal
    transform: scale(0)
    --zui-window--y: 100vh !important
    --zui-window--x: 0 !important
    opacity: 0

  &--animation,
  &--animation &__content-frame
    transition: all .3s ease-in-out

  &__focus
    position: absolute
    inset: 0
    background: rgba(0, 0, 0, .15)
    cursor: pointer

  &__header
    padding: .2em
    display: flex
    background: var(--background--ui)

  &__handle
    width: calc(100% - 75px)
    cursor: move
    user-select: none
    display: flex
    align-items: center

  &__title
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    display: block
    text-overflow: ellipsis

  &__content-frame
    --zui-window--width-real: var(--zui-window--width)
    --zui-window--height-real: calc(var(--zui-window--height) - .8em - 25px + var(--zui-window--content-delta))
    width: var(--zui-window--width)
    height: calc(var(--zui-window--height) - .4em - 25px + var(--zui-window--content-delta))
    background: var(--color--dark)
    position: relative
    overflow: hidden

  &__content
    padding: .2em
    overflow: auto
    max-height: 100%
    box-sizing: border-box

  &__controls
    height: 100%
    font-size: .8em
    display: flex
    user-select: none

  &__left,
  &__right,
  &__min,
  &__max,
  &__close
    cursor: pointer
    width: 25px
    height: 25px
    display: flex
    justify-content: center
    align-items: center

  &__min:hover,
  &__max:hover
    background: rgba(150, 150, 150)

  &__close:hover
    background: var(--error, #F56C6C)

  &__resize-handle
    position: absolute
    right: 0
    bottom: 0
    width: 16px
    height: 16px
    cursor: se-resize
    background: transparent
    z-index: 10
    border-right: 2px solid rgba(255,255,255,.5)
    border-bottom: 2px solid rgba(255,255,255,.5)

  &--maximal &__resize-handle
    display: none

</style>