<script setup lang="ts">
import {computed} from 'vue'
import {useUsersStore} from 'src/stores/users'
import {RolledTraitAction} from 'src/types/Actors'

const props = defineProps<{
  roll: RolledTraitAction
  from: string
}>()

const usersStore = useUsersStore()

const colorClass = computed(() => {
  return props.from === usersStore.currentUser.id ? 'dark' : 'light'
})


const rollClasses = computed(() => {
  if (props.from === usersStore.currentUser.id) return 'roll roll-dark toHit-roll'
  else return 'roll roll-light toHit-roll'
})

const toHitClasses = computed(() => {
  const typeClass = props.roll.toHit.parsed ? `result-${colorClass.value}` : `only-damage-${colorClass.value}`

  return `toHit-roll result ${typeClass}`
})

</script>

<template>
  <div v-if="(roll.complexRoll)">
    <div class="roll-description" v-html="roll.description"/>
    <div :class="rollClasses" v-if="roll.toHit.parsed">
      <div>To Hit</div>
      <div>{{roll.toHit.parsed}}</div>
    </div>
    <div :class="toHitClasses">
      <div>Damage </div>
      <span class="damage-container">
          <span :class="`damage-result damage-result-${colorClass}`" :key="index" v-for="(damage, index) in roll.damage" v-tooltip="{
            content: `${damage.roll.original.slice(3)}`,
            theme: 'info-tooltip'
          }">
            <span>
              {{damage.roll.parsed}}
            </span>
            <span>
              {{damage.damageType}}
            </span>
          </span>
        </span>
    </div>
  </div>
</template>

<style scoped lang="scss">

.result {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;

  &-dark {
    border: 1px solid $secondary;
    border-radius: 0 0 6px 6px;
    background: $darker-tertiary;
  }

  &-light {
    border: 1px solid $tertiary;
    border-radius: 0 0 6px 6px;
    background: $darker-secondary;
  }
}

.roll {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;

  &-light {
    cursor: pointer;
    border-top: 1px solid $tertiary;
    border-left: 1px solid $tertiary;
    border-right: 1px solid $tertiary;
    border-radius: 6px 6px 0 0;
    background: $darker-secondary;

  }

  &-dark {
    cursor: pointer;
    border-top: 1px solid $secondary;
    border-left: 1px solid $secondary;
    border-right: 1px solid $secondary;
    border-radius: 6px 6px 0 0;
    background: $darker-tertiary;

  }
}

.only-damage {
  border-radius: 6px;

  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;

  &-dark {
    border: 1px solid $secondary;
    background: $darker-tertiary;
  }

  &-light {
    border: 1px solid $tertiary;
    background: $darker-secondary;
  }
}

.toHit-roll {
  flex-direction: column;
  min-width: 150px;
  gap: 3px;
}


.damage-result {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &-light:not(:last-child) {
    border-right: 1px solid $tertiary;
    padding-right: 3px;
  }

  &-dark:not(:last-child) {
    border-right: 1px solid $secondary;
    padding-right: 3px;
  }
}

.damage-container {
  display: flex;
  gap: 3px;
}


.roll-description {
  margin-bottom: 3px;
}

</style>
