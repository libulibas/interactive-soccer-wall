// Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const playBtn = document.getElementById('play-btn');
const retryBtn = document.getElementById('retry-btn');
const closeBtn = document.getElementById('close-btn');

const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const finalScoreDisplay = document.getElementById('final-score');
const gameArea = document.getElementById('game-area');
const bgContainer = document.getElementById('bg-container');

// Game State
let score = 0;
let timeLeft = 30;
let gameInterval;
let spawnInterval;
let isPlaying = false;

const GAME_DURATION = 30;
const INITIAL_SPAWN_RATE = 800; // ms between spawns
const MAX_TARGETS = 7;

// Initialize Background Animations
function createBackgroundBalls() {
    for (let i = 0; i < 10; i++) {
        const ball = document.createElement('div');
        ball.classList.add('bg-ball');
        
        // Random position
        ball.style.left = `${Math.random() * 100}vw`;
        ball.style.top = `${Math.random() * 100}vh`;
        
        // Random animation duration and delay
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 5;
        
        // Inline keyframes for random movement
        const animName = `moveBall${i}`;
        const styleSheet = document.styleSheets[0];
        
        const tx1 = (Math.random() - 0.5) * 500;
        const ty1 = (Math.random() - 0.5) * 500;
        const tx2 = (Math.random() - 0.5) * 500;
        const ty2 = (Math.random() - 0.5) * 500;
        
        const keyframes = `
        @keyframes ${animName} {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            33% { transform: translate(${tx1}px, ${ty1}px) rotate(180deg); }
            66% { transform: translate(${tx2}px, ${ty2}px) rotate(360deg); }
            100% { transform: translate(0px, 0px) rotate(720deg); }
        }`;
        
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        
        ball.style.animation = `${animName} ${duration}s infinite alternate linear ${delay}s`;
        
        bgContainer.appendChild(ball);
    }
}

// Navigation
function showScreen(screen) {
    startScreen.classList.remove('active');
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('active');
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('active');
    endScreen.classList.add('hidden');

    setTimeout(() => {
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }, 50); // slight delay to allow display change before transition
}

// Game Logic
function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    scoreDisplay.innerText = score;
    timeDisplay.innerText = timeLeft;
    gameArea.innerHTML = '';
    
    showScreen(gameScreen);
    isPlaying = true;
    
    gameInterval = setInterval(updateTimer, 1000);
    spawnTargets();
}

function updateTimer() {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    
    // Pulse time if low
    if (timeLeft <= 5) {
        timeDisplay.parentElement.style.color = '#ff4b4b';
        timeDisplay.parentElement.style.border = '1px inset rgba(255,75,75,0.4)';
    } else {
        timeDisplay.parentElement.style.color = '';
        timeDisplay.parentElement.style.border = '';
    }

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearTimeout(spawnInterval);
    
    // Clean up targets
    const targets = document.querySelectorAll('.target');
    targets.forEach(t => t.remove());

    finalScoreDisplay.innerText = score;
    showScreen(endScreen);
}

function spawnTargets() {
    if (!isPlaying) return;

    const currentTargets = document.querySelectorAll('.target').length;
    
    if (currentTargets < MAX_TARGETS) {
        createTarget();
    }

    // Slightly increase spawn rate as time goes down
    const currentSpawnRate = INITIAL_SPAWN_RATE - ((GAME_DURATION - timeLeft) * 15);
    const nextSpawn = Math.max(300, currentSpawnRate); 

    spawnInterval = setTimeout(spawnTargets, nextSpawn);
}

function createTarget() {
    const target = document.createElement('div');
    target.classList.add('target');
    
    const size = 80; // target size from css
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;
    
    // Ensure targets don't spawn under the HUD
    const startY = 100; // Offset HUD height
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(startY + Math.random() * (maxY - startY));
    
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    
    // Randomize target points and size slightly
    const isSpecial = Math.random() > 0.8; // 20% chance for special target
    let points = 10;
    
    if (isSpecial) {
        target.style.background = 'radial-gradient(circle at 30% 30%, #eab308, #854d0e)';
        target.style.transform = 'scale(0.8)';
        points = 25;
    }
    
    // Add Click listener
    // Using touchstart and mousedown to capture earliest possible interaction
    const hitTarget = (e) => {
        if (!isPlaying || target.classList.contains('popping')) return;
        e.preventDefault(); // prevent double firing
        
        score += points;
        scoreDisplay.innerText = score;
        
        // Visual feedback
        showFloatingText(`+${points}`, x, y);
        
        target.classList.add('popping');
        setTimeout(() => {
            if(target.parentNode) target.remove();
        }, 200); // match popping animation duration
    };

    target.addEventListener('mousedown', hitTarget);
    target.addEventListener('touchstart', hitTarget, {passive: false});

    gameArea.appendChild(target);

    // Auto-remove target after some time to keep it dynamic
    const lifespan = isSpecial ? 1500 : 2500 + Math.random() * 1000;
    setTimeout(() => {
        if (target.parentNode && !target.classList.contains('popping')) {
            target.classList.add('popping');
            setTimeout(() => {
                if(target.parentNode) target.remove();
            }, 200);
        }
    }, lifespan);
}

function showFloatingText(text, x, y) {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    floatEl.innerText = text;
    // Center text over target
    floatEl.style.left = `${x + 20}px`;
    floatEl.style.top = `${y}px`;
    
    gameArea.appendChild(floatEl);
    
    setTimeout(() => {
        if(floatEl.parentNode) floatEl.remove();
    }, 600); // match floatUp animation
}

// Event Listeners
playBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
closeBtn.addEventListener('click', () => {
    showScreen(startScreen);
});

// Setup
window.addEventListener('DOMContentLoaded', () => {
    createBackgroundBalls();
});
