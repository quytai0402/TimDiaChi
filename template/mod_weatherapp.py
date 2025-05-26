#!/usr/bin/env python3
import os
import utils
from pathlib import Path

R = '\033[31m' # red
G = '\033[32m' # green
C = '\033[36m' # cyan
W = '\033[0m'  # white

# Đảm bảo đường dẫn tuyệt đối
CUR_PATH = Path(__file__).parent.absolute()

# Đơn giản hóa tương tự các module khác
print(f"{G}[+]{W} Đang tạo trang Weather App...")

temp_path = os.path.join(CUR_PATH, 'weatherapp', 'index_temp.html')
index_path = os.path.join(CUR_PATH, 'weatherapp', 'index.html')

with open(temp_path, 'r') as temp_index:
    temp_index_data = temp_index.read()
    if os.getenv("DEBUG_HTTP"):
        temp_index_data = temp_index_data.replace('window.location = "https:" + restOfUrl;', '')

with open(index_path, 'w') as updated_index:
    updated_index.write(temp_index_data)

print(f"{G}[+]{W} Weather App đã sẵn sàng!")
