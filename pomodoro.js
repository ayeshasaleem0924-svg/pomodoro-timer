let timerId = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isWorkMode = true;
let completedSessions = 0;

const timerDisplay = document.getElementById('timer');
const modeTitle = document.getElementById('mode-title');
const sessionCountDisplay = document.getElementById('session-count');
const workBtn = document.getElementById('work-mode-btn');
const breakBtn = document.getElementById('break-mode-btn');

// Safe Audio Synthesizer
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Sound Pitch
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.6); // Play duration: 0.6 seconds
  } catch (e) {
    console.log("Audio not supported or restricted:", e);
  }
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function startTimer() {
  if (timerId !== null) return; // Repeated click se fast timer hone ka bug handle ho gaya

  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerId);
      timerId = null;
      
      playNotificationSound();

      if (isWorkMode) {
        completedSessions++;
        sessionCountDisplay.textContent = completedSessions;
        alert("Focus session complete! Take a break.");
        switchMode('break');
      } else {
        alert("Break is over! Time to focus again.");
        switchMode('work');
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  pauseTimer();
  timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
  updateDisplay();
}

function switchMode(mode) {
  pauseTimer();
  if (mode === 'work') {
    isWorkMode = true;
    timeLeft = 25 * 60;
    modeTitle.textContent = "Focus Time 🎯";
    document.body.style.background = "linear-gradient(135deg, #ff6b6b, #ff8e53)";
    workBtn.classList.add('active-mode');
    breakBtn.classList.remove('active-mode');
  } else {
    isWorkMode = false;
    timeLeft = 5 * 60;
    modeTitle.textContent = "Break Time ☕";
    document.body.style.background = "linear-gradient(135deg, #4ecdc4, #556270)";
    breakBtn.classList.add('active-mode');
    workBtn.classList.remove('active-mode');
  }
  updateDisplay();
}

// Initial display setup on page load
updateDisplay();