<script setup lang="ts">
import {usePlayAreaStore} from 'src/stores/PlayArea'

const nameToObjectMap = {
  'sourceLight': 'canvasLights',
  'player': 'canvasPlayers',
  'adjustableShape': 'canvasWalls',
  'wall': 'canvasWalls',
  'controlPoint': 'canvasWalls',
  'centerPoint': 'canvasWalls',
}

const props = defineProps<{ bodyData: {id: string, name: string} }>()
const playAreaStore = usePlayAreaStore()
const storeObject = playAreaStore[nameToObjectMap[props.bodyData.name]][props.bodyData.id]
console.log(playAreaStore[nameToObjectMap[props.bodyData.name]])
console.log(props.bodyData.id)
</script>

<template>
  <div>there will be configs {{storeObject}}</div>
</template>

<style scoped lang="scss">

</style>
