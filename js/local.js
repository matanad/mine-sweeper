'use strict'

const IS_SUPPORT = checkLocalStorageSupport()

function storeBestScore(level, score) {
    if (!IS_SUPPORT) return null
    var bestScore = localStorage.getItem(level)
    if (!bestScore) {
        localStorage.setItem(level, score)
    }else if(+bestScore > +score){
        localStorage.removeItem(level)
        localStorage.setItem(level, score)
    }else{
        return
    }


}


function getBestScore(level) {
    if (!IS_SUPPORT) return null
    return localStorage.getItem(level)
}



function checkLocalStorageSupport() {
    if (typeof (Storage) !== "undefined") {
        return true
    } else {
        return false
    }
}