<script setup lang="ts">
import {useCanvasCollectionStore} from 'src/stores/CanvasCollection'
import {ref} from 'vue'

const canvasCollectionStore = useCanvasCollectionStore()
const canvasName = ref('')
const groundDimension = ref(1000)
const gridSize = ref(20)

const submitCanvas = async () => {
  canvasCollectionStore.createNewCanvas(canvasName.value, groundDimension.value, gridSize.value)
}


</script>
<template>
  <div>
    <div class="element">
      <span>
        Canvas Name
      </span>
      <input v-model="canvasName" type="text">
    </div>

    <div class="element">
      <span>
        Ground Dimension
      </span>
      <input v-model="groundDimension" type="number">
    </div>

    <div class="element">
      <span>
        Grid Size
      </span>
      <input v-model="gridSize" type="number">
    </div>
    <button type="button" @click="() => submitCanvas()">Add Canvas</button>
  </div>
</template>
<style></style>
