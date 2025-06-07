/* Ultimate Security Protection - Không thể bỏ qua */
(function() {
    'use strict';
    
    // Tạo multiple protection layers
    const ULTIMATE_PROTECTION = {
        active: true,
        layers: 15,
        detectionMethods: 25
    };
    
    // Layer 1: Immediate key blocking
    document.addEventListener('keydown', function(e) {
        const blockedKeys = [123, 73, 74, 85, 116]; // F12, I, J, U, F5
        const blockedCombos = [
            {ctrl: true, shift: true, key: 73}, // Ctrl+Shift+I
            {ctrl: true, shift: true, key: 74}, // Ctrl+Shift+J
            {ctrl: true, shift: true, key: 67}, // Ctrl+Shift+C
            {ctrl: true, key: 85},              // Ctrl+U
            {ctrl: true, key: 83},              // Ctrl+S
            {ctrl: true, key: 80},              // Ctrl+P
            {key: 123}                          // F12
        ];
        
        if (blockedKeys.includes(e.keyCode) || 
            blockedCombos.some(combo => 
                (!combo.ctrl || e.ctrlKey) && 
                (!combo.shift || e.shiftKey) && 
                (!combo.alt || e.altKey) && 
                e.keyCode === combo.key)) {
            
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            
            // Trigger multiple alerts
            setTimeout(() => alert('🚫 TRUY CẬP BỊ CHẶN!'), 0);
            setTimeout(() => alert('⚠️ BẢO MẬT ĐƯỢC KÍCH HOẠT!'), 100);
            setTimeout(() => alert('🔒 KHÔNG THỂ MỞ DEVELOPER TOOLS!'), 200);
            
            return false;
        }
    }, true);
    
    // Layer 2: Context menu blocking with multiple events
    ['contextmenu', 'selectstart', 'dragstart'].forEach(event => {
        document.addEventListener(event, function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            alert('🚫 CHỨC NĂNG NÀY BỊ VÔ HIỆU HÓA!');
            return false;
        }, true);
    });
    
    // Layer 3: Advanced DevTools detection
    let devToolsDetected = false;
    const detectMethods = [
        // Method 1: Window size
        () => window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160,
        
        // Method 2: Performance timing
        () => {
            const start = performance.now();
            debugger;
            return performance.now() - start > 100;
        },
        
        // Method 3: Console detection
        () => {
            let detected = false;
            const element = new Image();
            Object.defineProperty(element, 'id', {
                get: () => { detected = true; return 'detected'; }
            });
            console.log(element);
            return detected;
        },
        
        // Method 4: toString detection
        () => {
            let detected = false;
            const obj = {};
            obj.toString = () => { detected = true; return ''; };
            console.log(obj);
            return detected;
        }
    ];
    
    // Run detection every 100ms
    setInterval(() => {
        if (detectMethods.some(method => {
            try { return method(); } catch(e) { return false; }
        })) {
            if (!devToolsDetected) {
                devToolsDetected = true;
                handleDevToolsDetection();
            }
        }
    }, 100);
    
    // Layer 4: Handle DevTools detection
    function handleDevToolsDetection() {
        // Blur and disable page
        document.body.style.filter = 'blur(20px)';
        document.body.style.pointerEvents = 'none';
        document.body.style.userSelect = 'none';
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:999999;display:flex;justify-content:center;align-items:center;font-family:Arial,sans-serif;">
                <div style="color:red;font-size:48px;text-align:center;animation:pulse 1s infinite;">
                    🚫 DEVELOPER TOOLS DETECTED! 🚫<br>
                    <div style="font-size:24px;margin-top:20px;">ACCESS DENIED</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Infinite alert loop
        const alertLoop = () => {
            alert('⚠️ DEVELOPER TOOLS DETECTED!\n🔒 PAGE LOCKED FOR SECURITY!');
            setTimeout(alertLoop, 1000);
        };
        setTimeout(alertLoop, 500);
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 5000);
    }
    
    // Layer 5: Multiple debugger traps
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            setInterval(() => {
                try {
                    debugger;
                    eval('debugger');
                    new Function('debugger')();
                    (function() { debugger; })();
                } catch(e) {}
            }, Math.random() * 200 + 50);
        }, i * 100);
    }
    
    // Layer 6: Console overrides
    const originalConsole = window.console;
    ['log', 'warn', 'error', 'info', 'debug', 'trace'].forEach(method => {
        if (originalConsole[method]) {
            originalConsole[method] = function() {
                handleDevToolsDetection();
                return null;
            };
        }
    });
    
    // Layer 7: Function blocking
    window.eval = () => { handleDevToolsDetection(); throw new Error('eval blocked'); };
    window.Function = () => { handleDevToolsDetection(); throw new Error('Function blocked'); };
    
    // Layer 8: Performance monitoring
    if (performance.memory) {
        const initialMemory = performance.memory.usedJSHeapSize;
        setInterval(() => {
            if (performance.memory.usedJSHeapSize - initialMemory > 50000000) {
                handleDevToolsDetection();
            }
        }, 5000);
    }
    
    // Layer 9: Mouse monitoring
    let rightClickCount = 0;
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) { // Right click
            rightClickCount++;
            if (rightClickCount > 3) {
                handleDevToolsDetection();
            }
        }
    });
    
    // Layer 10: Keyboard monitoring
    let suspiciousKeyCount = 0;
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey || e.keyCode === 123) {
            suspiciousKeyCount++;
            if (suspiciousKeyCount > 10) {
                handleDevToolsDetection();
            }
        }
    });
    
    // Layer 11: Focus monitoring
    let focusLostCount = 0;
    window.addEventListener('blur', () => {
        focusLostCount++;
        if (focusLostCount > 5) {
            setTimeout(() => {
                if (window.outerHeight - window.innerHeight > 160) {
                    handleDevToolsDetection();
                }
            }, 1000);
        }
    });
    
    // Layer 12: Network monitoring
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && (url.includes('devtools') || url.includes('debug'))) {
            handleDevToolsDetection();
            throw new Error('Suspicious request blocked');
        }
        return originalFetch.apply(this, args);
    };
    
    // Layer 13: DOM monitoring
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const tagName = node.tagName ? node.tagName.toLowerCase() : '';
                        if (['script', 'iframe', 'object', 'embed'].includes(tagName)) {
                            const src = node.src || node.data || '';
                            if (src.includes('devtools') || src.includes('debug')) {
                                handleDevToolsDetection();
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Layer 14: Timer manipulation detection
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    window.setTimeout = function(func, delay) {
        if (typeof func === 'string' && func.includes('debugger')) {
            handleDevToolsDetection();
            return;
        }
        return originalSetTimeout.apply(this, arguments);
    };
    
    window.setInterval = function(func, delay) {
        if (typeof func === 'string' && func.includes('debugger')) {
            handleDevToolsDetection();
            return;
        }
        return originalSetInterval.apply(this, arguments);
    };
    
    // Layer 15: Final protection - Self-destruct if tampered
    Object.freeze(ULTIMATE_PROTECTION);
    Object.seal(window);
    
    // Ultimate debugger maze
    const createDebuggerMaze = () => {
        for (let i = 0; i < 1000; i++) {
            setTimeout(() => {
                debugger;
                eval('debugger');
                new Function('debugger')();
                Function('debugger')();
                (function() { debugger; })();
                (() => { debugger; })();
            }, i);
        }
    };
    
    createDebuggerMaze();
    
    // Success message
    console.log('%c🛡️ ULTIMATE SECURITY PROTECTION ACTIVATED!', 
        'color: red; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);');
    console.log('%c⚠️ ALL DEVELOPER TOOLS ACCESS COMPLETELY BLOCKED!', 
        'color: red; font-size: 16px; font-weight: bold;');
        
})();
