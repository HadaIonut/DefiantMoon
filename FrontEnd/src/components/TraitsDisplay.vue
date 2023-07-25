<script setup lang="ts">
import {Trait} from '../types/Actors'

export interface TraitsProps {
    traits: Trait[]
}

const props = defineProps<TraitsProps>()

const actions = props.traits.filter((trait) => trait.isAction)
const legendaryActions = props.traits.filter((trait) => trait.isLegendary)
const reactions = props.traits.filter((trait) => trait.isReaction)

const normalTraits = props.traits.filter((trait) => !trait.isAction && !trait.isLegendary && !trait.isReaction)

</script>

<template>
    <div>
        <div v-for="(action, index) in normalTraits" :key=index>
            {{action.name}} - {{action.description}}
        </div>
    </div>
    <div>
        <b>Actions</b>
        <div>
            <div v-for="(action, index) in actions" :key=index>
                {{action.name}} - {{action.description}}
            </div>
        </div>
    </div>
    <div>
        <b>Reactions</b>
        <div>
            <div v-for="(action, index) in reactions" :key=index>
                {{action.name}} - {{action.description}}
            </div>
        </div>
    </div>
    <div>
        <b>Legendary Actions</b>
        <div>
            <div v-for="(action, index) in legendaryActions" :key=index>
                {{action.name}} - {{action.description}}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
