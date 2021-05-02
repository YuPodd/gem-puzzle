window.onload = loadGame;

function loadGame() {
    initializePositions();
    shufflePositions();
    displayElements();
    initializeTimer();
};
let numberOfElementsInRow = 4;
let positions;
let positionsExpected;

function initializePositions() {
    positions = createMatrix(numberOfElementsInRow);
    positionsExpected = createMatrix(numberOfElementsInRow);
}

function createMatrix(size) {
    let matrix = [];
    let k = 1;
    for (let i = 0; i < size; i++) {
        matrix.push([]);
        for (let j = 0; j < size; j++) {
            matrix[i].push(k === size * size ? 0 : k);
            k++;
        }
    }
    return matrix;
}
//***variables of header***
const headerDiv = document.getElementsByTagName("header")[0];
let timerDiv = document.createElement("div");
let timer;
let movesDiv = document.createElement("div");
let counterOfMoves = 0;
let startNewGameDiv = document.createElement("div");
let startSavedGameDiv = document.createElement("div");

//***variables of main ***
const gameBoard = document.querySelector(".game-board");
let congrats = document.createElement("div");

//***variables of footer***

let soundEnabled = false;
const footer = document.createElement("FOOTER");


createFooterElements();
createSizeButtons('easy');
createSizeButtons('3 * 3');
createSizeButtons('4 * 4');
createSizeButtons('6 * 6');
createSizeButtons('8 * 8');
createSaveButton();
createScoreButton();
createSoundButton();

function createFooterElements() {
    let wrapperSizeDiv = document.createElement("div");
    let textSizeDiv = document.createElement("div");
    textSizeDiv.className = "choose-text";
    textSizeDiv.textContent = "Choose the size of the board:";
    let buttonWrapperSizeDiv = document.createElement("div");
    buttonWrapperSizeDiv.className = "button-wrapper";

    document.body.append(footer);
    footer.append(wrapperSizeDiv);
    wrapperSizeDiv.append(textSizeDiv);
    wrapperSizeDiv.append(buttonWrapperSizeDiv);
}

function createSizeButtons(textContent) {
    let chooseButtons = document.createElement("button");
    chooseButtons.textContent = textContent;
    chooseButtons.addEventListener('click', changeNumberOfElements);
    let buttonWrapperSizeDiv = document.querySelector(".button-wrapper");
    buttonWrapperSizeDiv.append(chooseButtons);
}

function createSaveButton() {
    let saveButton = document.createElement("button");
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', saveGame);
    footer.append(saveButton);
}

function createScoreButton() {
    let scoreButton = document.createElement("button");
    scoreButton.textContent = 'Score';
    scoreButton.addEventListener('click', displayScore);
    scoreButton.classList.add("popup");
    footer.append(scoreButton);

    let scoreTable = document.createElement("div");
    scoreTable.classList.add("popuptext");
    scoreButton.append(scoreTable);
}

function displayScore() {
    let popup = document.querySelector(".popuptext");
    popup.classList.toggle("show");
}

function createSoundButton() {
    let soundButton = document.createElement("div");
    soundButton.classList.add("sound");
    soundButton.innerHTML = `<img src="assets/sound-mute.png" alt="sound"></img>`;
    soundButton.addEventListener('click', function () {
        soundEnabled = !soundEnabled;
        if (soundEnabled === true) {
            soundButton.innerHTML = `<img src="assets/sound.svg" alt="sound"></img>`;
        } else {
            soundButton.innerHTML = `<img src="assets/sound-mute.png" alt="sound"></img>`;
        }
    });
    footer.append(soundButton);
}

function saveGame() {
    let jsonString = JSON.stringify(positions);
    localStorage.setItem('positions', jsonString);
    localStorage.setItem('size', numberOfElementsInRow);
    localStorage.setItem('moves', counterOfMoves);
    localStorage.setItem('time', timerDiv.textContent);
}

function changeNumberOfElements(event) {
    switch (event.target.textContent) {
        case 'easy':
            numberOfElementsInRow = 2;
            stylingElements();
            startNewGame();
            break;
        case '3 * 3':
            numberOfElementsInRow = 3;
            stylingElements();
            startNewGame();
            break;
        case '4 * 4':
            numberOfElementsInRow = 4;
            stylingElements();
            startNewGame();
            break;
        case '6 * 6':
            numberOfElementsInRow = 6;
            startNewGame();
            stylingManyElements();
            break;
        case '8 * 8':
            numberOfElementsInRow = 8;
            startNewGame();
            stylingManyElements();
            break;
        default:
            numberOfElementsInRow = 4;
            startNewGame();
            break;
    }

}

function stylingGrid() {
    gameBoard.style.gridTemplateColumns = `repeat(${numberOfElementsInRow}, 1fr)`;
}

function stylingManyElements() {
    gameBoard.style.maxWidth = "620px";
    headerDiv.style.margin = "0";
    let elements = document.querySelectorAll(".game-element");
    let empty = document.querySelector(".empty");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.height = "35px";
        empty.style.height = "35px";
    }

}

function stylingElements() {
    gameBoard.style.maxWidth = "420px";
    headerDiv.style.marginBottom = "2%";
    if (numberOfElementsInRow === 6 || numberOfElementsInRow == 8) {
        stylingManyElements();
    }
    if (numberOfElementsInRow === 2) {
        gameBoard.style.maxWidth = "320px";
    }
}

function shufflePositions() {
    // create a new array with all sub-array elements concatenated into it
    let totalPositions = positions.flat();

    for (let i = totalPositions.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = totalPositions[i];
        totalPositions[i] = totalPositions[j];
        totalPositions[j] = temp;
    }
    for (let i = 0; i < totalPositions.length; i++) {
        let n = numberOfElementsInRow;
        let row = Math.floor(i / n);
        let col = i % n;
        positions[row][col] = totalPositions[i];
    }
}

