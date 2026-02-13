// Study Abroad Chatbot API - FIXED CORS VERSION
const Anthropic = require('@anthropic-ai/sdk');

// Your complete knowledge base
const KNOWLEDGE_BASE = {
  "entries": [
    {
      "id": "united_arab_emirates_student_residence_visa_(sponsored_by_institution)",
      "country": "United Arab Emirates",
      "region": "UAE",
      "visa_type": "Student residence visa (sponsored by institution)",
      "summary": "Institution acts as sponsor; acceptance letter, medical test, Emirates ID, health insurance required.",
      "documents": [
        "Passport (≥6 months)",
        "Acceptance letter",
        "Medical fitness certificate",
        "Proof of funds",
        "Passport photos",
        "Sponsor documents"
      ],
      "language_tests": "Varies by university (IELTS/TOEFL commonly accepted)",
      "financial": "Bank statements (3-6 months) or sponsor letter; fees and insurance",
      "application_steps": "1) Get admission 2) University/sponsor initiates visa 3) Medical tests 4) Emirates ID issuance",
      "processing_time": "2–6 weeks",
      "fees": "Visa app 3,000–3,500 AED; Renewal 2,000–2,500 AED; Medical 300–500 AED; Emirates ID 370–400 AED",
      "work_rights": "Conditional; requires permission and sponsor/university approval",
      "scholarships": "University-specific scholarships; Abu Dhabi Golden Visa for high achievers"
    },
    {
      "id": "united_states_of_america_f-1_(academic)_/_m-1_(vocational)",
      "country": "United States of America",
      "region": "North America",
      "visa_type": "F-1 (Academic) / M-1 (Vocational)",
      "summary": "F-1 requires I-20 from SEVP-certified school, SEVIS fee, DS-160, consulate interview and proof of funds.",
      "documents": [
        "Passport",
        "Form I-20",
        "DS-160 confirmation",
        "SEVIS I-901 fee receipt",
        "Financial evidence",
        "Passport photo"
      ],
      "language_tests": "Depends on institution (TOEFL/IELTS commonly used for admissions)",
      "financial": "Proof of funds covering tuition + living for first year; amounts vary by school",
      "application_steps": "1) Apply & get I-20 2) Pay SEVIS fee 3) Complete DS-160 4) Schedule consulate interview",
      "processing_time": "Varies by consulate; weeks to months",
      "fees": "Visa application fee ~USD 185; SEVIS I-901 fee USD 350 (approx)",
      "work_rights": "On-campus (typically 20 hrs/week); OPT/CPT options post-graduation",
      "scholarships": "EducationUSA; university scholarships"
    },
    {
      "id": "canada_study_permit",
      "country": "Canada",
      "region": "North America",
      "visa_type": "Study Permit",
      "summary": "Study permit for Designated Learning Institutions; recent PAL/TAL attestation requirement (2024); proof of funds required.",
      "documents": [
        "Letter of Acceptance from DLI",
        "Provincial Attestation Letter (PAL/TAL) where required",
        "Passport",
        "Photos",
        "Proof of funds",
        "Biometrics",
        "Medical/police if applicable"
      ],
      "language_tests": "Varies by institution (IELTS/TOEFL commonly accepted)",
      "financial": "Proof of tuition + living (approx CAD 20,635 for single student)",
      "application_steps": "Apply online via IRCC; provide LOA & proof of funds; biometrics; wait for decision",
      "processing_time": "8–20 weeks (varies by origin)",
      "fees": "Biometrics fee CAD 85; other application fees vary",
      "work_rights": "Post-Graduation Work Permit available (PGWP) with eligibility restrictions",
      "scholarships": "EduCanada links and university scholarships"
    },
    {
      "id": "germany_national_student_visa",
      "country": "Germany",
      "region": "Europe",
      "visa_type": "National Student Visa / Student Applicant Visa",
      "summary": "Non-EU students need national visa; commonly required blocked account (Sperrkonto) showing €11,904/year (as of 2025).",
      "documents": [
        "Passport",
        "Acceptance/LOA",
        "Blocked account or formal commitment",
        "Health insurance",
        "Proof of accommodation"
      ],
      "language_tests": "TestDaF, DSH or Goethe-Zertifikat for German-taught; IELTS often for English-taught programs",
      "financial": "Blocked account €11,904 per year (as of 2025)",
      "application_steps": "Apply to university; obtain admission/LOA; open blocked account or submit commitment; apply at consulate",
      "processing_time": "4–12 weeks (varies by consulate)",
      "fees": "Visa fee ~€75 (local currency payable)",
      "work_rights": "140 full days or 280 half days per year (~20 hours/week)",
      "scholarships": "DAAD scholarships and institution-level funding"
    },
    {
      "id": "france_vls-ts",
      "country": "France",
      "region": "Europe",
      "visa_type": "VLS-TS (Long-stay student visa serving as residence permit)",
      "summary": "VLS-TS serves as visa+residence permit; validate online after arrival; financial proof ~€615/month for first year.",
      "documents": [
        "Passport",
        "VLS-TS application",
        "Campus France approval",
        "Proof of accommodation",
        "Financial resources proof",
        "Health insurance"
      ],
      "language_tests": "TCF/TEF for French programs; varies for English-taught programs",
      "financial": "Approximately €615/month (€7,380/year minimum)",
      "application_steps": "Complete Campus France process; apply for VLS-TS at consulate; validate visa after arrival",
      "processing_time": "Varies by consulate (typically weeks)",
      "fees": "Visa fee ~€99; Campus France fees vary",
      "work_rights": "964 hours per year (approx 20 hrs/week)",
      "scholarships": "Campus France scholarships; university funding"
    },
    {
      "id": "united_kingdom_student_route",
      "country": "United Kingdom",
      "region": "Europe",
      "visa_type": "Student Route visa (formerly Tier 4)",
      "summary": "Requires Confirmation of Acceptance for Studies (CAS) from licensed sponsor; updated financial requirements and English proficiency.",
      "documents": [
        "CAS from institution",
        "Passport",
        "Financial evidence",
        "English language proof",
        "TB test (if required)",
        "ATAS certificate (for certain courses)"
      ],
      "language_tests": "IELTS UKVI, PTE Academic UKVI, or equivalent SELT",
      "financial": "Living costs: £1,334/month (London) or £1,023/month (outside London) for up to 9 months",
      "application_steps": "Get CAS; apply online; pay visa fee and Immigration Health Surcharge; attend appointment; wait for decision",
      "processing_time": "3 weeks (standard); faster options available",
      "fees": "Visa fee £490; Immigration Health Surcharge £470/year",
      "work_rights": "20 hrs/week during term; full-time during breaks (conditions apply)",
      "scholarships": "GREAT Scholarships; Chevening; university scholarships"
    },
    {
      "id": "australia_student_visa_subclass_500",
      "country": "Australia",
      "region": "Australia",
      "visa_type": "Student visa (subclass 500)",
      "summary": "Genuine Student (GS) test required; higher financial benchmarks and application fee (AUD 2,000 as of July 2025).",
      "documents": [
        "Confirmation of Enrolment (CoE)",
        "OSHC health cover",
        "Passport",
        "Proof of funds",
        "Genuine student evidence"
      ],
      "language_tests": "IELTS/PTE/TOEFL commonly accepted (typical scores: UG 6.0, PG 6.5)",
      "financial": "Evidence of funds including AUD 29,710 living expenses",
      "application_steps": "Apply online via Immi account; provide CoE & documents; pay visa fee; provide health cover evidence",
      "processing_time": "Varies (weeks)",
      "fees": "Visa fee AUD 2,000 (from July 1, 2025)",
      "work_rights": "48 hours per fortnight while in session",
      "scholarships": "Australia government and university scholarships"
    },
    {
      "id": "new_zealand_pathway_student_visa",
      "country": "New Zealand",
      "region": "New Zealand",
      "visa_type": "Pathway Student Visa",
      "summary": "Pathway Student Visa allows up to three consecutive programs on a single visa; living fund requirement NZD 20,000/year.",
      "documents": [
        "Offer of place",
        "Proof of funds",
        "Passport",
        "Health/character documents as required"
      ],
      "language_tests": "Varies by institution; English proficiency typically required",
      "financial": "Living fund NZD 20,000 per year",
      "application_steps": "Apply online via Immigration NZ; provide evidence & documents; await decision",
      "processing_time": "Varies (weeks)",
      "fees": "Fee varies",
      "work_rights": "Typically 20 hours/week during term",
      "scholarships": "Immigration NZ & tertiary institution scholarships"
    },
    {
      "id": "singapore_students_pass",
      "country": "Singapore",
      "region": "Asia",
      "visa_type": "Student's Pass (SOLAR system)",
      "summary": "SOLAR system: university registers student, student completes eForm; processing often 1–2 weeks.",
      "documents": [
        "Passport",
        "University registration",
        "eForm 16",
        "Medical exam (HIV/X-ray) where required"
      ],
      "language_tests": "Varies by institution",
      "financial": "Processing & issuance fees (S$45–S$60)",
      "application_steps": "University registers in SOLAR; student completes eForm; await approval and issuance",
      "processing_time": "1–2 weeks (typical)",
      "fees": "Processing fee S$45; Issuance fee S$60",
      "work_rights": "Limited; subject to MOM rules and institution",
      "scholarships": "University scholarships and Singapore government schemes"
    },
    {
      "id": "japan_student_visa",
      "country": "Japan",
      "region": "Asia",
      "visa_type": "Student Visa (requires Certificate of Eligibility)",
      "summary": "Certificate of Eligibility (CoE) required; schools act as proxy to apply for CoE; financial proof ~JPY 3,000,000 for first year.",
      "documents": [
        "Passport",
        "CoE",
        "Acceptance letter",
        "Proof of funds (~JPY 3,000,000)",
        "Health/character documents"
      ],
      "language_tests": "Varies by program (Japanese proficiency for Japanese-taught; English tests for English-taught)",
      "financial": "Approx JPY 3,000,000 (~USD 20,000) for first year",
      "application_steps": "School submits CoE application to Regional Immigration Bureau; on CoE issuance student applies for visa at embassy",
      "processing_time": "Varies",
      "fees": "Fee varies",
      "work_rights": "Limited; permission required for part-time work",
      "scholarships": "MEXT scholarships and university funding"
    },
    {
      "id": "ireland_stamp_2",
      "country": "Ireland",
      "region": "Europe",
      "visa_type": "Stamp 2 (Student Permission)",
      "summary": "Non-EEA students need entry visa if required; then register for Stamp 2 permission. Proof of €10,000 + fees required.",
      "documents": [
        "Letter of acceptance",
        "Proof of fees paid",
        "Evidence of €10,000",
        "Private medical insurance",
        "Passport"
      ],
      "language_tests": "Varies by institution (IELTS commonly accepted)",
      "financial": "€10,000 for living expenses (in addition to fees)",
      "application_steps": "Apply for entry visa if required; travel to Ireland; register with immigration for Stamp 2",
      "processing_time": "Varies",
      "fees": "€300 registration fee for Stamp 2",
      "work_rights": "20 hours/week during term; 40 hours/week during holidays",
      "scholarships": "Government of Ireland scholarships; university funding"
    }
  ]
};

