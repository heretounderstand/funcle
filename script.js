// Funcle Game Logic - Version améliorée
// Générateur de fonctions mathématiques basé sur la date
class FunctionGenerator {
    constructor() {
        this.templates = {
            noob: [
                "x^2",
                "x"
            ],
            amateur: [
                "abs(x)",
                "1 / (1 + abs(x))",
                "sqrt(abs(x))",
                "x^3 / (1 + x^2)"
            ],
            medium: [
                "sin(x)",
                "cos(x)",
                "tanh(x)",
                "atan(x)",
                "x * exp(-x^2/10)",
                "sin(x) * exp(-abs(x)/5)"
            ],
            pro: [
                "x / (1 + x^2)",
                "(1 - exp(-abs(x)))",
                "log(1 + abs(x)) / log(11)",
                "x * sin(x) / (1 + x^2/4)",
                "sech(x/2)"
            ],
            nerd: [
                "sin(pi * x) / (pi * x)",
                "erf(x)",
                "gamma(1 + abs(x)/10) / gamma(2)",
                "lgamma(1 + abs(x)) / lgamma(11)",
                "(2 * atan(x) / pi)"
            ]
        };
        
        // Toutes les paires de nombres entre 1 et 9 sauf les exceptions
        const excluded = [
            [1,1], [2,2], [2,4], [2,6], [2,8], [3,3], [3,6], [3,9], 
            [4,2], [4,4], [4,6], [4,8], [5,5], [6,2], [6,3], [6,4], 
            [6,6], [6,8], [6,9], [7,7], [8,2], [8,4], [8,6], [8,8], 
            [9,3], [9,6], [9,9]
        ];
        
        this.coprimes = [];
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (!excluded.some(pair => pair[0] === i && pair[1] === j)) {
                    this.coprimes.push([i, j]);
                }
            }
        }
    }
    
    // Générateur de nombres pseudo-aléatoires basé sur une graine
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // Obtenir la date normalisée (YYYY-MM-DD)
    getDateString(date = new Date()) {
        return date.toISOString().split('T')[0];
    }
    
    // Convertir une chaîne en nombre pour la graine
    stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir en entier 32 bits
        }
        return Math.abs(hash);
    }
    
    // Générer une fonction pour un niveau donné
    generateFunction(level, date = new Date()) {
        const dateStr = this.getDateString(date);
        const seed = this.stringToSeed(dateStr + level);
        
        // Obtenir les templates du niveau
        const levelTemplates = this.templates[level];
        if (!levelTemplates) {
            throw new Error(`Niveau inconnu: ${level}`);
        }
        
        // Sélectionner 2 templates différents
        const template1Index = Math.floor(this.seededRandom(seed) * levelTemplates.length);
        let template2Index = Math.floor(this.seededRandom(seed + 1) * levelTemplates.length);
        
        // S'assurer qu'on a des templates différents si possible
        if (template1Index === template2Index && levelTemplates.length > 1) {
            template2Index = (template2Index + 1) % levelTemplates.length;
        }
        
        // Sélectionner les paires de coefficients
        const coprimeIndex1 = Math.floor(this.seededRandom(seed + 2) * this.coprimes.length);
        const coprimeIndex2 = Math.floor(this.seededRandom(seed + 3) * this.coprimes.length);
        
        const [A, B] = this.coprimes[coprimeIndex1];
        const [C, D] = this.coprimes[coprimeIndex2];
        
        // Constante E entre 0 et 9
        const E = Math.floor(this.seededRandom(seed + 4) * 10);
        
        // Signes aléatoires
        const sign1 = this.seededRandom(seed + 5) > 0.5 ? '+' : '-';
        const sign2 = this.seededRandom(seed + 6) > 0.5 ? '+' : '-';
        const sign3 = this.seededRandom(seed + 7) > 0.5 ? '+' : '-';
        
        // Construire la fonction seed (avec variables ABCDE)
        const seedFunction = `(A/B) * (${levelTemplates[template1Index]}) ${sign1} (C/D) * (${levelTemplates[template2Index]}) ${sign2} E`;
        
        // Construire la fonction avec les coefficients
        const formulaFunction = `(${A}/${B}) * (${levelTemplates[template1Index]}) ${sign1} (${C}/${D}) * (${levelTemplates[template2Index]}) ${sign2} ${E}`;
        
        return {
            level: level,
            date: dateStr,
            seed: seedFunction,
            formula: formulaFunction,
            coefficients: [A, B, C, D, E]
        };
    }
    
    // Générer toutes les fonctions pour une date donnée
    generateAllFunctions(date = new Date()) {
        const levels = ['noob', 'amateur', 'medium', 'pro', 'nerd'];
        const functions = {};
        
        for (const level of levels) {
            functions[level] = this.generateFunction(level, date);
        }
        
        return functions;
    }
    
    // Méthode compatible avec loadDailyChallenges()
    async loadDailyChallenges() {
        try {
            // Génération locale des défis quotidiens
            const challenges = this.generateAllFunctions();
            
            // Format compatible avec l'API
            this.dailyChallenges = {
                noob: {
                    seed: challenges.noob.seed,
                    formula: this.convertToMathJSFormat(challenges.noob.formula),
                    coefficients: challenges.noob.coefficients
                },
                amateur: {
                    seed: challenges.amateur.seed,
                    formula: this.convertToMathJSFormat(challenges.amateur.formula),
                    coefficients: challenges.amateur.coefficients
                },
                medium: {
                    seed: challenges.medium.seed,
                    formula: this.convertToMathJSFormat(challenges.medium.formula),
                    coefficients: challenges.medium.coefficients
                },
                pro: {
                    seed: challenges.pro.seed,
                    formula: this.convertToMathJSFormat(challenges.pro.formula),
                    coefficients: challenges.pro.coefficients
                },
                nerd: {
                    seed: challenges.nerd.seed,
                    formula: this.convertToMathJSFormat(challenges.nerd.formula),
                    coefficients: challenges.nerd.coefficients
                }
            };
            
            return true;
        } catch (error) {
            console.warn('Failed to generate daily challenges:', error);
            return false;
        }
    }
    
    // Conversion vers le format MathJS
    convertToMathJSFormat(formula) {
        let mathJSFormula = formula;
        
        // Remplacements pour MathJS
        mathJSFormula = mathJSFormula.replace(/\^/g, '^');
        mathJSFormula = mathJSFormula.replace(/pi/g, 'pi');
        mathJSFormula = mathJSFormula.replace(/lgamma\(/g, 'lgamma(');
        mathJSFormula = mathJSFormula.replace(/sech\(/g, 'sech(');
        mathJSFormula = mathJSFormula.replace(/erf\(/g, 'erf(');
        mathJSFormula = mathJSFormula.replace(/gamma\(/g, 'gamma(');
        
        return mathJSFormula;
    }
    evaluateFunction(functionData, x) {
        try {
            // Remplacer les fonctions mathématiques par leurs équivalents JavaScript
            let formula = functionData.formula;
            
            // Remplacements basiques
            formula = formula.replace(/\^/g, '**');
            formula = formula.replace(/abs\(/g, 'Math.abs(');
            formula = formula.replace(/sin\(/g, 'Math.sin(');
            formula = formula.replace(/cos\(/g, 'Math.cos(');
            formula = formula.replace(/tan\(/g, 'Math.tan(');
            formula = formula.replace(/atan\(/g, 'Math.atan(');
            formula = formula.replace(/exp\(/g, 'Math.exp(');
            formula = formula.replace(/log\(/g, 'Math.log(');
            formula = formula.replace(/sqrt\(/g, 'Math.sqrt(');
            formula = formula.replace(/pi/g, 'Math.PI');
            
            // Fonctions plus complexes (approximations)
            formula = formula.replace(/tanh\(/g, 'Math.tanh(');
            formula = formula.replace(/gamma\(/g, 'Math.gamma(');
            formula = formula.replace(/lgamma\(/g, 'Math.lgamma(');
            formula = formula.replace(/sech\(/g, '(1/Math.cosh(');
            formula = formula.replace(/erf\(/g, 'this.erf(');
            
            // Remplacer x par la valeur
            formula = formula.replace(/x/g, `(${x})`);
            
            return eval(formula);
        } catch (error) {
            console.error('Erreur lors de l\'évaluation:', error);
            return NaN;
        }
    }
    
    // Approximation de la fonction d'erreur
    erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }
}

class FuncleGame {
    constructor() {
        // Constants
        this.COEFFICIENTS = Array.from({ length: 10 }, (_, i) => i); // [0, 1, ..., 9]
        this.MAX_ATTEMPTS = 6;
        this.LEVELS = ['noob', 'amateur', 'medium', 'pro', 'nerd'];
        
        // Game state
        this.generator = new FunctionGenerator();
        this.dailyChallenges = null;
        this.currentFunction = null;
        this.attempts = [];
        this.currentAttempt = 0;
        this.gameWon = false;
        this.gameOver = false;
        this.level = 'amateur';
        this.showGraph = true;
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.levelStates = this.loadLevelStates();
        this.countdownInterval = null;
        
        // Initialize game
        this.init();
    }

    async init() {
        try {
            this.initDOM();
            this.bindEvents();
            await this.initializeGame();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }

    // DOM Initialization
    initDOM() {
        const elements = {
            levelSelect: 'level-select',
            attemptCounter: 'attempt-counter',
            graphContainer: 'graph-container',
            toggleGraphBtn: 'toggle-graph',
            inputSection: 'input-section',
            submitBtn: 'submit-btn',
            gameBoard: '.game-board',
            formulaDisplay: 'formula-display',
            winMessage: 'win-message',
            loseMessage: 'lose-message',
            winAttempts: 'win-attempts',
            winSolution: 'win-solution',
            loseSolution: 'lose-solution',
            newGameWinBtn: 'new-game-win',
            newGameLoseBtn: 'new-game-lose',
            shareBtn: 'share-btn',
            nextPuzzleTimer: 'next-puzzle-timer',
            helpButton: 'help-button',
            helpModal: 'help-modal',
            closeModal: '.close-modal'
        };

        // Assign DOM elements with error checking
        Object.entries(elements).forEach(([key, selector]) => {
            const element = selector.startsWith('.') 
                ? document.querySelector(selector)
                : document.getElementById(selector);
            
            if (!element) {
                console.warn(`Element not found: ${selector}`);
            }
            this[key] = element;
        });

        // Get special elements that need separate handling
        this.coeffInputs = document.querySelectorAll('.coeff-input');
        this.attemptRows = document.querySelectorAll('.attempt-row');

        if (this.coeffInputs.length === 0) {
            throw new Error('Coefficient inputs not found');
        }
    }

    // Event Binding
    bindEvents() {
        // Level selector
        this.levelSelect?.addEventListener('change', this.handleLevelChange.bind(this));

        // Graph toggle
        this.toggleGraphBtn?.addEventListener('click', this.toggleGraph.bind(this));

        this.helpButton?.addEventListener('click', this.helpBtn.bind(this))

        // Submit button
        this.submitBtn?.addEventListener('click', this.submitGuess.bind(this));

        // Input handlers
        this.coeffInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleInputChange(e, index));
            input.addEventListener('keypress', this.handleKeyPress.bind(this));
        });

        // Share button
        this.shareBtn?.addEventListener('click', this.copyResults.bind(this));

        // Handle resize for graph
        window.addEventListener('resize', this.debounce(() => {
            if (window.Plotly && this.showGraph) {
                Plotly.Plots.resize('function-graph');
            }
        }, 250));
    }

    // Event Handlers
    async handleLevelChange(e) {
        const newLevel = e.target.value;
    
        const levelState = this.levelStates[newLevel];
        if (levelState.attempts && levelState.attempts.length > 0) {
            this.attempts = levelState.attempts;
            this.currentAttempt = levelState.attempts.length;
        } else {
            this.attempts = [];
            this.currentAttempt = 0;
        }
        
        this.level = newLevel;
        await this.startNewGame();
    }

    toggleGraph() {
        this.showGraph = !this.showGraph;
        this.graphContainer?.classList.toggle('hidden', !this.showGraph);
        if (this.toggleGraphBtn) {
            this.toggleGraphBtn.textContent = this.showGraph ? 'Hide Graph' : 'Show Graph';
        }
    }

    helpBtn() {
        this.helpButton.onclick = () => this.helpModal.classList.remove("hidden");
        this.closeModal.onclick = () => this.helpModal.classList.add("hidden");
        this.window.onclick = e => { if (e.target == helpModal) this.helpModal.classList.add("hidden"); };
    }

    handleInputChange(e, index) {
        const value = parseInt(e.target.value);
        
        // Validate input
        if (value && !this.COEFFICIENTS.includes(value)) {
            e.target.setCustomValidity('Must be a number between 0 and 9');
        } else {
            e.target.setCustomValidity('');
        }
        
        // Auto-focus to next input
        if (value && this.COEFFICIENTS.includes(value) && index < this.coeffInputs.length - 1) {
            this.coeffInputs[index + 1].focus();
        }
        
        this.updateSubmitButton();
        this.changeLevelState();
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.submitGuess();
        }
    }

    // Level State Management
    loadLevelState(levelState) {
        if (levelState.attemptsList?.length > 0) {
            this.attempts = levelState.attemptsList.map(guess => ({
                guess: guess,
                evaluation: this.evaluateGuess(guess)
            }));
            this.currentAttempt = levelState.attemptsList.length;
        } else {
            this.attempts = [];
            this.currentAttempt = 0;
        }
    }

    loadLevelStates() {
        const saved = localStorage.getItem('funcle-level-states');
        const today = new Date().toDateString();
        
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date === today) {
                Object.keys(data.states).forEach(level => {
                    if (data.states[level].attemptsList && !data.states[level].attempts) {
                        data.states[level].attempts = [];
                        data.states[level].completed = false;
                    }
                });
                return data.states;
            }
        }
        
        return this.createNewLevelStates(today);
    }

    createNewLevelStates(today) {
        const newStates = {};
        this.LEVELS.forEach(level => {
            newStates[level] = {
                completed: false,
                won: false,
                attempts: []
            };
        });
        
        this.saveLevelStates(newStates, today);
        return newStates;
    }

    saveLevelStates(states = this.levelStates, date = new Date().toDateString()) {
        try {
            localStorage.setItem('funcle-level-states', JSON.stringify({
                date,
                states
            }));
        } catch (error) {
            console.error('Failed to save level states:', error);
        }
    }

    updateLevelState() {
        this.levelStates[this.level] = {
            completed: true,
            won: this.gameWon,
            attempts: this.attempts,
            timestamp: Date.now()
        };
        
        this.saveLevelStates();
        this.updateLevelSelector();
    }

    changeLevelState() {
        this.levelStates[this.level] = {
            completed: false,
            won: null,
            attempts: this.attempts,
            timestamp: Date.now()
        };
        
        this.saveLevelStates();
    }

    updateLevelSelector() {
        if (!this.levelSelect) return;

        const options = this.levelSelect.querySelectorAll('option');
        options.forEach(option => {
            const level = option.value;
            const state = this.levelStates[level];
            
            if (!state) return;

            const cleanText = option.textContent.replace(/ [✅❌]$/, '');
            
            if (state.completed) {
                option.textContent = cleanText + (state.won ? ' ✅' : ' ❌');
            } else {
                option.textContent = cleanText;
            }
        });
    }

    getNextIncompleteLevel() {
        return this.LEVELS.find(level => !this.levelStates[level]?.completed);
    }

    // Game Logic
    async initializeGame() {
        await this.startNewGame();
    }

    async initChallenges() {
        await this.generator.loadDailyChallenges();
        this.dailyChallenges = this.generator.dailyChallenges;
    }

    generateRandomFunction() {
        if (!this.dailyChallenges) {
            throw new Error('Daily challenges not loaded');
        }

        const challenge = this.dailyChallenges[this.level];
        if (!challenge) {
            throw new Error(`Challenge for level ${this.level} not found`);
        }

        const { formula, coefficients } = challenge;

        const evaluate = (x) => {
            try {
                if (typeof math === 'undefined') {
                    // Simple polynomial evaluation fallback
                    return this.evaluatePolynomial(coefficients, x);
                }
                
                const scope = { x: x };
                return math.evaluate(formula, scope);
            } catch (error) {
                console.error('Evaluation error:', error);
                return this.evaluatePolynomial(coefficients, x);
            }
        };

        return { coefficients, formula, evaluate };
    }

    evaluatePolynomial(coefficients, x) {
        return coefficients.reduce((result, coeff, index) => {
            return result + coeff * Math.pow(x, coefficients.length - 1 - index);
        }, 0);
    }

    async startNewGame() {
        try {
            // Load challenges if needed
            if (!this.dailyChallenges) {
                await this.initChallenges();
            }

            // Reset game state
            this.gameStartTime = Date.now();
            this.currentFunction = this.generateRandomFunction();
            this.updateFormulaDisplay();
            
            // Initialize based on level state
            const levelState = this.levelStates[this.level];
            if (levelState?.completed) {
                this.gameWon = levelState.won;
                this.gameOver = !levelState.won;
                this.handleGameEnd();
            } else {
                this.resetGameState();
            }

            // Update UI
            this.updateUI();
            this.drawGraph();

            if (this.attempts.length > 0) {
                this.reconstructGameBoard();
            }
            
            if (this.level === "noob") {
                console.log("Congrats! You found the console. Too bad your problem-solving skills peaked at 'Right-Click > Inspect'. Maybe try guessing next time?");
            } 
            else if (this.level === "amateur") {
                console.log("Ah, the console warrior! Sadly, cheating here won’t fix your IQ. There’s a reason you’re stuck in 'Amateur'—own it.");
            } 
            else if (this.level === "medium") {
                console.log("Statistically, you’re median. Morally, you’re deviant. Congrats on being *almost* good at something!");
            } 
            else if (this.level === "pro") {
                console.log("You’ve mastered Ctrl+Shift+I, but not the art of dignity. Fun fact: 99% of pros don’t need cheats. Guess which group you’re in?");
            } 
            else if (this.level === "nerd") {
                console.log("Ah, a fellow nerd! Or just a poser? Real nerds solve equations—not Google them. Nice try, though.");
            }
        } catch (error) {
            console.error('Failed to start new game:', error);
            this.showError('Failed to start new game');
        }
    }

    resetGameState() {
        this.gameWon = false;
        this.gameOver = false;
        
        if (!this.attempts || this.attempts.length === 0) {
            this.attempts = [];
            this.currentAttempt = 0;
        }
    }

    updateUI() {
        this.updateAttemptCounter();
        this.clearInputs();
        this.resetGameBoard();
        this.hideMessages();
        this.updateSubmitButton();

        if (this.gameWon || this.gameOver) {
            if (this.gameWon) {
                this.showWinMessage();
            } else {
                this.showLoseMessage();
            }
            this.hideInputSection();
        } else {
            this.showInputSection();
        }
    }

    handleGameEnd() {
        if (this.gameWon) {
            this.showWinMessage();
        } else {
            this.showLoseMessage();
        }
        this.hideInputSection();
    }

    updateFormulaDisplay() {
        if (this.formulaDisplay && this.currentFunction && this.dailyChallenges) {
            const challenge = this.dailyChallenges[this.level];
            const seed = challenge?.seed || 'Mathematical Function';
            this.formulaDisplay.innerHTML = `<strong>Formula:</strong> ${seed}`;
        }
    }

    // Game Board Management
    reconstructGameBoard() {
        this.resetGameBoard();
        
        this.attempts.forEach((attempt, index) => {
            if (index >= this.attemptRows.length) return;
            
            const row = this.attemptRows[index];
            const cells = row.querySelectorAll('.cell');
            
            cells.forEach((cell, cellIndex) => {
                if (cellIndex < attempt.guess.length) {
                    cell.textContent = attempt.guess[cellIndex];
                    cell.className = `cell ${attempt.evaluation[cellIndex]}`;
                }
            });
        });
    }

    resetGameBoard() {
        this.attemptRows.forEach(row => {
            const cells = row.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'cell empty';
            });
        });
    }

    updateGameBoard() {
        const lastAttempt = this.attempts[this.attempts.length - 1];
        const rowIndex = this.attempts.length - 1;
        
        if (rowIndex >= this.attemptRows.length) return;
        
        const row = this.attemptRows[rowIndex];
        const cells = row.querySelectorAll('.cell');
        
        cells.forEach((cell, index) => {
            if (index < lastAttempt.guess.length) {
                cell.textContent = lastAttempt.guess[index];
                cell.className = `cell ${lastAttempt.evaluation[index]}`;
            }
        });
    }

    // Game Mechanics
    submitGuess() {
        if (this.gameWon || this.gameOver) return;

        const guess = this.getCurrentGuess();
        if (!this.validateGuess(guess)) return;

        const evaluation = this.evaluateGuess(guess);
        this.attempts.push({ guess, evaluation });
        
        this.updateGameBoard();
        this.checkGameEnd(evaluation);
        this.updateGameAfterGuess();
    }

    getCurrentGuess() {
        return Array.from(this.coeffInputs).map(input => parseInt(input.value) || 0);
    }

    validateGuess(guess) {
        if (guess.some(g => !this.COEFFICIENTS.includes(g))) {
            this.showError('Please enter valid numbers: 0 - 9');
            return false;
        }
        return true;
    }

    checkGameEnd(evaluation) {
        if (evaluation.every(e => e === 'correct')) {
            this.gameWon = true;
            this.showWinMessage();
        } else if (this.attempts.length >= this.MAX_ATTEMPTS) {
            this.gameOver = true;
            this.showLoseMessage();
        }
    }

    updateGameAfterGuess() {
        this.currentAttempt++;
        this.updateAttemptCounter();
        this.clearInputs();
        
        if (this.gameWon || this.gameOver) {
            this.hideInputSection();
        }
    }

    evaluateGuess(guess) {
        if (!this.currentFunction) return [];
        
        const result = [];
        const correctCoeffs = this.currentFunction.coefficients;
        const remainingCoeffs = [...correctCoeffs]; // Copie pour suivre les coefficients restants

        // D'abord marquer les 'correct'
        for (let i = 0; i < Math.min(guess.length, correctCoeffs.length); i++) {
            if (guess[i] === correctCoeffs[i]) {
                result.push('correct');
                remainingCoeffs[i] = null; // Marquer comme déjà utilisé
            } else {
                result.push(null); // Temporaire, sera mis à jour après
            }
        }

        // Ensuite marquer les 'present' sans dépasser les occurrences
        for (let i = 0; i < result.length; i++) {
            if (result[i] === null) {
                const guessValue = guess[i];
                const foundIndex = remainingCoeffs.findIndex(val => val === guessValue);
                
                if (foundIndex !== -1) {
                    result[i] = 'present';
                    remainingCoeffs[foundIndex] = null; // Marquer comme utilisé
                } else {
                    result[i] = 'absent';
                }
            }
        }
        
        return result;
    }

    // Graph Drawing
    drawGraph() {
        if (!this.currentFunction || !this.showGraph) return;

        try {
            const { xValues, yValues } = this.generateGraphData();
            const trace = this.createGraphTrace(xValues, yValues);
            const layout = this.createGraphLayout();
            const config = { displayModeBar: false, responsive: true };
            
            if (typeof Plotly !== 'undefined') {
                Plotly.newPlot('function-graph', [trace], layout, config);
            }
        } catch (error) {
            console.error('Failed to draw graph:', error);
        }
    }

    generateGraphData() {
        const xValues = [];
        const yValues = [];
        
        for (let x = -10; x <= 10; x += 0.001) {
            try {
                const y = this.currentFunction.evaluate(x);
                
                if (isFinite(y) && Math.abs(y) < 1000) {
                    xValues.push(x);
                    yValues.push(y);
                }
            } catch (e) {
                // Skip problematic points
            }
        }
        
        return { xValues, yValues };
    }

    createGraphTrace(xValues, yValues) {
        return {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: '#3b82f6',
                width: 3
            },
            name: 'f(x)'
        };
    }

    createGraphLayout() {
        return {
            title: {
                text: 'Function Graph',
                font: { size: 16, color: '#374151' }
            },
            xaxis: {
                title: 'x',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#9ca3af',
                zerolinewidth: 2,
                tickfont: { size: 12, color: '#6b7280' }
            },
            yaxis: {
                title: 'f(x)',
                gridcolor: '#e5e7eb',
                zerolinecolor: '#9ca3af',
                zerolinewidth: 2,
                tickfont: { size: 12, color: '#6b7280' }
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            margin: { l: 40, r: 20, t: 40, b: 40 },
            autosize: true,
            showlegend: false
        };
    }

    // UI Updates
    clearInputs() {
        this.coeffInputs.forEach(input => {
            input.value = '';
            input.setCustomValidity('');
        });
        if (this.coeffInputs.length > 0) {
            this.coeffInputs[0].focus();
        }
    }

    updateAttemptCounter() {
        if (this.attemptCounter) {
            this.attemptCounter.textContent = this.attempts.length;
        }
    }

    updateSubmitButton() {
        if (!this.submitBtn) return;
        
        const allFilled = Array.from(this.coeffInputs).every(input => 
            input.value && this.COEFFICIENTS.includes(parseInt(input.value))
        );
        
        this.submitBtn.disabled = !allFilled || this.gameWon || this.gameOver;
    }

    // Message Display
    showWinMessage() {
        if (this.winAttempts) {
            this.winAttempts.textContent = this.attempts.length;
        }
        if (this.winSolution) {
            this.winSolution.textContent = this.currentFunction.coefficients.join(', ');
        }
        if (this.winMessage) {
            this.winMessage.classList.remove('hidden');
        }
        
        this.gameEndTime = Date.now();
        this.startNextPuzzleCountdown();
        this.updateLevelState();
        this.updateNextLevelButton();
    }

    showLoseMessage() {
        if (this.loseSolution) {
            this.loseSolution.textContent = this.currentFunction.coefficients.join(', ');
        }
        if (this.loseMessage) {
            this.loseMessage.classList.remove('hidden');
        }
        
        this.updateLevelState();
        this.updateNextLevelButton();
    }

    hideMessages() {
        this.winMessage?.classList.add('hidden');
        this.loseMessage?.classList.add('hidden');
    }

    showInputSection() {
        this.inputSection?.classList.remove('hidden');
    }

    hideInputSection() {
        this.inputSection?.classList.add('hidden');
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper error UI
        console.error(message);
        alert(message); // Replace with better UI
    }

    // Level Navigation
    updateNextLevelButton() {
        const nextLevel = this.getNextIncompleteLevel();
        
        const updateButton = (button, hasNext) => {
            if (!button) return;
            
            if (hasNext) {
                button.textContent = `Try ${nextLevel.toUpperCase()} Level`;
                button.onclick = () => this.goToLevel(nextLevel);
                button.disabled = false;
            } else {
                button.textContent = 'All Levels Complete! 🎉';
                button.onclick = null;
                button.disabled = true;
            }
        };

        updateButton(this.newGameWinBtn, !!nextLevel);
        updateButton(this.newGameLoseBtn, !!nextLevel);
    }

    goToLevel(targetLevel) {
        this.level = targetLevel;
        this.levelSelect.value = targetLevel;
        
        const levelState = this.levelStates[targetLevel];
        if (levelState.attempts && levelState.attempts.length > 0) {
            this.attempts = levelState.attempts;
            this.currentAttempt = levelState.attempts.length;
        } else {
            this.attempts = [];
            this.currentAttempt = 0;
        }
        
        this.startNewGame();
    }

    // Sharing and Timer
    copyResults() {
        try {
            const pattern = this.generateResultsPattern();
            this.copyToClipboard(pattern);
            this.showShareFeedback();
            this.shareOnSocial(pattern);
        } catch (error) {
            console.error('Failed to copy results:', error);
            this.showError('Failed to copy results');
        }
    }

    generateResultsPattern() {
        const attempts = this.attempts.length;
        const level = this.level.charAt(0).toUpperCase() + this.level.slice(1);
        const gameTime = this.gameEndTime ? Math.round((this.gameEndTime - this.gameStartTime) / 1000) : 0;
        
        let pattern = `🔢 Funcle ${level} ${attempts}/6\n\n`;
        
        this.attempts.forEach(attempt => {
            let row = '';
            attempt.evaluation.forEach(evalu => {
                row += evalu === 'correct' ? '🟩' : evalu === 'present' ? '🟨' : '⬜';
            });
            pattern += row + '\n';
        });
        
        pattern += `\n⏱️ Solved in ${gameTime}s`;
        pattern += `\n🧮 Mathematical puzzle solving game`;
        pattern += `\n#Funcle #MathPuzzle #DailyChallenge`;
        
        return pattern;
    }

    async copyToClipboard(text) {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    showShareFeedback() {
        if (this.shareBtn) {
            const originalText = this.shareBtn.textContent;
            this.shareBtn.textContent = 'Copied! ✓';
            setTimeout(() => {
                this.shareBtn.textContent = originalText;
            }, 2000);
        }
    }

    shareOnSocial(pattern) {
        if (navigator.share) {
            navigator.share({
                title: 'Funcle Results',
                text: pattern
            }).catch(err => console.log('Error sharing:', err));
        } else {
            const shareText = encodeURIComponent(pattern);
            const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
            window.open(shareUrl, '_blank');
        }
    }

    startNextPuzzleCountdown() {
        // Clear existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const updateTimer = () => {
            if (!this.nextPuzzleTimer) return;
            
            const now = new Date();
            const timeLeft = tomorrow - now;
            
            if (timeLeft <= 0) {
                this.nextPuzzleTimer.textContent = "New puzzle available!";
                clearInterval(this.countdownInterval);
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            this.nextPuzzleTimer.textContent = `Next puzzle in: ${hours}h ${minutes}m ${seconds}s`;
        };
        
        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Cleanup
    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        // Remove event listeners if needed
        window.removeEventListener('resize', this.debounce);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new FuncleGame();
    } catch (error) {
        console.error('Failed to initialize Funcle game:', error);
    }
});