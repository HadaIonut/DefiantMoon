<script setup lang="ts">
import {Quill, QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import {nextTick, onMounted, ref, Ref} from 'vue'
import {Window} from 'types/windows'
import {getRandomString} from '../../utils/utils'
import {WEBSOCKET_RECEIVABLE_EVENTS} from '../../websocket/events'
import {websocket} from '../../websocket/websocket'
import {apiClient} from '../../api/index'
import {ChatMessage} from '../../api/generated/index'
import {useInfiniteScroll} from '@vueuse/core'

const props = defineProps<{ windowData: Window }>()

const chatEditor: Ref<Quill> = ref('')
const chatMessages: Ref<ChatMessage[]> = ref([])
const uploadedImages: Ref<string[]> = ref([])
const messageDisplayArea: Ref<any | null> = ref(null)

type UserJoinOrLeftParams = {
    user: {
        username: string,
        id: string
    }
}

const isImageUrl = (text: string): boolean => {
    return new RegExp('(http(s?):)([/|.|\\w|\\s|-])*\\.(?:jpg|gif|png)').test(text)
}

const handleImagePaste = (items: DataTransferItemList | undefined, event: ClipboardEvent) => {
    let blob = null

    Array.from(items as DataTransferItemList).forEach((item: DataTransferItem) => {
        if (item.type.indexOf('image') === 0) blob = item.getAsFile()
    })

    if (blob) {
        event.preventDefault()
        event.stopPropagation()

        const reader = new FileReader()
        reader.onload = (event: ProgressEvent) => {
            const result = (event?.target as FileReader)?.result
            if (result) uploadedImages.value.push(result.toString())
        }
        reader.readAsDataURL(blob)
    }
}

const handleTextPaste = (text: string, event: ClipboardEvent) => {
    if (isImageUrl(text)) {
        event.preventDefault()
        event.stopPropagation()

        uploadedImages.value.push(text)
    }
}

const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const res = await fetch(url)
    const buf = await res.arrayBuffer()
    return new File([buf], filename, {type: mimeType})
}

const getImages = async (): Promise<File[]> => {
    const out: File[] = []

    for (const image of uploadedImages.value) {
        const isBase64: boolean = image.includes('base64')
        const baseImageType: string = image.match(/data:([\w/]+);/)?.[1] ?? 'image/png'
        const urlImageType: string = image.match(/(http(s?):)([/|.|\w|\s|-])*\.(jpg|gif|png)/)?.[4] ?? 'png'
        const formattedUrlImageType: string = `image/${urlImageType}`

        out.push(await urlToFile(image, getRandomString(), isBase64 ? baseImageType : formattedUrlImageType))
    }

    return out
}

const scrollToBottom = (area: Ref<any>) => {
    area.value.ps.element.scrollTo(0, area.value.ps.element.scrollHeight)
}

const sendMessage = async () => {
    let currentContent = (chatEditor.value.getHTML() as string).trimEnd()
    currentContent = currentContent.replaceAll(/\n/g, '<br>')
    const images: File[] = await getImages()

    await apiClient.sendChatMessage(currentContent, images)
    chatEditor.value.setHTML('<p></p>')
    uploadedImages.value = []
}

const catchImagePasteEvent = () => {
    chatEditor.value.getQuill().root.addEventListener('paste', (event: ClipboardEvent) => {
        const eventData = event?.clipboardData

        handleImagePaste(eventData?.items, event)
        handleTextPaste(eventData?.getData?.('Text') ?? '', event)
    })
}

const catchEnterEvent = () => {
    chatEditor.value.getQuill().root.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            event.stopPropagation()
            sendMessage()
        }
    })
}

onMounted(() => {
    const keyboardModule = chatEditor.value.getQuill().getModule('keyboard')
    delete keyboardModule.bindings[13]

    catchImagePasteEvent()
    catchEnterEvent()

    apiClient.getChatMessages(Date.now()).then(({data}) => {
        chatMessages.value = data
        nextTick().then(() => scrollToBottom(messageDisplayArea))
    })
})

