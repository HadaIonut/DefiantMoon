<script setup lang="ts">
import {usePlayAreaStore} from 'src/stores/PlayArea'

type MapTypes = Record<string, 'canvasLights' | 'canvasPlayers' | 'canvasWalls'>

const nameToObjectMap: MapTypes = {
  'sourceLight': 'canvasLights',
  'player': 'canvasPlayers',
  'adjustableShape': 'canvasWalls',
  'wall': 'canvasWalls',
  'controlPoint': 'canvasWalls',
  'centerPoint': 'canvasWalls',
}
const filteredKeyWords = ['id', 'type']

const containedAnyInArray = (testString: string, testArray: string[]): boolean => {
  return testArray.reduce((acc, cur) => acc || testString.toLowerCase().includes(cur), false)
}

const props = defineProps<{ bodyData: {id: string, name: string} }>()
const playAreaStore = usePlayAreaStore()
const entityName = nameToObjectMap[props.bodyData.name]
const storeObject = playAreaStore[entityName][props.bodyData.id]

const variablesToConfig = Object.keys(storeObject)
  .filter((entry) => !containedAnyInArray(entry, filteredKeyWords)) as (keyof typeof storeObject)[]
</script>

<template>
  <div>
    <div v-for="variable in variablesToConfig" :key="variable">
      <div v-if="typeof storeObject[variable] !== 'object'">
        <span>{{variable}}</span>
        <input v-if="variable === 'color'" type="color" :value="`#${storeObject[variable].toString(16)}`">
        <input v-else-if="typeof storeObject[variable] === 'boolean'" type="checkbox" :value="storeObject[variable]">
        <input v-else :type="typeof storeObject[variable]" :value="storeObject[variable]">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
