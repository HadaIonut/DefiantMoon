<script setup lang="ts">
import {Quill, QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import {onMounted, ref, Ref} from 'vue'
import {Window} from 'types/windows'
import {getRandomString} from '../../utils/utils'
import {WEBSOCKET_EMITABLE_EVENTS, WEBSOCKET_RECEIVABLE_EVENTS} from '../../websocket/events'
import {websocket} from '../../websocket/websocket'
import {ChatMessage} from 'types/ChatMessage'

const props = defineProps<{ windowData: Window }>()

const chatEditor: Ref<Quill> = ref('')
const chatMessages: Ref<ChatMessage[]> = ref([])
const uploadedImages: Ref<string[]> = ref([])
const messageDisplayArea: Ref<any | null> = ref(null)

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

const blobToBase64 = (blob: Blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise((resolve) => {
        reader.onloadend = () => {
            resolve(reader.result)
        }
    })
}

const scrollToBottom = (area: Ref<any>) => {
    area.value.ps.element.scrollTo(0, area.value.ps.element.scrollHeight)
}

const sendMessage = async () => {
    let currentContent = (chatEditor.value.getHTML() as string).trimEnd()
    currentContent = currentContent.replaceAll(/\n/g, '<br>')
    const images: File[] = await getImages()

    const imagesBlobs = await Promise.all(images.map(blobToBase64))

    websocket.sendMessage(WEBSOCKET_EMITABLE_EVENTS.CHAT_MESSAGE, {text: currentContent, images: imagesBlobs})
    chatEditor.value.setHTML('<p></p>')
    uploadedImages.value = []

    scrollToBottom(messageDisplayArea)
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
})

const pushToChat = (message: ChatMessage) => {
    chatMessages.value.push(message)
}

const onChatMessage: WebsocketMessageCallback = (chatMessage: ChatMessage) => {
    pushToChat(chatMessage)
}

type UserJoinOrLeftParams = {
    user: {
        username: string,
        id: string
    }
}

const onPLayerJoin: WebsocketMessageCallback = ({user}: UserJoinOrLeftParams) => {
    pushToChat({
        text: `${user.username} joined the chat`,
        images: [],
        timestamp: new Date(),
        username: 'System',
        userId: '0',
    })
}

const onPlayerLeft: WebsocketMessageCallback = ({user}: UserJoinOrLeftParams) => {
    pushToChat({
        text: `${user.username} left the chat`,
        images: [],
        timestamp: new Date(),
        username: 'System',
        userId: '0',
    })
}

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
