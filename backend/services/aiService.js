const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'cannot breathe',
  'shortness of breath',
  'difficulty breathing',
  'stroke',
  'paralysis',
  'face drooping',
  'unconscious',
  'passed out',
  'severe bleeding',
  'heavy bleeding',
  'poison',
  'overdose',
  'seizure',
  'anaphylaxis',
  'suicidal',
];

const checkEmergency = (message) => {
  const lower = message.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
};

// System prompt enforcing medical ethics and hospital awareness
const buildSystemPrompt = (hospitalContext, userContext) => {
  return `You are "MediBot", the compassionate, highly professional AI assistant for MetroHealth Memorial Hospital.

CRITICAL MEDICAL SAFETY RULES (NON-NEGOTIABLE):
1. You are NOT a medical doctor. You MUST NOT diagnose illnesses, interpret diagnostic imaging/labs as definitive, or prescribe specific medications or dosages.
2. If the user presents symptoms, you may provide broad, objective general health education (e.g. hydration, rest, signs that require attention), but ALWAYS instruct them to consult a qualified physician for clinical evaluation.
3. If the user mentions acute red-flag symptoms (chest pain, severe breathlessness, stroke warning signs, profound bleeding, loss of consciousness), immediately advise them to seek emergency services or visit our 24/7 Emergency Department without delay.

HOSPITAL INFORMATION CONTEXT:
- Name: MetroHealth Memorial Hospital
- Emergency Hotline: +1 (800) 555-0911 (24/7 Available)
- General Reception: +1 (800) 555-0199
- OPD Timings: Monday to Saturday, 08:00 AM - 08:00 PM
- Emergency & Trauma Care: 24/7, 365 Days
- 24/7 In-house Pharmacy: Ground Floor, Block A
- Central Diagnostics & Lab: Ground Floor, Block B (Routine: 7 AM - 9 PM, Emergency: 24/7)
- Visiting Hours: 11:00 AM - 01:00 PM & 05:00 PM - 07:00 PM daily (Max 2 visitors per patient)
- Billing & Insurance: Cashless facility for 40+ insurance partners and TPAs. TPA Helpdesk located at Desk 4, Ground Floor. Accepts Cards, Cash, UPI, and Net Banking.
- Medical Reports: Downloadable via Patient Portal with Medical Record Number (MRN), or collect in person at Lab Dispatch counter within 4-24 hours.

HOSPITAL DEPARTMENTS:
${hospitalContext.departments
  .map(
    (d) => `- ${d.name} (${d.code}): ${d.description}. Location: ${d.location}`
  )
  .join('\n')}

FEATURED DOCTORS:
${hospitalContext.doctors
  .map(
    (doc) =>
      `- Dr. ${doc.name} | ${doc.specialization} (${doc.department?.name || 'General'}) | Exp: ${doc.experienceYears} yrs | Fee: $${doc.consultationFee} | OPD: ${doc.opdTimings} | Days: ${doc.availableDays.join(', ')}`
  )
  .join('\n')}

CURRENT USER STATUS:
${
  userContext.isLoggedIn
    ? `Logged in Patient: ${userContext.user.name} (MRN: ${userContext.user.medicalRecordNumber || 'N/A'}, Phone: ${userContext.user.phone || 'N/A'})\n` +
      `Active Appointments: ${
        userContext.appointments && userContext.appointments.length > 0
          ? userContext.appointments
              .map(
                (a) =>
                  `• With Dr. ${a.doctor?.name} (${a.department?.name}) on ${new Date(a.appointmentDate).toDateString()} at ${a.timeSlot} [Status: ${a.status}, Token: ${a.tokenNumber}]`
              )
              .join('\n')
          : 'None currently scheduled'
      }`
    : 'Patient is browsing as a Guest. If they wish to book or view personal appointments, encourage them to log in using the Login button in the top navigation or in the chat.'
}

RESPONSE STYLE:
- Warm, empathetic, professional, clear, and concise.
- Use formatting like bullet points or bold text where appropriate to make information easy to digest for patients.`;
};

