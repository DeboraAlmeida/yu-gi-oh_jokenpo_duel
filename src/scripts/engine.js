import cards from "../assets/data/cards.json" assert { type: 'json' }
const cardData = cards.cardData
const playersSide = cards.playersSides

const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points')
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card')
  },
  actions: {
    button: document.getElementById('next-duel')
  }
}

const getRandomCardId = async () => {
  return Math.floor(Math.random() * cardData.length)
}

const removeAllCardsImages = async () => {
  function removeCards(cardBox) {
    let cards = document.getElementById(`${cardBox}`)
    let imgElements = cards.querySelectorAll('img')
    imgElements.forEach(img => img.remove())
  }
  
  removeCards(playersSide.computer)
  removeCards(playersSide.player1)
}

const playAudio = async (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.play()
}

const checkDuelResults = async (playerCardId, computerCardId) => {
  let duelResults = "Draw"
  let playerCard = cardData[playerCardId]

  if(playerCard.WinOf.includes(computerCardId)) {
    duelResults = 'You win!'
    await playAudio('win')
    state.score.playerScore++
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'You lose!'
    await playAudio('lose')
    state.score.computerScore++
  }

  return duelResults
}

const drawButton = async (text) => {
  state.actions.button.innerText = text
  state.actions.button.style.display = 'block'
}

const updateScore = async () => {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

const resetCardDetails = () => {
  state.cardSprites.name.innerText = 'Select'
  state.cardSprites.type.innerText = 'Your card'
  state.cardSprites.avatar.src = ''
}

const showCardFieldsImages = (value) => {
  if (value) {
    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'
  } else { 
    state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'
  }
}

const drawCardsInFields = (idCard, computerCardId) => {
  state.fieldCards.player.src = cardData[idCard].img
  state.fieldCards.computer.src = cardData[computerCardId].img
}

const setCardsField = async (idCard) => {
  await removeAllCardsImages()
  let computerCardId = await getRandomCardId()
  drawCardsInFields(idCard, computerCardId)
  showCardFieldsImages(true)
  resetCardDetails()

  let duelResuts = await checkDuelResults(idCard, computerCardId)

  await updateScore()
  await drawButton(duelResuts)
}

const drawSelectedCard = async (idCard) => {
  state.cardSprites.avatar.src = cardData[idCard].img
  state.cardSprites.name.innerText = cardData[idCard].name
  state.cardSprites.type.innerText = `Attribute: ${cardData[idCard].type}`
}

const createCardImage = async (idCard, fieldSide) => {
  const cardImage = document.createElement('img')
  cardImage.classList.add('card')
  cardImage.setAttribute('src', './src/assets/icons/card-back.png')
  cardImage.setAttribute('data-id', idCard)

  if (fieldSide === playersSide.player1) {
    cardImage.classList.add('card-player')
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'))
    })
    cardImage.addEventListener('mouseover', () => {
      drawSelectedCard(idCard)
    })
  }

  return cardImage
}

const drawCards = async (cardNumber, fieldSide) => {
  for (let i=0; i < cardNumber; i++){
    const randomCardId = await getRandomCardId()
    const cardImage = await createCardImage(randomCardId, fieldSide)
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

const init = () => {
  showCardFieldsImages(false)
  drawCards(5, playersSide.player1)
  drawCards(5, playersSide.computer)

  const bgm = document.getElementById('bgm')
  bgm.play()
}

init()

state.actions.button.addEventListener('click', () => {
  state.cardSprites.avatar.src = ''
  state.actions.button.style.display = 'none'
  showCardFieldsImages(false)
  init()
})