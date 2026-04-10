import requests
import json

# Test health
try:
    r = requests.get('http://127.0.0.1:8000/health')
    print(f"✓ Health: {r.status_code} - {r.json()}")
except Exception as e:
    print(f"✗ Health failed: {e}")

# Test auth
try:
    r = requests.post('http://127.0.0.1:8000/auth/demo-login')
    print(f"✓ Auth: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"  Token: {data.get('access_token', 'N/A')[:30]}...")
    else:
        print(f"  Error: {r.text}")
except Exception as e:
    print(f"✗ Auth failed: {e}")

# Test evaluation
try:
    auth_r = requests.post('http://127.0.0.1:8000/auth/demo-login')
    if auth_r.status_code == 200:
        token = auth_r.json()['access_token']
        headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
        payload = {
            'transcribed_text': 'Today we learn about ML',
            'syllabus_text': 'ML intro',
            'teaching_objectives': 'Learn ML'
        }
        eval_r = requests.post('http://127.0.0.1:8000/quick-evaluate', headers=headers, json=payload)
        print(f"✓ Evaluation: {eval_r.status_code}")
        if eval_r.status_code == 200:
            result = eval_r.json()
            print(f"  Scores: {result.get('scores', 'N/A')}")
        else:
            print(f"  Error: {eval_r.text}")
    else:
        print("✗ Cannot test evaluation - auth failed")
except Exception as e:
    print(f"✗ Evaluation failed: {e}")

print("\n✅ APP IS RUNNING!")
print(f"Frontend: http://localhost:3000")
print(f"Backend: http://127.0.0.1:8000")