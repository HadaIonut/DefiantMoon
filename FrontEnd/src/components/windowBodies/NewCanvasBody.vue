<script setup lang="ts">
import { useCanvasCollectionStore } from 'src/stores/CanvasCollection'
import { usePlayAreaStore } from 'src/stores/PlayArea'
import { ref } from 'vue'

export interface NewCanvasBody {
  bodyData: {
    initialName?: string,
    initialGroundDimension?: number,
    initialGridSize?: number,
    bodyId?: string
  }
}

const props = defineProps<NewCanvasBody>()

const canvasCollectionStore = useCanvasCollectionStore()
const playAreaStore = usePlayAreaStore()
const canvasName = ref(props.bodyData.initialName ?? '')
const groundDimension = ref(props.bodyData.initialGroundDimension ?? 1000)
const gridSize = ref(props.bodyData.initialGridSize ?? 20)

const submitCanvas = async () => {
  if (props.bodyData.bodyId) {
    canvasCollectionStore.updateCanvas(props.bodyData.bodyId, canvasName.value, groundDimension.value, gridSize.value)
  } else {
    canvasCollectionStore.createNewCanvas(canvasName.value, groundDimension.value, gridSize.value)
    playAreaStore.loadCanvas(canvasCollectionStore.active)
  }
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
