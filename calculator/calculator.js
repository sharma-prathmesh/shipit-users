// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let isNewCalculation = false;

// Bug Level 1 - Issue 1: Missing initialization of display
// The display should be initialized to '0' on page load
window.onload = function() {
    display.value = '0';
};

// Bug Level 1 - Issue 2: Incorrect operator precedence handling
function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            // Allow negative numbers
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function updateDisplay() {
    if (currentInput === '') {
        display.value = previousInput || '0';
    } else {
        display.value = currentInput;
    }
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    isNewCalculation = false;
    display.value = '0';
}

// Bug Level 2 - Issue 1: Division by zero not handled properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current; 
            break;
        default:
            return;
    }
    
    // Bug Level 2 - Issue 2: Floating point precision issues
    // Result should be rounded to avoid floating point errors
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    isNewCalculation = true;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
        updateDisplay();
    }
}

// Bug Level 3 - Issue 1: Memory functions don't work with current display value
function memoryStore() {
    if (currentInput !== '') {
        memory = parseFloat(display.value); // Bug: Should use currentInput or display.value consistently
    }
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

// Bug Level 3 - Issue 2: Memory add function has logical error
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value); // Bug: Inconsistent behavior
    }
}

function appendToDisplay(value) {
    if (isNewCalculation && !isOperator(value)) {
        currentInput = '';
        isNewCalculation = false;
    }
    
    if (isOperator(value)) {
        if (currentInput === '' && value === '-') {
            currentInput += value;
        } else if (currentInput !== '') {
            if (previousInput !== '' && operator !== '') {
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    } else {
        // Fix: Prevent multiple decimal points
        if (value === '.' && currentInput.includes('.')) {
            return;
        }
        currentInput += value;
    }
    
    updateDisplay();
}

// Bug Level 4 - Issue 2: Keyboard input not supported
// Missing keyboard event listeners for better UX
// Keyboard input support for better UX
document.addEventListener('keydown', function(e) {
    const key = e.key;
    if (/\d/.test(key)) {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '.') {
        appendToDisplay(key);
    }
});
// Bug Level 5 - Issue 1: Chain calculations don't work properly
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0|| prev===0) { // Bug: Division by zero not handled
                result=prev/0.000001;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Bug: Chain calculations reset previousInput incorrectly
    currentInput = result.toString();
    operator = '';
    previousInput = currentInput; // Keep result for chaining
    isNewCalculation = true;
    updateDisplay();
}

// Bug Level 5 - Issue 2: Memory overflow not handled
function memoryAdd() {
    if (currentInput !== '') {
        memory += parseFloat(currentInput);
    } else {
        memory += parseFloat(display.value);
    }
    // Limit memory to reasonable bounds
    if (memory > 1e12) memory = 1e12;
    if (memory < -1e12) memory = -1e12;
}

// Initialize calculator on page load
window.onload = function() {
    display.value = '0'; // This should fix Level 1 Bug 1 if added
};
