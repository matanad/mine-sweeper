'use strict'

const HINT = '<img src="img/lightOff.png">'
const HINT_ACTIVE = '<img src="img/lightOn.png">'


function onHintClicked(elHint) {
    if (gGame.isManualMode) return
    if (!gGame.isOn) return
    if (gGame.hints === 0) return
    gGame.isHint = !gGame.isHint
    renderHints()

}

function onHintCellCLicked(iPos, jPos) {
    if (gGame.isFirstClick) {
        firstMove(iPos, jPos)
        gGame.isFirstClick = false
    }
    gGame.isHint = !gGame.isHint
    const revealedCells = []
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            if (gBoard[i][j].isShown) continue
            const currCell = gBoard[i][j]
            const elExpanded = document.querySelector(`#cell-${i}-${j}`)
            elExpanded.classList.add('clicked')
            elExpanded.innerHTML = currCell.minesAroundCount
            elExpanded.style.color = currCell.color
            if (currCell.minesAroundCount === 0) {
                elExpanded.innerHTML = EMPTY
            }
            if (currCell.isMine) elExpanded.innerHTML = MINE
            revealedCells.push(elExpanded)
        }
    }
    const unRevealeInterval = setInterval(() => {
        for (var i = 0; i < revealedCells.length; i++) {
            revealedCells[i].classList.remove('clicked')
            revealedCells[i].innerHTML = EMPTY
        }
        clearInterval(unRevealeInterval)
        gGame.hints--
        renderHints()
    }, 1000);
}

function renderHints() {
    const elHint = document.querySelector('.hint-container')
    var hintsStr = ''
    for (var i = 1; i <= gGame.hints; i++) {
        if (i === gGame.hints) {
            if (gGame.isHint) hintsStr += HINT_ACTIVE
            else hintsStr += HINT
        } else hintsStr += HINT
    }
    elHint.innerHTML = hintsStr
}