function displayElements() {
    //display header divs
    timerDiv.classList.add("time");
    movesDiv.classList.add("moves");
    startNewGameDiv.classList.add("new-game");
    startSavedGameDiv.classList.add("saved-game");
    startNewGameDiv.addEventListener('click', startNewGame);
    startSavedGameDiv.addEventListener('click', startSavedGame);
    headerDiv.append(timerDiv, movesDiv, startNewGameDiv, startSavedGameDiv);


    //display elements divs
    for (let i = 0; i < positions.length; i++) {
        for (let j = 0; j < positions.length; j++) {
            let newDiv = document.createElement("div");
            newDiv.id = i + '_' + j;
            newDiv.addEventListener('click', moveElement);

            //for all elements besides 0 add class and text
            if (positions[i][j] !== 0) {
                newDiv.classList.add("game-element");
                newDiv.textContent = positions[i][j];
            }
            // 0 will be an empty element
            if (positions[i][j] == 0) {
                newDiv.textContent = '';
                newDiv.classList.add("empty");
            }
            stylingGrid();
            gameBoard.append(newDiv);
        }
    }
};

function moveElement(event) {

    let movedElement = document.querySelector(".moved");
    if (movedElement != null) {
        movedElement.classList.remove("moved");
    }

    //get id of empty element
    let emptyDiv = document.querySelector(".empty");
    let ei = emptyDiv.id.charAt(0);
    let ej = emptyDiv.id.charAt(2);
    //get id of clicked element
    let i = event.target.id.charAt(0);
    let j = event.target.id.charAt(2);

    //if theese elements are in the same column or row - swap
    if ((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1)) {
        //*sound */
        if (soundEnabled === true) {
            const audio = document.querySelector(`audio[data-key="sound"]`);
            if (!audio) return;
            audio.currentTime = 0;
            audio.play();
        }
        //display - swap
        emptyDiv.className = "game-element moved";
        emptyDiv.textContent = event.target.textContent;

        event.target.innerText = '';
        event.target.className = "empty";

        //array - swap
        let t = positions[ei][ej];
        positions[ei][ej] = positions[i][j];
        positions[i][j] = t;

        //add number of moves
        counterOfMoves++;
        movesDiv.textContent = counterOfMoves;
    }
    if (isGameFinished()) {
        clearInterval(timer);
        gameBoard.classList.add("vanish");
        timerDiv.classList.add("vanish");
        movesDiv.classList.add("vanish");
        congrats.classList.add("centered");
        congrats.textContent = `Hooray! You solved the puzzle for ${timerDiv.textContent} and ${counterOfMoves} moves`;
        startNewGameDiv.classList.add("centered");
        document.body.append(congrats);
        createScoreObject();
        addBestResultsToScoreTable();
    }
}

function startNewGame() {
    clearInterval(timer);
    congrats.remove();
    counterOfMoves = 0;
    movesDiv.textContent = counterOfMoves;
    while (gameBoard.firstChild) {
        gameBoard.firstChild.remove();
    }
    loadGame();
    gameBoard.classList.remove("vanish");
    timerDiv.classList.remove("vanish");
    movesDiv.classList.remove("vanish");
    startNewGameDiv.classList.remove("centered");
};

function initializeTimer() {
    let start = Date.now();
    timer = setInterval(showTime, 1000);

    function showTime() {
        let passedSec = (Date.now() - start) / 1000;
        let min = Math.floor(passedSec / 60);
        let sec = Math.floor(passedSec % 60);
        min = (min < 10) ? `0${min}` : min;
        sec = (sec < 10) ? `0${sec}` : sec;
        timerDiv.textContent = `${min}:${sec}`;
    }
}

function startSavedGame() {
    if (localStorage.getItem('positions')) {
        while (gameBoard.firstChild) {
            gameBoard.firstChild.remove();
        }
        numberOfElementsInRow = Number(localStorage.getItem('size'));
        counterOfMoves = localStorage.getItem('moves');
        let t = localStorage.getItem('time');
        let savedPositions = localStorage.getItem('positions');
        let newPositions = JSON.parse(savedPositions);
        positions = newPositions;
        movesDiv.textContent = counterOfMoves;
        displayElements();
        stylingElements();
         console.log(newPositions, t);
    }
}

function isGameFinished() {
    for (let i = 0; i < positions.length; i++) {
        for (let j = 0; j < positions.length; j++) {
            if (positions[i][j] !== positionsExpected[i][j]) {
                return false;
            }
        }
    }
    return true;
}
//console.log(positions);
let arrayOfScoreObjects = [];

function createScoreObject() {
    let bestResults = [];
    let ScoreObject = {
        moves: counterOfMoves,
        time: timerDiv.textContent,
    };
    arrayOfScoreObjects.push(ScoreObject);
    arrayOfScoreObjects.sort((a, b) => (a.moves > b.moves) ? 1 : -1);

    for (let i = 0; i < Math.min(arrayOfScoreObjects.length, 10); i++) {
        bestResults.push(arrayOfScoreObjects[i]);
    }
    arrayOfScoreObjects = bestResults;
    console.log(arrayOfScoreObjects);
}

function addBestResultsToScoreTable() {
    let scoreTable = document.querySelector(".popuptext");
    while (scoreTable.firstChild) {
        scoreTable.firstChild.remove();
    }
    for (let i = 0; i < arrayOfScoreObjects.length; i++) {
        let scoreRow = document.createElement("div");
        scoreRow.textContent = `Moves: ${arrayOfScoreObjects[i].moves} Time: ${arrayOfScoreObjects[i].time}`;
        scoreTable.append(scoreRow);
    };
}