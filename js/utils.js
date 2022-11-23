'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell
            if (mat[i][j].isShown) {
                cell = mat[i][j].isMine ? MINE : mat[i][j].minesAroundCount
            } else {
                cell = EMPTY
            }
            const className = `cell`
            const id = `cell-${i}-${j}`

            strHTML += `<td class="${className}" id="${id}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this)">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`#cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomInt(min, max, isInclusive = false) {
    const inclusive = isInclusive ? 1 : 0
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + inclusive) + min)
}

function getEmptyCells(board) {
    const cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                cells.push({ i, j })
            }
        }
    }
    return cells[0] ? cells : null
}

function drawCell(cells) {
    var randIdx = getRandomInt(0, cells.length)
    return cells.splice(randIdx, 1)[0]
}

function getCellLocation(elCell) {
    var i = +elCell.id.split('-')[1]
    var j = +elCell.id.split('-')[2]
    return { i, j }

}

