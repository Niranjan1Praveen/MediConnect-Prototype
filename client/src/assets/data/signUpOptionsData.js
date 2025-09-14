const signUpOptionsData = [
  {
    id: "01",
    color: "teal",
    title: "NGO / Clinic",
    img: "/assets/images/signupOptions/ngo.jpeg",
    catchPhrase: "frontliners",
    description:
      "Enable voice-based diagnostics at your clinic — AI-powered triage, optional doctor escalation, and digital care delivery in one tool.",
    cta: "Partner as a NGO Clinic",
    className: "md:col-span-2 lg:col-span-1",
    to: "/register/ngo",
    features: [
      "Voice-first, zero-typing diagnosis",
      "AI-based triage for TB, wounds, skin, tongue",
      "Optional escalation to remote doctors",
      "CSR-backed infra and support",
      "Faster, trusted care in your community",
    ],
  },
  {
    id: "02",
    color: "blue",
    title: "Corporate (CSR)",
    img: "/assets/images/signupOptions/corporate.jpeg",
    catchPhrase: "enablers",
    description:
      "Support rural diagnostics through AI and voice — track live clinic activity, prescriptions, and impact under CSR Section 135.",
    cta: "Join as a CSR Partner",
    className:
      "md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto",
    to: "/register/corporate",
    features: [
      "CSR-aligned dashboards with live insights",
      "Fund voice-first diagnostic clinics",
      "Transparent AI usage & patient data logs",
      "Branded impact stories & visibility",
      "Scalable, compliant rural health delivery",
    ],
  },
];

export default signUpOptionsData;
