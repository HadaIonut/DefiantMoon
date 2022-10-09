<script setup lang="ts">
import {ChatMessage} from 'types/ChatMessage'
import {computed} from 'vue'
import {useUsersStore} from '../../stores/users'
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {Navigation, Pagination} from 'swiper'


const props = defineProps<{
    message: ChatMessage
}>()

const usersStore = useUsersStore()

const messageClasses = computed(() => {
    if (props.message.userId === usersStore.currentUser.id) return 'message message-right'
    else return 'message'
})

</script>

<template>
    <div class="message-row" :key="message.timestamp">
        <div :class="messageClasses">
            <div class="message-sender">
                {{props.message.username ?? 'undefined'}}
            </div>

            <div class="message-content " v-html="props.message.text"></div>

            <img :src="message.images[0]" alt="" v-if="message.images.length === 1" class="chat-image">

            <swiper
                :navigation="true"
                :pagination="true"
                :modules="[Navigation, Pagination]"
                class="mySwiper"
                v-if="message.images.length > 1">
                <swiper-slide v-for="(image, index) in message.images" :key="index" class="slide">
                    <img class="chat-image" :src="image" alt="">
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<style scoped lang="scss">

.chat-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mySwiper {
    width: 100%;
    height: 400px;
}

.message-row {
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
}

.message {
    background-color: $lighter-secondary;
    max-width: 70%;
    width: fit-content;
    padding: 10px;
    border-radius: 12px;
}

.message-right {
    align-self: end;
    background-color: $tertiary;
    color: $secondary;
}

.message-sender {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 5px;
}

.message-content {
    &::v-deep(*) {
        margin: 0;
        padding: 0;
        width: fit-content;
    }
}
</style>

<style lang="scss">
.swiper-pagination-bullet {
    opacity: ($tertiary, .5);
}

.swiper-pagination-bullet-active {
    background: $brighter-primary;
}

.swiper-button-next, .swiper-button-prev {
    color: $brighter-primary;
}
</style>
