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
    print("Loading login page...")
    driver.get('http://localhost:5173/login')
    time.sleep(2)
    
    print("Clearing storage...")
    driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
    driver.delete_all_cookies()
    driver.refresh()
    time.sleep(2)
    
    print("Switching role tab to 'Officer'...")
    role_buttons = driver.find_elements("css selector", "button")
    for btn in role_buttons:
        if "Officer" in btn.text:
            btn.click()
            time.sleep(1)
            break
            
    email = driver.find_element('css selector', "input[type='email']")
    pwd = driver.find_element('css selector', "input[type='password']")
    btn = driver.find_element('css selector', "button[type='submit']")
    
    print("Form credentials automatically set by clicking tab:")
    print("Email field value:", email.get_attribute("value"))
    print("Password field value:", pwd.get_attribute("value"))
    
    print("Submitting...")
    btn.click()
    time.sleep(4)
    
    print('Current URL:', driver.current_url)
    
    # Check for alert banner
    try:
        alerts = driver.find_elements("css selector", ".alert-banner")
        for alert in alerts:
            print("Alert Text:", alert.text)
    except Exception as ae:
        print("No alerts or error finding them:", ae)
        
    print('Token:', driver.execute_script("return localStorage.getItem('token');"))
    print('User:', driver.execute_script("return localStorage.getItem('user');"))
    
except Exception as e:
    print('Error:', e)
finally:
    driver.quit()
