// 番茄钟状态变量
let isRunning = false;
let isWorkTime = true;
let timer = null;
let startTime = null;
let pausedTime = 0;
let remainingTime = 0;

// 默认设置
let workDuration = 25 * 60; // 25分钟，以秒为单位
let breakDuration = 5 * 60;  // 5分钟，以秒为单位
let soundEnabled = true;

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

// 初始化
function init() {
    workTimeInput.value = workDuration / 60;
    breakTimeInput.value = breakDuration / 60;
    soundEnabledCheckbox.checked = soundEnabled;
    
    updateTimerDisplay(workDuration);
    updateStatus();
    
    // 添加事件监听器
    startBtn.addEventListener('click', toggleTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    workTimeInput.addEventListener('change', updateWorkDuration);
    breakTimeInput.addEventListener('change', updateBreakDuration);
    soundEnabledCheckbox.addEventListener('change', toggleSound);
    
    // 添加页面可见性变化事件监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// 处理页面可见性变化
function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && isRunning) {
        // 页面重新变为可见且计时器正在运行，更新计时器
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        remainingTime = (isWorkTime ? workDuration : breakDuration) - elapsedTime - pausedTime;
        
        // 如果时间已经用完，则触发计时结束
        if (remainingTime <= 0) {
            timerComplete();
        } else {
            // 否则更新显示
            updateTimerDisplay(remainingTime);
        }
    }
}

// 开始/暂停计时器
function toggleTimer() {
    if (isRunning) {
        // 暂停计时器
        clearInterval(timer);
        const currentTime = new Date().getTime();
        pausedTime += Math.floor((currentTime - startTime) / 1000);
        startBtn.textContent = '开始';
        isRunning = false;
    } else {
        // 开始计时器
        startTime = new Date().getTime();
        isRunning = true;
        startBtn.textContent = '暂停';
        
        // 如果是重新开始，重置剩余时间
        if (remainingTime <= 0) {
            remainingTime = isWorkTime ? workDuration : breakDuration;
            pausedTime = 0;
        }
        
        timer = setInterval(updateTimer, 1000);
    }
}

// 更新计时器
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    remainingTime = (isWorkTime ? workDuration : breakDuration) - elapsedTime - pausedTime;
    
    if (remainingTime <= 0) {
        timerComplete();
    } else {
        updateTimerDisplay(remainingTime);
    }
}

// 计时结束
function timerComplete() {
    clearInterval(timer);
    isRunning = false;
    pausedTime = 0;
    
    // 播放提示音
    if (soundEnabled) {
        bellSound.currentTime = 0;
        bellSound.play().catch(error => {
            console.error('播放声音失败:', error);
        });
    }
    
    // 切换工作/休息模式
    isWorkTime = !isWorkTime;
    remainingTime = isWorkTime ? workDuration : breakDuration;
    
    // 更新UI
    updateTimerDisplay(remainingTime);
    updateStatus();
    startBtn.textContent = '开始';
}

/**
 * 暂停计时器
 */
function pauseTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    isRunning = false;
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
    isWorkTime = true;
    modeIndicator.textContent = '工作时间';
    
    // 重置时间
    remainingTime = workDuration;
    
    // 更新UI
    updateTimerDisplay(remainingTime);
    updateStatus();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

/**
 * 更新计时器显示
 */
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = remainingSeconds.toString().padStart(2, '0');
}

/**
 * 更新状态文本
 */
function updateStatus() {
    modeIndicator.textContent = isWorkTime ? '工作时间' : '休息时间';
    document.body.className = isWorkTime ? 'work-mode' : 'break-mode';
}

/**
 * 更新工作时间
 */
function updateWorkDuration() {
    const newDuration = parseInt(workTimeInput.value);
    if (newDuration > 0) {
        workDuration = newDuration * 60;
        if (isWorkTime && !isRunning) {
            remainingTime = workDuration;
            updateTimerDisplay(remainingTime);
        }
    } else {
        workTimeInput.value = workDuration / 60;
    }
}

/**
 * 更新休息时间
 */
function updateBreakDuration() {
    const newDuration = parseInt(breakTimeInput.value);
    if (newDuration > 0) {
        breakDuration = newDuration * 60;
        if (!isWorkTime && !isRunning) {
            remainingTime = breakDuration;
            updateTimerDisplay(remainingTime);
        }
    } else {
        breakTimeInput.value = breakDuration / 60;
    }
}

/**
 * 切换声音
 */
function toggleSound() {
    soundEnabled = soundEnabledCheckbox.checked;
}

// 初始化应用
window.addEventListener('load', init); 