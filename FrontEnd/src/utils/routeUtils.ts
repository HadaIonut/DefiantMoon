import {rtFetch} from './fetchOverRTC'
import {parse} from 'dice-parsering-library'

export const sendDiceRoll = async (diceExpression: string) => {
  await sendChatMessage(`<p>/r ${diceExpression}</p>`, [])
}

const rollTheDice = (message: string) => {
  const tempHTML = document.createElement('div')
  tempHTML.innerHTML = message
  const body = tempHTML.querySelector('p')
  const bodyText = body?.innerText ?? message
  const parsedDice = parse(bodyText)

  if (parsedDice.original === parsedDice.parsed) return parsedDice.original
  return JSON.stringify(parsedDice)
}

export const sendChatMessage = async (message: string, images: File[]) => {
  await rtFetch({
    route: '/api/chat/messages',
    method: 'POST',
    contentType: 'multipart/form-data',
    body: {
      message: rollTheDice(message),
      images,
    },
  })
}
