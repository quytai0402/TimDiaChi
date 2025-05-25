#!/usr/bin/env bash

# Script để sử dụng sau khi bạn đã đăng ký khóa SSH với serveo
# Tác giả: TranQuyTai

# Màu sắc giao diện
R='\033[31m'  # red
G='\033[32m'  # green
C='\033[36m'  # cyan
W='\033[0m'   # white
Y='\033[33m'  # yellow

# Xác định thư mục khóa SSH
SSH_KEY_DIR="$PWD/ssh_key"

clear
echo -e "${G}==================================================${W}"
echo -e "${G}      SỬ DỤNG TÊN MIỀN TÙY CHỌN VỚI SERVEO       ${W}"
echo -e "${G}==================================================${W}"
echo ""

# Kiểm tra xem khóa SSH đã tồn tại chưa
if [ ! -f "$SSH_KEY_DIR/id_rsa" ]; then
    echo -e "${R}[!] ${W}Không tìm thấy khóa SSH trong thư mục $SSH_KEY_DIR"
    echo -e "${R}[!] ${W}Vui lòng chạy ./serveo_setup.sh trước để tạo khóa SSH"
    exit 1
fi

echo -e "${G}[+] ${W}Đã tìm thấy khóa SSH tại $SSH_KEY_DIR/id_rsa"
echo -e "${Y}[!] ${W}Nếu bạn chưa đăng ký khóa SSH với serveo, vui lòng làm theo hướng dẫn trước đó."
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
echo -e "${Y}[!] ${W}Nhấn Ctrl+C để dừng tunnel"
echo ""

# Kết nối đến serveo với subdomain tùy chọn sử dụng khóa SSH từ thư mục hiện tại
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_DIR/id_rsa" -R ${SUBDOMAIN}:80:localhost:${PORT} serveo.net
