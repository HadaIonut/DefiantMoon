<script setup lang="ts">
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useVirtualList, UseVirtualListItem} from '@vueuse/core'
import {useWindowsStore} from 'src/stores/windows'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {getCenteredWindow} from 'src/utils/utils'
import {Actor} from 'src/types/Actors'


const actors = ref<Actor[]>([])
const windowStore = useWindowsStore()

const {list, containerProps, wrapperProps} = useVirtualList(
  actors,
  {
    itemHeight: 70,
  },
)

onMounted(async () => {
  const actorsRes = (await rtFetch({
    route: `/api/actors/all`,
    method: 'GET',
  }))

  actors.value = actorsRes.data.actors
})


const actorClickHandler = (clickedObject: UseVirtualListItem<Actor>, event: MouseEvent) => {
  windowStore.addNewWindow(`monsterWindow-${clickedObject.data.id}`,
    {
      componentType: 'SimpleHeader',
      componentData: clickedObject.data.name,
    },
    {
      componentType: 'MonsterWindow',
      componentData: clickedObject.data,
    },
    {
      icon: 'shirt', actionName: 'MonsterWindow',
    },
    getCenteredWindow(500, 500),
  )
}

</script>

<template>
  <div class="list-wrapper" v-bind="containerProps">
    <div class="list-container" v-bind="wrapperProps">
      <div class="actor clickable" v-for="actor in list" :key="actor.data.id">
        <div class="actorRow" @click="(event) => actorClickHandler(actor, event)">
          <img src="../../assets/externalIcons/defaultIcon.svg" class="portrait">
          <div style="height: fit-content">
            {{ actor.data.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-wrapper {
  height: 99%;
}

.portrait {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 5px;
}

.actorRow {
  display: flex;
  align-items: center;
  height: 70px;

  &:hover {
    background: $darker-secondary;
    padding-left: 5px;
    transition: background-color 90ms ease-in-out, padding-left 100ms ease-in;
  }
}
</style>

<style lang="scss">
.ps > .ps__rail-y > .ps__thumb-y {
  background-color: $tertiary;
  border: $accent 1px solid;
}

.ps > .ps__rail-x > .ps__thumb-x {
  background-color: $tertiary;
  border: $accent 1px solid;
}

</style>
