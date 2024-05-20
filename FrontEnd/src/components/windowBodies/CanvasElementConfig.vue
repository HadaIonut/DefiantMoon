<script setup lang="ts">
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {ConfigurableCanvasElements} from 'src/types/PlayerArea'

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

const filteredKeyWords = ['id', 'type', 'networkupdate']

const currentEntry = (variable: keyof ConfigurableCanvasElements) => {
  const configElement = (playAreaStore[entityName])
  return configElement[props.bodyData.id][variable]
}

const containedAnyInArray = (testString: string, testArray: string[]): boolean => {
  return testArray.reduce((acc, cur) => acc || testString.toLowerCase().includes(cur), false)
}

const props = defineProps<{ bodyData: { id: string, name: string } }>()
const entityName = nameToObjectMap[props.bodyData.name]

const variablesToConfig = (Object.keys(playAreaStore[entityName][props.bodyData.id]) as (keyof ConfigurableCanvasElements)[])
  .filter((entry) => {
    const contained = !containedAnyInArray(entry, filteredKeyWords)
    const isObject = typeof currentEntry(entry) === 'object'

    return contained && !isObject
  })

const handleInputChange = (event: Event, changedField: string) => {
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

const getInputType = (variable: string) => {
  if (variable === 'color') return 'color'
  else if (typeof currentEntry(variable) === 'boolean') return 'checkbox'
  else return typeof currentEntry(variable)
}

const getValue = (variable: string) => {
  if (variable === 'color') return `#${currentEntry(variable).toString(16)}`
  else return currentEntry(variable)
}
</script>

<template>
  <labeledInput :labelText="variable" :inputType="getInputType(variable)" :value="getValue(variable)"
    v-for="variable in variablesToConfig" :key="variable"
    @input="(event: Event) => handleInputChange(event, variable)" />
</template>
