// Global variables
let currentIntake = 0;
let dailyGoal = 2000;
let reminderInterval;
let reminderTimer;
let waterLog = [];

// Level 1 Bug 1: Missing initialization on page load
// Page loads with empty progress, should show initial state
window.onload = function () {
    updateProgress();
    updateWaterLog();
    document.getElementById('reminder-status').textContent = 'No reminder set';
};

// Level 1 Bug 2: Goal input doesn't validate properly
function setGoal() {
    const goalInput = document.getElementById('goal-input');
    const newGoal = goalInput.value;
    
    // Bug: No validation for empty or invalid values
    dailyGoal = newGoal;
    updateProgress();
    showNotification('Goal updated!', 'success');
}

function addWater(amount) {
    // Level 2 Bug 1: Amount parameter not validated
    // Bug: Negative numbers or invalid amounts can be passed
    currentIntake += amount;
    
    // Level 2 Bug 2: Date/time not properly tracked for log entries
    const logEntry = {
        amount: amount,
        time: new Date().toTimeString() // Bug: Should use toLocaleTimeString() for better format
    };
    waterLog.push(logEntry);
    
    updateProgress();
    updateWaterLog();
    checkGoalAchievement();
}

function addCustomWater() {
    const customInput = document.getElementById('custom-amount');
    const amount = parseInt(customInput.value);
    
    if (amount) {
        addWater(amount);
        customInput.value = '';
    }
}

function updateProgress() {
    // Level 3 Bug 1: Division by zero possible when goal is 0
    const percentage = (currentIntake / dailyGoal) * 100;
    
    document.getElementById('progress-text').textContent = `${currentIntake} / ${dailyGoal} ml`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    
    // Level 3 Bug 2: Percentage can exceed 100% and display incorrectly
    document.getElementById('percentage-display').textContent = `${Math.round(percentage)}%`;
}

function updateWaterLog() {
    const logContainer = document.getElementById('water-log');
    logContainer.innerHTML = '';
    
    waterLog.forEach((entry, index) => {
        const logItem = document.createElement('div');
        logItem.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
        logItem.innerHTML = `
            <span>💧 ${entry.amount}ml</span>
            <span class="text-sm text-gray-500">${entry.time}</span>
            <button onclick="removeLogEntry(${index})" class="text-red-500 hover:text-red-700 text-sm">✕</button>
        `;
        logContainer.appendChild(logItem);
    });
}

function removeLogEntry(index) {
    // Subtract the removed entry's amount from currentIntake
    if (waterLog[index]) {
        currentIntake -= waterLog[index].amount;
    }
    waterLog.splice(index, 1);
    updateProgress();
    updateWaterLog();
}

function setReminder() {
    const intervalInput = document.getElementById('reminder-interval');
    const minutes = parseInt(intervalInput.value);
    
    if (minutes) {
        // Clear previous timer before setting a new one
        if (reminderTimer) {
            clearInterval(reminderTimer);
        }
        reminderInterval = minutes;
        reminderTimer = setInterval(() => {
            showNotification('Time to drink water! 💧', 'reminder');
        }, minutes * 60 * 1000);
        
        document.getElementById('reminder-status').textContent = `Reminder every ${minutes} minutes`;
    }
}

function stopReminder() {
    clearInterval(reminderTimer);
    document.getElementById('reminder-status').textContent = 'No reminder set';
}

function checkGoalAchievement() {
    if (currentIntake >= dailyGoal) {
        showNotification('🎉 Congratulations! You reached your daily goal!', 'success');
    }
}

function resetDaily() {
    currentIntake = 0;
    waterLog = [];
    updateProgress();
    updateWaterLog();
    showNotification('Daily progress reset', 'info');
}

let notificationTimeout; // Add this at the top with other globals

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg`;
    
    // Apply color based on type
    if (type === 'success') {
        notification.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'reminder') {
        notification.classList.add('bg-blue-100', 'text-blue-800');
    } else if (type === 'info') {
        notification.classList.add('bg-gray-100', 'text-gray-800');
    } else if (type === 'error') {
        notification.classList.add('bg-red-100', 'text-red-800');
    } else {
        notification.classList.add('bg-white', 'text-black');
    }
    
    notification.classList.remove('hidden');

    // Auto-dismiss after 3 seconds, clear previous timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    notificationTimeout = setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Missing initialization - Level 1 Bug 1
// Should initialize display on page load
