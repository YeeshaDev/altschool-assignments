// Variables to track all the time needed
let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let interval = null;
let isRunning = false;
let lapCounter = 1;


const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('lapsContainer');
const lapsList = document.getElementById('lapsList');
const clearLapsBtn = document.getElementById('clearLapsBtn');
const themeToggle = document.getElementById('themeToggle');

/**
 * Initialize theme based on user's previous preference or system preference
 */
function initializeTheme() {
    // Check the saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Format number to always show two digits
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
function formatTime(num) {
    return num < 10 ? '0' + num : num;
}

/**
 * Format milliseconds to show three digits
 * @param {number} num - The milliseconds to format
 * @returns {string} Formatted milliseconds
 */
function formatMilliseconds(num) {
    if (num < 10) return '00' + num;
    if (num < 100) return '0' + num;
    return num;
}

/**
 * Update the display of the stopwatch with current time
 */
function updateDisplay() {
    display.innerHTML = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}<span class="milliseconds">.${formatMilliseconds(milliseconds)}</span>`;
}

/**
 * Start the stopwatch
 * Prevents multiple intervals from running simultaneously
 */
function start() {
    if (!isRunning) {
        isRunning = true;
        display.classList.add('running');
        startBtn.disabled = true;
        lapBtn.disabled = false;
        
        // Update every 10 milliseconds for smooth animation
        interval = setInterval(() => {
            milliseconds += 10;
            
            // Convert milliseconds to seconds
            if (milliseconds >= 1000) {
                milliseconds = 0;
                seconds++;
                
                // Convert seconds to minutes
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    
                    // Convert minutes to hours
                    if (minutes >= 60) {
                        minutes = 0;
                        hours++;
                    }
                }
            }
            
            updateDisplay();
        }, 10);
    }
}

/**
 * Stop/pause the stopwatch
 * Clears the interval but maintains current time
 */
function stop() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        display.classList.remove('running');
        startBtn.disabled = false;
        lapBtn.disabled = true;
    }
}

/**
 * Reset the stopwatch to zero
 * Stops the timer and resets all values
 */
function reset() {
    clearInterval(interval);
    isRunning = false;
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    updateDisplay();
    display.classList.remove('running');
    startBtn.disabled = false;
    lapBtn.disabled = true;
}

/**
 * Record a lap/split time
 * Only works when stopwatch is running
 */
function recordLap() {
    if (isRunning) {
        const lapTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
        
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-time';
        lapElement.innerHTML = `
            <span class="lap-number">Lap ${lapCounter}</span>
            <span class="lap-value">${lapTime}</span>
        `;
        
        lapsList.insertBefore(lapElement, lapsList.firstChild);
        lapsContainer.style.display = 'block';
        lapCounter++;
    }
}

/**
 * Clear all recorded laps
 * Removes all lap elements and hides container
 */
function clearLaps() {
    lapsList.innerHTML = '';
    lapsContainer.style.display = 'none';
    lapCounter = 1;
}

initializeTheme();

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);
clearLapsBtn.addEventListener('click', clearLaps);
themeToggle.addEventListener('click', toggleTheme);

/**
 * Keyboard shortcuts for enhanced user experience
 * Space: Start/Stop toggle
 * R: Reset stopwatch
 * L: Record lap (only when running)
 * T: Toggle theme
 */
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); 
        if (isRunning) {
            stop();
        } else {
            start();
        }
    } else if (e.code === 'KeyR') {
        reset();
    } else if (e.code === 'KeyL' && isRunning) {
        recordLap();
    } else if (e.code === 'KeyT') {
        toggleTheme();
    }
});