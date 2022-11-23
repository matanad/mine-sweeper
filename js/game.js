'use strict'

const EMPTY = ' '
const MINE = '💣'
const FLAG = '🚩'
const LIVE = '❤️'
const NORMAL = '😃'
const LOSE = '🤯'
const WIN = '😎'

var gBoard
var gLevel = { SIZE: 4, MINES: 2 }
var gGame
var gStartTime
var gTimerInterval

function initGame() {
    if (gTimerInterval) clearInterval(gTimerInterval)
    document.querySelector('h2 .time').innerText = '000'
    gGame = {
        isOn: true,
        isFirstClick: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
    const elSmile = document.querySelector('.smile')
    elSmile.innerText = NORMAL
    const elLives = document.querySelector('.lives')
    elLives.innerText = LIVE
    elLives.innerText += LIVE
    elLives.innerText += LIVE
    // 
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                // color,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function cellClicked(elCell, i, j) {
    // if the cell already shown or marked or game is not on - do nothing
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked || !gGame.isOn) return

    const elSmile = document.querySelector('.smile')
    gBoard[i][j].isShown = true
    gBoard[i][j].isMarked = true

    // first move
    if (gGame.isFirstClick) {
        locateMines(gBoard, i, j)

        for (var iPos = 0; iPos < gLevel.SIZE; iPos++) {
            for (var jPos = 0; jPos < gLevel.SIZE; jPos++) {
                gBoard[iPos][jPos].minesAroundCount = setMinesNegsCount(gBoard, iPos, jPos)
            }
        }
        gGame.isFirstClick = false
        startTimer()

        // not first move and mine clicked
    } else if (gBoard[i][j].isMine) {
        elSmile.innerText = LOSE
        gBoard[i][j].isShown = true
        gBoard[i][j].isMarked = true
        elCell.innerText = MINE
        onMineClick()
        elCell.style.backgroundColor = '#c33c54'
        if (checkGameOver()) {
            gGame.isOn = false
            clearInterval(gTimerInterval)
        }
        return
    }

    elSmile.innerText = NORMAL
    var minesAroundCount = gBoard[i][j].minesAroundCount
    elCell.innerText = minesAroundCount === 0 ? EMPTY : minesAroundCount
    elCell.classList.add('clicked')
    gGame.shownCount++

    // not first move
    if (!gGame.isFirstClick) {
        expandShown(gBoard, elCell, i, j)
        if (checkGameOver()) {
            gGame.isOn = false
            elSmile.innerText = WIN
            clearInterval(gTimerInterval)
        }
    }
}

function cellMarked(elCell) {
    if (gGame.isOn) {
        const cellPos = getCellLocation(elCell)
        if (elCell.innerText === FLAG) {
            elCell.innerText = EMPTY
            gGame.markedCount--
            gBoard[cellPos.i][cellPos.j].isMarked = false
            console.log(gBoard[cellPos.i][cellPos.j])
        } else if (!gBoard[cellPos.i][cellPos.j].isMarked) {
            elCell.innerText = FLAG
            gGame.markedCount++
            gBoard[cellPos.i][cellPos.j].isMarked = true
            console.log(gBoard[cellPos.i][cellPos.j])
        }
        checkGameOver()
    } else return
}

function checkGameOver() {
    const isAllCellsShown = gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)
    const isAllMinesMarked = gGame.markedCount === gLevel.MINES
    if ((isAllMinesMarked && isAllCellsShown)) {
        return true
    } else if (gGame.lives === 0) {
        return true
    } else if (isAllCellsShown) {
        return true
    }
    return false
}

function expandShown(board, elCell, iPos, jPos) {
    if (elCell.innerText === MINE || +elCell.innerText > 0) return
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === iPos && j === jPos) continue
            if (!board[i][j].isMine && !board[i][j].isShown) {
                board[i][j].isShown = true
                gBoard[i][j].isMarked = true
                gGame.shownCount++
                const elExpanded = document.querySelector(`#cell-${i}-${j}`)
                elExpanded.classList.add('clicked')
                elExpanded.innerText = board[i][j].minesAroundCount
                if (board[i][j].minesAroundCount === 0) {
                    elExpanded.innerText = EMPTY
                    expandShown(gBoard, elCell, i, j)
                }
            }
        }
    }
}

function setMinesNegsCount(board, iPos, jPos) {
    var negs = 0
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j > board.length - 1) continue
            if (i === iPos && j === jPos) continue
            if (board[i][j].isMine) negs++
        }
    }
    return negs
}

function locateMines(board, iPos, jPos) {
    var emptyCells = getEmptyCells(board)
    if (!emptyCells) return
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyCell = drawCell(emptyCells)
        if (emptyCell.i === iPos && emptyCell.j === jPos) {
            emptyCell = drawCell(emptyCells)
        }
        board[emptyCell.i][emptyCell.j].isMine = true
    }
}

function onMineClick() {
    var live = document.querySelector('.lives').innerText
    live = live.slice(2)
    document.querySelector('.lives').innerText = live
    console.log(live);
    gGame.lives--
    if (gGame.lives > 0) return
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell({ i, j }, MINE)
            }
        }
    }

}

function onChangeLevel(elLevel, level) {
    switch (level) {
        case 'beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            document.querySelector('.medium').classList.remove('active')
            document.querySelector('.expert').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
        case 'medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            document.querySelector('.beginner').classList.remove('active')
            document.querySelector('.expert').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
        case 'expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            document.querySelector('.beginner').classList.remove('active')
            document.querySelector('.medium').classList.remove('active')
            elLevel.classList.add('active')
            initGame()
            break;
    }
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var time = Math.floor((Date.now() - gStartTime) / 1000)
        var totalLength = 3
        if (time > 99) {
            totalLength = 0
        }
        time = addLeadingZeros(time, totalLength)
        var elH2 = document.querySelector('h2 .time')
        elH2.innerText = time
    }, 1);
}

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}