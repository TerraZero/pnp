<template lang="pug">
.page
  .card
    .card-image.card-defect(style="background-image: url('/images/sts-defect.jpg')")
    .card-image.card-ironclad(style="background-image: url('/images/sts-ironclad.jpg')")
    .card-image.card-silent(style="background-image: url('/images/sts-silent.jpg')")
    .card-image.card-watcher(style="background-image: url('/images/sts-watcher.jpg')")
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
  width: 700px
  aspect-ratio: 850/1180
  border: .5cm solid white
  box-sizing: border-box
  position: relative

.card-image
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-size: 60% 60%
  background-repeat: no-repeat

  &:after
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

.card-watcher
  clip-path: polygon(0 0, 45% 0, 55% 45%, 0 50%)

  &:after
    background: radial-gradient(circle, rgba(249,220,255,.1) 10%, rgba(80,41,96,.9) 100%)

.card-defect
  clip-path: polygon(45% 0, 100% 0, 100% 55%, 55% 45%)
  background-position: 100% 0

  &:after
    background: radial-gradient(circle, rgba(194,200,228,.1) 10%, rgba(10,22,61,.9) 100%)

.card-ironclad
  clip-path: polygon(0 50%, 55% 45%, 45% 100%, 0 100%)
  background-position: 0 110%

  &:after
    background: radial-gradient(circle, rgba(223,199,135,.1) 10%, rgba(70,44,9,.9) 100%)

.card-silent
  clip-path: polygon(55% 45%, 100% 55%, 100% 100%, 45% 100%)
  background-position: 100% 100%

  &:after
    background: radial-gradient(circle, rgba(103,219,166,.1) 10%, rgba(7,56,26,.9) 100%)

</style>