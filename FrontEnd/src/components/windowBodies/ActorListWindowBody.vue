<script setup lang="ts">
import {apiClient} from '../../api/index'
import {Actor} from 'types/Actors'
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useVirtualList} from '@vueuse/core'

const actors = ref<Actor[]>([])

const {list, containerProps, wrapperProps} = useVirtualList(
    actors,
    {
        itemHeight: 70,
    },
)

onMounted(async () => {
    // @ts-ignore
    actors.value = (await apiClient.getActors()).data.actors
})

</script>

<template>
    <div class="list-wrapper" v-bind="containerProps">
        <div class="list-container" v-bind="wrapperProps">
            <div class="actor clickable" v-for="actor in list" :key="actor.data.id">
                <div class="actorRow">
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
