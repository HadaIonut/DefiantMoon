<script setup lang="ts">
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {computed, toRaw} from 'vue'

type MapTypes = Record<string, 'canvasLights' | 'canvasPlayers' | 'canvasWalls'>

const playAreaStore = usePlayAreaStore()

const nameToObjectMap: MapTypes = {
  'sourceLight': 'canvasLights',
  'player': 'canvasPlayers',
  'adjustableShape': 'canvasWalls',
  'wall': 'canvasWalls',
  'controlPoint': 'canvasWalls',
  'centerPoint': 'canvasWalls',
}

const objectToFunctionMap = {
  'canvasLights': playAreaStore.updateLight,
  'canvasWalls': playAreaStore.updateWall,
  'canvasPlayers': playAreaStore.updatePlayer,
}

const filteredKeyWords = ['id', 'type', 'networkUpdate']

const currentEntry = (variable: any) => {
  // @ts-ignore
  return playAreaStore[entityName][props.bodyData.id][variable]
}

const containedAnyInArray = (testString: string, testArray: string[]): boolean => {
  return testArray.reduce((acc, cur) => acc || testString.toLowerCase().includes(cur), false)
}

const props = defineProps<{ bodyData: {id: string, name: string} }>()
const entityName = nameToObjectMap[props.bodyData.name]

const variablesToConfig = Object.keys(playAreaStore[entityName][props.bodyData.id])
  .filter((entry) => !containedAnyInArray(entry, filteredKeyWords))

const handleInputChange = (event: InputEvent, changedField: string) => {
  const target = event.target as HTMLInputElement
  let newValue
  switch (target.type) {
  case 'number':
    newValue = Number(target.value)
    break
  case 'color':
    newValue = parseInt(Number(`0${target.value.replace('#', 'x')}`), 10)
    break
  default:
    newValue = target.value
    break
  }

  // @ts-ignore
  objectToFunctionMap[entityName](props.bodyData.id, {
    ...playAreaStore[entityName][props.bodyData.id],
    [changedField]: newValue,
  })
}

</script>

<template>
  <div>
    <div v-for="variable in variablesToConfig" :key="variable">
      <div v-if="typeof currentEntry(variable) !== 'object'">
        <span>{{variable}}</span>
        <input v-if="variable === 'color'" type="color" :value="`${currentEntry(variable).toString(16)}`"
                @input="event => handleInputChange(event, variable)">
        <input v-else-if="typeof currentEntry(variable) === 'boolean'" type="checkbox" :value="currentEntry(variable)"
               @input="event => handleInputChange(event, variable)">
        <input v-else :type="typeof currentEntry(variable)" :value="currentEntry(variable)"
               @input="event => handleInputChange(event, variable)">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
