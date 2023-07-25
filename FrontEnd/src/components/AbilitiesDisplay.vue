<script setup lang="ts">
import {Actor} from '../types/Actors'

export interface AbilitiesDisplayProps {
    actor: Actor
}

const props = defineProps<AbilitiesDisplayProps>()
const abilties = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

</script>

<template>
<div style="display: flex; justify-content: space-evenly">
    <div v-for="ability in abilties" :key=ability>
        <div>
            {{ability}}
        </div>
        <div style="text-align: center">
            {{props.actor[ability.toLowerCase()]}}
        </div>
    </div>
</div>
</template>

<style scoped lang="scss">

</style>
