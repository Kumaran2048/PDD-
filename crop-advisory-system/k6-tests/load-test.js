import http from 'k6/http';
import { check, sleep, group } from 'k6';

// ── Test Configuration ───────────────────────────────────────────────
export const options = {
  // 100 concurrent users (VUs) running for 1 minute
  vus: 100,
  duration: '1m',
  
  // Define performance SLAs (Service Level Agreements)
  thresholds: {
    // 95% of requests must complete within 1000ms (1s) under stress load
    http_req_duration: ['p(95)<1000'],
    // Less than 1% of requests should fail
    http_req_failed: ['rate<0.01'],
  },
};

// Base URL for the Crop Advisory Backend API
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

// ── Setup Block (Executed Once at the Start) ─────────────────────────
export function setup() {
  console.log(`Starting load test against base URL: ${BASE_URL}`);
  
  // Login payload using seeded farmer account
  const payload = JSON.stringify({
    email: 'farmer@demo.com',
    password: 'password',
  });
  
  const headers = { 'Content-Type': 'application/json' };
  
  const response = http.post(`${BASE_URL}/api/auth/login`, payload, { headers });
  
  const loginSuccess = check(response, {
    'login succeeded with 200': (r) => r.status === 200,
    'token returned': (r) => r.json() && r.json().token !== undefined,
  });

  if (!loginSuccess) {
    console.error('Setup failed: Unable to log in with farmer@demo.com / password.');
    // Fail-fast by returning empty token
    return { token: '' };
  }

  const token = response.json().token;
  console.log('Setup complete: Authentication token retrieved successfully.');
  return { token };
}

// ── Default Scenario (Executed by Virtual Users in a Loop) ───────────
export default function (data) {
  const token = data.token;
  
  if (!token) {
    // If auth token is missing, fail-fast
    check(null, { 'authenticated user': () => false });
    return;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // Group 1: Public Health Check
  group('Health Check', function () {
    const res = http.get(`${BASE_URL}/`);
    check(res, {
      'health check status is 200': (r) => r.status === 200,
    });
  });

  sleep(1); // Think time: 1 second

  // Group 2: Weather Services
  group('Weather Services', function () {
    const responses = http.batch([
      ['GET', `${BASE_URL}/api/weather/current`, null, { headers: authHeaders }],
      ['GET', `${BASE_URL}/api/weather/forecast`, null, { headers: authHeaders }],
    ]);

    check(responses[0], {
      'current weather status is 200': (r) => r.status === 200,
    });
    check(responses[1], {
      'forecast status is 200': (r) => r.status === 200,
    });
  });

  sleep(1.5); // Think time: 1.5 seconds

  // Group 3: Market Prices & Schemes
  group('Market Prices & Schemes', function () {
    const responses = http.batch([
      ['GET', `${BASE_URL}/api/market/all-crops`, null, { headers: authHeaders }],
      ['GET', `${BASE_URL}/api/schemes`, null, { headers: authHeaders }],
    ]);

    check(responses[0], {
      'market prices status is 200': (r) => r.status === 200,
    });
    check(responses[1], {
      'schemes status is 200': (r) => r.status === 200,
    });
  });

  sleep(1); // Think time: 1 second

  // Group 4: Crops Data
  group('Crops List', function () {
    const res = http.get(`${BASE_URL}/api/crop/all`, { headers: authHeaders });
    check(res, {
      'crops list status is 200': (r) => r.status === 200,
    });
  });

  sleep(1.5); // Think time: 1.5 seconds
}
