// DOM Elements
const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const buttons = document.querySelectorAll('.btn');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetDisplay = false;

// Update display
function updateDisplay() {
    currentDisplay.textContent = currentOperand;
    if (operation) {
        previousDisplay.textContent = `${previousOperand} ${operation}`;
    } else {
        previousDisplay.textContent = previousOperand;
    }
}

// Clear calculator
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
}

// Clear current entry
function clearEntry() {
    currentOperand = '0';
}

// Delete last character
function deleteLast() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Append number
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentOperand = number;
        shouldResetDisplay = false;
    } else {
        currentOperand = currentOperand === '0' ? number : currentOperand + number;
    }
}

// Choose operation
function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    shouldResetDisplay = true;
}

// Calculate result
function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = add(prev, current);
            break;
        case '-':
            result = subtract(prev, current);
            break;
        case '×':
            result = multiply(prev, current);
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearAll();
                return;
            }
            result = divide(prev, current);
            break;
        default:
            return;
    }
    
    // Round to 8 decimal places to avoid floating point issues
    result = Math.round(result * 100000000) / 100000000;
    
    currentOperand = result.toString();
    operation = null;
    previousOperand = '';
    shouldResetDisplay = true;
}

// Basic math functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return a / b; }

// Operate function (as required)
function operate(operator, a, b) {
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '×': return multiply(a, b);
        case '÷': return b === 0 ? null : divide(a, b);
        default: return null;
    }
}

// Handle decimal point
function addDecimal() {
    if (shouldResetDisplay) {
        currentOperand = '0.';
        shouldResetDisplay = false;
        return;
    }
    
    if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
}

// Button click handler
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Number buttons
        if (button.classList.contains('number')) {
            appendNumber(button.dataset.number);
        }
        // Operation buttons
        else if (button.classList.contains('operator')) {
            chooseOperation(button.dataset.operation);
        }
        // Action buttons
        else if (button.dataset.action) {
            switch (button.dataset.action) {
                case 'clear-all':
                    clearAll();
                    break;
                case 'clear':
                    clearEntry();
                    break;
                case 'delete':
                    deleteLast();
                    break;
                case 'decimal':
                    addDecimal();
                    break;
                case 'equals':
                    calculate();
                    break;
            }
        }
        
        updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    // Numbers
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    }
    // Operators
    else if (['+', '-'].includes(event.key)) {
        chooseOperation(event.key);
    }
    else if (event.key === '*') {
        chooseOperation('×');
    }
    else if (event.key === '/') {
        event.preventDefault();
        chooseOperation('÷');
    }
    // Other keys
    else if (event.key === '.') {
        addDecimal();
    }
    else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    }
    else if (event.key === 'Escape') {
        clearAll();
    }
    else if (event.key === 'Backspace') {
        deleteLast();
    }
    else if (event.key === 'Delete') {
        clearEntry();
    }
    
    updateDisplay();
});

// Initial display
updateDisplay();

// Test in console (as required)
console.log('Test basic functions:');
console.log('add(5, 3) =', add(5, 3));
console.log('subtract(10, 4) =', subtract(10, 4));
console.log('multiply(6, 7) =', multiply(6, 7));
console.log('divide(15, 3) =', divide(15, 3));

console.log('\nTest operate function:');
console.log('operate("+", 12, 7) =', operate('+', 12, 7));
console.log('operate("-", 12, 7) =', operate('-', 12, 7));
console.log('operate("×", 12, 7) =', operate('×', 12, 7));
console.log('operate("÷", 12, 4) =', operate('÷', 12, 4));