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
  drawCards(5, playersSide.player1)
  drawCards(5, playersSide.computer)
}

init()