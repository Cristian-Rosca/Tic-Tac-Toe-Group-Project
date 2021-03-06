console.log("JS is working")
console.log("branch")

// Confetti Package

// Flag to randomise player 2 clicks
let isCpuOn = false;

const gameResultText = document.getElementById('game-result')

const playerOneWins = document.getElementById('player-one-wins')
const playerTwoWins = document.getElementById('player-two-wins')

let playerOneName = "Player 1";
let playerTwoName = "Player 2";

// Icons to hide/show current player's Icon
const playerOneIcon = document.getElementById('playerOneIcon')
const playerTwoIcon = document.getElementById('playerTwoIcon')

// Boolean to determine who's turn it is - start with player 1 - X
let isPlayerTwoTurn = false;
// This flag is to prevent adding icons when game is over!! - can only add once restart button is pressed
let restartRequired = false;


const gridList = document.querySelectorAll(".grid");
const WINNINGCOMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

for (let i = 0; i < gridList.length; i++) {
    addGridIconEventListener(gridList[i])
}


function addGridIconEventListener(oneGrid) {
  // Named function to hoist to the top
  oneGrid.addEventListener("click", () => {
    if (!restartRequired) {

        gameResultText.innerText = " "
      // console.log(oneGrid.classList)
      // Boolean to see if the grid is used (grab the class)
      isUsed = oneGrid.classList[2] === "used";
      // console.log("Grid is being occupied by " + oneGrid.classList[1])

      if (!isUsed) {
        let icon = document.createElement("i");
        icon.classList.add("fa-solid");
        icon.classList.add("fa-6x");

        if (isPlayerTwoTurn) {
          icon.classList.add("fa-o");
          // keep track of what is inside of the grid (o being placed)
          oneGrid.classList.add("o");
        } else {
          icon.classList.add("fa-x");
          oneGrid.classList.add("x");
        }
        // Once icon is made - place in the grid
        oneGrid.appendChild(icon);

        // Set grid to used (add used class)
        oneGrid.classList.add("used");

        if (currentPlayerWins()) {
          if (isPlayerTwoTurn) {
            console.log(`${playerTwoName} wins (o)`);
            if(isCpuOn){
                gameResultText.innerText = `${playerOneName} mate, You best be switching to TalkTalk.`;
            } else{
                gameResultText.innerText = `${playerTwoName} Wins the game, Please restart the game`;
            }
            playerTwoWins.innerText++;
            // todo: prevent player from clicking anywhere else
            restartRequired = true;

            // add in confetti from right when Player 2 wins
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          } else {
            console.log(`${playerOneName} wins (x)`);
            if(isCpuOn){
                gameResultText.innerText = `Nasir's wifi disconnected.....`;
            } else{
                gameResultText.innerText = `${playerOneName} Wins the game, Please restart the game`;
            }
            playerOneWins.innerText++;
            restartRequired = true;
            // todo: prevent player from clicking anywhere else

            // Add in confetti from left when Player 1 wins
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
          }
        } else {
          // Now check if a draw
          if (isADraw()) {
            console.log("It's a Draw!!");
            gameResultText.innerText = `It's a Draw! Please restart the game`;
          }
          // Continue
        }

        // Switch turns
        switchPlayerTurn();
      } else {
        console.log("This Grid is used");
      }
    } else {
      console.log("restart required");
    }
  });
}

async function switchPlayerTurn(){
    isPlayerTwoTurn = !isPlayerTwoTurn;
    playerOneIcon.classList.toggle("hide")
    playerTwoIcon.classList.toggle("hide")

    console.log('switching player');
    
    // If player is 2 && cpu mode is on - force random attempt
    if(isCpuOn && isPlayerTwoTurn){
        // randomAttemptButton.click();
        if(!restartRequired){
            gameResultText.innerText = "Nasir's Wifi is connecting...."
            await cpuPlays();
        }
    }
}

const cpuPlays = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(randomAttemptButton.click())
        }, 2000);
    })
}


function currentPlayerWins() {
    const currentPlayerPositions = grabCurrentPlayerPositions();
    // console.log(currentPlayerPositions);
   return hasWinningCombination(currentPlayerPositions);
} 

