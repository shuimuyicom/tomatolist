// DOM元素
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const modeIndicator = document.getElementById('mode-indicator');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const soundEnabledCheckbox = document.getElementById('sound-enabled');
const bellSound = document.getElementById('bell-sound');

// 番茄钟状态
let timer = null;
let isRunning = false;
let isPaused = false;
let isWorkMode = true;
let totalSeconds = 25 * 60; // 默认25分钟
let remainingSeconds = totalSeconds;

// 初始化显示
updateTimerDisplay();

// 事件监听器
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
workTimeInput.addEventListener('change', updateWorkTime);
breakTimeInput.addEventListener('change', updateBreakTime);

/**
 * 开始计时器
 */
function startTimer() {
    if (isPaused) {
        isPaused = false;
    } else {
        // 如果是新的计时，根据当前模式设置时间
        if (!isRunning) {
            if (isWorkMode) {
                totalSeconds = parseInt(workTimeInput.value) * 60;
            } else {
                totalSeconds = parseInt(breakTimeInput.value) * 60;
            }
            remainingSeconds = totalSeconds;
            updateTimerDisplay();
        }
    }
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // 启动计时器
    timer = setInterval(() => {
        remainingSeconds--;
        
        if (remainingSeconds <= 0) {
            // 计时结束
            clearInterval(timer);
            playSound();
            
            // 切换模式
            isWorkMode = !isWorkMode;
            modeIndicator.textContent = isWorkMode ? '工作时间' : '休息时间';
            
            // 重置计时器
            totalSeconds = isWorkMode 
                ? parseInt(workTimeInput.value) * 60 
                : parseInt(breakTimeInput.value) * 60;
            remainingSeconds = totalSeconds;
            
            isRunning = false;
            isPaused = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
        
        updateTimerDisplay();
    }, 1000);
}

/**
 * 暂停计时器
 */
function pauseTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

/**
 * 重置计时器
 */
function resetTimer() {
    // 清除计时器
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    // 重置状态
    isRunning = false;
    isPaused = false;
    isWorkMode = true;
    modeIndicator.textContent = '工作时间';
    
    // 重置时间
    totalSeconds = parseInt(workTimeInput.value) * 60;
    remainingSeconds = totalSeconds;
    
    // 更新UI
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

/**
 * 更新工作时间
 */
function updateWorkTime() {
    if (!isRunning && isWorkMode) {
        totalSeconds = parseInt(workTimeInput.value) * 60;
        remainingSeconds = totalSeconds;
        updateTimerDisplay();
    }
}

/**
 * 更新休息时间
 */
function updateBreakTime() {
    if (!isRunning && !isWorkMode) {
        totalSeconds = parseInt(breakTimeInput.value) * 60;
        remainingSeconds = totalSeconds;
        updateTimerDisplay();
    }
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

/**
 * 播放提示音
 */
function playSound() {
    if (soundEnabledCheckbox.checked) {
        bellSound.currentTime = 0;
        bellSound.play().catch(error => {
            console.error('播放声音失败:', error);
        });
    }
} 