// Fallback intelligent rule engine when external AI keys are not configured
const executeRuleEngine = async (message, hospitalContext, userContext) => {
  const lower = message.toLowerCase().trim();
  const isEmergency = checkEmergency(message);

  if (isEmergency) {
    return {
      text: `🚨 **EMERGENCY WARNING**\n\nThe symptoms you mentioned require immediate medical evaluation. Please do not wait.\n\n• **Call our 24/7 Emergency Line**: **+1 (800) 555-0911** or dial **911** / your local emergency number immediately.\n• **Emergency Room**: Located at MetroHealth Memorial Hospital, Ground Floor, Gate 1 (Open 24/7, 365 days).\n• If you are alone, sit or lie down, unlock your front door, and call for assistance right away.`,
      metadata: {
        isEmergency: true,
        action: 'EMERGENCY_ALERT',
        data: {
          emergencyPhone: '+1 (800) 555-0911',
          location: 'Gate 1, Emergency & Trauma Center',
        },
      },
      suggestedQuestions: [
        'Directions to Emergency Room',
        'Ambulance services',
        'Speak with on-duty staff',
      ],
    };
  }

  // Show appointments
  if (
    lower.includes('show my appointment') ||
    lower.includes('my appointments') ||
    lower.includes('check appointment') ||
    lower.includes('view appointment')
  ) {
    if (!userContext.isLoggedIn) {
      return {
        text: `To view your scheduled appointments, please **Log In** to your patient account. You can click the "Login" button in the navigation bar or use the login option.`,
        metadata: {
          action: 'REQUIRE_LOGIN',
        },
        suggestedQuestions: [
          'How to create an account?',
          'Which cardiologists are available?',
          'What are the hospital timings?',
        ],
      };
    }

    if (!userContext.appointments || userContext.appointments.length === 0) {
      return {
        text: `Hello **${userContext.user.name}**, you do not have any upcoming appointments scheduled at MetroHealth Memorial Hospital.\n\nWould you like help booking an appointment with one of our specialists?`,
        metadata: {
          action: 'SHOW_APPOINTMENTS',
          data: [],
        },
        suggestedQuestions: [
          'How can I book an appointment?',
          'Which cardiologists are available?',
          'What departments are available?',
        ],
      };
    }

    const apptList = userContext.appointments
      .map(
        (a, i) =>
          `**${i + 1}. Dr. ${a.doctor?.name}** (${a.doctor?.specialization})\n` +
          `📅 Date: **${new Date(a.appointmentDate).toDateString()}** at **${a.timeSlot}**\n` +
          `🏢 Dept: ${a.department?.name || 'General'}\n` +
          `🎫 Token: \`${a.tokenNumber}\` | Status: **${a.status.toUpperCase()}**`
      )
      .join('\n\n');

    return {
      text: `Here are your upcoming appointments, **${userContext.user.name}**:\n\n${apptList}\n\nYou can cancel or reschedule any active appointment directly below.`,
      metadata: {
        action: 'SHOW_APPOINTMENTS',
        data: userContext.appointments,
      },
      suggestedQuestions: [
        'How can I cancel my appointment?',
        'How can I book an appointment?',
        'What are the hospital timings?',
      ],
    };
  }

  // Cancel appointment query
  if (
    lower.includes('cancel my appointment') ||
    lower.includes('how can i cancel') ||
    lower.includes('cancel appointment')
  ) {
    if (!userContext.isLoggedIn) {
      return {
        text: `To cancel an appointment, please **Log In** to your patient account first so we can securely locate your booking.`,
        metadata: { action: 'REQUIRE_LOGIN' },
        suggestedQuestions: ['How can I book an appointment?', 'Hospital timings'],
      };
    }
    const scheduled = userContext.appointments?.filter(
      (a) => a.status === 'scheduled'
    );
    if (!scheduled || scheduled.length === 0) {
      return {
        text: `You do not have any active appointments to cancel. If you need to schedule a new one, let me know!`,
        suggestedQuestions: [
          'How can I book an appointment?',
          'What departments are available?',
        ],
      };
    }
    return {
      text: `You have **${scheduled.length}** active appointment(s). You can click "Cancel" on the card below:`,
      metadata: {
        action: 'SHOW_APPOINTMENTS',
        data: scheduled,
      },
      suggestedQuestions: ['Show my appointments', 'Hospital timings'],
    };
  }

  // Doctor search by specialization
  const specMatch = [
    'cardiolog',
    'neurolog',
    'pediatric',
    'orthopedic',
    'oncolog',
    'dermatolog',
    'radiolog',
    'general medicine',
    'physician',
    'doctor',
  ].find((term) => lower.includes(term));

  if (
    lower.includes('cardiologist') ||
    lower.includes('neurologist') ||
    lower.includes('pediatrician') ||
    lower.includes('orthopedic') ||
    lower.includes('dermatologist') ||
    lower.includes('oncologist') ||
    (specMatch && (lower.includes('available') || lower.includes('who') || lower.includes('find') || lower.includes('list')))
  ) {
    let filteredDoctors = hospitalContext.doctors;
    if (specMatch) {
      filteredDoctors = hospitalContext.doctors.filter(
        (doc) =>
          doc.specialization.toLowerCase().includes(specMatch) ||
          doc.department?.name?.toLowerCase().includes(specMatch)
      );
    }

    if (filteredDoctors.length > 0) {
      return {
        text: `Here are our specialist doctors available at MetroHealth Memorial Hospital:\n\nYou can click **Book Appointment** on any doctor to schedule a visit!`,
        metadata: {
          action: 'SHOW_DOCTORS',
          data: filteredDoctors,
        },
        suggestedQuestions: [
          'How can I book an appointment?',
          'What are the hospital timings?',
          'Explain billing procedures',
        ],
      };
    }
  }

  // How can I book an appointment
  if (
    lower.includes('how can i book') ||
    lower.includes('book an appointment') ||
    lower.includes('book appointment') ||
    lower.includes('schedule an appointment')
  ) {
    return {
      text: `### 📅 How to Book an Appointment at MetroHealth:\n\n1. **Select a Specialist**: Browse doctors below by department or specialization.\n2. **Choose Slot**: Select your preferred appointment date and time slot.\n3. **Confirmation**: You will receive a unique token number and instant confirmation.\n\n*Note: Please make sure you are logged in to save appointments to your patient profile.*`,
      metadata: {
        action: 'SHOW_DOCTORS',
        data: hospitalContext.doctors.slice(0, 4),
      },
      suggestedQuestions: [
        'Which cardiologists are available?',
        'What departments are available?',
        'Show my appointments',
      ],
    };
  }

  // Hospital timings
  if (
    lower.includes('timing') ||
    lower.includes('hours') ||
    lower.includes('when are you open') ||
    lower.includes('visiting hours') ||
    lower.includes('opd timing')
  ) {
    return {
      text: `### ⏰ MetroHealth Memorial Hospital Timings:\n\n• **Emergency & Trauma Unit**: **24 Hours / 7 Days a week** (Always open)\n• **Out-Patient Department (OPD)**: Monday to Saturday, **08:00 AM – 08:00 PM**\n• **In-House Pharmacy**: **24/7** (Ground Floor, Block A)\n• **Diagnostic Lab & Imaging**: 24/7 for emergency; **07:00 AM – 09:00 PM** for routine investigations\n• **Inpatient Visiting Hours**: **11:00 AM – 01:00 PM** & **05:00 PM – 07:00 PM** (Max 2 visitors per patient at a time)`,
      metadata: {
        action: 'INFO_TIMINGS',
      },
      suggestedQuestions: [
        'What departments are available?',
        'Which cardiologists are available?',
        'Explain billing procedures',
      ],
    };
  }

  // Departments
  if (
    lower.includes('department') ||
    lower.includes('specialties') ||
    lower.includes('services offered')
  ) {
    const deptList = hospitalContext.departments
      .map((d) => `• **${d.name} (${d.code})**: ${d.description}`)
      .join('\n');

    return {
      text: `### 🏥 Hospital Departments & Centers of Excellence:\n\n${deptList}\n\nWould you like to see doctors belonging to any specific department?`,
      metadata: {
        action: 'SHOW_DEPARTMENTS',
        data: hospitalContext.departments,
      },
      suggestedQuestions: [
        'Which cardiologists are available?',
        'How can I book an appointment?',
        'Hospital timings',
      ],
    };
  }

  // Billing and Insurance
  if (
    lower.includes('billing') ||
    lower.includes('insurance') ||
    lower.includes('cashless') ||
    lower.includes('cost') ||
    lower.includes('payment') ||
    lower.includes('tpa')
  ) {
    return {
      text: `### 💳 Billing & Cashless Insurance Procedures:\n\n• **Cashless Facility**: We are empaneled with major health insurers and Third-Party Administrators (TPAs), including BlueCross, Aetna, Star Health, UnitedHealthcare, and Cigna.\n• **TPA Helpdesk**: Located at **Desk 4, Ground Floor** (Open 24/7).\n• **Pre-Authorization**: For planned admissions, please submit your insurance e-card and doctor's prescription 48 hours prior. For emergencies, authorization is processed within 2 hours.\n• **Accepted Payment Modes**: Credit / Debit Cards, UPI, Net Banking, and Cash.\n• **Itemized Invoices**: Available via the Patient Portal or the Billing Counter upon discharge.`,
      metadata: { action: 'INFO_BILLING' },
      suggestedQuestions: [
        'How to access medical reports?',
        'What are the hospital timings?',
        'How can I book an appointment?',
      ],
    };
  }

  // Medical reports
  if (
    lower.includes('report') ||
    lower.includes('lab result') ||
    lower.includes('test result') ||
    lower.includes('download report')
  ) {
    return {
      text: `### 📋 How to Access Your Medical Reports:\n\n1. **Online Patient Portal**: Log into your account and navigate to the "Reports" section using your Medical Record Number (MRN).\n2. **SMS / Email Link**: A secure download link is sent to your registered mobile number once tests are verified by pathologists.\n3. **Physical Collection**: Visit the **Central Diagnostics Dispatch Counter** (Level 1, Block B).\n   - Routine blood tests: Ready within **4 to 6 hours**\n   - Specialized / Biopsy / Culture tests: **24 to 48 hours**`,
      metadata: { action: 'INFO_REPORTS' },
      suggestedQuestions: [
        'Show my appointments',
        'What are the hospital timings?',
        'Explain billing procedures',
      ],
    };
  }

  // General health guidance query (medical safety applied!)
  if (
    lower.includes('headache') ||
    lower.includes('fever') ||
    lower.includes('cough') ||
    lower.includes('cold') ||
    lower.includes('diet') ||
    lower.includes('health tips')
  ) {
    return {
      text: `### 🩺 General Health Information\n\n*Important Notice: MediBot provides general educational information and cannot offer clinical diagnoses or prescribe medication.*\n\n• **Hydration & Rest**: Drink ample water (2-3 liters daily) and aim for 7-8 hours of sound sleep.\n• **Monitor Symptoms**: If symptoms like fever exceed 101°F (38.3°C), persist for more than 48 hours, or worsen, clinical evaluation is necessary.\n• **Consult a Physician**: We strongly recommend scheduling a consultation with our General Medicine team for an accurate evaluation and personalized care plan.\n\nWould you like to book a consultation with our General Physician?`,
      metadata: { action: 'HEALTH_INFO' },
      suggestedQuestions: [
        'Book General Physician appointment',
        'Hospital timings',
        'Emergency services',
      ],
    };
  }

  // Default helpful response
  return {
    text: `Hello! I am **MediBot**, your AI assistant for MetroHealth Memorial Hospital.\n\nI can help you with:\n• Finding doctors by specialization and checking schedules\n• Booking, rescheduling, or cancelling appointments\n• Checking hospital timings and department services\n• Billing, cashless insurance, and medical reports\n• Emergency helpline guidance\n\nHow may I assist you today?`,
    suggestedQuestions: [
      'How can I book an appointment?',
      'Which cardiologists are available?',
      'What are the hospital timings?',
      'What departments are available?',
      'Show my appointments',
      'How can I cancel my appointment?',
    ],
  };
};

