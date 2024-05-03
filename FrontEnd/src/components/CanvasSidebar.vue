<script setup lang="ts">
import {Vector3} from 'three'
import {getRandomInt} from 'src/utils/CanvasUtils'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {computed} from 'vue'

const playAreaStore = usePlayAreaStore()

const drawModeToggleFunction = (event: MouseEvent) => {
  event.stopPropagation()
  playAreaStore.toggleDrawMode()
}

const addRandomLight = () => {
  playAreaStore.addLightToCanvas({
    position: new Vector3(getRandomInt(500), 10, getRandomInt(500)),
  })
}

const addRandomPlayer = () => {
  playAreaStore.addPlayerToCanvas(new Vector3(getRandomInt(500), 10, getRandomInt(500)))
}

const drawModeClass = computed(() => {
  return playAreaStore.drawMode ? 'marker-active' : 'marker-inactive'
})

</script>

<template>
  <div class="element-container">
    <div class="element activity-marker-container">
      <div @click="drawModeToggleFunction">wall draw</div>
      <span :class="`activity-marker ${drawModeClass}`"/>
    </div>
    <div class="element">
      <div @click="addRandomLight">add random light</div>
    </div>
    <div class="element">
      <div @click="addRandomPlayer">add random player</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.element-container {
  position: absolute;
  top: 100px;
  left: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.element {

  padding: 5px;
  background: $tertiary;
  border: 1px solid $accent;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: mix($tertiary, $secondary, 50%);
    transition: background-color 0.1s ease-in-out;
  }
}

.activity-marker-container {
  position: relative;
}

.activity-marker {
  position: absolute;
  width: 0;
  height: 2px;
  background-color: $text;
  border-radius: 12px;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);

  transition: width 0.2s ease-in-out;
}

.marker-active {
  width: 40%;
}

.marker-inactive {
  width: 3px;
}

</style>
