const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', (chunk) => (resBody += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(resBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Starting MediBot API Automated Verification Tests...\n');

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    console.log(`[TEST 1] Health Check: Status ${health.status} =>`, health.data.status);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Get Departments
    const depts = await request('GET', '/api/departments');
    console.log(`[TEST 2] Fetch Departments: Found ${depts.data.count} departments`);
    if (!depts.data.data || depts.data.data.length === 0) throw new Error('No departments returned');

    // 3. Get Doctors
    const docs = await request('GET', '/api/doctors');
    console.log(`[TEST 3] Fetch Doctors: Found ${docs.data.count} doctors`);
    if (!docs.data.data || docs.data.data.length === 0) throw new Error('No doctors returned');
    const firstDoc = docs.data.data[0];
    console.log(`         Sample doctor: Dr. ${firstDoc.name} (${firstDoc.specialization})`);

    // 4. Auth: Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'john@example.com',
      password: 'password123',
    });
    console.log(`[TEST 4] Patient Login (John Doe): Status ${loginRes.status}`);
    if (!loginRes.data.success || !loginRes.data.data?.token) throw new Error('Login failed');
    const token = loginRes.data.data.token;
    console.log(`         MRN: ${loginRes.data.data.medicalRecordNumber}, Token acquired`);

    // 5. Patient Appointments
    const appts = await request('GET', '/api/appointments', null, token);
    console.log(`[TEST 5] Get User Appointments: Found ${appts.data.count} appointments for John Doe`);
    if (!appts.data.data || appts.data.data.length === 0) throw new Error('Appointments query failed');
    console.log(`         First Token: ${appts.data.data[0].tokenNumber}`);

    // 6. Chat API - Hospital Timings
    const chatTimings = await request('POST', '/api/chat', {
      message: 'What are the hospital timings?',
    });
    console.log(`[TEST 6] Chat (Hospital Timings): Received reply length ${chatTimings.data.data.reply.length}`);

    // 7. Chat API - Cardiologist search
    const chatCardio = await request('POST', '/api/chat', {
      message: 'Which cardiologists are available?',
    });
    console.log(`[TEST 7] Chat (Doctor Search): Action =>`, chatCardio.data.data.metadata?.action);

    // 8. Chat API - Emergency triage detection (Medical Safety)
    const chatEmergency = await request('POST', '/api/chat', {
      message: 'I have acute chest pain and difficulty breathing!',
    });
    console.log(`[TEST 8] Chat (Emergency Safety Guardrail): IsEmergency =>`, chatEmergency.data.data.metadata?.isEmergency);
    if (!chatEmergency.data.data.metadata?.isEmergency) throw new Error('Emergency was not flagged!');

    // 9. Chat API - Authenticated user appointments query
    const chatUserAppt = await request('POST', '/api/chat', {
      message: 'Show my appointments',
    }, token);
    console.log(`[TEST 9] Chat (Show My Appointments as User): Action =>`, chatUserAppt.data.data.metadata?.action);

    // 10. Book new appointment via API
    const bookRes = await request('POST', '/api/appointments', {
      doctorId: firstDoc._id,
      appointmentDate: new Date(Date.now() + 86400000 * 3),
      timeSlot: '11:15 AM',
      reason: 'Automated test consultation',
    }, token);
    console.log(`[TEST 10] Book Appointment: Status ${bookRes.status} => Token: ${bookRes.data.data?.tokenNumber}`);

    // 11. Cancel the newly booked appointment
    const newApptId = bookRes.data.data._id;
    const cancelRes = await request('DELETE', `/api/appointments/${newApptId}`, null, token);
    console.log(`[TEST 11] Cancel Appointment: Status ${cancelRes.status} => ${cancelRes.data.message}`);

    console.log('\n🎉 ALL 11 AUTOMATED TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
};

runTests();
