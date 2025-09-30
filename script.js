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
                <input type="text" class="calculator-display" value="0" readonly>
                <div class="calculator-buttons">
                    <button class="calculator-button" data-action="clear">C</button>
                    <button class="calculator-button" data-action="clear-entry">CE</button>
                    <button class="calculator-button" data-action="backspace">←</button>
                    <button class="calculator-button" data-action="divide">÷</button>
                    <button class="calculator-button" data-number="7">7</button>
                    <button class="calculator-button" data-number="8">8</button>
                    <button class="calculator-button" data-number="9">9</button>
                    <button class="calculator-button" data-action="multiply">×</button>
                    <button class="calculator-button" data-number="4">4</button>
                    <button class="calculator-button" data-number="5">5</button>
                    <button class="calculator-button" data-number="6">6</button>
                    <button class="calculator-button" data-action="subtract">-</button>
                    <button class="calculator-button" data-number="1">1</button>
                    <button class="calculator-button" data-number="2">2</button>
                    <button class="calculator-button" data-number="3">3</button>
                    <button class="calculator-button" data-action="add">+</button>
                    <button class="calculator-button" data-number="0" style="grid-column: span 2;">0</button>
                    <button class="calculator-button" data-action="decimal">.</button>
                    <button class="calculator-button" data-action="equals">=</button>
                </div>
            </div>
        `;
        
        const window = this.createWindow('计算器', content, 200, 260, '🧮');
        this.setupCalculator(window);
    }

    setupCalculator(window) {
        const display = window.querySelector('.calculator-display');
        const buttons = window.querySelectorAll('.calculator-button');
        
        let currentValue = '0';
        let previousValue = null;
        let operation = null;
        let waitingForNewNumber = false;
        
        const updateDisplay = () => {
            display.value = currentValue;
        };
        
        const inputNumber = (num) => {
            if (waitingForNewNumber) {
                currentValue = num;
                waitingForNewNumber = false;
            } else {
                currentValue = currentValue === '0' ? num : currentValue + num;
            }
            updateDisplay();
        };
        
        const inputOperation = (nextOperation) => {
            const inputValue = parseFloat(currentValue);
            
            if (previousValue === null) {
                previousValue = inputValue;
            } else if (operation) {
                const result = calculate();
                currentValue = String(result);
                previousValue = result;
                updateDisplay();
            }
            
            waitingForNewNumber = true;
            operation = nextOperation;
        };
        
        const calculate = () => {
            const prev = previousValue;
            const current = parseFloat(currentValue);
            
            switch (operation) {
                case 'add': return prev + current;
                case 'subtract': return prev - current;
                case 'multiply': return prev * current;
                case 'divide': return current !== 0 ? prev / current : 0;
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
            }
        };
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
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
                                currentValue += '.';
                                updateDisplay();
                            }
                            break;
                        case 'equals':
                            performCalculation();
                            break;
                        default:
                            inputOperation(action);
                    }
                }
            });
        });
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