function grabCurrentPlayerPositions() {
    const playerPositions = [];
    let iconToLookFor;
    if (isPlayerTwoTurn) {
        iconToLookFor = "o"
    } else { 
        iconToLookFor = "x"
    }

    for(let position = 0; position < gridList.length; position++){
        if( gridList[position].classList[1] === iconToLookFor){
            playerPositions.push(position)
        }
    }

    return playerPositions;
}

function hasWinningCombination(currentPlayerPositions){
    for (const oneCombo of WINNINGCOMBINATIONS) {
        if(currentPlayerPositions.includes(oneCombo[0]) && currentPlayerPositions.includes(oneCombo[1]) && currentPlayerPositions.includes(oneCombo[2])){ 
            console.log("Winning combination found!")
            // Set winning combo to green on grid
            gridList[oneCombo[0]].firstElementChild.classList.add("green")
            gridList[oneCombo[1]].firstElementChild.classList.add("green")
            gridList[oneCombo[2]].firstElementChild.classList.add("green")
            // console.log(gridList[oneCombo[0]].classList);
            return true;
        }
    }
    // Never finds winning combo (i.e never )
    return false;
}


function isADraw() {
  for (const oneGrid of gridList) {
    if (oneGrid.classList[2] != "used") {
        // Found an empty spot
        return false;
    }
  }
  // All spaces occupied
  return true;
}

const restartButton = document.querySelector(".restart-button");




function handleRestartButtonClick () {
    console.log(gridList);
    console.log("restart button clicked");
    for (const oneGrid of gridList) {
        oneGrid.classList.remove('used')
        oneGrid.classList.remove('x')
        oneGrid.classList.remove('o')
        oneGrid.classList.remove('green')
        if (oneGrid.firstElementChild) {
            oneGrid.firstElementChild.remove()
        }
        // REMOVE THIS as want loser to start - don't want x to start all the time - otherwise will need to deal with
        // isCirclePlayerTurn = false;
    }
    restartRequired = false;
    console.log(restartRequired);
    gameResultText.innerText = "";
    
}

restartButton.addEventListener("click", handleRestartButtonClick);



// Player name - event listeners to allow changing names using input(forms)
// Do for player two 
const playerOneForm = document.getElementById('playerOneDetails');
const playerOneInput = document.getElementById('playerOneName');

function updatePlayerOneName () {
    // console.log(form.elements['playerOneName'].value);
    playerOneName = playerOneForm.elements['playerOneName'].value
    this.style.width = (this.value.length - 1) + "ch";
}

playerOneInput.addEventListener("input", updatePlayerOneName);

// Do for player two 
const playerTwoForm = document.getElementById('playerTwoDetails');
const playerTwoInput = document.getElementById('playerTwoName');

function updatePlayerTwoName () {
    // console.log(playerTwoForm.elements['playerTwoName'].value);
    playerTwoName = playerTwoForm.elements['playerTwoName'].value
    this.style.width = (this.value.length-1) + "ch";
}

playerTwoInput.addEventListener("input", updatePlayerTwoName);
 


const randomAttemptButton = document.getElementById('random-attempt-button');

// generates num between 0 to 8 for index
function generateRandomGridPosition() {
    // Math.random generates between 0-1
    // 0.1*9 = 0.9 (Floor => 0) - Min index
    // 0.9*9 = 8.1 (Floor => 8) - Max index
  return Math.floor(Math.random() * 9);
}

function randomAttempt() {
  let gridPosition = generateRandomGridPosition();
  while (gridList[gridPosition].classList[2] === "used") {
    gridPosition = generateRandomGridPosition();
  }
  gridList[gridPosition].click();
}

    
randomAttemptButton.addEventListener("click", randomAttempt)




const cpuModeButton = document.getElementById('cpu-mode-button');


function changeToCPUMode() {
    console.log('CPU button clicked');
    console.log(cpuModeButton);
    console.log(cpuModeButton.innerText);
    
    isCpuOn = !isCpuOn
    // Allows switching between modes
    if(isCpuOn){
        playerTwoForm.elements['playerTwoName'].value = "Nasir's wifi"
        playerTwoForm.elements['playerTwoName'].style.width = playerTwoForm.elements['playerTwoName'].length
        cpuModeButton.innerText = "PVP Mode"
        gameResultText.innerText = "Time to get merked!"
    } else{
        cpuModeButton.innerText = "CPU Mode"
        gameResultText.innerText = "Yh thought so mate!"
    }
    
    
}

    
cpuModeButton.addEventListener("click", changeToCPUMode)


