// Defining music variables
const foodSound = new Audio('../music/food.mp3');
const moveSound = new Audio('../music/move.mp3');
const gameOverSound = new Audio('../music/gameover.mp3');

// Defining variables
let scoreText = document.getElementById('score-text');
let highScoreText = document.getElementById('high-score-text');
let gameBoard = document.getElementById('game-board');
let totalGrid = 20;

let score = 0;

let speed = 5;    //Game Speed
let snakeArr = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let lastPaintTime = 0;
let foodInitialX = 16;
let foodInitialY = 17;
let foodPos = { x: foodInitialX, y: foodInitialY };     //Inital food position
let highScoreVar = localStorage.getItem("highScore");

if (highScoreVar === null) {
    highScoreVar = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreVar))
}
else {
    highScoreVar = JSON.parse(highScoreVar);
    highScoreText.innerHTML = highScoreVar;
}

const mainFunc = (currentTime) => {
    window.requestAnimationFrame(mainFunc);
    if ((currentTime - lastPaintTime) / 1000 < (1 / speed)) {  // Defining the refresh rate
        return;
    }
    lastPaintTime = currentTime;
    gameLogic();
}

const isCollides = (snake) => {
    // Snake hit itself
    for (let i = 1; i < snakeArr.length; i++) {
        // If head of the snake hits its body
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    // Snake hit the wall
    if (snake[0].x >= totalGrid || snake[0].x <= 0 || snake[0].y >= totalGrid || snake[0].y <= 0) {
        return true;
    }
    return false;
}

const gameLogic = () => {
    // Snake collides to itself or wall
    if (isCollides(snakeArr)) {
        // Updating the high-score
        if (score > highScoreVar) {
            highScoreVar = score;
            localStorage.setItem('highScore', highScoreVar);
            highScoreText.innerHTML = highScoreVar;
        }
        gameOverSound.play();
        direction = { x: 0, y: 0 };
        alert('Game Over. Press any key to play again!');
        snakeArr = [{ x: 10, y: 10 }];
        score = 0;
        scoreText.innerHTML = score;
    }

    // Updating the snake array and food position
    // If snake ate the food
    if (snakeArr[0].x === foodPos.x && snakeArr[0].y === foodPos.y) {
        foodSound.play();
        score += 1;

        // Whenever user score becomes the multiple of 10, then we will increase the speed by 1 
        if (score % 10 == 0) {
            speed++;
        }

        // Updating the score
        scoreText.innerHTML = score;

        snakeArr.unshift({ x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y });

        // Displaying food at random position
        let a = 2;    // Grid start
        let b = totalGrid - 2;   // Grid end

        foodPos = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };

        // To make sure that the food does not position over snake body
        snakeArr.forEach((element, index) => {
            if (element.x === foodPos.x && element.y === foodPos.y) {
                foodPos = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
            }
        })
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    // New head of the snake
    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // Displaying the snake
    gameBoard.innerHTML = '';     //Clearing the board for every repaint
    snakeArr.forEach((element, index) => {
        let snake = document.createElement('div');
        snake.style.gridColumnStart = element.x;
        snake.style.gridRowStart = element.y;
        if (index === 0) {
            snake.classList.add('snake-head');
        } else {
            snake.classList.add('snake-body');
        }
        gameBoard.appendChild(snake);
    });
    // Displaying the food
    let food = document.createElement('div');
    food.style.gridColumnStart = foodPos.x;
    food.style.gridRowStart = foodPos.y;
    food.classList.add('snake-food');
    gameBoard.appendChild(food);
}

window.requestAnimationFrame(mainFunc);

window.addEventListener('keydown', (event) => {
    // The snake will move horizontally when game will start
    direction = { x: 1, y: 0 };

    // To check which key is being pressed
    switch (event.key) {
        // The snake will move upward in vertical direction which is -y axis and so on for different keystrokes
        case 'ArrowUp': direction.x = 0; direction.y = -1;
            break;
        case 'ArrowDown': direction.x = 0; direction.y = 1;
            break;
        case 'ArrowLeft': direction.x = -1; direction.y = 0;
            break;
        case 'ArrowRight': direction.x = 1; direction.y = 0;
            break;
        default:
            break;
    }
});