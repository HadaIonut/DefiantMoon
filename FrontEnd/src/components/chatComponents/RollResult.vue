<script setup lang="ts">
import {ParsedResult, RolledTraitAction} from 'types/Actors'
import {computed} from 'vue'
import {useUsersStore} from '../../stores/users'

const props = defineProps<{
  roll: ParsedResult | RolledTraitAction
  messageFrom: string
}>()

const usersStore = useUsersStore()

const colorClass = computed(() => {
  return props.messageFrom === usersStore.currentUser.id ? 'dark' : 'light'
})


</script>

<template>
  <div>
    <ComplexRoll :roll="roll" v-if="(roll.complexRoll)" :from="messageFrom"/>
    <SimpleRoll :roll="roll" v-else-if="typeof roll.parsed === 'number'" :from="messageFrom"/>
    <div v-else>
      <InlineRoll :roll="roll" :theme="colorClass" :isInChat="true"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
