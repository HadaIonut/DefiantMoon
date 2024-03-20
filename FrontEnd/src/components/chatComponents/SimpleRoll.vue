<script setup lang="ts">
import {computed} from 'vue'
import {useUsersStore} from 'src/stores/users'
import {ParsedResult} from 'src/types/Actors'

const props = defineProps<{
  roll: ParsedResult
  from: string
}>()

const usersStore = useUsersStore()

const colorClass = computed(() => {
  return props.from === usersStore.currentUser.id ? 'dark' : 'light'
})

</script>

<template>
  <div class="roll-container"  >
    <div class="roll-description" v-html="roll.description"/>
    <div :class="`roll roll-${colorClass}`">
      {{ roll?.original.replace('/r', '') }}
    </div>
    <div :class="`result result-${colorClass}`">
      {{ roll?.parsed }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.roll-container {
  display: flex;
  flex-direction: column;
}

.roll, .result {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;
}

.roll {
  cursor: pointer;
  border-radius: 6px 6px 0 0;

  &-dark {
    border-top: 1px solid $secondary;
    border-left: 1px solid $secondary;
    border-right: 1px solid $secondary;
    background: $darker-tertiary;
  }

  &-light {
    border-top: 1px solid $tertiary;
    border-left: 1px solid $tertiary;
    border-right: 1px solid $tertiary;
    background: $darker-secondary;
  }

}

.result {
  border-radius: 0 0 6px 6px;

  &-dark {
    background: $darker-tertiary;
    border: 1px solid $secondary;
  }

  &-light {
    background: $darker-secondary;
    border: 1px solid $tertiary;
  }
}

.roll-description {
  margin-bottom: 3px;
}

</style>
