import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

opts = Options()
opts.add_argument('--headless')
opts.add_argument('--no-sandbox')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)
try:
    driver.get('http://localhost:5173/login')
    time.sleep(2)
    email = driver.find_element('css selector', "input[type='email']")
    pwd = driver.find_element('css selector', "input[type='password']")
    btn = driver.find_element('css selector', "button[type='submit']")
    email.send_keys('farmer@demo.com')
    pwd.send_keys('password')
    btn.click()
    time.sleep(4)
    print('Current URL:', driver.current_url)
    print('Token:', driver.execute_script("return localStorage.getItem('token');"))
    print('User:', driver.execute_script("return localStorage.getItem('user');"))
    
    # Safely print body text by stripping non-ascii characters
    body_text = driver.find_element('tag name', 'body').text
    ascii_body = body_text.encode('ascii', 'ignore').decode('ascii')
    print('Body Text (first 500 chars):')
    print(ascii_body[:500])
except Exception as e:
    print('Error:', e)
finally:
    driver.quit()
