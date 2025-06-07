// File bảo mật - Ngăn chặn F12, chuột phải và các Developer Tools
(function() {
    'use strict';
    
    // Cấu hình bảo mật nâng cao
    const SECURITY_CONFIG = {
        blockRightClick: true,
        blockF12: true,
        blockCtrlShiftI: true,
        blockCtrlU: true,
        blockCtrlS: true,
        blockCtrlP: true,
        blockCtrlA: false,
        blockCtrlC: false,
        blockF5: false,
        detectDevTools: true,
        showWarning: true,
        redirectOnDetect: false,
        redirectUrl: 'about:blank',
        blockSelection: true,
        showWarnings: true,
        blockDragDrop: true,
        aggressiveMode: true, // Chế độ tích cực
        breakOnDebugger: true,
        antiDebugger: true
    };

    // Thông báo cảnh báo
    const WARNING_MESSAGES = {
        rightClick: "⚠️ Chuột phải đã bị vô hiệu hóa để bảo vệ nội dung!",
        keyBlock: "⚠️ Phím tắt này đã bị chặn để bảo mật!",
        devTools: "⚠️ Developer Tools đã được phát hiện!\nVui lòng đóng để tiếp tục sử dụng.",
        selection: "⚠️ Việc chọn văn bản đã bị vô hiệu hóa!"
    };

    // ========== CHẶN CHUỘT PHẢI ==========
    function blockRightClick() {
        if (!SECURITY_CONFIG.blockRightClick) return;
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showWarning(WARNING_MESSAGES.rightClick);
            return false;
        }, false);

        // Chặn menu ngữ cảnh trên mobile
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // ========== CHẶN PHÍM TẮT ==========
    function blockKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();
            const ctrlKey = e.ctrlKey;
            const shiftKey = e.shiftKey;
            const altKey = e.altKey;
            
            // Chặn F12
            if (SECURITY_CONFIG.blockF12 && e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+Shift+I (Developer Tools)
            if (SECURITY_CONFIG.blockCtrlShiftI && ctrlKey && shiftKey && key === 'i') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+Shift+J (Console)
            if (ctrlKey && shiftKey && key === 'j') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+U (View Source)
            if (SECURITY_CONFIG.blockCtrlU && ctrlKey && key === 'u') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+S (Save Page)
            if (SECURITY_CONFIG.blockCtrlS && ctrlKey && key === 's') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+P (Print)
            if (SECURITY_CONFIG.blockCtrlP && ctrlKey && key === 'p') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+A (Select All)
            if (SECURITY_CONFIG.blockCtrlA && ctrlKey && key === 'a') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.selection);
                return false;
            }
            
            // Chặn Ctrl+C (Copy) - Tùy chọn
            if (SECURITY_CONFIG.blockCtrlC && ctrlKey && key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn Ctrl+Shift+C (Element Inspector)
            if (ctrlKey && shiftKey && key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
            
            // Chặn F5 (nếu được bật)
            if (SECURITY_CONFIG.blockF5 && e.keyCode === 116) {
                e.preventDefault();
                e.stopPropagation();
                showWarning(WARNING_MESSAGES.keyBlock);
                return false;
            }
        }, false);
    }

    // ========== PHÁT HIỆN DEVELOPER TOOLS NÂNG CAO ==========
    function detectDevTools() {
        if (!SECURITY_CONFIG.detectDevTools) return;
        
        let devtools = {
            opened: false,
            orientation: null
        };
        
        // Phương pháp 1: Kiểm tra kích thước cửa sổ
        const threshold = 160;
        
        setInterval(function() {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.opened) {
                    devtools.opened = true;
                    handleDevToolsDetection();
                }
            } else {
                devtools.opened = false;
            }
        }, 200);
        
        // Phương pháp 2: Kiểm tra console.log timing
        let start = new Date();
        debugger;
        let end = new Date();
        if (end - start > 100) {
            handleDevToolsDetection();
        }
        
        // Phương pháp 3: Console detection với toString
        let element = new Image();
        let devtoolsDetected = false;
        
        Object.defineProperty(element, 'id', {
            get: function() {
                if (!devtoolsDetected) {
                    devtoolsDetected = true;
                    handleDevToolsDetection();
                }
                return 'devtools-detector';
            }
        });
        
        // Phương pháp 4: Kiểm tra FireFox DevTools
        let check = {
            toString: function() {
                handleDevToolsDetection();
                return '';
            }
        };
        
        // Phương pháp 5: Performance timing detection
        setInterval(function() {
            const before = performance.now();
            debugger;
            const after = performance.now();
            if (after - before > 100) {
                handleDevToolsDetection();
            }
        }, 1000);
        
        // Phương pháp 6: Console clear detection
        const originalClear = console.clear;
        console.clear = function() {
            handleDevToolsDetection();
            return originalClear.apply(console, arguments);
        };
        
        // Kiểm tra định kỳ với nhiều phương pháp
        setInterval(function() {
            console.log('%cDeveloper Tools Detection Active', 'color: transparent; font-size: 1px;', element);
            console.log(check);
            
            // Debugger trap
            if (SECURITY_CONFIG.antiDebugger) {
                (function() {
                    let a = new Date();
                    debugger;
                    let b = new Date();
                    if (b - a > 100) {
                        handleDevToolsDetection();
                    }
                })();
            }
            
            console.clear && console.clear();
        }, 500);
        
        // Phương pháp 7: Monkey patching detection
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = console.warn = console.error = function() {
            handleDevToolsDetection();
            return originalLog.apply(console, arguments);
        };
    }

    // Xử lý khi phát hiện Developer Tools - Nâng cao
    function handleDevToolsDetection() {
        if (SECURITY_CONFIG.showWarning) {
            showWarning(WARNING_MESSAGES.devTools);
        }
        
        // Làm mờ trang web
        document.body.style.filter = 'blur(10px)';
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
        
        // Vô hiệu hóa tất cả interactions
        document.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);
        
        // Thêm nhiều debugger traps
        if (SECURITY_CONFIG.breakOnDebugger) {
            const debuggerLoop = function() {
                setInterval(function() {
                    debugger;
                }, 50);
            };
            debuggerLoop();
        }
        
        // Infinite alert loop (tùy chọn)
        if (SECURITY_CONFIG.aggressiveMode) {
            setTimeout(function() {
                const alertLoop = function() {
                    alert('⚠️ Developer Tools detected! Please close to continue.');
                    setTimeout(alertLoop, 100);
                };
                alertLoop();
            }, 1000);
        }
        
        // Chuyển hướng nếu được cấu hình
        if (SECURITY_CONFIG.redirectOnDetect) {
            setTimeout(function() {
                window.location.href = SECURITY_CONFIG.redirectUrl;
            }, 3000);
        }
        
        // Tạo overlay cảnh báo
        createDevToolsOverlay();
        
        // Ghi đè các function nguy hiểm
        window.eval = function() { return null; };
        window.Function = function() { return null; };
        
        // Block new window/tab
        window.open = function() { return null; };
    }

    // ========== CHẶN CHỌN VĂN BẢN ==========
    function blockTextSelection() {
        // CSS để chặn selection
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        // JavaScript để chặn selection
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        }, false);

        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        }, false);
    }

    // ========== HIỂN THỊ CẢNH BÁO ==========
    function showWarning(message) {
        if (!SECURITY_CONFIG.showWarning) return;
        
        // Tạo element cảnh báo
        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.innerHTML = message;
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            max-width: 300px;
            word-wrap: break-word;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        document.body.appendChild(warning);
        
        // Tự động xóa sau 3 giây
        setTimeout(function() {
            if (warning && warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }

    // ========== TẠO OVERLAY CẢNH BÁO DEVTOOLS ==========
    function createDevToolsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'devtools-overlay';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                ">
                    <h2 style="color: #e74c3c; margin-bottom: 20px;">🚫 Truy cập bị hạn chế</h2>
                    <p style="color: #333; margin-bottom: 20px;">
                        Developer Tools đã được phát hiện.<br>
                        Vui lòng đóng Developer Tools để tiếp tục.
                    </p>
                    <button onclick="location.reload()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Tải lại trang</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    // ========== THÊM CSS ANIMATIONS ==========
    function addSecurityStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            .security-warning {
                cursor: default;
            }
            
            /* Ẩn scrollbar để khó debug hơn */
            ::-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== CÁC KỸ THUẬT BẢO MẬT NÂNG CAO ==========
    
    // Anti-debugging với debugger statements
    function antiDebugger() {
        if (!SECURITY_CONFIG.antiDebugger) return;
        
        // Tạo infinite debugger loop
        setInterval(function() {
            debugger;
        }, 100);
        
        // Function anti-debugging
        const func = function() {
            return function() {
                debugger;
            }.constructor('debugger').call();
        };
        
        setInterval(func, 50);
        
        // Constructor anti-debugging
        const debug = function() {
            debugger;
        };
        debug.toString = function() {
            handleDevToolsDetection();
            return 'function debug() { [native code] }';
        };
        
        setInterval(debug, 100);
    }

    // Monkey patch tất cả các function nguy hiểm
    function disableDangerousFunctions() {
        // Vô hiệu hóa eval
        window.eval = function(code) {
            handleDevToolsDetection();
            return null;
        };
        
        // Vô hiệu hóa Function constructor
        window.Function = function() {
            handleDevToolsDetection();
            return function() {};
        };
        
        // Vô hiệu hóa setTimeout với string
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(func, delay) {
            if (typeof func === 'string') {
                handleDevToolsDetection();
                return;
            }
            return originalSetTimeout.apply(this, arguments);
        };
        
        // Vô hiệu hóa setInterval với string  
        const originalSetInterval = window.setInterval;
        window.setInterval = function(func, delay) {
            if (typeof func === 'string') {
                handleDevToolsDetection();
                return;
            }
            return originalSetInterval.apply(this, arguments);
        };
        
        // Chặn import() dynamic
        if (window.import) {
            window.import = function() {
                handleDevToolsDetection();
                return Promise.reject(new Error('Dynamic import blocked'));
            };
        }
    }

    // Kiểm tra console object
    function detectConsoleUsage() {
        const originalConsole = window.console;
        
        // Ghi đè tất cả console methods
        ['log', 'warn', 'error', 'info', 'debug', 'trace', 'dir', 'dirxml', 
         'table', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'assert'].forEach(method => {
            if (originalConsole[method]) {
                originalConsole[method] = function() {
                    handleDevToolsDetection();
                    return null;
                };
            }
        });
        
        // Chặn truy cập console
        Object.defineProperty(window, 'console', {
            get: function() {
                handleDevToolsDetection();
                return originalConsole;
            },
            set: function(val) {
                handleDevToolsDetection();
            }
        });
    }

    // Phát hiện WebDriver/Automation
    function detectAutomation() {
        // Kiểm tra webdriver property
        if (navigator.webdriver) {
            handleDevToolsDetection();
        }
        
        // Kiểm tra các automation properties
        const automationChecks = [
            'webdriver',
            '__webdriver_script_fn',
            '__driver_evaluate',
            '__webdriver_evaluate',
            '__selenium_evaluate',
            '__fxdriver_evaluate',
            '__driver_unwrapped',
            '__webdriver_unwrapped',
            '__selenium_unwrapped',
            '__fxdriver_unwrapped'
        ];
        
        automationChecks.forEach(prop => {
            if (window[prop] || document[prop]) {
                handleDevToolsDetection();
            }
        });
        
        // Kiểm tra phantom.js
        if (window.callPhantom || window._phantom) {
            handleDevToolsDetection();
        }
        
        // Kiểm tra user agent
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = ['phantomjs', 'selenium', 'webdriver', 'chromium'];
        
        botPatterns.forEach(pattern => {
            if (userAgent.includes(pattern)) {
                handleDevToolsDetection();
            }
        });
    }

    // Kiểm tra extension/addon
    function detectExtensions() {
        // Kiểm tra một số extension phổ biến
        const extensionChecks = [
            'chrome.runtime',
            'browser.runtime',
            'window.InstallTrigger', // Firefox
            'HTMLElement.prototype.webkitRequestFullScreen', // Safari extension API
        ];
        
        extensionChecks.forEach(check => {
            try {
                if (eval('typeof ' + check) !== 'undefined') {
                    // Extension detected - có thể có developer tools
                    console.log('Extension detected');
                }
            } catch(e) {}
        });
    }

    // Chống copy source code
    function preventSourceAccess() {
        // Chặn view-source:
        if (window.location.protocol === 'view-source:') {
            window.location.href = 'about:blank';
        }
        
        // Chặn data: URLs
        if (window.location.protocol === 'data:') {
            window.location.href = 'about:blank';
        }
        
        // Chặn javascript: URLs
        if (window.location.protocol === 'javascript:') {
            window.location.href = 'about:blank';
        }
        
        // Override document.write
        document.write = function() {
            handleDevToolsDetection();
        };
        
        document.writeln = function() {
            handleDevToolsDetection();
        };
    }

    // Infinite loops cho debugger
    function createDebuggerTraps() {
        if (!SECURITY_CONFIG.breakOnDebugger) return;
        
        // Multiple debugger traps
        for (let i = 0; i < 10; i++) {
            setTimeout(function() {
                setInterval(function() {
                    debugger;
                }, Math.random() * 100 + 50);
            }, i * 100);
        }
        
        // Recursive debugger
        function recursiveDebugger() {
            debugger;
            setTimeout(recursiveDebugger, 100);
        }
        recursiveDebugger();
        
        // Promise-based debugger
        function promiseDebugger() {
            return new Promise(function(resolve) {
                debugger;
                setTimeout(resolve, 100);
            }).then(promiseDebugger);
        }
        promiseDebugger();
    }

    // ========== KHỞI TẠO BẢO MẬT ==========
    function initAdvancedSecurity() {
        antiDebugger();
        disableDangerousFunctions();
        detectConsoleUsage();
        detectAutomation();
        detectExtensions();
        preventSourceAccess();
        createDebuggerTraps();
        
        // Chạy các kiểm tra định kỳ
        setInterval(function() {
            detectAutomation();
        }, 2000);
    }

    // ========== KHỞI TẠO TOÀN BỘ HỆ THỐNG ==========
    function initSecurity() {
        // Kiểm tra xem đã khởi tạo chưa
        if (window.securitySystemActive) return;
        window.securitySystemActive = true;
        
        console.log('%c🔒 Initializing Enhanced Security System...', 'color: orange; font-weight: bold; font-size: 14px;');
        
        // Khởi tạo các tính năng cơ bản
        blockRightClick();
        blockKeyboardShortcuts();
        blockTextSelection();
        detectDevTools();
        addSecurityStyles();
        
        // Khởi tạo bảo mật nâng cao
        initEnhancedSecurity();
        
        // Thông báo hoàn thành
        setTimeout(() => {
            console.log('%c🛡️ Enhanced Security System Fully Activated!', 'color: red; font-weight: bold; font-size: 16px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
            console.log('%c⚠️ All Developer Tools Access Blocked!', 'color: red; font-weight: bold; font-size: 14px;');
        }, 1000);
    }

    // ========== AUTO START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    // Backup initialization
    window.addEventListener('load', initSecurity);

    // Export functions for manual control (optional)
    window.SecuritySystem = {
        init: initSecurity,
        config: SECURITY_CONFIG,
        detectDevTools: detectDevTools,
        handleDetection: handleDevToolsDetection
    };

    // ========== KỸ THUẬT CHỐNG DEVTOOLS TIÊN TIẾN ==========
    
    // Chặn DevTools bằng cách kiểm tra performance timing
    function advancedDevToolsDetection() {
        let devToolsOpen = false;
        
        // Method 1: Performance timing detection
        setInterval(() => {
            const threshold = 100;
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > threshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    handleDevToolsDetection();
                }
            } else {
                devToolsOpen = false;
            }
        }, 1000);
        
        // Method 2: Console toString detection
        const detectToString = () => {
            let devtools = { open: false };
            let element = new Image();
            
            Object.defineProperty(element, 'id', {
                get: function() {
                    devtools.open = true;
                    handleDevToolsDetection();
                }
            });
            
            setInterval(() => {
                console.log(element);
                console.clear();
            }, 500);
        };
        
        detectToString();
        
        // Method 3: Window size detection với độ chính xác cao
        let windowOuterHeight = window.outerHeight;
        let windowOuterWidth = window.outerWidth;
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                handleDevToolsDetection();
            }
        }, 100);
        
        // Method 4: Firebug detection
        if (window.console && (window.console.firebug || window.console.exception)) {
            handleDevToolsDetection();
        }
        
        // Method 5: DevTools hotkey detection
        let keyCount = 0;
        document.addEventListener('keydown', (e) => {
            keyCount++;
            if (keyCount > 2 && e.key === 'F12') {
                handleDevToolsDetection();
            }
        });
    }
    
    // Tạo nhiều debugger trap để làm khó việc debugging
    function createMultipleDebuggerTraps() {
        // Infinite loop debugger
        const infiniteDebugger = () => {
            while (true) {
                debugger;
            }
        };
        
        // Random interval debuggers
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                setInterval(() => {
                    debugger;
                }, Math.random() * 100 + 50);
            }, i * 100);
        }
        
        // Recursive function with debugger
        const recursiveDebugger = (depth = 0) => {
            if (depth < 1000) {
                debugger;
                recursiveDebugger(depth + 1);
            }
        };
        
        setTimeout(recursiveDebugger, 2000);
        
        // Promise chain with debugger
        let promiseChain = Promise.resolve();
        for (let i = 0; i < 50; i++) {
            promiseChain = promiseChain.then(() => {
                return new Promise(resolve => {
                    debugger;
                    setTimeout(resolve, 10);
                });
            });
        }
    }
    
    // Override tất cả console methods để chặn debugging
    function overrideConsoleMethods() {
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'exception', 'trace', 'time', 'timeEnd'];
        
        methods.forEach(method => {
            if (console[method]) {
                const original = console[method];
                console[method] = function() {
                    handleDevToolsDetection();
                    return null;
                };
            }
        });
        
        // Override console object
        Object.defineProperty(window, 'console', {
            get: function() {
                handleDevToolsDetection();
                return {
                    log: () => null,
                    warn: () => null,
                    error: () => null,
                    info: () => null,
                    debug: () => null
                };
            },
            set: function(val) {
                handleDevToolsDetection();
            }
        });
    }
    
    // Chặn các function nguy hiểm khác
    function blockDangerousFunctions() {
        // Block eval completely
        window.eval = function() {
            handleDevToolsDetection();
            throw new Error('eval is disabled');
        };
        
        // Block Function constructor
        window.Function = function() {
            handleDevToolsDetection();
            throw new Error('Function constructor is disabled');
        };
        
        // Block setTimeout/setInterval with string
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = function(func, delay) {
            if (typeof func === 'string') {
                handleDevToolsDetection();
                throw new Error('setTimeout with string is disabled');
            }
            return originalSetTimeout.apply(this, arguments);
        };
        
        window.setInterval = function(func, delay) {
            if (typeof func === 'string') {
                handleDevToolsDetection();
                throw new Error('setInterval with string is disabled');
            }
            return originalSetInterval.apply(this, arguments);
        };
        
        // Block document.write
        document.write = function() {
            handleDevToolsDetection();
            throw new Error('document.write is disabled');
        };
        
        // Block XMLHttpRequest to certain URLs
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url) {
                if (url.includes('devtools') || url.includes('debug')) {
                    handleDevToolsDetection();
                    throw new Error('Suspicious request blocked');
                }
                return originalOpen.apply(this, arguments);
            };
            
            return xhr;
        };
    }
    
    // Tạo fake DevTools để đánh lừa
    function createFakeDevTools() {
        // Tạo fake console object
        const fakeConsole = {
            log: () => console.log('DevTools đã bị vô hiệu hóa!'),
            warn: () => console.log('DevTools đã bị vô hiệu hóa!'),
            error: () => console.log('DevTools đã bị vô hiệu hóa!'),
            info: () => console.log('DevTools đã bị vô hiệu hóa!'),
            debug: () => console.log('DevTools đã bị vô hiệu hóa!'),
            clear: () => console.log('DevTools đã bị vô hiệu hóa!')
        };
        
        // Override window.console periodically
        setInterval(() => {
            try {
                Object.defineProperty(window, 'console', {
                    get: () => fakeConsole,
                    set: () => handleDevToolsDetection()
                });
            } catch(e) {}
        }, 100);
    }
    
    // Kiểm tra xem có đang bị debug không
    function detectDebugging() {
        let debugging = false;
        
        // Check if debugger is active
        const check = () => {
            const before = new Date().getTime();
            debugger;
            const after = new Date().getTime();
            
            if (after - before > 100) {
                debugging = true;
                handleDevToolsDetection();
                return true;
            }
            return false;
        };
        
        // Run check every second
        setInterval(check, 1000);
        
        // Also check on various events
        ['click', 'keydown', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => {
                if (Math.random() > 0.95) { // 5% chance
                    check();
                }
            });
        });
        
        return debugging;
    }
    
    // Advanced mouse and keyboard monitoring
    function advancedInputMonitoring() {
        let suspiciousActivity = 0;
        
        // Monitor for rapid F12 presses
        let f12Count = 0;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                f12Count++;
                if (f12Count > 3) {
                    handleDevToolsDetection();
                }
                setTimeout(() => f12Count--, 5000);
            }
            
            // Monitor for other suspicious key combinations
            if (e.ctrlKey && e.shiftKey) {
                suspiciousActivity++;
                if (suspiciousActivity > 5) {
                    handleDevToolsDetection();
                }
            }
        });
        
        // Reset suspicious activity counter
        setInterval(() => {
            suspiciousActivity = Math.max(0, suspiciousActivity - 1);
        }, 10000);
    }
    
    // Memory và performance monitoring
    function monitorPerformance() {
        if (performance.memory) {
            let initialMemory = performance.memory.usedJSHeapSize;
            
            setInterval(() => {
                let currentMemory = performance.memory.usedJSHeapSize;
                let memoryIncrease = currentMemory - initialMemory;
                
                // If memory increased significantly, might be DevTools
                if (memoryIncrease > 50000000) { // 50MB
                    handleDevToolsDetection();
                }
            }, 5000);
        }
        
        // Monitor performance entries
        setInterval(() => {
            const entries = performance.getEntriesByType('navigation');
            if (entries.length > 0) {
                const timing = entries[0];
                if (timing.loadEventEnd - timing.fetchStart > 10000) {
                    // Suspiciously slow load might indicate debugging
                    handleDevToolsDetection();
                }
            }
        }, 3000);
    }
    
    // Cập nhật initAdvancedSecurity để bao gồm các kỹ thuật mới
    function initEnhancedSecurity() {
        initAdvancedSecurity();
        advancedDevToolsDetection();
        createMultipleDebuggerTraps();
        overrideConsoleMethods();
        blockDangerousFunctions();
        createFakeDevTools();
        detectDebugging();
        advancedInputMonitoring();
        monitorPerformance();
        
        // Thêm protection layers
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                setInterval(() => {
                    try {
                        debugger;
                        eval('debugger');
                        (function() { debugger; })();
                        new Function('debugger')();
                    } catch(e) {
                        handleDevToolsDetection();
                    }
                }, Math.random() * 1000 + 500);
            }, i * 200);
        }
        
        console.log('%c🔒 Enhanced Security Activated - All DevTools Blocked!', 
            'color: red; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    }

})();
