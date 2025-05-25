#!/usr/bin/env bash

# Script để thiết lập subdomain tùy chọn với serveo.net
# Tác giả: TranQuyTai

# Màu sắc giao diện
R='\033[31m'  # red
G='\033[32m'  # green
C='\033[36m'  # cyan
W='\033[0m'   # white
Y='\033[33m'  # yellow

clear
echo -e "${G}==================================================${W}"
echo -e "${G}    THIẾT LẬP SUBDOMAIN TÙY CHỌN VỚI SERVEO.NET   ${W}"
echo -e "${G}==================================================${W}"
echo ""

# Xác định thư mục hiện tại để lưu khóa SSH
SSH_KEY_DIR="$PWD/ssh_key"
mkdir -p "$SSH_KEY_DIR"

# Kiểm tra xem đã có khóa SSH chưa
if [ ! -f "$SSH_KEY_DIR/id_rsa" ]; then
    echo -e "${Y}[!] ${W}Bạn chưa có khóa SSH. Cần tạo khóa mới."
    echo -e "${C}Bạn có muốn tạo khóa SSH mới không? (y/n):${W}"
    read -r CREATE_KEY
    
    if [[ "$CREATE_KEY" == "y" || "$CREATE_KEY" == "Y" ]]; then
        echo -e "${G}[+] ${W}Đang tạo khóa SSH mới trong thư mục hiện tại..."
        ssh-keygen -t rsa -b 4096 -f "$SSH_KEY_DIR/id_rsa" -N ""
        echo -e "${G}[+] ${W}Đã tạo khóa SSH thành công tại $SSH_KEY_DIR/id_rsa!"
    else
        echo -e "${R}[!] ${W}Bạn cần có khóa SSH để sử dụng tên miền tùy chọn."
        exit 1
    fi
else
    echo -e "${G}[+] ${W}Đã tìm thấy khóa SSH hiện có tại $SSH_KEY_DIR/id_rsa."
fi

echo ""
echo -e "${Y}[!] ${W}Bây giờ bạn cần đăng ký khóa SSH với serveo."
echo -e "${Y}[!] ${W}Kết nối đầu tiên sẽ nhận được hướng dẫn đăng ký."
echo ""

# Hỏi cổng
echo -e "${C}Nhập cổng mà SeekerPro đang chạy [mặc định: 8080]:${W}"
read -r PORT
PORT=${PORT:-8080}

# Hỏi tên miền tùy chọn
echo -e "${C}Nhập tên miền bạn muốn sử dụng:${W}"
read -r SUBDOMAIN

echo ""
echo -e "${Y}[!] ${W}Đang thiết lập tunnel với tên miền: ${G}${SUBDOMAIN}.serveo.net${W}"
echo -e "${Y}[!] ${W}Sau khi kết nối, hãy làm theo hướng dẫn trên màn hình để đăng ký khóa SSH."
echo -e "${Y}[!] ${W}Nhấn Ctrl+C để dừng tunnel"
echo ""

# Kết nối đến serveo với subdomain tùy chọn sử dụng khóa SSH từ thư mục hiện tại
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_DIR/id_rsa" -R ${SUBDOMAIN}:80:localhost:${PORT} serveo.net

# Sau khi đăng ký khóa thành công, người dùng có thể sử dụng lệnh này để kết nối với subdomain tùy chọn
