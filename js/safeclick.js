'use strict'

var isSafeProcces = false

function onSafeClick(elSafe) {
    if (gGame.safeClicks === 0 || isSafeProcces || !gGame.isOn) return

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
