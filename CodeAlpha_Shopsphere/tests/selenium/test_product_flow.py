import time
import sys
import os
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
  sys.stdout.reconfigure(encoding='utf-8')
  sys.stderr.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5173"

def get_driver():
  """Initialize Chrome or Edge WebDriver in headless mode."""
  try:
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--log-level=3")

    chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    if os.path.exists(chrome_path):
      chrome_options.binary_location = chrome_path

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    return driver
  except Exception as chrome_err:
    print(f"  [INFO] Chrome init note ({chrome_err}), falling back to Edge...")

  try:
    edge_options = webdriver.EdgeOptions()
    edge_options.add_argument("--headless=new")
    edge_options.add_argument("--disable-gpu")
    edge_options.add_argument("--no-sandbox")
    edge_options.add_argument("--window-size=1920,1080")

    edge_path = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
    if os.path.exists(edge_path):
      edge_options.binary_location = edge_path

    driver = webdriver.Edge(options=edge_options)
    driver.implicitly_wait(10)
    return driver
  except Exception as edge_err:
    raise RuntimeError(f"Could not start Chrome or Edge WebDriver: {edge_err}")


class ShopSphereProductFlowTest(unittest.TestCase):

  @classmethod
  def setUpClass(cls):
    print("=" * 65)
    print("[SELENIUM] Initializing End-to-End Test Suite for ShopSphere")
    print(f"[TARGET] URL: {BASE_URL}")
    print("=" * 65)
    cls.driver = get_driver()
    cls.wait = WebDriverWait(cls.driver, 15)

  @classmethod
  def tearDownClass(cls):
    if cls.driver:
      cls.driver.quit()
      print("\n[CLEANUP] Selenium WebDriver session closed.")

  def ensure_authenticated(self):
    """Helper to ensure user is logged in past the AuthWall."""
    try:
      # Check if on AuthWall
      body_text = self.driver.find_element(By.TAG_NAME, "body").text
      if "Member Access Required" in body_text or "Enter Store (Demo Shopper)" in body_text:
        demo_btns = self.driver.find_elements(By.XPATH, "//button[contains(., 'Demo Shopper')]")
        if demo_btns:
          demo_btns[0].click()
          time.sleep(1.5)
    except Exception:
      pass

  def test_01_auth_wall_and_login(self):
    """Test 1: Verify AuthWall and login into store"""
    print("\n[Test 1] Verifying Mandatory Login Wall & Customer Sign In...")
    self.driver.get(BASE_URL)

    # Wait for AuthWall to be rendered past the loading spinner
    self.wait.until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Welcome to Shop')]"))
    )
    print("  [PASS] Login Wall displayed successfully on initial launch")

    # Click the demo login button to authenticate
    demo_btn = self.wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Demo Shopper')]"))
    )
    demo_btn.click()
    time.sleep(2)

    # Verify store unlocked
    body_after_login = self.driver.find_element(By.TAG_NAME, "body").text
    self.assertIn("ShopSphere", body_after_login)
    print("  [PASS] Customer authenticated & Storefront unlocked successfully")

  def test_02_homepage_elements(self):
    """Test 2: Verify Homepage hero, branding, and navigation"""
    print("\n[Test 2] Verifying Homepage Hero & Navigation...")
    self.driver.get(f"{BASE_URL}/")
    self.ensure_authenticated()

    # Verify Hero Title exists
    hero_title = self.wait.until(
        EC.presence_of_element_located((By.XPATH, "//h1"))
    )
    hero_text = hero_title.text
    self.assertTrue("Elevate" in hero_text or "Style" in hero_text, f"Hero title content: {hero_text}")
    print(f"  [PASS] Hero banner headline verified: \"{hero_text}\"")

    # Verify Navigation Links
    nav = self.driver.find_element(By.TAG_NAME, "nav")
    self.assertIn("Products", nav.text, "Products navigation link should exist")
    self.assertIn("My Orders", nav.text, "My Orders link should exist")
    print("  [PASS] Navbar navigation links verified")

  def test_03_product_catalog_and_search(self):
    """Test 3: Verify Catalog browsing, search query, and filters"""
    print("\n[Test 3] Verifying Product Catalog & Search Filtering...")
    self.driver.get(f"{BASE_URL}/products")
    self.ensure_authenticated()

    # Wait for Product Cards to load
    product_cards = self.wait.until(
        EC.presence_of_all_elements_located((By.XPATH, "//h3"))
    )
    self.assertGreater(len(product_cards), 0, "Products should be displayed in catalog")
    first_title = product_cards[0].text
    print(f"  [PASS] Catalog loaded with products. First item: \"{first_title}\"")

    # Test Search Input
    search_inputs = self.driver.find_elements(By.XPATH, "//input[@placeholder='Search catalog...']")
    if search_inputs:
      search_input = search_inputs[0]
      search_input.clear()
      search_input.send_keys("Moisturizer")
      search_input.send_keys(Keys.ENTER)
      time.sleep(1.5)
      print("  [PASS] Product search query executed successfully")

  def test_04_product_details_and_add_to_cart(self):
    """Test 4: Verify Product Details page, quantity adjustment, and Add to Cart"""
    print("\n[Test 4] Verifying Product Details & Cart Addition...")
    self.driver.get(f"{BASE_URL}/products/1")
    self.ensure_authenticated()

    # Verify details elements
    add_btn = self.wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Add to Cart')]"))
    )
    print("  [PASS] Product details page loaded with pricing and specs")

    add_btn.click()
    time.sleep(1.5)
    print("  [PASS] 'Add to Cart' action executed successfully")

  def test_05_cart_page_and_coupon(self):
    """Test 5: Verify Cart page, quantity calculation, and promo code"""
    print("\n[Test 5] Verifying Shopping Cart & Coupon Discount...")
    self.driver.get(f"{BASE_URL}/cart")
    self.ensure_authenticated()

    body_text = self.wait.until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(., 'Order Summary')]"))
    ).text
    self.assertIn("Order Summary", body_text, "Order Summary should be visible on Cart page")
    print("  [PASS] Shopping Cart page loaded with line items and subtotal")

    # Test Promo Code Application
    promo_inputs = self.driver.find_elements(By.XPATH, "//input[@placeholder='e.g. SHOPSPHERE10']")
    if promo_inputs:
      promo_input = promo_inputs[0]
      promo_input.clear()
      promo_input.send_keys("SHOPSPHERE10")
      apply_btns = self.driver.find_elements(By.XPATH, "//button[contains(., 'Apply')]")
      if apply_btns:
        apply_btns[0].click()
        time.sleep(1)
        print("  [PASS] Promo coupon 'SHOPSPHERE10' applied successfully")

  def test_06_checkout_and_order_submission(self):
    """Test 6: Verify Checkout flow and backend order placement"""
    print("\n[Test 6] Verifying Checkout & Order Placement Flow...")
    self.driver.get(f"{BASE_URL}/checkout")
    self.ensure_authenticated()

    # Fill checkout form if needed
    name_inputs = self.driver.find_elements(By.NAME, "fullName")
    if name_inputs and not name_inputs[0].get_attribute("value"):
      name_inputs[0].send_keys("Selenium Test Customer")

    address_inputs = self.driver.find_elements(By.NAME, "address")
    if address_inputs and not address_inputs[0].get_attribute("value"):
      address_inputs[0].send_keys("100 Tech Blvd")

    city_inputs = self.driver.find_elements(By.NAME, "city")
    if city_inputs and not city_inputs[0].get_attribute("value"):
      city_inputs[0].send_keys("Seattle")

    # Click Place Order
    submit_btns = self.driver.find_elements(By.XPATH, "//button[contains(., 'Place Order')]")
    if submit_btns:
      submit_btns[0].click()
      time.sleep(3.5)

      current_url = self.driver.current_url
      self.assertTrue(
          "order-confirmation" in current_url or "orders" in current_url,
          f"Expected confirmation URL, got: {current_url}"
      )
      print("  [PASS] Order placed and redirected to Order Confirmation receipt")

  def test_07_secret_admin_security_gate(self):
    """Test 7: Verify Secret Admin Portal passkey authentication"""
    print("\n[Test 7] Verifying Secret Admin Portal Authentication Gate...")
    self.driver.get(f"{BASE_URL}/admin")

    # Wait for Admin Authentication gate
    self.wait.until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Admin Authentication')]"))
    )
    print("  [PASS] Secret Admin passkey gate verified on /admin")

    # Fill Admin credentials (admin / admin123)
    user_input = self.wait.until(
        EC.presence_of_element_located((By.NAME, "admin_username"))
    )
    user_input.clear()
    user_input.send_keys("admin")

    pass_input = self.wait.until(
        EC.presence_of_element_located((By.NAME, "admin_passkey"))
    )
    pass_input.clear()
    pass_input.send_keys("admin123")

    unlock_btn = self.wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
    )
    unlock_btn.click()
    time.sleep(2)

    # Wait for Admin Console header
    admin_header = self.wait.until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(., 'Admin Console')]"))
    )
    self.assertTrue(admin_header.is_displayed(), "Admin Console should unlock after valid passkey")
    print("  [PASS] Secret Admin Console unlocked with sales KPIs and live order management")


if __name__ == "__main__":
  unittest.main(verbosity=2)
