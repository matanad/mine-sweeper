'use strict'

var gPlacedMines = 0

function onManualMode(elManual) {
    const elBoard = document.querySelector('table')

    if (gGame.isManualMode && gPlacedMines > 0 && gPlacedMines < gLevel.MINES) {
        elManual.style.boxShadow = 'none'
        elBoard.style.cursor = 'pointer'
        elManual.style.opacity = '0.3'
        gGame.isFirstClick = true
        gGame.isManualMode = false
        return
    }

    if (!gGame.isFirstClick) return


    if (gGame.isManualMode) {
        gGame.isManualMode = false
        elManual.style.boxShadow = 'none'
        elBoard.style.cursor = 'pointer'
    } else {
        gGame.isManualMode = true
        elBoard.style.cursor = 'cell'
        elManual.style.boxShadow = '0px 0px 9px 4px #a400a8'
    }
}

function manualModeClicked(elCell, i, j) {
    gGame.isFirstClick = false
    gBoard[i][j].isMine = true
    gPlacedMines++

    if (gPlacedMines === gLevel.MINES) {
        console.log('DONE!');
        gGame.isManualMode = false
        setMinesNegsCount(gBoard)
        const elBoard = document.querySelector('table')
        elBoard.style.cursor = 'pointer'
        const elManual = document.querySelector('.manual')
        elManual.style.boxShadow = 'none'
        elManual.style.opacity = '0.3'
        elManual.style.cursor = 'default'

        return
    }


}

function renderManualBtnOnInit() {
    const elManual = document.querySelector('.manual')
    elManual.style.opacity = '1'
    elManual.style.cursor = 'pointer'
    gPlacedMines = 0
}