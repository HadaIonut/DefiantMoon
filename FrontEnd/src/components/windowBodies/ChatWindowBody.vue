<script setup lang="ts">
import {Quill, QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import DiceD4Icon from '../customIcons/DiceD4Icon.vue'
import DiceD6Icon from '../customIcons/DiceD6Icon.vue'
import DiceD8Icon from '../customIcons/DiceD8Icon.vue'
import DiceD10Icon from '../customIcons/DiceD10Icon.vue'
import DiceD12Icon from '../customIcons/DiceD12Icon.vue'
import DiceD20Icon from '../customIcons/DiceD20Icon.vue'
import {onMounted, ref, Ref} from 'vue'

const chatEditor: Ref<Quill> = ref('')
const uploadedImages: Ref<string[]> = ref([])

const diceButton = (diceType: string) => {
    const currentContent = chatEditor.value.getHTML()

    const hasOtherText: boolean = !!currentContent.match(/<p>([/ \w\n+]+)<\/p>/)?.[1]
    const hasOnlyBR: boolean = currentContent === '<p><br></p>'
    const append: boolean = hasOtherText && !hasOnlyBR
    const hasRollFormula: boolean = currentContent.includes('/r')
    const currentDiceRegex = new RegExp('([0-9]+' + diceType + ')')
    const containsThisDiceType: boolean = !!currentContent.match(currentDiceRegex)?.[1]

    if (append) {
        let newChatValue: string = ''

        if (hasRollFormula && containsThisDiceType) {
            const diceRegex = new RegExp(`([0-9]+)${diceType}`)

            newChatValue = currentContent.replace(diceRegex, (_: string, diceCount: string) => (Number(diceCount) + 1) + diceType)
        } else if (hasRollFormula) {
            const rollFormula = new RegExp('/r((?: ?\\dd\\d+ ?\\+?)+)')

            newChatValue = currentContent.replace(rollFormula, (_:string, formula:string) => `/r${formula} + 1${diceType}`)
        } else newChatValue = `${chatEditor.value.getHTML()}<p>/r 1${diceType}</p>`

        chatEditor.value.setHTML(newChatValue)
    } else chatEditor.value.setHTML(`<p>/r 1${diceType}</p>`)
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

onMounted(() => {
    chatEditor.value.getQuill().root.addEventListener('paste', (event: ClipboardEvent) => {
        const eventData = event?.clipboardData

        handleImagePaste(eventData?.items, event)
        handleTextPaste(eventData?.getData?.('Text') ?? '', event)
    })
})

</script>

<template>
    <div class="chat">
        <div class="chat-content">

        </div>
        <div class="chat-input-container">
            <div class="chat-toolbar">
                <div class="dice d4 toolbar-action" @click="() => diceButton('d4')">
                    <DiceD4Icon size="28px"/>
                </div>
                <div class="dice d6 toolbar-action" @click="() => diceButton('d6')">
                    <DiceD6Icon size="28px"/>
                </div>
                <div class="dice d8 toolbar-action" @click="() => diceButton('d8')">
                    <DiceD8Icon size="28px"/>
                </div>
                <div class="dice d10 toolbar-action" @click="() => diceButton('d10')">
                    <DiceD10Icon size="28px"/>
                </div>
                <div class="dice d12 toolbar-action" @click="() => diceButton('d12')">
                    <DiceD12Icon size="28px"/>
                </div>
                <div class="dice d20 toolbar-action" @click="() => diceButton('d20')">
                    <DiceD20Icon size="28px"/>
                </div>
                <div class="send-message toolbar-action">
                    Send <font-awesome-icon icon="fa-solid fa-paper-plane" />
                </div>
            </div>
            <div class="chat-input">
                <QuillEditor theme="bubble" ref="chatEditor" />
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
    height: 100%;
}
.chat-content {
    border: 1px solid $background;
    margin-bottom: $content-margin-bottom;
    height: calc(100% - #{$chat-input-height} - #{$content-margin-bottom} - #{$parent-padding});
}
.chat-toolbar {
    display: flex;
    height: $chat-toolbar-height;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px dashed $background;
}
.chat-input-container {
    border: 1px solid $background;
    background: $darker-secondary;
    border-radius: 10px;
    height: $chat-input-height;
}
.chat-input {
    height: calc(100% - #{$chat-toolbar-height});
}
.toolbar-action {
    cursor: pointer;
    background: $darker-secondary;
    transition: background-color 0.2s ease-in-out;
    padding-left: 2px;
    padding-right: 2px;

    &:hover {
        background: $darker2-secondary;
    }
}

.send-message {
    margin-left: auto;
    user-select: none;
    height: 100%;
    display: flex;
    align-items: center;
    grid-gap: 5px;
}

.dice {
    height: 26px;
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