// Main Chat Generator Function
const generateChatResponse = async (userMessage, hospitalContext, userContext) => {
  const isEmergency = checkEmergency(userMessage);

  // If emergency, prioritize instant emergency alert
  if (isEmergency) {
    return executeRuleEngine(userMessage, hospitalContext, userContext);
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();

  // Try Google Gemini API if configured
  if (geminiKey && (provider === 'gemini' || !openaiKey)) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemPrompt = buildSystemPrompt(hospitalContext, userContext);
      const fullPrompt = `${systemPrompt}\n\nPatient Query: "${userMessage}"\n\nPlease reply helpfully adhering strictly to the medical safety guardrails.`;

      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();

      return {
        text: responseText,
        metadata: {
          provider: 'gemini',
        },
        suggestedQuestions: [
          'Which cardiologists are available?',
          'What are the hospital timings?',
          'How can I book an appointment?',
        ],
      };
    } catch (err) {
      console.warn('[AI Service] Gemini API call failed, falling back to Knowledge Engine:', err.message);
    }
  }

  // Try OpenAI API if configured
  if (openaiKey && (provider === 'openai' || !geminiKey)) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const systemPrompt = buildSystemPrompt(hospitalContext, userContext);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.4,
      });

      const responseText = completion.choices[0].message.content;

      return {
        text: responseText,
        metadata: {
          provider: 'openai',
        },
        suggestedQuestions: [
          'Which cardiologists are available?',
          'What are the hospital timings?',
          'How can I book an appointment?',
        ],
      };
    } catch (err) {
      console.warn('[AI Service] OpenAI API call failed, falling back to Knowledge Engine:', err.message);
    }
  }

  // Fallback to intelligent deterministic rule/knowledge engine
  return executeRuleEngine(userMessage, hospitalContext, userContext);
};

module.exports = {
  generateChatResponse,
  checkEmergency,
};
