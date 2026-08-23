import subprocess
import time
import socket
import sys
import os

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
  sys.stdout.reconfigure(encoding='utf-8')
  sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

def is_port_open(port):
  """Check if a TCP port is currently listening."""
  with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.settimeout(1.0)
    return s.connect_ex(('127.0.0.1', port)) == 0

def wait_for_port(port, timeout=30):
  """Wait until a TCP port starts listening."""
  start = time.time()
  while time.time() - start < timeout:
    if is_port_open(port):
      return True
    time.sleep(1)
  return False

def main():
  print("=" * 65)
  print("[ORCHESTRATOR] ProjectManager Automated Selenium Test Suite")
  print("=" * 65)

  backend_proc = None
  frontend_proc = None

  # 1. Start Backend if not already running on port 5000
  if not is_port_open(5000):
    print("\n[INFO] Starting Backend Server on port 5000...")
    backend_proc = subprocess.Popen(
        ["npm", "start", "--prefix", "backend"],
        cwd=ROOT_DIR,
        shell=True
    )
    if not wait_for_port(5000, 25):
      print("  [WARN] Backend port 5000 took longer to open, continuing...")
    else:
      print("  [OK] Backend Server is ready on http://localhost:5000")
  else:
    print("\n[INFO] Backend Server is already running.")

  # 2. Start Frontend if not already running on port 5173
  if not is_port_open(5173):
    print("\n[INFO] Starting Frontend App on port 5173...")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev:frontend"],
        cwd=ROOT_DIR,
        shell=True
    )
    if not wait_for_port(5173, 25):
      print("  [WARN] Frontend port 5173 took longer to open, continuing...")
    else:
      print("  [OK] Frontend App is ready on http://localhost:5173")
  else:
    print("\n[INFO] Frontend App is already running.")

  time.sleep(3)

  # 3. Execute Selenium Test Suite
  print("\n" + "=" * 65)
  print("[RUN] Running Selenium Test Cases...")
  print("=" * 65 + "\n")

  test_file = os.path.join(os.path.dirname(__file__), "test_project_manager_flow.py")
  result = subprocess.run([sys.executable, test_file], cwd=ROOT_DIR)

  # 4. Clean up spawned processes if needed
  if backend_proc:
    try:
      subprocess.run(f"taskkill /F /T /PID {backend_proc.pid}", shell=True, capture_output=True)
    except Exception:
      pass

  if frontend_proc:
    try:
      subprocess.run(f"taskkill /F /T /PID {frontend_proc.pid}", shell=True, capture_output=True)
    except Exception:
      pass

  print("\n" + "=" * 65)
  print(f"[FINISHED] Selenium Test Suite Exit Code: {result.returncode}")
  print("=" * 65)

  sys.exit(result.returncode)

if __name__ == "__main__":
  main()
