# Weather App Template

Đây là template Weather App cho công cụ Seeker, giúp lấy vị trí người dùng thông qua giao diện ứng dụng thời tiết đẹp mắt.

## Tính năng

1. **Hiển thị thông tin thời tiết thực tế** - Sử dụng API OpenWeatherMap để hiển thị thời tiết thực tế cho người dùng
2. **Thu thập vị trí chính xác** - Thu thập vị trí thực của người dùng thông qua Geolocation API
3. **Thu thập thông tin thiết bị** - Thu thập thông tin thiết bị của người dùng
4. **Giao diện thân thiện** - Giao diện đẹp mắt, hỗ trợ chế độ tối/sáng
5. **Hướng dẫn cấp quyền** - Hướng dẫn chi tiết cách cấp quyền vị trí cho từng trình duyệt

## Cách hoạt động

Template này hoạt động bằng cách đưa ra lý do chính đáng để người dùng cấp quyền vị trí - đó là cung cấp thông tin thời tiết chính xác cho khu vực của họ. Khi được cấp quyền, template sẽ:

1. Thu thập vị trí chính xác của người dùng
2. Thu thập thông tin thiết bị
3. Gửi các thông tin này về máy chủ
4. Hiển thị thông tin thời tiết thực tế dựa trên vị trí thu thập được

## Kết quả

Thông tin vị trí sẽ được lưu trong thư mục `db` của Seeker:
- Vị trí người dùng: `results.txt`
- Thông tin thiết bị: `info.txt`

## Tự động tích hợp

Template này tự động tích hợp với các tính năng có sẵn của Seeker để thu thập thông tin vị trí và thiết bị một cách hiệu quả.

## Lưu ý

- Không sử dụng template này cho các mục đích phi pháp
- Chỉ sử dụng template này để kiểm tra bảo mật và với sự đồng ý của người dùng
