# Hướng dẫn sử dụng Serveo thay thế Ngrok

## Giới thiệu
Serveo là một dịch vụ tạo tunnel miễn phí, cho phép bạn truy cập vào máy chủ local từ internet. Serveo có một số ưu điểm so với Ngrok:
- Miễn phí hoàn toàn
- Không yêu cầu cài đặt thêm phần mềm (chỉ cần SSH)
- Không giới hạn số lượng kết nối
- Có thể sử dụng subdomain tùy chọn

## Cách sử dụng

### 1. Chạy SeekerPro
Đầu tiên, bạn cần chạy SeekerPro như thông thường:

```bash
python3 seeker.py
```

Ghi nhớ cổng mà SeekerPro sử dụng (mặc định là 8080).

### 2. Tạo tunnel với Serveo
Sau khi SeekerPro đã khởi động và đang chạy, mở một terminal mới và chạy script serveo_tunnel.sh:

```bash
bash serveo_tunnel.sh [cổng] [subdomain-tùy-chọn]
```

Ví dụ:
- Sử dụng cổng mặc định với subdomain ngẫu nhiên:
  ```bash
  bash serveo_tunnel.sh
  ```

- Sử dụng cổng tùy chọn (ví dụ: 8888):
  ```bash
  bash serveo_tunnel.sh 8888
  ```

- Sử dụng cổng tùy chọn và subdomain tùy chọn:
  ```bash
  bash serveo_tunnel.sh 8080 mysubdomain
  ```

### 3. Sử dụng URL từ Serveo
Sau khi kết nối thành công, Serveo sẽ cung cấp cho bạn một URL (ví dụ: https://mysubdomain.serveo.net). Sử dụng URL này thay vì URL Ngrok để chia sẻ với mục tiêu.

## Lưu ý
- Serveo yêu cầu kết nối SSH hoạt động
- Đảm bảo rằng SeekerPro đã được khởi động trước khi chạy script serveo_tunnel.sh
- Để dừng tunnel, nhấn Ctrl+C trong terminal đang chạy script serveo_tunnel.sh

## Xử lý sự cố
1. Nếu gặp lỗi "port already in use" (cổng đã được sử dụng), hãy thử một cổng khác hoặc kiểm tra xem có tiến trình nào đang sử dụng cổng đó không.
2. Nếu subdomain bạn yêu cầu đã được sử dụng, hãy thử một subdomain khác.
3. Nếu gặp lỗi kết nối, hãy kiểm tra kết nối internet của bạn và thử lại.
