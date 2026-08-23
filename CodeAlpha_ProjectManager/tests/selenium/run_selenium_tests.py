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

def kill_processes_on_ports(ports):
  """Kill any stale processes listening on specified ports."""
  if sys.platform == "win32":
    for port in ports:
      try:
        out = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode('utf-8', errors='ignore')
        for line in out.strip().split('\n'):
          parts = line.strip().split()
          if len(parts) >= 5 and ('LISTENING' in line or 'ESTABLISHED' in line):
            pid = parts[-1]
            if pid.isdigit() and int(pid) > 4:
              subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
      except Exception:
        pass

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

  # Kill any old background servers to ensure clean test environment
  print("\n[INFO] Ensuring clean ports for ProjectManager (5050, 5175)...")
  kill_processes_on_ports([5050, 5175])
  time.sleep(2)

  backend_proc = None
  frontend_proc = None

  # 1. Start Backend on port 5050
  print("[INFO] Starting ProjectManager Backend Server on port 5050...")
  backend_proc = subprocess.Popen(
      ["npm", "start", "--prefix", "backend"],
      cwd=ROOT_DIR,
      shell=True
  )
  if not wait_for_port(5050, 25):
    print("  [WARN] Backend port 5050 took longer to open, continuing...")
  else:
    print("  [OK] ProjectManager Backend is ready on http://localhost:5050")

  # 2. Start Frontend on port 5175
  print("[INFO] Starting ProjectManager Frontend App on port 5175...")
  frontend_proc = subprocess.Popen(
      ["npm", "run", "dev:frontend"],
      cwd=ROOT_DIR,
      shell=True
  )
  if not wait_for_port(5175, 25):
    print("  [WARN] Frontend port 5175 took longer to open, continuing...")
  else:
    print("  [OK] ProjectManager Frontend is ready on http://localhost:5175")

  time.sleep(3)

  # 3. Execute Selenium Test Suite
  print("\n" + "=" * 65)
  print("[RUN] Running Selenium Test Cases on http://localhost:5175...")
  print("=" * 65 + "\n")

  test_file = os.path.join(os.path.dirname(__file__), "test_project_manager_flow.py")
  result = subprocess.run([sys.executable, test_file], cwd=ROOT_DIR)

  # 4. Clean up spawned processes
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

  kill_processes_on_ports([5050, 5175])

  print("\n" + "=" * 65)
  print(f"[FINISHED] Selenium Test Suite Exit Code: {result.returncode}")
  print("=" * 65)

  sys.exit(result.returncode)

if __name__ == "__main__":
  main()
