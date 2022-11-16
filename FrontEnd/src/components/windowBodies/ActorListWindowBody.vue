<script setup lang="ts">
import {apiClient} from '../../api/index'
import {Actor} from 'types/Actors'
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useVirtualList} from '@vueuse/core'

const actors = ref<Actor[]>([])

const {list, containerProps, wrapperProps, scrollTo} = useVirtualList(
    actors,
    {
        itemHeight: 30,
    },
)

onMounted(async () => {
    // @ts-ignore
    actors.value = (await apiClient.getActors()).data.actors
})

</script>

<template>
    <perfect-scrollbar>
        <div class="list-wrapper" v-bind="containerProps">
            <div class="list-container" v-bind="wrapperProps">
                <div class="actor" v-for="actor in list" :key="actor.data.id" style="height: 30px">
                    {{ actor.data.name }}
                </div>
            </div>
        </div>
    </perfect-scrollbar>
</template>

<style scoped lang="scss">
.ps {
    height: 100%;
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
