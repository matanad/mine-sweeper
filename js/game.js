'use strict'

const EMPTY = ' '
const MINE = '<img class="on-board-img" src="img/mine.png">'
const FLAG = '<img class="on-board-img" src="img/flag.png">'
const LIVE = '❤️'
const NORMAL = '😃'
const LOSE = '🤯'
const WIN = '😎'


//numbers colors
const ONE = '#b0e2ff'
const TWO = '#e07a5f'
const THREE = '#f2cc8f'
const FOUR = '#f4f1de'
const FIVE = '#efd0ff'

var gBoard
var gGame
var gStartTime
var gTimerInterval
var gBombInterval

function initGame() {
    gGame = {
        isOn: true,
        isFirstClick: true,
        isHint: false,
        shownCount: 0,
        mineShownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 2,
        hints: 3,
        safeClicks: 3
    }
    renderBestScore()
    renderHints()
    const elLives = document.querySelector('.lives')
    elLives.innerText = LIVE + LIVE
    if (gLevel.MINES > 2) {
        elLives.innerText += LIVE
        gGame.lives = 3
    }
    clearInterval(gBombInterval)
    if (gTimerInterval) clearInterval(gTimerInterval)
    document.querySelector('h2 .time').innerText = '000'
    const elSmile = document.querySelector('.smile')
    elSmile.innerText = NORMAL
    // 
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
}

function onGameStart() {

}

function renderBestScore() {
    const score = getBestScore(gLevel.level)
    const elBestScore = document.querySelector('.best-score')
    if (score) elBestScore.innerHTML = getBestScore(gLevel.level)
    else elBestScore.innerHTML = '000'
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                color: ONE
            }
        }
    }
    return board
}

function cellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    // if the cell already shown or marked or game is not on - do nothing
    if (currCell.isShown || currCell.isMarked || !gGame.isOn) return


    if (gGame.isHint && gGame.shownCount !== 0) return onHintCellCLicked(i, j)

    const elSmile = document.querySelector('.smile')
    currCell.isShown = true
    currCell.isMarked = true

    // first move - locate mines and count mines negs
    if (gGame.shownCount === 0) firstMove(i, j)


    // not first move and mine clicked
    if (currCell.isMine) {
        elSmile.innerHTML = LOSE
        currCell.isShown = true
        elCell.innerHTML = MINE
        onMineClick()
        elCell.style.backgroundColor = '#c33c54'
        gGame.mineShownCount++
        if (checkGameOver()) gameOver(false)
        return
    }

    elSmile.innerHTML = NORMAL
    var minesAroundCount = currCell.minesAroundCount
    if (minesAroundCount === 0) {
        elCell.innerHTML = EMPTY
    } else {
        elCell.innerHTML = minesAroundCount
        elCell.style.color = currCell.color
    }
    elCell.classList.add('clicked')
    gGame.shownCount++

    // not first move

    expandShown(gBoard, elCell, i, j)
    if (checkGameOver()) gameOver(true)

}

function firstMove(i, j) {
    locateMines(gBoard, i, j)
    setMinesNegsCount(gBoard)
    startTimer()
}

function cellMarked(elCell) {
    if (!gGame.isOn) return
    const cellPos = getCellLocation(elCell)
    if (elCell.innerHTML === FLAG) {
        elCell.innerHTML = EMPTY
        gGame.markedCount--
        gBoard[cellPos.i][cellPos.j].isMarked = false
        console.log(gBoard[cellPos.i][cellPos.j])
    } else if (!gBoard[cellPos.i][cellPos.j].isMarked) {
        elCell.innerHTML = FLAG
        gGame.markedCount++
        gBoard[cellPos.i][cellPos.j].isMarked = true
        console.log(gBoard[cellPos.i][cellPos.j])
    }
    if (checkGameOver()) gameOver(true)
}

function checkGameOver() {
    const totalNoneMineCells = gLevel.SIZE ** 2 - gLevel.MINES
    const isAllCellsShown = gGame.shownCount === totalNoneMineCells
    const isAllMinesMarked = gGame.markedCount === gLevel.MINES

    if ((isAllMinesMarked && isAllCellsShown)) return true
    if (gGame.lives === 0) return true
    if (gGame.mineShownCount < 3 && isAllCellsShown && gGame.mineShownCount + gGame.markedCount === gLevel.MINES) return true

    return false
}

function expandShown(board, elCell, iPos, jPos) {
    if (board[iPos][jPos].isMine || board[iPos][jPos].minesAroundCount > 0) return
    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            const currCell = board[i][j]
            if (j < 0 || j > board.length - 1) continue
            if (i === iPos && j === jPos) continue
            if (currCell.isMine) continue
            if (currCell.isShown) continue
            currCell.isShown = true
            currCell.isMarked = true
            gGame.shownCount++
            const elExpanded = document.querySelector(`#cell-${i}-${j}`)
            elExpanded.classList.add('clicked')
            elExpanded.innerHTML = currCell.minesAroundCount
            elExpanded.style.color = currCell.color
            if (currCell.minesAroundCount === 0) {
                elExpanded.innerHTML = EMPTY
                expandShown(gBoard, currCell, i, j)
            }
        }
    }
}

function checkMinesNegsCount(board, iPos, jPos) {
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
        var emptyCell = drawRandomCell(emptyCells)
        if (emptyCell.i === iPos && emptyCell.j === jPos) {
            emptyCell = drawRandomCell(emptyCells)
        }
        board[emptyCell.i][emptyCell.j].isMine = true
    }
}

function onMineClick() {
    var live = document.querySelector('.lives').innerText
    live = live.slice(2)
    document.querySelector('.lives').innerText = live
    gGame.lives--
    if (gGame.lives > 0) return

    bombAllMines()
}

function bombAllMines() {
    const bombs = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                bombs.push({ i, j })
            }
        }
    }
    gBombInterval = setInterval(() => {
        const randBomb = drawRandomCell(bombs)
        document.querySelector(`#cell-${randBomb.i}-${randBomb.j}`).classList.add('clicked')
        renderCell(randBomb, MINE)
        if (bombs.length === 0) clearInterval(gBombInterval)
    }, 100);
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
        gGame.secsPassed = time
    }, 1);
}

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}

function getNumColor(num) {
    switch (num) {
        case 1: return ONE
        case 2: return TWO
        case 3: return THREE
        case 4: return FOUR
        default: return FIVE
    }
}

function gameOver(isWin) {
    gGame.isOn = false
    clearInterval(gTimerInterval)
    if (isWin) {
        document.querySelector('.smile').innerHTML = WIN
        storeBestScore(gLevel.level, gGame.secsPassed)
    } else document.querySelector('.smile').innerHTML = LOSE
}