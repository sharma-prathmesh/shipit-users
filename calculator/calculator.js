// Global variables
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let memory = 0;
let isNewCalculation = false;

// Initialize calculator on page load
window.onload = function() {
  display.value = '0';
};

function isOperator(value) {
  return ['+', '-', '*', '/'].includes(value);
}

function appendToDisplay(value) {
  if (isNewCalculation && !isOperator(value)) {
    currentInput = '';
    isNewCalculation = false;
  }

  if (isOperator(value)) {
    if (currentInput === '' && value === '-') {
      currentInput += value; // allow negative numbers
    } else if (currentInput !== '') {
      if (previousInput !== '' && operator !== '') {
        calculate();
      }
      operator = value;
      previousInput = currentInput;
      currentInput = '';
    }
  } else {
    // Prevent multiple decimal points
    if (value === '.' && currentInput.includes('.')) return;
    currentInput += value;
  }
  updateDisplay();
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

function deleteLast() {
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
  }
}

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
      if (current === 0) {
        display.value = "Error";
        currentInput = '';
        previousInput = '';
        operator = '';
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Round to avoid floating point errors
  result = Math.round(result * 1000000) / 1000000;

  currentInput = result.toString();
  operator = '';
  previousInput = currentInput; // keep result for chaining
  isNewCalculation = true;
  updateDisplay();
}

// Memory Functions
function memoryStore() {
  memory = parseFloat(currentInput || display.value);
}

function memoryRecall() {
  currentInput = memory.toString();
  updateDisplay();
}

function memoryClear() {
  memory = 0;
}

function memoryAdd() {
  memory += parseFloat(currentInput || display.value);
  if (Math.abs(memory) > Number.MAX_SAFE_INTEGER) {
    memory = 0;
    alert("Memory overflow! Resetting memory.");
  }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!isNaN(e.key) || e.key === '.') {
    appendToDisplay(e.key);
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    appendToDisplay(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    calculate();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
