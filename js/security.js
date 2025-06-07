// File bảo mật - Ngăn chặn F12, chuột phải và các Developer Tools
(function() {
    'use strict';
    
    // Cấu hình bảo mật
    const SECURITY_CONFIG = {
    blockRightClick: true,
    blockF12: true,
    blockCtrlShiftI: "true,          // Chặn Ctrl+Shift+I (Developer Tools)",
    blockCtrlU: true,
    blockCtrlS: "true,               // Chặn Ctrl+S (Save Page)",
    blockCtrlP: "true,               // Chặn Ctrl+P (Print)",
    blockCtrlA: false,
    blockCtrlC: false,
    blockF5: "false,                 // Không chặn F5 (Refresh)",
    detectDevTools: true,
    showWarning: "true,              // Hiển thị cảnh báo",
    redirectOnDetect: "false,        // Chuyển hướng khi phát hiện (tùy chọn)",
    redirectUrl: "'about:blank'      // URL chuyển hướng",
    blockSelection: true,
    showWarnings: true,
    blockDragDrop: false,
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

    // ========== PHÁT HIỆN DEVELOPER TOOLS ==========
    function detectDevTools() {
        if (!SECURITY_CONFIG.detectDevTools) return;
        
        let devtools = {
            opened: false,
            orientation: null
        };
        
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
        }, 500);
        
        // Phương pháp khác: sử dụng console.log
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
        
        // Kiểm tra định kỳ
        setInterval(function() {
            console.log('%cDeveloper Tools Detection', 'color: transparent; font-size: 1px;', element);
            console.clear && console.clear();
        }, 1000);
    }

    // Xử lý khi phát hiện Developer Tools
    function handleDevToolsDetection() {
        if (SECURITY_CONFIG.showWarning) {
            showWarning(WARNING_MESSAGES.devTools);
        }
        
        if (SECURITY_CONFIG.redirectOnDetect) {
            setTimeout(function() {
                window.location.href = SECURITY_CONFIG.redirectUrl;
            }, 2000);
        }
        
        // Làm mờ trang web
        document.body.style.filter = 'blur(5px)';
        document.body.style.pointerEvents = 'none';
        
        // Tạo overlay cảnh báo
        createDevToolsOverlay();
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

    // ========== CHỐNG DEBUG ==========
    function antiDebug() {
        // Làm chậm debugger
        setInterval(function() {
            debugger;
        }, 1000);
        
        // Clear console định kỳ
        setInterval(function() {
            if (console.clear) {
                console.clear();
            }
        }, 500);
        
        // Ghi đè console methods
        const consoleMethod = ['log', 'debug', 'info', 'warn', 'error', 'table', 'clear'];
        consoleMethod.forEach(function(method) {
            console[method] = function() {};
        });
    }

    // ========== KHỞI ĐỘNG BẢO MẬT ==========
    function initSecurity() {
        // Kiểm tra nếu đã được khởi tạo
        if (window.securityInitialized) return;
        window.securityInitialized = true;
        
        console.log('🔒 Đang khởi tạo hệ thống bảo mật...');
        
        // Thêm styles
        addSecurityStyles();
        
        // Kích hoạt các tính năng bảo mật
        blockRightClick();
        blockKeyboardShortcuts();
        blockTextSelection();
        detectDevTools();
        
        // Tùy chọn: Kích hoạt anti-debug (có thể gây khó chịu cho người dùng thông thường)
        // antiDebug();
        
        console.log('✅ Hệ thống bảo mật đã được kích hoạt!');
        
        // Hiển thị thông báo cho developer
        setTimeout(function() {
            console.log('%c🛡️ Website Security System Active', 
                'color: #e74c3c; font-size: 16px; font-weight: bold;');
        }, 1000);
    }

    // ========== TẮT BẢO MẬT (CHO ADMIN) ==========
    window.disableSecurity = function(password) {
        if (password === 'admin123') {
            SECURITY_CONFIG.blockRightClick = false;
            SECURITY_CONFIG.blockF12 = false;
            SECURITY_CONFIG.blockCtrlShiftI = false;
            SECURITY_CONFIG.detectDevTools = false;
            SECURITY_CONFIG.showWarning = false;
            
            // Xóa overlay nếu có
            const overlay = document.getElementById('devtools-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            // Bỏ mờ trang
            document.body.style.filter = '';
            document.body.style.pointerEvents = '';
            
            console.log('🔓 Bảo mật đã được tắt!');
            return true;
        }
        return false;
    };

    // ========== KHỞI ĐỘNG ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
    // Backup: khởi động khi window load
    window.addEventListener('load', function() {
        setTimeout(initSecurity, 100);
    });

})();
