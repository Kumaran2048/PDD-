# K6 Load Testing - Crop Advisory System

This directory contains the baseline load-testing suite designed to test the system under a normal, expected amount of concurrent users (100 users at a time).

The tests hit multiple key endpoints (authentication, weather data, crop information, market prices, schemes, etc.) to verify API responsiveness, throughput, and error rates.

## Test Configuration
- **Virtual Users (VUs):** 100 concurrent VUs
- **Duration:** 1 Minute
- **Authentication:** Automaticaly logs in using seeded credentials (`farmer@demo.com` / `password`) and shares the session token across VUs.
- **SLA Thresholds:**
  - 95% of requests must complete under **500ms** (`http_req_duration: ['p(95)<500']`)
  - Request failure rate must be less than **1%** (`http_req_failed: ['rate<0.01']`)

---

## Targeted Endpoints
- `POST /api/auth/login` (Login flow)
- `GET /` (Health check)
- `GET /api/weather/current` (Current Weather & irrigation advice)
- `GET /api/weather/forecast` (5-day Weather forecast)
- `GET /api/market/all-crops` (Crop Market Prices)
- `GET /api/schemes` (Government Eligible Schemes)
- `GET /api/crop/all` (List of crops)

---

## How to Run

### Prerequisite
Ensure the Crop Advisory backend server is running locally on port 5000:
1. Navigate to the backend server directory: `/crop-advisory-backend/crop-advisory/server`
2. Start the database and server:
   ```bash
   npm run dev
   ```

### Option 1: Using the Batch script (Recommended for Windows)
Double-click `run-load-test.bat` (or run it in a terminal):
```cmd
run-load-test.bat
```
This script automatically:
1. Temporarily updates your terminal's `PATH` to include the standard k6 installation folder.
2. Checks that `k6` is available.
3. Asks if you want to run a **Dry Run** (1 VU for 5s) or the **Full Load Test** (100 VUs for 1m).

### Option 2: Running via Command Line
Run the test directly from the command prompt:
```bash
# Dry Run (recommended to test connection first)
k6 run --vus 1 --duration 5s load-test.js

# Full Load Test
k6 run load-test.js
```

---

## Understanding the Results

When k6 finishes executing, it outputs a detailed summary containing the following key performance indicators:

### 1. Requests per Second (RPS)
Look for **`http_reqs`** in the summary:
```text
http_reqs..................: 7243    120.716667/s
```
* **Meaning:** The total number of HTTP requests sent, followed by the average requests per second. In the example above, the API processed about 120 requests every second.

### 2. Response Time
Look for **`http_req_duration`** in the summary:
```text
http_req_duration..........: avg=62ms min=48ms med=55ms max=601ms p(90)=125ms p(95)=263ms
```
* **`avg = 62ms`:** The average response time across all requests was 62 milliseconds.
* **`p(95) = 263ms`:** 95% of the requests were completed in 263ms or less (5% were slower).
* **`max = 601ms`:** The absolute slowest request took 601ms.
* **`min = 48ms`:** The absolute fastest request took 48ms.

### 3. Error Rate
Look for **`http_req_failed`** in the summary:
```text
✓ http_req_failed..........: 0.00% ✓ 0    ✗ 7243
```
* **Meaning:** The percentage of HTTP requests that returned error status codes (e.g. 500, 502, 404). Ideally, this should show `0.00%`.
