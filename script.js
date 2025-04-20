// DOM Elements
const timerDisplay = document.querySelector('.timer-display');
const progressBar = document.querySelector('.progress-bar');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const streakCount = document.querySelector('.streak-count');
const rewardContainer = document.getElementById('reward-container');
const rewardImg = document.getElementById('reward-img');
const rewardQuote = document.getElementById('reward-quote');
const rewardAuthor = document.getElementById('reward-author');
const soundToggle = document.getElementById('sound-toggle');
const memeToggle = document.getElementById('meme-toggle');
const quoteToggle = document.getElementById('quote-toggle');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const lapsContainer = document.getElementById('laps-container');

// Timer variables
let timeLeft = 25 * 60; // Default: 25 minutes in seconds
let totalTime = timeLeft;
let timer;
let isRunning = false;
let isPaused = false;
let streak = parseInt(localStorage.getItem('pomoStreak')) || 0;
let lapCount = 0;
let laps = [];
let elapsedTime = 0;
let lastLapTime = 0;

// Quotes and memes data
const quotes = [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { quote: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
    { quote: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
    { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { quote: "Until we can manage time, we can manage nothing else.", author: "Peter Drucker" }
];

const memes = [
    "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='400' height='300' fill='%23f9f9f9'/><text x='200' y='50' font-size='24' text-anchor='middle' fill='%23333'>When you finish a Pomodoro</text><circle cx='200' cy='150' r='80' fill='%23FFD700'/><circle cx='160' cy='130' r='15' fill='%23333'/><circle cx='240' cy='130' r='15' fill='%23333'/><path d='M160 190 C180 210, 220 210, 240 190' stroke='%23333' stroke-width='8' fill='none'/></svg>",
    "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='400' height='300' fill='%23f9f9f9'/><text x='200' y='50' font-size='24' text-anchor='middle' fill='%23333'>Procrastination? Not today!</text><circle cx='200' cy='150' r='80' fill='%23ff6b6b'/><circle cx='160' cy='130' r='15' fill='%23333'/><circle cx='240' cy='130' r='15' fill='%23333'/><path d='M160 170 C180 200, 220 200, 240 170' stroke='%23333' stroke-width='8' fill='none'/></svg>",
    "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='400' height='300' fill='%23f9f9f9'/><text x='200' y='50' font-size='24' text-anchor='middle' fill='%23333'>Focus level: 100%</text><rect x='100' y='100' width='200' height='150' fill='%234ecdc4'/><text x='200' y='180' font-size='32' text-anchor='middle' fill='white'>FOCUS</text></svg>",
    "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='400' height='300' fill='%23f9f9f9'/><text x='200' y='50' font-size='24' text-anchor='middle' fill='%23333'>Productivity: Unlocked</text><circle cx='200' cy='150' r='80' fill='%23FFA500'/><path d='M170 130 L200 160 L230 130' stroke='%23333' stroke-width='10' fill='none'/><path d='M170 160 L200 190 L230 160' stroke='%23333' stroke-width='10' fill='none'/></svg>",
    "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='400' height='300' fill='%23f9f9f9'/><text x='200' y='50' font-size='24' text-anchor='middle' fill='%23333'>25 Minutes of Pure Focus</text><circle cx='200' cy='150' r='80' fill='%2327ae60'/><text x='200' y='160' font-size='24' text-anchor='middle' fill='white'>DONE!</text></svg>"
];

// Sound effects
const playSound = (type) => {
    if (!soundToggle.checked) return;
    
    const sounds = {
        start: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAGhgDR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXTAAAAAAAABobabLUOAAAAAAD/+xBkAA8TTnlRMGGnKzSOKODTIEIAAAGkAAAAIAAANIAAAARMQU1FMy4xMDADqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'),
        complete: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAIaADMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYZAAAAAAAACGhlXqy5AAAAAAD/+xBkAA8YFcmGgT2XhsSSMEAQloAAAAGkAAAAIAAANIAAAARMQU1FMy4xMDADqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'),
        click: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAEWgDLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQZAAAAAAAABFq2qKGGAAAAAAD/+xBkAA8TnhlfMGl3aKCOLFARkeAAAAGkAAAAIAAANIAAAARMQU1FMy4xMDADqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'),
        lap: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAEWgDLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQZAAAAAAAABFq2qKGGAAAAAAD/+xBkAA8TnhlfMGl3aKCOLFARkeAAAAGkAAAAIAAANIAAAARMQU1FMy4xMDADqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    };
    
    if (sounds[type]) {
        sounds[type].play();
    }
};

// Settings from localStorage
const loadSettings = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const memesEnabled = localStorage.getItem('memesEnabled') !== 'false';
    const quotesEnabled = localStorage.getItem('quotesEnabled') !== 'false';
    
    darkModeToggle.checked = darkMode;
    soundToggle.checked = soundEnabled;
    memeToggle.checked = memesEnabled;
    quoteToggle.checked = quotesEnabled;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
};

// Update streak in UI and localStorage
const updateStreak = (count) => {
    streak =count;
    localStorage.setItem('pomoStreak', streak);
    streakCount.textContent = streak;
};

// Format time (seconds) to MM:SS
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Update timer display and progress bar
const updateTimerDisplay = () => {
    timerDisplay.textContent = formatTime(timeLeft);
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
};

// Set timer from input fields
const setTimerFromInput = () => {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    // Validate input
    if (minutes < 0 || minutes > 60) {
        minutesInput.value = 25;
        return;
    }
    
    if (seconds < 0 || seconds > 59) {
        secondsInput.value = 0;
        return;
    }
    
    if (minutes === 0 && seconds === 0) {
        minutesInput.value = 25;
        return;
    }
    
    timeLeft = (minutes * 60) + seconds;
    totalTime = timeLeft;
    updateTimerDisplay();
};

// Start timer
const startTimer = () => {
    if (isRunning && !isPaused) return;
    
    if (!isRunning) {
        // First start of the timer
        setTimerFromInput();
        playSound('start');
        isRunning = true;
        lapCount = 0;
        laps = [];
        elapsedTime = 0;
        lastLapTime = 0;
        
        // Clear laps container except for the title
        const lapsTitle = lapsContainer.querySelector('.laps-title');
        lapsContainer.innerHTML = '';
        if (lapsTitle) {
            lapsContainer.appendChild(lapsTitle);
        } else {
            const title = document.createElement('h3');
            title.classList.add('laps-title');
            title.textContent = 'Session History';
            lapsContainer.appendChild(title);
        }
    } else {
        // Resume from pause
        playSound('click');
        isPaused = false;
    }
    
    startBtn.textContent = 'Resume';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    
    timer = setInterval(() => {
        timeLeft--;
        elapsedTime = totalTime - timeLeft;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            completePomo();
        }
    }, 1000);
};

// Pause timer
const pauseTimer = () => {
    if (!isRunning || isPaused) return;
    
    playSound('click');
    isPaused = true;
    clearInterval(timer);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
};

// Record lap
const recordLap = () => {
    if (!isRunning || isPaused) return;
    
    playSound('lap');
    lapCount++;
    
    // Calculate lap time (time since last lap)
    const lapDuration = elapsedTime - lastLapTime;
    lastLapTime = elapsedTime;
    
    // Store lap data
    laps.push({
        number: lapCount,
        duration: formatTime(lapDuration),
        elapsed: formatTime(elapsedTime),
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Display lap in UI
    const lapElement = document.createElement('div');
    lapElement.classList.add('lap-record');
    lapElement.innerHTML = `
        <span class="lap-number">Lap ${lapCount}</span>
        <span class="lap-timestamp">${new Date().toLocaleTimeString()}</span>
        <span class="lap-time">${formatTime(lapDuration)}</span>
    `;
    
    // Insert at the beginning of the container, right after the title
    const lapsTitle = lapsContainer.querySelector('.laps-title');
    if (lapsTitle && lapsTitle.nextSibling) {
        lapsContainer.insertBefore(lapElement, lapsTitle.nextSibling);
    } else {
        lapsContainer.appendChild(lapElement);
    }
};

// Reset timer
const resetTimer = () => {
    playSound('click');
    isRunning = false;
    isPaused = false;
    clearInterval(timer);
    
    // Reset time to input values
    setTimerFromInput();
    
    // Reset UI elements
    progressBar.style.width = '0%';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    startBtn.textContent = 'Start';
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    
    // Hide reward if visible
    rewardContainer.style.display = 'none';
};

// Complete Pomodoro session
const completePomo = () => {
    clearInterval(timer);
    isRunning = false;
    playSound('complete');
    
    // Update streak
    updateStreak(streak + 1);
    
    // Enable inputs again
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    
    // Reset UI elements
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    startBtn.textContent = 'Start';
    
    // Show reward
    showReward();
    
    // Create confetti effect
    createConfetti();
};

// Show reward (meme and quote)
const showReward = () => {
    if (!memeToggle.checked && !quoteToggle.checked) {
        return;
    }
    
    rewardContainer.style.display = 'flex';
    
    if (memeToggle.checked) {
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        rewardImg.src = randomMeme;
        rewardImg.style.display = 'block';
    } else {
        rewardImg.style.display = 'none';
    }
    
    if (quoteToggle.checked) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        rewardQuote.textContent = `"${randomQuote.quote}"`;
        rewardAuthor.textContent = `- ${randomQuote.author}`;
        rewardQuote.style.display = 'block';
        rewardAuthor.style.display = 'block';
    } else {
        rewardQuote.style.display = 'none';
        rewardAuthor.style.display = 'none';
    }
};

// Create confetti effect
const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#FFD700', '#FFA500', '#27ae60'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            
            document.body.appendChild(confetti);
            
            // Animate falling
            const duration = Math.random() * 3000 + 2000; // 2-5 seconds
            const xPos = Math.random() * 100 - 50; // Random horizontal movement
            
            confetti.animate(
                [
                    { transform: 'translate(0, 0) rotate(0deg)' },
                    { transform: `translate(${xPos}px, 100vh) rotate(${Math.random() * 360}deg)` }
                ],
                {
                    duration: duration,
                    easing: 'ease-in'
                }
            );
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, duration);
        }, Math.random() * 1000); // Stagger confetti creation
    }
};

// Save settings to localStorage
const saveSettings = () => {
    localStorage.setItem('darkMode', darkModeToggle.checked);
    localStorage.setItem('soundEnabled', soundToggle.checked);
    localStorage.setItem('memesEnabled', memeToggle.checked);
    localStorage.setItem('quotesEnabled', quoteToggle.checked);
};

// Toggle dark mode
const toggleDarkMode = () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    saveSettings();
};

// Initialize app
const initApp = () => {
    streak=0;
    // Load settings from localStorage
    loadSettings();
    
    // Set initial timer display
    updateTimerDisplay();
    
    // Set streak display
    updateStreak(streak);
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
    darkModeToggle.addEventListener('change', toggleDarkMode);
    
    // Update timer when input changes
    minutesInput.addEventListener('change', setTimerFromInput);
    secondsInput.addEventListener('change', setTimerFromInput);
    
    // Save settings when they change
    soundToggle.addEventListener('change', saveSettings);
    memeToggle.addEventListener('change', saveSettings);
    quoteToggle.addEventListener('change', saveSettings);
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
// document.addEventListener('DOMContentLoaded',()=>{
//     streak=0;
// })
