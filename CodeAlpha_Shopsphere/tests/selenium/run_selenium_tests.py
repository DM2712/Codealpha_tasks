import subprocess
import time
import sys
import os
import urllib.request

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
  sys.stdout.reconfigure(encoding='utf-8')
  sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))

def is_server_ready(url, timeout=1):
  try:
    with urllib.request.urlopen(url, timeout=timeout) as response:
      return response.status == 200
  except Exception:
    return False

def wait_for_server(name, url, max_retries=25):
  print(f"[Wait] Waiting for {name} to be ready at {url}...")
  for i in range(max_retries):
    if is_server_ready(url):
      print(f"[OK] {name} is online!")
      return True
    time.sleep(1)
  return False

def main():
  print("\n" + "=" * 65)
  print("[ORCHESTRATOR] ShopSphere Automated Selenium Test Suite")
  print("=" * 65 + "\n")

  processes = []
  backend_url = "http://localhost:5000/api/health"
  frontend_url = "http://localhost:5173"

  # 1. Start Backend if not already running
  if not is_server_ready(backend_url):
    print("[START] Starting Backend Server (Port 5000)...")
    backend_proc = subprocess.Popen(
        "npm run start --prefix backend",
        cwd=ROOT_DIR,
        shell=True
    )
    processes.append(backend_proc)
    if not wait_for_server("Backend API", backend_url):
      print("[FAIL] Failed to start Backend Server. Aborting Selenium tests.")
      cleanup(processes)
      sys.exit(1)
  else:
    print("[INFO] Backend Server is already running.")

  # 2. Start Frontend if not already running
  if not is_server_ready(frontend_url):
    print("[START] Starting Frontend Dev Server (Port 5173)...")
    frontend_proc = subprocess.Popen(
        "npm run dev --prefix frontend",
        cwd=ROOT_DIR,
        shell=True
    )
    processes.append(frontend_proc)
    if not wait_for_server("Frontend App", frontend_url):
      print("[FAIL] Failed to start Frontend Server. Aborting Selenium tests.")
      cleanup(processes)
      sys.exit(1)
  else:
    print("[INFO] Frontend App is already running.")

  # 3. Execute Selenium Test Suite
  print("\n" + "=" * 65)
  print("[RUN] Running Selenium Test Cases...")
  print("=" * 65 + "\n")

  test_script = os.path.join(os.path.dirname(__file__), "test_product_flow.py")
  test_result = subprocess.run([sys.executable, test_script], cwd=ROOT_DIR)

  # 4. Clean up any started processes
  cleanup(processes)

  sys.exit(test_result.returncode)

def cleanup(processes):
  if processes:
    print("\n[CLEANUP] Shutting down test background servers...")
    for p in processes:
      try:
        if sys.platform == "win32":
          subprocess.run(f"taskkill /F /T /PID {p.pid}", shell=True, capture_output=True)
        else:
          p.terminate()
      except Exception:
        pass
    print("[OK] Cleanup complete.")

if __name__ == "__main__":
  main()
