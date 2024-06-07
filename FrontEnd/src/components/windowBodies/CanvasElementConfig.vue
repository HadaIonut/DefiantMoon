<script setup lang="ts">
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {CanvasLightProperties, CanvasPlayerProperties, CanvasWallProperties} from 'src/types/PlayerArea'

type EntityKey = 'sourceLight' | 'player' | 'adjustableShape' | 'wall' | 'controlPoint' | 'centerPoint'
type EntityName = 'canvasLights' | 'canvasPlayers' | 'canvasWalls'
type MapTypes = Record<EntityKey, EntityName>

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

// TODO: move to utils
type ValueOf<T> = T[keyof T];
type SecondParameter<T> = T extends (param1: any, param2: infer P) => any ? P : never;
type KeysOfUnion<T> = T extends any ? keyof T : never;

type Variables = SecondParameter<ValueOf<typeof objectToFunctionMap>>;
type VariableName = KeysOfUnion<Variables>;

const currentEntry = (variable: VariableName) => {
  return (playAreaStore[entityName][props.bodyData.id] as Record<VariableName, any>)[variable]
}

const containedAnyInArray = (testString: string, testArray: string[]): boolean => {
  return testArray.reduce((acc, cur) => acc || testString.toLowerCase().includes(cur), false)
}

const props = defineProps<{ bodyData: { id: string, name: EntityKey } }>()
const entityName = nameToObjectMap[props.bodyData.name]

const variablesToConfig = (Object.keys(playAreaStore[entityName][props.bodyData.id]) as VariableName[])
  .filter((entry) => {
    const contained = !containedAnyInArray(entry, filteredKeyWords)
    const isObject = typeof currentEntry(entry) === 'object'

    return contained && !isObject
  })

const handleInputChange = (event: Event, changedField: VariableName) => {
  const target = event.target as HTMLInputElement
  let newValue
  switch (target.type) {
  case 'number':
    newValue = Number(target.value)
    break
  case 'color':
    // @ts-ignore
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

const getInputType = (variable: VariableName) => {
  if (variable === 'color') return 'color'
  else if (typeof currentEntry(variable) === 'boolean') return 'checkbox'
  else return typeof currentEntry(variable)
}

const getValue = (variable: VariableName) => {
  if (variable === 'color') return `#${currentEntry(variable).toString(16)}`
  else return currentEntry(variable)
}
</script>

<template>
  <labeledInput :labelText="variable.toString()" :inputType="getInputType(variable)" :value="getValue(variable)"
                v-for="variable in variablesToConfig" :key="variable"
                @input="(event: Event) => handleInputChange(event, variable)"/>
</template>
