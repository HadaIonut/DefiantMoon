<script setup lang="ts">

import {Actor} from '../../types/Actors'

export interface MonsterWindowProps {
    bodyData?: Actor
}

const props = defineProps<MonsterWindowProps>()
console.log(props.bodyData?.name)

</script>

<template>
    <div style="overflow: auto">monster window test {{JSON.stringify(props.bodyData)}} </div>
</template>

<style>

</style>
