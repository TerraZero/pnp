<template lang="pug">
.page
  .card
    .card-image.card-defect
      .card-image-assets
        .card-image-asset.card-image-asset__bg(style="background-image: url('/images/sts-defect.jpg')")
        .card-image-asset.card-image-asset__full(style="background-image: url('/images/defect/sts-defect--full.png')")
        .card-image-asset.card-image-asset__highlight(style="background-image: url('/images/defect/sts-defect--highlight.png')")
    .card-image.card-ironclad
      .card-image-assets
        .card-image-asset.card-image-asset__bg(style="background-image: url('/images/sts-ironclad.jpg')")
        .card-image-asset.card-image-asset__full(style="background-image: url('/images/ironclad/sts-ironclad--full.png')")
        .card-image-asset.card-image-asset__highlight(style="background-image: url('/images/ironclad/sts-ironclad--highlight.png')")
    .card-image.card-silent
      .card-image-assets
        .card-image-asset.card-image-asset__bg(style="background-image: url('/images/sts-silent.jpg')")
        .card-image-asset.card-image-asset__full(style="background-image: url('/images/silent/sts-silent--full.png')")
        .card-image-asset.card-image-asset__highlight(style="background-image: url('/images/silent/sts-silent--highlight.png')")
    .card-image.card-watcher
      .card-image-assets
        .card-image-asset.card-image-asset__bg(style="background-image: url('/images/sts-watcher.jpg')")
        .card-image-asset.card-image-asset__full(style="background-image: url('/images/watcher/sts-watcher--full.png')")
        .card-image-asset.card-image-asset__highlight(style="background-image: url('/images/watcher/sts-watcher--highlight.png')")
</template>

<script>

</script>

<style lang="sass">
.page
  width: 100vw
  height: 100vh
  margin: 0
  display: flex
  justify-content: center
  align-items: center
  background: black
  position: fixed
  top: 0
  left: 0

.card
  --pt: 53%
  --pr: 55%
  --pb: 47%
  --pl: 45%
  --pmx: 50%
  --pmy: 50%
  width: 700px
  aspect-ratio: 850/1180
  border: .5cm solid white
  box-sizing: border-box
  position: relative

.card-image
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0

.card-image-assets
  position: absolute
  width: 60%
  height: 60%

.card-image-asset
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-size: cover

.card-image-asset__bg

  &:before
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: var(--color-highlight-bg)

  &:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, var(--color-background-opacity, .7))

.card-image-asset__full
  filter: drop-shadow(0 0 var(--color-highlight-blur) var(--color-highlight)) drop-shadow(0 0 var(--color-highlight-blur) var(--color-highlight)) drop-shadow(0 0 var(--color-highlight-blur) var(--color-highlight)) drop-shadow(0 0 5px rgba(255, 255, 255, .5)) saturate(1.2) brightness(1.2) contrast(1.15)

.card-image-asset__highlight
  filter: drop-shadow(0 0 var(--color-highlight-blur) var(--color-light)) saturate(var(--color-highlight-saturation, 1.5)) contrast(var(--color-highlight-contrast, 1.2))



.card-watcher
  --color-light: rgba(255,255,0)
  --color-middle: rgba(76,127,74)
  // --color-highlight: rgb(100, 177, 98)
  --color-highlight: rgb(120,30,230)
  --color-highlight-bg: rgba(80,41,96,.3)
  --color-highlight-blur: 1px
  --color-highlight-saturation: 1.5
  --color-highlight-contrast: 1.8

  clip-path: polygon(0 0, var(--pt) 0, var(--pmx) var(--pmy), 0 var(--pl))

  .card-image-assets
    left: 0
    top: 0

  // &:after
    // background: radial-gradient(circle, rgba(249,220,255,.1) 10%, rgba(80,41,96,.9) 100%)

.card-defect
  --color-light: rgba(255,255,0)
  --color-middle: rgba(76,127,74)
  // --color-highlight: rgb(100, 177, 98)
  --color-highlight: rgb(110,120,255)
  --color-highlight-bg: rgba(10,22,61,.3)
  --color-highlight-blur: 1px
  --color-highlight-saturation: 1.5
  --color-highlight-contrast: 1.8

  clip-path: polygon(var(--pt) 0, 100% 0, 100% var(--pr), var(--pmx) var(--pmy))

  .card-image-assets
    right: -20px
    top: 0

  // &:after
  //   background: radial-gradient(circle, rgba(194,200,228,.1) 10%, rgba(10,22,61,.9) 100%)

.card-ironclad
  --color-light: rgba(217,107,74)
  --color-middle: rgba(76,127,74)
  // --color-highlight: rgb(100, 177, 98)
  --color-highlight: rgb(255, 50, 50)
  --color-highlight-bg: rgba(70,44,9,.3)
  --color-highlight-blur: 2px
  --color-background-opacity: .4

  clip-path: polygon(0 var(--pl), var(--pmx) var(--pmy), var(--pb) 100%, 0 100%)

  .card-image-assets
    left: 0
    bottom: -5px
    width: 57%
    height: 57%

  // &:after
  //   background: radial-gradient(circle, rgba(223,199,135,.1) 10%, rgba(70,44,9,.9) 100%)

.card-silent
  --color-light: rgba(103,219,166)
  --color-middle: rgba(76,127,74)
  // --color-highlight: rgb(100, 177, 98)
  --color-highlight: rgb(35, 225, 0)
  --color-highlight-bg: rgba(103,219,166,.3)
  --color-highlight-blur: 1px


  clip-path: polygon(var(--pmx) var(--pmy), 100% var(--pr), 100% 100%, var(--pb) 100%)

  .card-image-assets
    right: -40px
    bottom: -10px

</style>