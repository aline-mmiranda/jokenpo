const splash = document.getElementById('splash');
const app = document.getElementById('app');
const progressBar = document.getElementById('prog');
const choices = document.querySelector('.choices');
const statusDisplay = document.querySelector('.status-display');
const yourChoiceDisplay = document.getElementById('your-choice');
const robotChoiceDisplay = document.getElementById('robot-choice');
const yourScoreDisplay = document.getElementById('your-score');
const robotScoreDisplay = document.getElementById('robot-score');
const resetBtn = document.getElementById('reset-btn');
const bgCurrent = document.getElementById('bg-current');
const bgNext = document.getElementById('bg-next');

let yourScore = 0;
let robotScore = 0;
let isPlaying = false;

const backgrounds = [
    './assets/bg1.jpg',
    './assets/bg2.jpg',
    './assets/bg3.jpg',
    './assets/bg4.jpg',
    './assets/bg5.jpg',
    './assets/bg6.jpg',
    './assets/bg7.jpg',
    './assets/bg8.jpg',
    './assets/bg9.jpg'
];

const JOKENPO = Object.freeze({
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3
});

const items = [
    { image: './assets/rock.png', label: 'Pedra' },
    { image: './assets/paper.png', label: 'Papel' },
    { image: './assets/scissors.png', label: 'Tesoura' },
];

// ─── splash screen
requestAnimationFrame(() => {
    progressBar.style.width = '100%';
});

setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
        splash.style.display = 'none';
        app.classList.add('visible');
    }, 600);
}, 2000);

// ─── background randomizer
let currentBgIndex = Math.floor(Math.random() * backgrounds.length);

bgCurrent.style.backgroundImage = `url(${backgrounds[currentBgIndex]})`;

function aplicarBgAleatorio() {
    if (isPlaying) return;

    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * backgrounds.length);
    } while (nextIndex === currentBgIndex && backgrounds.length > 1);

    bgNext.style.backgroundImage = `url(${backgrounds[nextIndex]})`;
    bgNext.style.opacity = '1';

    setTimeout(() => {
        bgCurrent.style.backgroundImage = `url(${backgrounds[nextIndex]})`;
        bgNext.style.opacity = '0';
        currentBgIndex = nextIndex;
    }, 1000);
}

setInterval(aplicarBgAleatorio, 60000);

// ─── game logic
choices.addEventListener('click', (event) => {
    if (isPlaying) return;

    const buttonChoice = event.target.closest('button');
    if (!buttonChoice) return;

    isPlaying = true;
    choices.classList.add('disabled');

    const playerChoice = buttonChoice.id;
    const robotRandom = getRandomIntInclusive(1, 3);
    const robotChoice = Object.keys(JOKENPO)
        .find(key => JOKENPO[key] === robotRandom)
        .toLocaleLowerCase();
    const { message, winner } = determineWinner(playerChoice, robotChoice);

    setTimeout(() => {
        stopSpin();

        yourChoiceDisplay.src = buttonChoice.querySelector('img').src;
        robotChoiceDisplay.src = `./assets/${robotChoice}.png`;

        yourChoiceDisplay.alt = items.find(i => i.image.includes(playerChoice))?.label ?? '';
        robotChoiceDisplay.alt = items.find(i => i.image.includes(robotChoice))?.label ?? '';

        setTimeout(() => {
            statusDisplay.className = 'status-display result-' + winner;
            statusDisplay.textContent = message;

            if (winner === 'player') {
                yourScore++;
                yourScoreDisplay.textContent = yourScore;
            } else if (winner === 'robot') {
                robotScore++;
                robotScoreDisplay.textContent = robotScore;
            }

            setTimeout(() => {
                statusDisplay.className = 'status-display';
                statusDisplay.textContent = 'Esperando sua jogada...';
                startSpin();
                isPlaying = false;
                choices.classList.remove('disabled');
            }, 2000);

        }, 500);

    }, 500);
});

// ─── reset
resetBtn.addEventListener('click', () => {
    yourScore = 0;
    robotScore = 0;
    yourScoreDisplay.textContent = 0;
    robotScoreDisplay.textContent = 0;
});

// ─── helpers
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function determineWinner(playerChoice, robotChoice) {
    if (playerChoice === robotChoice) {
        return { message: 'Empate! 🤝', winner: 'none' };
    }
    if (
        (playerChoice === 'rock' && robotChoice === 'scissors') ||
        (playerChoice === 'paper' && robotChoice === 'rock') ||
        (playerChoice === 'scissors' && robotChoice === 'paper')
    ) {
        return { message: 'Você venceu! 🎉', winner: 'player' };
    }
    return { message: 'Robô venceu! 🤖', winner: 'robot' };
}

// ─── spin animation
let current = 0;
let interval = null;

function showItem(idx) {
    yourChoiceDisplay.src = items[idx].image;
    robotChoiceDisplay.src = items[idx].image;
    current = idx;
}

function startSpin() {
    interval = setInterval(() => {
        showItem((current + 1) % items.length);
    }, 100);
}

function stopSpin() {
    clearInterval(interval);
}

startSpin();