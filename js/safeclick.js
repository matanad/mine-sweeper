'use strict'

var isSafeProcces = false

function onSafeClick(elSafe) {
    if (gGame.safeClicks === 0 || isSafeProcces || !gGame.isOn) return
    if (gGame.isHint || gGame.isManualMode) return

    if (gGame.isFirstClick) {
        var randomFirstCell = {
            i: getRandomInt(0, gLevel.SIZE),
            j: getRandomInt(0, gLevel.SIZE)
        }
        firstMove(randomFirstCell.i, randomFirstCell.j)
        gGame.isFirstClick = false
    }

    isSafeProcces = true
    gGame.safeClicks--
    if (gGame.safeClicks === 0) {
        elSafe.style.opacity = '0'
        elSafe.style.cursor = 'default'
    }
    const emptyCells = getEmptyCells(gBoard)
    const randomCell = drawRandomCell(emptyCells)
    const elRandCell = document.querySelector(`#cell-${randomCell.i}-${randomCell.j}`)
    elRandCell.classList.add('safe-cell')
    const safeIntimeOut = setTimeout(() => {
        elRandCell.classList.remove('safe-cell')
        isSafeProcces = false
        clearTimeout(safeIntimeOut)
    }, 2000);
}
