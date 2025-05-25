#!/usr/bin/env python3
import os
import utils

R = '\033[31m' # red
G = '\033[32m' # green
C = '\033[36m' # cyan
W = '\033[0m'  # white

with open('template/freewifi/index_temp.html', 'r') as temp_index:
    temp_index_data = temp_index.read()
    if os.getenv("DEBUG_HTTP"):
        temp_index_data = temp_index_data.replace('window.location = "https:" + restOfUrl;', '')
    
    # Đảm bảo các script xử lý modal được thêm vào nếu chưa có
    if "function showDenyModal()" not in temp_index_data:
        print(f"{R}[!] Modal xử lý từ chối cấp quyền chưa được thêm vào.{W}")
        print(f"{G}[+] Đang cập nhật file...{W}")

with open('template/freewifi/index.html', 'w') as updated_index:
    updated_index.write(temp_index_data)