// Main handler function
module.exports = async (req, res) => {
  // CRITICAL: Set CORS headers FIRST, before anything else
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests for actual chat
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required', success: false });
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set!');
      return res.status(500).json({ 
        error: 'Server configuration error: API key not set',
        success: false 
      });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create system prompt with knowledge base
    const systemPrompt = `You are a friendly and knowledgeable study abroad advisor. You help students find information about studying in different countries.

You have access to detailed, up-to-date visa and study information for these 11 countries:
${KNOWLEDGE_BASE.entries.map(e => `- ${e.country} (${e.visa_type})`).join('\n')}

Here is your complete knowledge base:
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

When answering questions:
1. Be warm, encouraging, and supportive - students are often nervous about studying abroad
2. Use the exact information from the knowledge base above
3. Format responses clearly with bullet points for lists
4. If asked about a country NOT in the database, politely say you only have information for the 11 countries listed
5. Always include relevant details like visa fees, processing times, required documents, work rights, and financial requirements
6. Use emojis sparingly to make responses friendly: 🎓 📚 ✈️ 💰 ⏰ 📋
7. If the question is vague, ask clarifying questions
8. Keep responses concise but complete - aim for 150-300 words unless more detail is requested

Remember: Your goal is to help students make informed decisions about studying abroad!`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    // Extract response
    const botResponse = response.content[0].text;

    // Send successful response
    return res.status(200).json({ 
      response: botResponse,
      success: true 
    });

  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    return res.status(500).json({ 
      error: 'Failed to get response from chatbot',
      details: error.message,
      success: false
    });
  }
};