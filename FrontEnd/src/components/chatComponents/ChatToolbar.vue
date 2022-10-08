<script setup lang="ts">
import {Quill} from '@vueup/vue-quill'
import DiceD4Icon from '../customIcons/DiceD4Icon.vue'
import DiceD6Icon from '../customIcons/DiceD6Icon.vue'
import DiceD8Icon from '../customIcons/DiceD8Icon.vue'
import DiceD10Icon from '../customIcons/DiceD10Icon.vue'
import DiceD12Icon from '../customIcons/DiceD12Icon.vue'
import DiceD20Icon from '../customIcons/DiceD20Icon.vue'

const props = defineProps<{
    chatEditor: Quill
}>()

const diceButton = (diceType: string) => {
    const currentContent = props.chatEditor.getHTML()

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

            newChatValue = currentContent.replace(rollFormula, (_: string, formula: string) => `/r${formula} + 1${diceType}`)
        } else newChatValue = `${props.chatEditor.value.getHTML()}<p>/r 1${diceType}</p>`

        props.chatEditor.setHTML(newChatValue)
    } else props.chatEditor.setHTML(`<p>/r 1${diceType}</p>`)
}
</script>

<template>
    <div class="chat-toolbar">
        <div class="dice d4 toolbar-action" @click="() => diceButton('d4')">
            <DiceD4Icon size="26px"/>
        </div>
        <div class="dice d6 toolbar-action" @click="() => diceButton('d6')">
            <DiceD6Icon size="26px"/>
        </div>
        <div class="dice d8 toolbar-action" @click="() => diceButton('d8')">
            <DiceD8Icon size="26px"/>
        </div>
        <div class="dice d10 toolbar-action" @click="() => diceButton('d10')">
            <DiceD10Icon size="26px"/>
        </div>
        <div class="dice d12 toolbar-action" @click="() => diceButton('d12')">
            <DiceD12Icon size="26px"/>
        </div>
        <div class="dice d20 toolbar-action" @click="() => diceButton('d20')">
            <DiceD20Icon size="26px"/>
        </div>
        <div class="send-message toolbar-action">
            Send
            <font-awesome-icon icon="fa-solid fa-paper-plane"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
$chat-toolbar-height: 26px;

.chat-toolbar {
    display: flex;
    height: $chat-toolbar-height;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px dashed $background;
}

.toolbar-action {
    cursor: pointer;
    background: $darker-secondary;
    transition: background-color 0.2s ease-in-out;
    padding-left: 2px;
    padding-right: 2px;
    display: flex;
    justify-content: center;

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
</style>
