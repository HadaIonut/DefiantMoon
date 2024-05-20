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
    <labeledInput inputType="string" labelText="Canvas Name" v-model="canvasName" />
    <labeledInput inputType="number" labelText="Ground Dimension" v-model="groundDimension" />
    <labeledInput inputType="number" labelText="Grid Size" v-model="gridSize" />
    <button class="submit-button" type="button" @click="() => submitCanvas()">Add Canvas</button>
  </div>
</template>

<style lang="scss">
.submit-button {
  padding: 10px;
  margin-left: 50%;
  transform: translateX(-50%);
  border: none;
  background: $tertiary;
  color: $text;
  font: bold;
  cursor: pointer;

  &:hover {
    background: $lighter-tertiary;
    transition: background 0.2s ease-in-out;
  }
}
</style>
