# SeekerPro - Công cụ địa lý GPS nâng cao

<div align="center">
  <img src="https://img.shields.io/badge/Phiên_bản-0.1.2-brightgreen.svg" alt="Version">
  <img src="https://img.shields.io/badge/Python-3.6+-blue.svg" alt="Python">
</div>

## Giới thiệu

SeekerPro là công cụ địa lý GPS chuyên nghiệp dùng để phân tích và theo dõi vị trí. Ứng dụng cho phép xác định vị trí chính xác của người dùng thông qua trình duyệt web, sử dụng kỹ thuật social engineering.

## Tính năng chính

- 🌍 Xác định vị trí chính xác (GPS)
- 📱 Hoạt động trên tất cả các nền tảng có trình duyệt web
- 🔍 Thu thập thông tin chi tiết về thiết bị
- 📊 Tạo báo cáo trực quan
- 🌐 Hỗ trợ nhiều template: NearYou, FreeWifi và nhiều mẫu khác
- 🔄 Hỗ trợ tunneling thông qua Serveo

## Yêu cầu hệ thống

- Python 3.6 trở lên
- PHP
- Các thư viện phụ thuộc: requests, packaging, psutil

## Cài đặt

### Cài đặt tự động

```bash
git clone https://github.com/TranQuyTai/TimViTri.git
cd TimViTri
chmod +x install.sh
bash install.sh
```

### Cài đặt thủ công

```bash
# Cài đặt các gói phụ thuộc
pip3 install requests packaging psutil

# Đảm bảo PHP đã được cài đặt
# Trên Ubuntu/Debian:
sudo apt install php

# Trên macOS:
brew install php
```

## Cách sử dụng

```bash
python3 seeker.py
```

### Các tùy chọn

```
usage: seeker.py [-h] [-k] [-t TEMPLATE] [--tunnel {manual,serveo}]
                [--port PORT] [--subdomain SUBDOMAIN]

tùy chọn:
  -h, --help                Hiển thị thông tin trợ giúp
  -t TEMPLATE, --template TEMPLATE
                           Chọn template (mặc định: nearyou)
  -p PORT, --port PORT     Cổng máy chủ (mặc định: 8080)
  --tunnel {manual,serveo} Chọn phương thức tunneling (mặc định: manual)
  --subdomain SUBDOMAIN    Chọn subdomain cho Serveo
```

### Sử dụng Serveo

Xem chi tiết trong [SERVEO_GUIDE.md](SERVEO_GUIDE.md)

### Sử dụng Ngrok

Ngrok là một giải pháp tunneling phổ biến khác để truy cập máy chủ local từ internet.

#### Cài đặt Ngrok

1. Đăng ký tài khoản tại [ngrok.com](https://ngrok.com)
2. Tải Ngrok từ [trang tải xuống](https://ngrok.com/download)
3. Giải nén file tải về:
   ```bash
   unzip /đường-dẫn-đến-file/ngrok-stable-darwin-amd64.zip
   ```
4. Kết nối với tài khoản của bạn (lấy authtoken từ [dashboard](https://dashboard.ngrok.com)):
   ```bash
   ./ngrok authtoken YOUR_AUTH_TOKEN
   ```

#### Sử dụng Ngrok với SeekerPro

1. Chạy SeekerPro:
   ```bash
   python3 seeker.py
   ```

2. Mở terminal mới và tạo tunnel với Ngrok:
   ```bash
   ./ngrok http 8080
   ```
   
3. Ngrok sẽ hiển thị URL công khai (dạng https://xxxx.ngrok.io). Sử dụng URL này để chia sẻ với mục tiêu.

## Template có sẵn

1. **NearYou** - Template xác định vị trí cơ bản
2. **FreeWifi** - Template mạo danh điểm WiFi miễn phí

## Bảo mật

**Lưu ý quan trọng**: Công cụ này chỉ được phát triển cho mục đích giáo dục và thử nghiệm bảo mật. Tác giả không chịu trách nhiệm về bất kỳ hành vi sử dụng sai mục đích hoặc phi pháp nào.

## Tác giả

- **thewhiteh4t**
- GitHub: [github.com/thewhiteh4t](https://github.com/thewhiteh4t)

## Phát triển bởi
- **Tran QuyT Tai**