const pushToChat = (message: ChatMessage) => {
    chatMessages.value.push(message)
}

const onChatMessage: WebsocketMessageCallback = (chatMessage: ChatMessage) => {
    console.log(chatMessage)
    pushToChat(chatMessage)
    nextTick().then(() => scrollToBottom(messageDisplayArea))
}

const onPLayerJoin: WebsocketMessageCallback = ({user}: UserJoinOrLeftParams) => {
    pushToChat({
        content: [`${user.username} joined the chat`],
        images: [],
        timestamp: Date.now(),
        from: '0',
    })
}

const onPlayerLeft: WebsocketMessageCallback = ({user}: UserJoinOrLeftParams) => {
    pushToChat({
        content: [`${user.username} left the chat`],
        images: [],
        timestamp: Date.now(),
        from: '0',
    })
}

useInfiniteScroll(
    messageDisplayArea,
    () => {
        const lastTimeStamp = chatMessages.value[0].timestamp
        const scrollHeightBeforeAdd = messageDisplayArea.value.ps.element.scrollHeight

        apiClient.getChatMessages(Number(lastTimeStamp)).then(({data}) => {
            chatMessages.value.unshift(...data)
            nextTick().then(() => {
                const element = messageDisplayArea.value.ps.element
                element.scrollTop += (element.scrollHeight - scrollHeightBeforeAdd)
            })
        })
    },
    {distance: 200, direction: 'top'},
)

websocket.addEventListener(WEBSOCKET_RECEIVABLE_EVENTS.CHAT_MESSAGE, onChatMessage)
websocket.addEventListener(WEBSOCKET_RECEIVABLE_EVENTS.CHAT_PLAYER_JOIN, onPLayerJoin)
websocket.addEventListener(WEBSOCKET_RECEIVABLE_EVENTS.CHAT_PLAYER_LEFT, onPlayerLeft)

</script>

<template>
    <div :class="`chat ${props.windowData.isMinimized ? 'minimized' : ''}`">
        <div class="chat-content">
            <perfect-scrollbar ref="messageDisplayArea">
                <ChatMessageComponent v-for="message in chatMessages" :key="message.timestamp" :message="message"/>
            </perfect-scrollbar>
        </div>
        <div class="chat-input-container">
            <div class="image-send-gallery">
                <perfect-scrollbar>
                    <img v-for="(image, index) in uploadedImages" :key="index" :src="image" alt=""
                         class="uploaded-image">
                </perfect-scrollbar>
            </div>
            <ChatToolbar :chatEditor="chatEditor"/>
            <div class="chat-input">
                <QuillEditor theme="bubble" ref="chatEditor"/>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$chat-input-height: 100px;
$chat-toolbar-height: 26px;
$content-margin-bottom: 15px;
$parent-padding: 5px;

.chat {
    height: calc(100% - 2 * #{$parent-padding});
    transition: height 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.minimized {
    display: none;
}

.chat-content {
    display: flex;
    height: calc(100% - #{$chat-input-height} - 8px - 2 * #{$parent-padding});
    overflow: auto;
}

.chat-content > .ps {
    width: 100%;
}

.chat-input-container {
    border: 1px solid $background;
    background: $darker-secondary;
    border-radius: 10px;
    height: $chat-input-height;
    position: relative;
}

.chat-input {
    height: calc(100% - #{$chat-toolbar-height});
}

.image-send-gallery {
    position: absolute;
    top: -93px;
    left: 0;
    width: 100%;
}

.image-send-gallery > .ps {
    width: 100%;
    display: flex;
    grid-gap: 5px;
}

.uploaded-image {
    height: 80px;
    aspect-ratio: 1/1;
    object-fit: cover;
}
</style>

<style lang="scss">

.chat-content > .ps > .ps__rail-y > .ps__thumb-y {
    background-color: $tertiary;
    border: $accent 1px solid;
}

.image-send-gallery > .ps > .ps__rail-x > .ps__thumb-x {
    background-color: $tertiary;
    border: $accent 1px solid;
}

</style>
