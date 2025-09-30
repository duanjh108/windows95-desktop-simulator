// Windows 95 桌面模拟器 JavaScript

class Windows95Desktop {
    constructor() {
        this.windows = [];
        this.windowZIndex = 100;
        this.activeWindow = null;
        this.startMenuOpen = false;
        this.soundEnabled = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        this.playStartupSound();
        
        // 每秒更新时钟
        setInterval(() => this.updateClock(), 1000);
    }

    setupEventListeners() {
        // 开始按钮
        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // 桌面点击
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target.id === 'desktop') {
                this.closeStartMenu();
                this.deselectAllIcons();
            }
        });

        // 桌面右键菜单
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // 关闭右键菜单
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // 桌面图标双击
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.getAttribute('data-app');
                this.openApplication(app);
            });
            
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIcon(icon);
            });
        });

        // 开始菜单项点击
        document.querySelectorAll('[data-app]').forEach(item => {
            item.addEventListener('click', () => {
                const app = item.getAttribute('data-app');
                this.openApplication(app);
                this.closeStartMenu();
            });
        });

        // 关机按钮
        document.getElementById('shutdown').addEventListener('click', () => {
            this.showShutdownDialog();
        });

        // 全局键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Escape') {
                // Ctrl+Esc 打开开始菜单
                this.toggleStartMenu();
            }
        });
    }

    // 音效系统
    playSound(soundId) {
        if (!this.soundEnabled) return;
        
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // 忽略播放失败
            });
        }
    }

    playStartupSound() {
        this.playSound('startup-sound');
    }

    playClickSound() {
        this.playSound('click-sound');
    }

    playErrorSound() {
        this.playSound('error-sound');
    }

    // 时钟更新
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('clock').textContent = timeString;
    }

    // 开始菜单管理
    toggleStartMenu() {
        this.playClickSound();
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        this.startMenuOpen = !this.startMenuOpen;
        
        if (this.startMenuOpen) {
            startMenu.classList.remove('hidden');
            startButton.classList.add('active');
        } else {
            startMenu.classList.add('hidden');
            startButton.classList.remove('active');
        }
    }

    closeStartMenu() {
        if (this.startMenuOpen) {
            document.getElementById('start-menu').classList.add('hidden');
            document.getElementById('start-button').classList.remove('active');
            this.startMenuOpen = false;
        }
    }

    // 右键菜单管理
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.remove('hidden');
    }

    hideContextMenu() {
        document.getElementById('context-menu').classList.add('hidden');
    }

    // 桌面图标管理
    selectIcon(icon) {
        this.deselectAllIcons();
        icon.classList.add('selected');
    }

    deselectAllIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    // 应用程序管理
    openApplication(appName) {
        this.playClickSound();
        
        switch (appName) {
            case 'notepad':
                this.openNotepad();
                break;
            case 'calculator':
                this.openCalculator();
                break;
            case 'paint':
                this.openPaint();
                break;
            case 'my-computer':
                this.openMyComputer();
                break;
            case 'recycle-bin':
                this.openRecycleBin();
                break;
            case 'minesweeper':
                this.openMinesweeper();
                break;
            case 'cps-tester':
                this.openCPSTester();
                break;
            default:
                this.showNotImplementedDialog(appName);
        }
    }

    // 窗口管理
    createWindow(title, content, width = 400, height = 300, icon = '📄') {
        const windowId = 'window-' + Date.now();
        const window = document.createElement('div');
        window.className = 'window active';
        window.id = windowId;
        window.style.width = width + 'px';
        window.style.height = height + 'px';
        window.style.left = (50 + this.windows.length * 30) + 'px';
        window.style.top = (50 + this.windows.length * 30) + 'px';
        window.style.zIndex = ++this.windowZIndex;

        window.innerHTML = `
            <div class="window-titlebar">
                <span class="window-title">${icon} ${title}</span>
                <div class="window-controls">
                    <div class="window-control" data-action="minimize">_</div>
                    <div class="window-control" data-action="maximize">□</div>
                    <div class="window-control" data-action="close">×</div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        document.getElementById('windows-container').appendChild(window);
        
        this.setupWindowEvents(window, title, icon);
        this.addTaskbarButton(windowId, title, icon);
        
        this.windows.push({
            id: windowId,
            element: window,
            title: title,
            icon: icon,
            minimized: false,
            maximized: false
        });

        this.setActiveWindow(window);
        return window;
    }

    setupWindowEvents(window, title, icon) {
        const titlebar = window.querySelector('.window-titlebar');
        const controls = window.querySelectorAll('.window-control');
        
        // 窗口拖拽
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-control')) return;
            
            isDragging = true;
            this.setActiveWindow(window);
            
            const rect = window.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
        });
        
        const handleDrag = (e) => {
            if (!isDragging || window.classList.contains('maximized')) return;
            
            window.style.left = (e.clientX - dragOffset.x) + 'px';
            window.style.top = (e.clientY - dragOffset.y) + 'px';
        };
        
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        };

        // 窗口控制按钮
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.getAttribute('data-action');
                
                switch (action) {
                    case 'minimize':
                        this.minimizeWindow(window);
                        break;
                    case 'maximize':
                        this.toggleMaximizeWindow(window);
                        break;
                    case 'close':
                        this.closeWindow(window);
                        break;
                }
            });
        });

        // 窗口点击激活
        window.addEventListener('mousedown', () => {
            this.setActiveWindow(window);
        });
    }

    setActiveWindow(window) {
        // 移除所有窗口的活动状态
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('active');
            w.classList.add('inactive');
        });
        
        // 设置当前窗口为活动
        window.classList.add('active');
        window.classList.remove('inactive');
        window.style.zIndex = ++this.windowZIndex;
        
        this.activeWindow = window;
        
        // 更新任务栏按钮状态
        this.updateTaskbarButtons();
    }

    minimizeWindow(window) {
        window.style.display = 'none';
        const windowData = this.windows.find(w => w.element === window);
        if (windowData) {
            windowData.minimized = true;
        }
        this.updateTaskbarButtons();
    }

    toggleMaximizeWindow(window) {
        const windowData = this.windows.find(w => w.element === window);
        if (!windowData) return;
        
        if (windowData.maximized) {
            // 还原窗口
            window.classList.remove('maximized');
            windowData.maximized = false;
        } else {
            // 最大化窗口
            window.classList.add('maximized');
            windowData.maximized = true;
        }
    }

    closeWindow(window) {
        const windowData = this.windows.find(w => w.element === window);
        if (!windowData) return;
        
        // 移除窗口
        window.remove();
        
        // 移除任务栏按钮
        this.removeTaskbarButton(windowData.id);
        
        // 从窗口列表中移除
        this.windows = this.windows.filter(w => w.id !== windowData.id);
        
        // 如果这是活动窗口，激活另一个窗口
        if (this.activeWindow === window) {
            const remainingWindows = document.querySelectorAll('.window');
            if (remainingWindows.length > 0) {
                this.setActiveWindow(remainingWindows[remainingWindows.length - 1]);
            } else {
                this.activeWindow = null;
            }
        }
    }

    // 任务栏按钮管理
    addTaskbarButton(windowId, title, icon) {
        const button = document.createElement('div');
        button.className = 'taskbar-button active';
        button.id = 'taskbar-' + windowId;
        button.innerHTML = `
            <span class="button-icon">${icon}</span>
            <span class="button-text">${title}</span>
        `;
        
        button.addEventListener('click', () => {
            const window = document.getElementById(windowId);
            const windowData = this.windows.find(w => w.id === windowId);
            
            if (windowData && windowData.minimized) {
                // 如果窗口被最小化，恢复它
                window.style.display = 'flex';
                windowData.minimized = false;
                this.setActiveWindow(window);
            } else if (this.activeWindow === window) {
                // 如果是活动窗口，最小化它
                this.minimizeWindow(window);
            } else {
                // 激活窗口
                this.setActiveWindow(window);
            }
        });
        
        document.getElementById('taskbar-buttons').appendChild(button);
    }

    removeTaskbarButton(windowId) {
        const button = document.getElementById('taskbar-' + windowId);
        if (button) {
            button.remove();
        }
    }

    updateTaskbarButtons() {
        document.querySelectorAll('.taskbar-button').forEach(button => {
            button.classList.remove('active');
        });
        
        if (this.activeWindow) {
            const windowData = this.windows.find(w => w.element === this.activeWindow);
            if (windowData && !windowData.minimized) {
                const button = document.getElementById('taskbar-' + windowData.id);
                if (button) {
                    button.classList.add('active');
                }
            }
        }
    }

    // 应用程序实现

    openNotepad() {
        const content = `
            <div class="notepad-content">
                <div class="notepad-menu">
                    <span class="notepad-menu-item">文件</span>
                    <span class="notepad-menu-item">编辑</span>
                    <span class="notepad-menu-item">搜索</span>
                    <span class="notepad-menu-item">帮助</span>
                </div>
                <textarea class="notepad-textarea" placeholder="在此输入文本..."></textarea>
            </div>
        `;
        
        this.createWindow('记事本', content, 500, 400, '📝');
    }

    openCalculator() {
        const content = `
            <div class="calculator-content">
                <div class="calculator-menu">
                    <span class="calculator-menu-item">查看</span>
                    <span class="calculator-menu-item">编辑</span>
                    <span class="calculator-menu-item">帮助</span>
                </div>
                <div class="calculator-display-container">
                    <div class="calculator-memory-indicator" id="memory-indicator" style="display: none;">M</div>
                    <input type="text" class="calculator-display" value="0" readonly>
                </div>
                <div class="calculator-mode-tabs">
                    <div class="calculator-tab active" data-mode="standard">标准型</div>
                    <div class="calculator-tab" data-mode="scientific">科学型</div>
                </div>
                <div class="calculator-buttons" id="calculator-buttons-container">
                    <!-- 标准模式按钮 -->
                    <button class="calculator-button memory" data-action="memory-clear">MC</button>
                    <button class="calculator-button memory" data-action="memory-recall">MR</button>
                    <button class="calculator-button memory" data-action="memory-store">MS</button>
                    <button class="calculator-button memory" data-action="memory-add">M+</button>
                    <button class="calculator-button memory" data-action="memory-subtract">M-</button>
                    
                    <button class="calculator-button operator" data-action="backspace">←</button>
                    <button class="calculator-button operator" data-action="clear-entry">CE</button>
                    <button class="calculator-button operator" data-action="clear">C</button>
                    <button class="calculator-button operator" data-action="sign">±</button>
                    <button class="calculator-button operator" data-action="sqrt">√</button>
                    
                    <button class="calculator-button number" data-number="7">7</button>
                    <button class="calculator-button number" data-number="8">8</button>
                    <button class="calculator-button number" data-number="9">9</button>
                    <button class="calculator-button operator" data-action="divide">÷</button>
                    <button class="calculator-button operator" data-action="percent">%</button>
                    
                    <button class="calculator-button number" data-number="4">4</button>
                    <button class="calculator-button number" data-number="5">5</button>
                    <button class="calculator-button number" data-number="6">6</button>
                    <button class="calculator-button operator" data-action="multiply">×</button>
                    <button class="calculator-button operator" data-action="reciprocal">1/x</button>
                    
                    <button class="calculator-button number" data-number="1">1</button>
                    <button class="calculator-button number" data-number="2">2</button>
                    <button class="calculator-button number" data-number="3">3</button>
                    <button class="calculator-button operator" data-action="subtract">-</button>
                    <button class="calculator-button equals" data-action="equals" style="grid-row: span 2;">=</button>
                    
                    <button class="calculator-button number" data-number="0" style="grid-column: span 2;">0</button>
                    <button class="calculator-button number" data-action="decimal">.</button>
                    <button class="calculator-button operator" data-action="add">+</button>
                </div>
            </div>
        `;
        
        const window = this.createWindow('计算器', content, 260, 340, '🧮');
        this.setupEnhancedCalculator(window);
    }

    setupEnhancedCalculator(window) {
        const display = window.querySelector('.calculator-display');
        const buttonsContainer = window.querySelector('#calculator-buttons-container');
        const memoryIndicator = window.querySelector('#memory-indicator');
        const tabs = window.querySelectorAll('.calculator-tab');
        const menuItems = window.querySelectorAll('.calculator-menu-item');
        
        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let waitingForNewNumber = false;
        let memory = 0;
        let isScientificMode = false;
        let lastOperation = null;
        let lastOperand = null;
        
        const updateDisplay = (value = currentValue) => {
            // 限制显示位数
            if (value.length > 12) {
                if (value.includes('e')) {
                    display.value = parseFloat(value).toExponential(5);
                } else {
                    display.value = parseFloat(value).toPrecision(6);
                }
            } else {
                display.value = value;
            }
        };
        
        const updateMemoryIndicator = () => {
            if (memory !== 0) {
                memoryIndicator.style.display = 'block';
            } else {
                memoryIndicator.style.display = 'none';
            }
        };
        
        const inputNumber = (num) => {
            if (waitingForNewNumber) {
                currentValue = num;
                waitingForNewNumber = false;
            } else {
                if (currentValue === '0' && num !== '.') {
                    currentValue = num;
                } else {
                    currentValue += num;
                }
            }
            updateDisplay();
        };
        
        const inputOperation = (nextOperation) => {
            const inputValue = parseFloat(currentValue);
            
            if (previousValue === null) {
                previousValue = inputValue;
            } else if (operation && !waitingForNewNumber) {
                const result = calculate();
                currentValue = String(result);
                previousValue = result;
                updateDisplay();
            }
            
            waitingForNewNumber = true;
            operation = nextOperation;
            lastOperation = nextOperation;
            lastOperand = inputValue;
        };
        
        const calculate = () => {
            const prev = previousValue;
            const current = parseFloat(currentValue);
            
            switch (operation) {
                case 'add': return prev + current;
                case 'subtract': return prev - current;
                case 'multiply': return prev * current;
                case 'divide': 
                    if (current === 0) {
                        this.playErrorSound();
                        return 0;
                    }
                    return prev / current;
                default: return current;
            }
        };
        
        const performCalculation = () => {
            if (operation && previousValue !== null) {
                const result = calculate();
                currentValue = String(result);
                previousValue = null;
                operation = null;
                waitingForNewNumber = true;
                updateDisplay();
            } else if (lastOperation && lastOperand !== null) {
                // 重复最后一次操作
                previousValue = parseFloat(currentValue);
                operation = lastOperation;
                currentValue = String(lastOperand);
                const result = calculate();
                currentValue = String(result);
                previousValue = null;
                operation = null;
                waitingForNewNumber = true;
                updateDisplay();
            }
        };
        
        const performFunction = (func) => {
            const value = parseFloat(currentValue);
            let result = 0;
            
            switch (func) {
                case 'sqrt':
                    if (value < 0) {
                        this.playErrorSound();
                        return;
                    }
                    result = Math.sqrt(value);
                    break;
                case 'reciprocal':
                    if (value === 0) {
                        this.playErrorSound();
                        return;
                    }
                    result = 1 / value;
                    break;
                case 'percent':
                    result = value / 100;
                    break;
                case 'sign':
                    result = -value;
                    break;
                case 'sin':
                    result = Math.sin(value * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(value * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(value * Math.PI / 180);
                    break;
                case 'log':
                    if (value <= 0) {
                        this.playErrorSound();
                        return;
                    }
                    result = Math.log10(value);
                    break;
                case 'ln':
                    if (value <= 0) {
                        this.playErrorSound();
                        return;
                    }
                    result = Math.log(value);
                    break;
                case 'x2':
                    result = value * value;
                    break;
                case 'x3':
                    result = value * value * value;
                    break;
                case 'xy':
                    inputOperation('power');
                    return;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                default:
                    return;
            }
            
            currentValue = String(result);
            waitingForNewNumber = true;
            updateDisplay();
        };
        
        const handleMemoryOperation = (action) => {
            const value = parseFloat(currentValue);
            
            switch (action) {
                case 'memory-clear':
                    memory = 0;
                    break;
                case 'memory-recall':
                    currentValue = String(memory);
                    waitingForNewNumber = true;
                    updateDisplay();
                    break;
                case 'memory-store':
                    memory = value;
                    break;
                case 'memory-add':
                    memory += value;
                    break;
                case 'memory-subtract':
                    memory -= value;
                    break;
            }
            
            updateMemoryIndicator();
        };
        
        const switchMode = (mode) => {
            tabs.forEach(tab => tab.classList.remove('active'));
            window.querySelector(`[data-mode="${mode}"]`).classList.add('active');
            
            isScientificMode = mode === 'scientific';
            
            if (isScientificMode) {
                buttonsContainer.classList.add('scientific');
                buttonsContainer.innerHTML = `
                    <!-- 科学计算器按钮布局 -->
                    <button class="calculator-button scientific-func" data-action="sin">sin</button>
                    <button class="calculator-button scientific-func" data-action="cos">cos</button>
                    <button class="calculator-button scientific-func" data-action="tan">tan</button>
                    <button class="calculator-button scientific-func" data-action="log">log</button>
                    <button class="calculator-button scientific-func" data-action="ln">ln</button>
                    <button class="calculator-button operator" data-action="clear">C</button>
                    
                    <button class="calculator-button memory" data-action="memory-clear">MC</button>
                    <button class="calculator-button memory" data-action="memory-recall">MR</button>
                    <button class="calculator-button memory" data-action="memory-store">MS</button>
                    <button class="calculator-button memory" data-action="memory-add">M+</button>
                    <button class="calculator-button memory" data-action="memory-subtract">M-</button>
                    <button class="calculator-button operator" data-action="backspace">←</button>
                    
                    <button class="calculator-button scientific-func" data-action="x2">x²</button>
                    <button class="calculator-button scientific-func" data-action="x3">x³</button>
                    <button class="calculator-button scientific-func" data-action="xy">xʸ</button>
                    <button class="calculator-button scientific-func" data-action="reciprocal">1/x</button>
                    <button class="calculator-button scientific-func" data-action="sqrt">√</button>
                    <button class="calculator-button operator" data-action="divide">÷</button>
                    
                    <button class="calculator-button scientific-func" data-action="pi">π</button>
                    <button class="calculator-button scientific-func" data-action="e">e</button>
                    <button class="calculator-button number" data-number="7">7</button>
                    <button class="calculator-button number" data-number="8">8</button>
                    <button class="calculator-button number" data-number="9">9</button>
                    <button class="calculator-button operator" data-action="multiply">×</button>
                    
                    <button class="calculator-button operator" data-action="percent">%</button>
                    <button class="calculator-button operator" data-action="sign">±</button>
                    <button class="calculator-button number" data-number="4">4</button>
                    <button class="calculator-button number" data-number="5">5</button>
                    <button class="calculator-button number" data-number="6">6</button>
                    <button class="calculator-button operator" data-action="subtract">-</button>
                    
                    <button class="calculator-button operator" data-action="clear-entry">CE</button>
                    <button class="calculator-button number" data-number="0">0</button>
                    <button class="calculator-button number" data-number="1">1</button>
                    <button class="calculator-button number" data-number="2">2</button>
                    <button class="calculator-button number" data-number="3">3</button>
                    <button class="calculator-button operator" data-action="add">+</button>
                    
                    <button class="calculator-button number" data-action="decimal">.</button>
                    <button class="calculator-button equals" data-action="equals" style="grid-column: span 5;">=</button>
                `;
            } else {
                buttonsContainer.classList.remove('scientific');
                buttonsContainer.innerHTML = `
                    <!-- 标准模式按钮 -->
                    <button class="calculator-button memory" data-action="memory-clear">MC</button>
                    <button class="calculator-button memory" data-action="memory-recall">MR</button>
                    <button class="calculator-button memory" data-action="memory-store">MS</button>
                    <button class="calculator-button memory" data-action="memory-add">M+</button>
                    <button class="calculator-button memory" data-action="memory-subtract">M-</button>
                    
                    <button class="calculator-button operator" data-action="backspace">←</button>
                    <button class="calculator-button operator" data-action="clear-entry">CE</button>
                    <button class="calculator-button operator" data-action="clear">C</button>
                    <button class="calculator-button operator" data-action="sign">±</button>
                    <button class="calculator-button operator" data-action="sqrt">√</button>
                    
                    <button class="calculator-button number" data-number="7">7</button>
                    <button class="calculator-button number" data-number="8">8</button>
                    <button class="calculator-button number" data-number="9">9</button>
                    <button class="calculator-button operator" data-action="divide">÷</button>
                    <button class="calculator-button operator" data-action="percent">%</button>
                    
                    <button class="calculator-button number" data-number="4">4</button>
                    <button class="calculator-button number" data-number="5">5</button>
                    <button class="calculator-button number" data-number="6">6</button>
                    <button class="calculator-button operator" data-action="multiply">×</button>
                    <button class="calculator-button operator" data-action="reciprocal">1/x</button>
                    
                    <button class="calculator-button number" data-number="1">1</button>
                    <button class="calculator-button number" data-number="2">2</button>
                    <button class="calculator-button number" data-number="3">3</button>
                    <button class="calculator-button operator" data-action="subtract">-</button>
                    <button class="calculator-button equals" data-action="equals" style="grid-row: span 2;">=</button>
                    
                    <button class="calculator-button number" data-number="0" style="grid-column: span 2;">0</button>
                    <button class="calculator-button number" data-action="decimal">.</button>
                    <button class="calculator-button operator" data-action="add">+</button>
                `;
            }
            
            setupButtonEvents();
        };
        
        const setupButtonEvents = () => {
            const buttons = buttonsContainer.querySelectorAll('.calculator-button');
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    this.playClickSound();
                    const number = button.getAttribute('data-number');
                    const action = button.getAttribute('data-action');
                    
                    if (number) {
                        inputNumber(number);
                    } else if (action) {
                        switch (action) {
                            case 'clear':
                                currentValue = '0';
                                previousValue = null;
                                operation = null;
                                waitingForNewNumber = false;
                                lastOperation = null;
                                lastOperand = null;
                                updateDisplay();
                                break;
                            case 'clear-entry':
                                currentValue = '0';
                                updateDisplay();
                                break;
                            case 'backspace':
                                if (currentValue.length > 1) {
                                    currentValue = currentValue.slice(0, -1);
                                } else {
                                    currentValue = '0';
                                }
                                updateDisplay();
                                break;
                            case 'decimal':
                                if (currentValue.indexOf('.') === -1) {
                                    if (waitingForNewNumber) {
                                        currentValue = '0.';
                                        waitingForNewNumber = false;
                                    } else {
                                        currentValue += '.';
                                    }
                                    updateDisplay();
                                }
                                break;
                            case 'equals':
                                performCalculation();
                                break;
                            case 'add':
                            case 'subtract':
                            case 'multiply':
                            case 'divide':
                                inputOperation(action);
                                break;
                            case 'sqrt':
                            case 'reciprocal':
                            case 'percent':
                            case 'sign':
                            case 'sin':
                            case 'cos':
                            case 'tan':
                            case 'log':
                            case 'ln':
                            case 'x2':
                            case 'x3':
                            case 'xy':
                            case 'pi':
                            case 'e':
                                performFunction(action);
                                break;
                            case 'memory-clear':
                            case 'memory-recall':
                            case 'memory-store':
                            case 'memory-add':
                            case 'memory-subtract':
                                handleMemoryOperation(action);
                                break;
                        }
                    }
                });
            });
        };
        
        // 键盘输入支持
        const handleKeyPress = (event) => {
            event.preventDefault();
            const key = event.key;
            
            if (/[0-9]/.test(key)) {
                inputNumber(key);
            } else {
                switch (key) {
                    case '+':
                        inputOperation('add');
                        break;
                    case '-':
                        inputOperation('subtract');
                        break;
                    case '*':
                        inputOperation('multiply');
                        break;
                    case '/':
                        inputOperation('divide');
                        break;
                    case '=':
                    case 'Enter':
                        performCalculation();
                        break;
                    case '.':
                        if (currentValue.indexOf('.') === -1) {
                            if (waitingForNewNumber) {
                                currentValue = '0.';
                                waitingForNewNumber = false;
                            } else {
                                currentValue += '.';
                            }
                            updateDisplay();
                        }
                        break;
                    case 'Backspace':
                        if (currentValue.length > 1) {
                            currentValue = currentValue.slice(0, -1);
                        } else {
                            currentValue = '0';
                        }
                        updateDisplay();
                        break;
                    case 'Escape':
                    case 'Delete':
                        currentValue = '0';
                        previousValue = null;
                        operation = null;
                        waitingForNewNumber = false;
                        updateDisplay();
                        break;
                    case '%':
                        performFunction('percent');
                        break;
                }
            }
            
            this.playClickSound();
        };
        
        // 事件监听器
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const mode = tab.getAttribute('data-mode');
                switchMode(mode);
            });
        });
        
        // 菜单功能
        menuItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                switch (index) {
                    case 0: // 查看
                        // 切换科学/标准模式
                        switchMode(isScientificMode ? 'standard' : 'scientific');
                        break;
                    case 1: // 编辑
                        // 复制当前值到剪贴板
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(currentValue);
                        }
                        break;
                    case 2: // 帮助
                        this.showCalculatorHelp();
                        break;
                }
            });
        });
        
        // 窗口获得焦点时启用键盘输入
        window.addEventListener('click', () => {
            window.focus();
        });
        
        window.addEventListener('keydown', handleKeyPress);
        
        // 初始化
        setupButtonEvents();
        updateMemoryIndicator();
        
        // 窗口关闭时移除键盘监听
        const originalClose = window.querySelector('[data-action="close"]');
        if (originalClose) {
            originalClose.addEventListener('click', () => {
                window.removeEventListener('keydown', handleKeyPress);
            });
        }
    }
    
    showCalculatorHelp() {
        const content = `
            <div style="padding: 16px; font-size: 11px;">
                <h3 style="margin-top: 0;">计算器帮助</h3>
                <div style="margin-bottom: 12px;">
                    <strong>基本操作:</strong><br>
                    • 数字键: 输入数字<br>
                    • +, -, ×, ÷: 基本运算<br>
                    • =: 计算结果<br>
                    • C: 清除所有<br>
                    • CE: 清除输入<br>
                    • ←: 退格
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>内存功能:</strong><br>
                    • MC: 清除内存<br>
                    • MR: 读取内存<br>
                    • MS: 存储到内存<br>
                    • M+: 内存加法<br>
                    • M-: 内存减法
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>科学函数:</strong><br>
                    • √: 平方根<br>
                    • x²: 平方<br>
                    • 1/x: 倒数<br>
                    • %: 百分比<br>
                    • ±: 正负号
                </div>
                <div style="margin-bottom: 12px;">
                    <strong>键盘快捷键:</strong><br>
                    • 数字键: 0-9<br>
                    • 运算符: +, -, *, /<br>
                    • 回车: 等于<br>
                    • 退格: 删除<br>
                    • ESC: 清除全部
                </div>
                <div style="text-align: center; margin-top: 16px;">
                    <button class="calculator-button" onclick="this.closest('.window').querySelector('[data-action=close]').click()">
                        确定
                    </button>
                </div>
            </div>
        `;
        
        this.createWindow('计算器帮助', content, 320, 380, '❓');
    }

    openCPSTester() {
        const content = `
            <div style="padding: 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 100%; overflow: hidden;">
                <div style="margin-bottom: 20px;">
                    <h2 style="color: #00ffff; text-shadow: 0 0 10px #00ffff; margin-bottom: 10px;">⚡ CPS 测试器</h2>
                    <p style="color: #ffffff; opacity: 0.9;">点击速度挑战 - Clicks Per Second</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                        <div style="color: #00ffff; font-size: 24px; margin-bottom: 5px;" id="cps-display">0.0</div>
                        <div style="color: #ffffff; font-size: 12px;">当前 CPS</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">
                            <div style="color: #ff00ff; font-size: 18px;" id="click-count">0</div>
                            <div style="color: #ffffff; font-size: 10px;">点击次数</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px;">
                            <div style="color: #ffff00; font-size: 18px;" id="time-left">10</div>
                            <div style="color: #ffffff; font-size: 10px;">剩余时间</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #00ffff; font-size: 12px; margin-bottom: 8px;">测试时长</div>
                    <div style="display: flex; gap: 5px; justify-content: center;">
                        <button class="cps-duration-btn" data-duration="5" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 11px;">5s</button>
                        <button class="cps-duration-btn active" data-duration="10" style="background: #00ffff; color: black; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 11px;">10s</button>
                        <button class="cps-duration-btn" data-duration="20" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 11px;">20s</button>
                        <button class="cps-duration-btn" data-duration="30" style="background: #667eea; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 11px;">30s</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <button id="cps-start-btn" style="background: linear-gradient(45deg, #ff00ff, #00ffff); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                        开始测试
                    </button>
                </div>
                
                <div id="cps-level" style="margin-bottom: 15px;">
                    <span style="font-size: 16px;">🌱</span>
                    <span style="color: #999999; font-weight: bold; margin-left: 5px;">新手</span>
                </div>
                
                <div id="cps-status" style="color: #ffffff; font-size: 12px; opacity: 0.8;">
                    点击开始测试按钮开始
                </div>
                
                <div style="margin-top: 15px; font-size: 10px; color: #ffffff; opacity: 0.6;">
                    💡 提示：开始后疯狂点击测试区域获得高分！
                </div>
            </div>
        `;
        
        const window = this.createWindow('CPS测试器', content, 320, 450, '⚡');
        this.setupCPSTester(window);
    }

    setupCPSTester(window) {
        const cpsDisplay = window.querySelector('#cps-display');
        const clickCountDisplay = window.querySelector('#click-count');
        const timeLeftDisplay = window.querySelector('#time-left');
        const startBtn = window.querySelector('#cps-start-btn');
        const levelDisplay = window.querySelector('#cps-level');
        const statusDisplay = window.querySelector('#cps-status');
        const durationBtns = window.querySelectorAll('.cps-duration-btn');
        
        let gameState = 'idle'; // idle, testing, finished
        let duration = 10;
        let timeLeft = 0;
        let clickCount = 0;
        let currentCPS = 0;
        let startTime = 0;
        let gameInterval = null;
        
        const getLevelInfo = (cps) => {
            if (cps < 4) return { name: '新手', color: '#999999', icon: '🌱' };
            if (cps < 6) return { name: '普通', color: '#4CAF50', icon: '👍' };
            if (cps < 8) return { name: '熟练', color: '#2196F3', icon: '💪' };
            if (cps < 10) return { name: '高手', color: '#FF9800', icon: '🔥' };
            if (cps < 12) return { name: '专业', color: '#E91E63', icon: '⚡' };
            return { name: '超神', color: '#9C27B0', icon: '👑' };
        };
        
        const updateDisplay = () => {
            cpsDisplay.textContent = currentCPS.toFixed(1);
            clickCountDisplay.textContent = clickCount;
            timeLeftDisplay.textContent = gameState === 'testing' ? timeLeft.toFixed(1) : duration;
            
            const levelInfo = getLevelInfo(currentCPS);
            levelDisplay.innerHTML = `
                <span style="font-size: 16px;">${levelInfo.icon}</span>
                <span style="color: ${levelInfo.color}; font-weight: bold; margin-left: 5px;">${levelInfo.name}</span>
            `;
        };
        
        const startTest = () => {
            if (gameState !== 'idle') return;
            
            gameState = 'testing';
            timeLeft = duration;
            clickCount = 0;
            currentCPS = 0;
            startTime = Date.now();
            
            startBtn.textContent = '测试中...';
            startBtn.disabled = true;
            statusDisplay.textContent = '疯狂点击！';
            
            gameInterval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                timeLeft = Math.max(0, duration - elapsed);
                
                if (timeLeft <= 0) {
                    endTest();
                } else {
                    updateDisplay();
                }
            }, 50);
            
            updateDisplay();
        };
        
        const endTest = () => {
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = null;
            }
            
            gameState = 'finished';
            const finalTime = (Date.now() - startTime) / 1000;
            currentCPS = clickCount / finalTime;
            
            startBtn.textContent = '重新测试';
            startBtn.disabled = false;
            statusDisplay.textContent = `测试完成！最终成绩: ${currentCPS.toFixed(1)} CPS`;
            
            updateDisplay();
            
            // 重置状态
            setTimeout(() => {
                gameState = 'idle';
                startBtn.textContent = '开始测试';
                statusDisplay.textContent = '点击开始测试按钮开始';
            }, 3000);
        };
        
        const handleClick = (e) => {
            if (gameState === 'testing') {
                clickCount++;
                const elapsed = (Date.now() - startTime) / 1000;
                currentCPS = clickCount / elapsed;
                updateDisplay();
                
                // 简单的点击效果
                e.target.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 100);
            }
        };
        
        // 事件监听
        startBtn.addEventListener('click', startTest);
        
        // 点击区域设置
        const contentArea = window.querySelector('.window-content');
        contentArea.addEventListener('click', handleClick);
        
        // 时长选择
        durationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (gameState !== 'idle') return;
                
                durationBtns.forEach(b => {
                    b.style.background = '#667eea';
                    b.style.color = 'white';
                    b.classList.remove('active');
                });
                
                btn.style.background = '#00ffff';
                btn.style.color = 'black';
                btn.classList.add('active');
                
                duration = parseInt(btn.getAttribute('data-duration'));
                updateDisplay();
            });
        });
        
        // 窗口关闭清理
        const closeBtn = window.querySelector('[data-action="close"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (gameInterval) {
                    clearInterval(gameInterval);
                }
            });
        }
        
        // 初始化显示
        updateDisplay();
    }

    openPaint() {
        const content = `
            <div class="paint-content">
                <div class="paint-toolbar">
                    <div class="paint-tool active" data-tool="brush">🖌️</div>
                    <div class="paint-tool" data-tool="pencil">✏️</div>
                    <div class="paint-tool" data-tool="eraser">🧽</div>
                    <div class="paint-tool" data-tool="fill">🪣</div>
                    <div class="paint-tool" data-tool="text">📝</div>
                    <div class="paint-tool" data-tool="line">📏</div>
                    <div class="paint-tool" data-tool="rectangle">⬜</div>
                    <div class="paint-tool" data-tool="circle">⭕</div>
                </div>
                <div class="paint-canvas">
                    <canvas width="600" height="400" style="background: white; cursor: crosshair;"></canvas>
                </div>
            </div>
        `;
        
        const window = this.createWindow('画图', content, 640, 480, '🎨');
        this.setupPaint(window);
    }

    setupPaint(window) {
        const canvas = window.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const tools = window.querySelectorAll('.paint-tool');
        
        let currentTool = 'brush';
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        // 工具选择
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                currentTool = tool.getAttribute('data-tool');
                
                // 更新鼠标样式
                switch (currentTool) {
                    case 'eraser':
                        canvas.style.cursor = 'grab';
                        break;
                    case 'text':
                        canvas.style.cursor = 'text';
                        break;
                    default:
                        canvas.style.cursor = 'crosshair';
                }
            });
        });
        
        // 绘图事件
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            ctx.lineWidth = currentTool === 'eraser' ? 10 : 2;
            ctx.lineCap = 'round';
            
            if (currentTool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = '#000';
            }
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            
            lastX = currentX;
            lastY = currentY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseout', () => {
            isDrawing = false;
        });
    }

    openMyComputer() {
        const content = `
            <div style="display: flex; height: 100%;">
                <div style="width: 200px; border-right: 1px solid var(--win95-button-shadow); padding: 8px;">
                    <div style="margin-bottom: 8px; font-weight: bold;">我的电脑</div>
                    <div style="margin-left: 16px;">
                        <div style="margin: 4px 0;">💾 软盘 (A:)</div>
                        <div style="margin: 4px 0;">💿 光驱 (D:)</div>
                        <div style="margin: 4px 0;">💾 硬盘 (C:)</div>
                        <div style="margin: 4px 0;">🌐 网络邻居</div>
                        <div style="margin: 4px 0;">🗑️ 回收站</div>
                    </div>
                </div>
                <div style="flex: 1; padding: 8px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, 80px); gap: 16px;">
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">💾</div>
                            <div style="font-size: 11px;">软盘 (A:)</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">💿</div>
                            <div style="font-size: 11px;">光驱 (D:)</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 32px;">💾</div>
                            <div style="font-size: 11px;">硬盘 (C:)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow('我的电脑', content, 600, 400, '💻');
    }

    openRecycleBin() {
        const content = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 64px; margin-bottom: 20px;">🗑️</div>
                <div style="font-size: 14px; margin-bottom: 10px;">回收站是空的</div>
                <div style="font-size: 11px; color: var(--win95-dark-gray);">
                    要删除项目，请将其拖到回收站中。
                </div>
            </div>
        `;
        
        this.createWindow('回收站', content, 400, 300, '🗑️');
    }

    openMinesweeper() {
        const content = `
            <div style="padding: 16px; text-align: center;">
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="background: var(--win95-black); color: var(--win95-white); padding: 4px 8px; font-family: monospace;">💣 010</div>
                    <div style="font-size: 24px; cursor: pointer;">😊</div>
                    <div style="background: var(--win95-black); color: var(--win95-white); padding: 4px 8px; font-family: monospace;">⏱️ 000</div>
                </div>
                <div id="minesweeper-grid" style="display: grid; grid-template-columns: repeat(9, 20px); gap: 1px; justify-content: center; background: var(--win95-button-shadow);">
                    <!-- 扫雷网格将由JavaScript生成 -->
                </div>
                <div style="margin-top: 16px; font-size: 11px; color: var(--win95-dark-gray);">
                    左键单击打开方块，右键单击标记地雷
                </div>
            </div>
        `;
        
        const window = this.createWindow('扫雷', content, 300, 350, '💣');
        this.setupMinesweeper(window);
    }

    setupMinesweeper(window) {
        const grid = window.querySelector('#minesweeper-grid');
        const rows = 9;
        const cols = 9;
        const mineCount = 10;
        
        let board = [];
        let gameStarted = false;
        let gameOver = false;
        
        // 初始化游戏板
        const initBoard = () => {
            board = Array(rows).fill(null).map(() => Array(cols).fill({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            }));
            
            // 放置地雷
            let minesPlaced = 0;
            while (minesPlaced < mineCount) {
                const row = Math.floor(Math.random() * rows);
                const col = Math.floor(Math.random() * cols);
                
                if (!board[row][col].isMine) {
                    board[row][col] = { ...board[row][col], isMine: true };
                    minesPlaced++;
                }
            }
            
            // 计算相邻地雷数
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (!board[row][col].isMine) {
                        let count = 0;
                        for (let r = -1; r <= 1; r++) {
                            for (let c = -1; c <= 1; c++) {
                                const newRow = row + r;
                                const newCol = col + c;
                                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                                    if (board[newRow][newCol].isMine) count++;
                                }
                            }
                        }
                        board[row][col] = { ...board[row][col], adjacentMines: count };
                    }
                }
            }
        };
        
        // 渲染游戏板
        const renderBoard = () => {
            grid.innerHTML = '';
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const cell = document.createElement('div');
                    cell.style.width = '20px';
                    cell.style.height = '20px';
                    cell.style.border = '1px outset var(--win95-button-face)';
                    cell.style.background = 'var(--win95-button-face)';
                    cell.style.display = 'flex';
                    cell.style.alignItems = 'center';
                    cell.style.justifyContent = 'center';
                    cell.style.fontSize = '10px';
                    cell.style.cursor = 'pointer';
                    
                    const cellData = board[row][col];
                    
                    if (cellData.isRevealed) {
                        cell.style.border = '1px inset var(--win95-button-face)';
                        cell.style.background = 'var(--win95-white)';
                        
                        if (cellData.isMine) {
                            cell.textContent = '💣';
                            cell.style.background = 'red';
                        } else if (cellData.adjacentMines > 0) {
                            cell.textContent = cellData.adjacentMines;
                            const colors = ['', 'blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'];
                            cell.style.color = colors[cellData.adjacentMines];
                        }
                    } else if (cellData.isFlagged) {
                        cell.textContent = '🚩';
                    }
                    
                    // 事件监听
                    cell.addEventListener('click', () => revealCell(row, col));
                    cell.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        toggleFlag(row, col);
                    });
                    
                    grid.appendChild(cell);
                }
            }
        };
        
        // 翻开方块
        const revealCell = (row, col) => {
            if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) return;
            
            board[row][col] = { ...board[row][col], isRevealed: true };
            
            if (board[row][col].isMine) {
                gameOver = true;
                // 显示所有地雷
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (board[r][c].isMine) {
                            board[r][c] = { ...board[r][c], isRevealed: true };
                        }
                    }
                }
                this.playErrorSound();
            } else if (board[row][col].adjacentMines === 0) {
                // 自动翻开相邻的空方块
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        const newRow = row + r;
                        const newCol = col + c;
                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                            revealCell(newRow, newCol);
                        }
                    }
                }
            }
            
            renderBoard();
        };
        
        // 切换标记
        const toggleFlag = (row, col) => {
            if (gameOver || board[row][col].isRevealed) return;
            
            board[row][col] = { ...board[row][col], isFlagged: !board[row][col].isFlagged };
            renderBoard();
        };
        
        // 初始化游戏
        initBoard();
        renderBoard();
    }

    // 对话框
    showNotImplementedDialog(feature) {
        const content = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 32px; margin-bottom: 16px;">⚠️</div>
                <div style="margin-bottom: 16px;">
                    "${feature}" 功能暂未实现
                </div>
                <div style="margin-bottom: 20px; font-size: 11px; color: var(--win95-dark-gray);">
                    该功能将在未来的版本中添加。
                </div>
                <button class="calculator-button" onclick="this.closest('.window').querySelector('[data-action=close]').click()">
                    确定
                </button>
            </div>
        `;
        
        this.createWindow('提示', content, 280, 180, '⚠️');
    }

    showShutdownDialog() {
        const content = `
            <div style="padding: 20px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 16px;">🔌</div>
                <div style="margin-bottom: 20px;">
                    您确定要关闭计算机吗？
                </div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="calculator-button" onclick="window.close()">
                        是
                    </button>
                    <button class="calculator-button" onclick="this.closest('.window').querySelector('[data-action=close]').click()">
                        否
                    </button>
                </div>
            </div>
        `;
        
        this.createWindow('关闭 Windows', content, 300, 160, '🔌');
    }
}

// 启动桌面
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new Windows95Desktop();
});

// 防止拖放默认行为
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());