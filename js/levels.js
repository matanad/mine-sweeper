'use strict'

const BEGINNER = { SIZE: 4, MINES: 2 , level: 'beginner'}
const MEDIUM = { SIZE: 8, MINES: 14 , level: 'medium'}
const EXPERT = { SIZE: 12, MINES: 32 , level: 'expert'}
const SEVEN_BOOM = 'seven-boom'

var gLevel = BEGINNER

function onChangeLevel(elLevel, level) {

    switch (level) {
        case 'beginner':
            gLevel = BEGINNER
            document.querySelector('.medium').classList.remove('active')
            document.querySelector('.expert').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
        case 'medium':
            gLevel = MEDIUM
            document.querySelector('.beginner').classList.remove('active')
            document.querySelector('.expert').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
        case 'expert':
            gLevel = EXPERT
            document.querySelector('.beginner').classList.remove('active')
            document.querySelector('.medium').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
    }
}