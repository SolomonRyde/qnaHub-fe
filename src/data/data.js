// /data/exams.js - Centralized Exam Data Source
export const EXAMS = [
  // ==================== IT & SOFTWARE ====================

  // Programming (Java, Python, C++)
  {
    id: "1",
    title: "Python for Data Science",
    category: {
      industry: "it-software",
      subcategory: "Programming (Java, Python, C++)",
    },
    difficulty: "Intermediate",
    duration: 45,
    totalQuestions: 30,
    price: 0,
    passingScore: 75,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Free", "Certification", "Popular"],
    description:
      "Master Python fundamentals for data analysis, visualization, and machine learning workflows.",
    topics: [
      "NumPy & Pandas",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Basics",
      "Data Cleaning",
      "Jupyter Notebooks",
    ],
    instructions: [
      {
        title: "Time Limit",
        description: "Complete all 30 questions within 45 minutes.",
      },
      {
        title: "Secure Environment",
        description: "Tab switching will auto-submit your exam.",
      },
      {
        title: "Attempts",
        description: "You have 3 attempts to pass this exam.",
      },
      {
        title: "Instant Results",
        description: "Get your score and feedback immediately.",
      },
    ],
    about:
      "This exam validates your ability to use Python for data science tasks. Ideal for aspiring data analysts, scientists, or developers transitioning into data-focused roles. Passing earns a verifiable certificate for your professional portfolio.",
  },
  {
    id: "2",
    title: "Java Fundamentals Certification",
    category: {
      industry: "it-software",
      subcategory: "Programming (Java, Python, C++)",
    },
    difficulty: "Beginner",
    duration: 60,
    totalQuestions: 40,
    price: 29,
    passingScore: 70,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "Beginner-Friendly"],
    description:
      "Test your core Java knowledge including OOP concepts, collections, exception handling, and basic I/O operations.",
    topics: [
      "OOP Principles",
      "Collections Framework",
      "Exception Handling",
      "Multithreading Basics",
      "Java 8+ Features",
    ],
    instructions: [
      {
        title: "Proctoring",
        description: "Webcam required for identity verification.",
      },
      {
        title: "Code Questions",
        description: "5 questions require writing short code snippets.",
      },
      {
        title: "No External Resources",
        description: "Closed book - no internet or documentation allowed.",
      },
    ],
    about:
      "Designed for junior developers and computer science students. Validates foundational Java skills required for enterprise development roles.",
  },

  // Data Structures & Algorithms
  {
    id: "3",
    title: "DSA Problem Solving Mastery",
    category: {
      industry: "it-software",
      subcategory: "Data Structures & Algorithms",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 25,
    price: 49,
    passingScore: 80,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Popular", "Interview Prep", "Certification"],
    description:
      "Advanced algorithmic problem-solving covering graphs, dynamic programming, trees, and optimization techniques.",
    topics: [
      "Graph Algorithms",
      "Dynamic Programming",
      "Tree Traversals",
      "Greedy Algorithms",
      "Time/Space Complexity",
    ],
    instructions: [
      {
        title: "Coding Environment",
        description: "Built-in IDE with syntax highlighting and test cases.",
      },
      {
        title: "Partial Credit",
        description: "Solutions are evaluated on correctness and efficiency.",
      },
      {
        title: "Hints Available",
        description: "Use up to 3 hints per question (penalty applies).",
      },
    ],
    about:
      "Perfect for FAANG interview preparation. Tests ability to design efficient algorithms under time pressure. Certificate recognized by top tech employers.",
  },

  // Web Development
  {
    id: "4",
    title: "Full-Stack Web Development Assessment",
    category: {
      industry: "it-software",
      subcategory: "Web Development",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 35,
    price: 39,
    passingScore: 72,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Popular", "Project-Based", "Certification"],
    description:
      "Comprehensive evaluation of modern web development skills including React, Node.js, REST APIs, and database integration.",
    topics: [
      "React Hooks",
      "Express.js Routing",
      "MongoDB Queries",
      "Authentication & JWT",
      "Responsive Design",
    ],
    instructions: [
      {
        title: "Practical Tasks",
        description:
          "3 questions require building small functional components.",
      },
      {
        title: "API Testing",
        description: "Use provided Postman collection for backend validation.",
      },
      {
        title: "Code Review",
        description: "Solutions evaluated for best practices and readability.",
      },
    ],
    about:
      "Validates end-to-end web development competency. Ideal for mid-level developers seeking career advancement or freelance opportunities.",
  },

  // Cloud Computing
  {
    id: "5",
    title: "AWS Cloud Practitioner Essentials",
    category: {
      industry: "it-software",
      subcategory: "Cloud Computing",
    },
    difficulty: "Beginner",
    duration: 50,
    totalQuestions: 45,
    price: 0,
    passingScore: 70,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Free", "AWS", "Entry-Level"],
    description:
      "Foundational knowledge of AWS services, cloud concepts, security, pricing, and support models.",
    topics: [
      "EC2 & S3 Basics",
      "IAM & Security",
      "Billing & Cost Management",
      "Cloud Architecture Principles",
      "Well-Architected Framework",
    ],
    instructions: [
      {
        title: "Scenario Questions",
        description:
          "Questions based on real-world cloud deployment scenarios.",
      },
      {
        title: "No Console Access",
        description: "Theoretical exam - no live AWS console interaction.",
      },
      {
        title: "Reference Sheet",
        description: "Downloadable AWS service cheat sheet provided post-exam.",
      },
    ],
    about:
      "Perfect starting point for cloud careers. Aligns with AWS Certified Cloud Practitioner exam objectives. Free certification badge upon passing.",
  },

  // Cybersecurity
  {
    id: "6",
    title: "Ethical Hacking & Penetration Testing",
    category: {
      industry: "it-software",
      subcategory: "Cybersecurity",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 30,
    price: 79,
    passingScore: 85,
    attemptsAllowed: 1,
    attemptsRemaining: 1,
    tags: ["Certification", "Hands-On", "Industry-Recognized"],
    description:
      "Practical assessment of penetration testing methodologies, vulnerability assessment, and security tool proficiency.",
    topics: [
      "Network Scanning",
      "Web App Security",
      "Exploitation Techniques",
      "Post-Exploitation",
      "Reporting & Documentation",
    ],
    instructions: [
      {
        title: "Lab Environment",
        description: "Access to isolated vulnerable VMs for practical tasks.",
      },
      {
        title: "Legal Compliance",
        description:
          "All testing must stay within provided scope - unauthorized access prohibited.",
      },
      {
        title: "Time Management",
        description:
          "Allocate time wisely between reconnaissance, exploitation, and reporting phases.",
      },
    ],
    about:
      "Designed for aspiring penetration testers and security analysts. Certificate demonstrates practical offensive security skills valued by employers and clients.",
  },

  // AI & Machine Learning
  {
    id: "7",
    title: "Machine Learning Engineer Certification",
    category: {
      industry: "it-software",
      subcategory: "AI & Machine Learning",
    },
    difficulty: "Advanced",
    duration: 100,
    totalQuestions: 35,
    price: 59,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Popular", "Certification", "TensorFlow"],
    description:
      "Evaluate skills in model development, training pipelines, evaluation metrics, and deployment strategies for ML systems.",
    topics: [
      "Supervised Learning",
      "Neural Networks",
      "Model Evaluation",
      "Feature Engineering",
      "MLOps Basics",
    ],
    instructions: [
      {
        title: "Code Submission",
        description: "Submit Jupyter notebooks for modeling questions.",
      },
      {
        title: "Dataset Provided",
        description: "All required datasets included in exam environment.",
      },
      {
        title: "Reproducibility",
        description:
          "Solutions must include random seeds and dependency specifications.",
      },
    ],
    about:
      "Validates end-to-end ML engineering capabilities. Ideal for data scientists transitioning to production ML roles. Certificate includes portfolio project showcase.",
  },

  // Database Management
  {
    id: "8",
    title: "SQL & Database Design Fundamentals",
    category: {
      industry: "it-software",
      subcategory: "Database Management",
    },
    difficulty: "Intermediate",
    duration: 55,
    totalQuestions: 40,
    price: 24,
    passingScore: 75,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Free Trial", "Popular", "Beginner-Friendly"],
    description:
      "Test proficiency in SQL querying, database normalization, indexing strategies, and transaction management.",
    topics: [
      "Complex Joins",
      "Subqueries & CTEs",
      "Index Optimization",
      "ACID Properties",
      "Schema Design",
    ],
    instructions: [
      {
        title: "Live SQL Editor",
        description: "Write and test queries against sample databases.",
      },
      {
        title: "Explain Plans",
        description: "Some questions require analyzing query execution plans.",
      },
      {
        title: "Multiple Dialects",
        description:
          "Questions compatible with PostgreSQL, MySQL, and SQL Server syntax.",
      },
    ],
    about:
      "Essential certification for backend developers, data analysts, and DBAs. Demonstrates practical database skills applicable across industries.",
  },

  // DevOps & Tools
  {
    id: "9",
    title: "DevOps Pipeline Automation Specialist",
    category: {
      industry: "it-software",
      subcategory: "DevOps & Tools",
    },
    difficulty: "Advanced",
    duration: 85,
    totalQuestions: 30,
    price: 54,
    passingScore: 80,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "CI/CD", "Kubernetes"],
    description:
      "Assess expertise in CI/CD pipeline design, infrastructure as code, container orchestration, and monitoring strategies.",
    topics: [
      "GitHub Actions",
      "Terraform Basics",
      "Docker & Kubernetes",
      "Prometheus Monitoring",
      "Security Scanning",
    ],
    instructions: [
      {
        title: "YAML Configuration",
        description: "Write pipeline and deployment configuration files.",
      },
      {
        title: "Troubleshooting Scenarios",
        description: "Diagnose and fix broken pipeline configurations.",
      },
      {
        title: "Best Practices",
        description:
          "Solutions evaluated for security, scalability, and maintainability.",
      },
    ],
    about:
      "For DevOps engineers and SREs seeking validation of automation expertise. Certificate demonstrates ability to build reliable, scalable delivery pipelines.",
  },

  // ==================== BANKING, FINANCE & COMMERCE ====================

  // Banking Exams
  {
    id: "10",
    title: "Banking Fundamentals & Regulatory Compliance",
    category: {
      industry: "banking-finance",
      subcategory: "Banking Exams",
    },
    difficulty: "Intermediate",
    duration: 60,
    totalQuestions: 50,
    price: 34,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "Regulatory", "Popular"],
    description:
      "Comprehensive assessment of banking operations, financial regulations, risk management, and customer service protocols.",
    topics: [
      "KYC/AML Procedures",
      "Loan Processing",
      "Payment Systems",
      "Basel Norms",
      "Digital Banking",
    ],
    instructions: [
      {
        title: "Case Studies",
        description:
          "5 scenario-based questions testing practical application.",
      },
      {
        title: "Regulation Updates",
        description: "Questions based on current RBI/FDIC guidelines.",
      },
      {
        title: "Calculations",
        description: "Basic financial math required - calculator permitted.",
      },
    ],
    about:
      "Ideal for banking professionals, finance graduates, and aspirants preparing for public sector bank exams. Certificate enhances resume for banking roles.",
  },

  // Accounting
  {
    id: "11",
    title: "Financial Accounting & Reporting Standards",
    category: {
      industry: "banking-finance",
      subcategory: "Accounting",
    },
    difficulty: "Intermediate",
    duration: 70,
    totalQuestions: 45,
    price: 44,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "GAAP", "IFRS"],
    description:
      "Test knowledge of accounting principles, financial statement preparation, and compliance with GAAP/IFRS standards.",
    topics: [
      "Double-Entry System",
      "Financial Statements",
      "Revenue Recognition",
      "Asset Depreciation",
      "Audit Fundamentals",
    ],
    instructions: [
      {
        title: "Journal Entries",
        description: "Record transactions using proper accounting format.",
      },
      {
        title: "Statement Analysis",
        description: "Interpret balance sheets and income statements.",
      },
      {
        title: "Standards Reference",
        description:
          "Quick reference guide to key accounting standards provided.",
      },
    ],
    about:
      "Validates core accounting competencies for staff accountants, auditors, and finance professionals. Recognized by accounting firms and corporate finance departments.",
  },

  // Investment & Stock Market
  {
    id: "12",
    title: "Securities Analysis & Portfolio Management",
    category: {
      industry: "banking-finance",
      subcategory: "Investment & Stock Market",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 40,
    price: 69,
    passingScore: 82,
    attemptsAllowed: 1,
    attemptsRemaining: 1,
    tags: ["Certification", "CFA Prep", "Popular"],
    description:
      "Advanced evaluation of equity valuation, fixed income analysis, portfolio theory, and risk-adjusted return metrics.",
    topics: [
      "DCF Valuation",
      "Bond Pricing",
      "Modern Portfolio Theory",
      "Derivatives Basics",
      "Performance Attribution",
    ],
    instructions: [
      {
        title: "Financial Calculator",
        description: "Approved calculator required - list provided pre-exam.",
      },
      {
        title: "Case Analysis",
        description:
          "Analyze real company financials for investment recommendations.",
      },
      {
        title: "Ethics Section",
        description: "Mandatory questions on CFA Institute Code of Ethics.",
      },
    ],
    about:
      "Prepares candidates for CFA Level I and investment analyst roles. Certificate demonstrates analytical rigor valued by asset management firms and hedge funds.",
  },

  // Insurance Exams
  {
    id: "13",
    title: "Insurance Principles & Risk Assessment",
    category: {
      industry: "banking-finance",
      subcategory: "Insurance Exams",
    },
    difficulty: "Beginner",
    duration: 50,
    totalQuestions: 45,
    price: 29,
    passingScore: 70,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Entry-Level", "Certification", "Free Trial"],
    description:
      "Foundational knowledge of insurance products, underwriting principles, claims processing, and regulatory frameworks.",
    topics: [
      "Life vs General Insurance",
      "Policy Terms",
      "Risk Classification",
      "Claims Adjudication",
      "IRDAI Regulations",
    ],
    instructions: [
      {
        title: "Product Knowledge",
        description:
          "Questions on various insurance product features and benefits.",
      },
      {
        title: "Scenario Evaluation",
        description: "Assess risk and recommend appropriate coverage.",
      },
      {
        title: "Calculations",
        description: "Premium and payout calculations with provided formulas.",
      },
    ],
    about:
      "Perfect for insurance agents, brokers, and customer service representatives. Certificate meets pre-licensing education requirements in many jurisdictions.",
  },

  // Financial Certifications
  {
    id: "14",
    title: "Financial Planning & Wealth Management",
    category: {
      industry: "banking-finance",
      subcategory: "Financial Certifications",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 50,
    price: 54,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "CFP Prep", "Popular"],
    description:
      "Comprehensive assessment of retirement planning, tax strategies, estate planning, and client advisory best practices.",
    topics: [
      "Retirement Accounts",
      "Tax-Efficient Investing",
      "Estate Planning Tools",
      "Risk Tolerance Assessment",
      "Ethical Advisory",
    ],
    instructions: [
      {
        title: "Client Scenarios",
        description: "Develop financial plans for diverse client profiles.",
      },
      {
        title: "Regulatory Compliance",
        description:
          "Questions on fiduciary standards and disclosure requirements.",
      },
      {
        title: "Calculation Tools",
        description: "Financial calculators and spreadsheets permitted.",
      },
    ],
    about:
      "Aligns with CFP certification curriculum. Ideal for financial advisors, wealth managers, and banking relationship managers seeking career advancement.",
  },

  // ==================== HEALTHCARE & MEDICAL ====================

  // Medical Entrance
  {
    id: "15",
    title: "Pre-Medical Biology & Chemistry Mastery",
    category: {
      industry: "healthcare-medical",
      subcategory: "Medical Entrance",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 100,
    price: 39,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["NEET Prep", "MCAT Prep", "Popular"],
    description:
      "Rigorous assessment of biology, organic chemistry, and biochemistry concepts essential for medical school entrance exams.",
    topics: [
      "Cell Biology",
      "Human Physiology",
      "Organic Reactions",
      "Biochemical Pathways",
      "Genetics",
    ],
    instructions: [
      {
        title: "Timed Sections",
        description:
          "Biology (60 min), Chemistry (60 min) - cannot return to previous section.",
      },
      {
        title: "No Calculators",
        description: "Mental math and estimation skills tested.",
      },
      {
        title: "Passage-Based",
        description:
          "Many questions based on scientific passages and data interpretation.",
      },
    ],
    about:
      "Designed for pre-med students preparing for NEET, MCAT, or similar entrance exams. Detailed performance analytics help identify knowledge gaps.",
  },

  // Nursing Exams
  {
    id: "16",
    title: "Clinical Nursing Competency Assessment",
    category: {
      industry: "healthcare-medical",
      subcategory: "Nursing Exams",
    },
    difficulty: "Intermediate",
    duration: 90,
    totalQuestions: 75,
    price: 44,
    passingScore: 80,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["NCLEX Prep", "Certification", "Popular"],
    description:
      "Evaluate clinical judgment, patient care protocols, pharmacology knowledge, and emergency response procedures.",
    topics: [
      "Medication Administration",
      "Patient Assessment",
      "Infection Control",
      "Care Planning",
      "Ethical Decision-Making",
    ],
    instructions: [
      {
        title: "Next-Gen Questions",
        description:
          "Includes case studies and bow-tie format questions like NCLEX.",
      },
      {
        title: "Priority Setting",
        description:
          "Questions test ability to prioritize care in multi-patient scenarios.",
      },
      {
        title: "Safe Practice",
        description:
          "Emphasis on patient safety and evidence-based interventions.",
      },
    ],
    about:
      "Aligns with NCLEX-RN test plan. Ideal for nursing students and internationally educated nurses preparing for licensure exams.",
  },

  // Pharmacy
  {
    id: "17",
    title: "Pharmacology & Therapeutics Certification",
    category: {
      industry: "healthcare-medical",
      subcategory: "Pharmacy",
    },
    difficulty: "Advanced",
    duration: 100,
    totalQuestions: 60,
    price: 59,
    passingScore: 82,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "NAPLEX Prep", "Clinical"],
    description:
      "Advanced assessment of drug mechanisms, therapeutic guidelines, drug interactions, and patient counseling strategies.",
    topics: [
      "Drug Classes & MOA",
      "Dosing Calculations",
      "Adverse Effects",
      "Drug Interactions",
      "Patient Education",
    ],
    instructions: [
      {
        title: "Calculations Section",
        description: "15 questions on dosage, IV rates, and compounding math.",
      },
      {
        title: "Case-Based",
        description:
          "Clinical scenarios requiring therapeutic recommendations.",
      },
      {
        title: "Reference Materials",
        description: "Access to drug database excerpts during exam.",
      },
    ],
    about:
      "Prepares pharmacy students and technicians for NAPLEX and clinical roles. Certificate demonstrates therapeutic knowledge valued by hospitals and retail pharmacies.",
  },

  // Allied Health Sciences
  {
    id: "18",
    title: "Allied Health Professional Foundations",
    category: {
      industry: "healthcare-medical",
      subcategory: "Allied Health Sciences",
    },
    difficulty: "Beginner",
    duration: 60,
    totalQuestions: 50,
    price: 29,
    passingScore: 72,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Entry-Level", "Certification", "Multidisciplinary"],
    description:
      "Foundational knowledge for physical therapy assistants, radiology techs, lab technicians, and other allied health roles.",
    topics: [
      "Medical Terminology",
      "Anatomy Basics",
      "Patient Communication",
      "Safety Protocols",
      "Documentation Standards",
    ],
    instructions: [
      {
        title: "Role-Specific Modules",
        description: "Select your specialty track for tailored questions.",
      },
      {
        title: "Scenario Responses",
        description: "Choose appropriate actions in patient care scenarios.",
      },
      {
        title: "HIPAA Compliance",
        description: "Mandatory section on patient privacy regulations.",
      },
    ],
    about:
      "Ideal for students entering allied health programs or professionals seeking cross-training. Certificate enhances employability across healthcare settings.",
  },

  // Medical Licensing Exams
  {
    id: "19",
    title: "USMLE Step 1 Practice Assessment",
    category: {
      industry: "healthcare-medical",
      subcategory: "Medical Licensing Exams",
    },
    difficulty: "Advanced",
    duration: 180,
    totalQuestions: 120,
    price: 89,
    passingScore: 70,
    attemptsAllowed: 1,
    attemptsRemaining: 1,
    tags: ["USMLE", "High-Yield", "Popular"],
    description:
      "Comprehensive practice exam mirroring USMLE Step 1 format with integrated basic science and clinical concepts.",
    topics: [
      "Pathology",
      "Pharmacology",
      "Microbiology",
      "Biochemistry",
      "Behavioral Sciences",
    ],
    instructions: [
      {
        title: "Block Format",
        description:
          "4 blocks of 30 questions, 45 minutes each - timed separately.",
      },
      {
        title: "No Breaks",
        description:
          "Complete all blocks in one sitting to simulate real exam conditions.",
      },
      {
        title: "Detailed Feedback",
        description:
          "Comprehensive explanations provided post-exam for all questions.",
      },
    ],
    about:
      "Created by medical educators for USMLE Step 1 preparation. Performance analytics compare your results to national averages. Not affiliated with USMLE or NBME.",
  },

  // ==================== MEDICAL & PARAMEDICAL ====================

  // Paramedical Entrance Exams
  {
    id: "20",
    title: "Paramedical Sciences Entrance Prep",
    category: {
      industry: "medical-paramedical",
      subcategory: "Paramedical Entrance Exams",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 60,
    price: 34,
    passingScore: 70,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Entrance Exam", "Certification", "Popular"],
    description:
      "Preparation assessment for paramedical diploma and degree entrance exams covering biology, chemistry, and aptitude.",
    topics: [
      "Human Biology",
      "Basic Chemistry",
      "Logical Reasoning",
      "General Awareness",
      "Medical Ethics",
    ],
    instructions: [
      {
        title: "Section Timing",
        description:
          "Science (45 min), Aptitude (30 min) - manage time wisely.",
      },
      {
        title: "Negative Marking",
        description:
          "0.25 marks deducted for incorrect answers - guess strategically.",
      },
      {
        title: "Adaptive Difficulty",
        description: "Question difficulty adjusts based on performance.",
      },
    ],
    about:
      "Designed for aspirants of AIIMS Paramedical, JIPMER, and state-level paramedical entrance exams. Detailed solutions help strengthen weak areas.",
  },

  // Lab Technician
  {
    id: "21",
    title: "Clinical Laboratory Techniques Certification",
    category: {
      industry: "medical-paramedical",
      subcategory: "Lab Technician",
    },
    difficulty: "Intermediate",
    duration: 70,
    totalQuestions: 55,
    price: 39,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "Hands-On", "Popular"],
    description:
      "Evaluate proficiency in specimen collection, laboratory instrumentation, quality control, and result interpretation.",
    topics: [
      "Hematology Procedures",
      "Microbiology Cultures",
      "Biochemistry Assays",
      "QA/QC Protocols",
      "Lab Safety",
    ],
    instructions: [
      {
        title: "Virtual Lab Simulations",
        description: "Interactive modules for instrument operation practice.",
      },
      {
        title: "Error Identification",
        description: "Identify procedural errors in sample lab reports.",
      },
      {
        title: "CLIA Standards",
        description:
          "Questions aligned with Clinical Laboratory Improvement Amendments.",
      },
    ],
    about:
      "Validates technical competencies for medical lab technicians and technologists. Certificate meets continuing education requirements for many certifying bodies.",
  },

  // Radiology & Imaging
  {
    id: "22",
    title: "Radiologic Technology & Image Interpretation",
    category: {
      industry: "medical-paramedical",
      subcategory: "Radiology & Imaging",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 50,
    price: 64,
    passingScore: 80,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "ARRT Prep", "Popular"],
    description:
      "Advanced assessment of radiographic positioning, radiation safety, image evaluation, and modality-specific protocols.",
    topics: [
      "X-Ray Positioning",
      "CT/MRI Basics",
      "Radiation Protection",
      "Image Artifacts",
      "Contrast Media",
    ],
    instructions: [
      {
        title: "Image Analysis",
        description:
          "Evaluate radiographic images for positioning errors and pathology.",
      },
      {
        title: "Safety Calculations",
        description: "Calculate radiation dose and shielding requirements.",
      },
      {
        title: "Protocol Selection",
        description:
          "Choose appropriate imaging protocols for clinical scenarios.",
      },
    ],
    about:
      "Prepares radiography students and techs for ARRT certification exams. Certificate demonstrates technical expertise valued by imaging centers and hospitals.",
  },

  // Emergency Medical Services (EMS)
  {
    id: "23",
    title: "EMT & Paramedic Clinical Skills Assessment",
    category: {
      industry: "medical-paramedical",
      subcategory: "Emergency Medical Services (EMS)",
    },
    difficulty: "Intermediate",
    duration: 80,
    totalQuestions: 65,
    price: 49,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["NREMT Prep", "Certification", "Popular"],
    description:
      "Test emergency patient assessment, trauma management, medical emergencies, and pre-hospital care protocols.",
    topics: [
      "Primary Assessment",
      "Cardiac Emergencies",
      "Trauma Triage",
      "Pediatric Emergencies",
      "Pharmacology for EMS",
    ],
    instructions: [
      {
        title: "Scenario-Based",
        description:
          "Dynamic patient scenarios requiring sequential decision-making.",
      },
      {
        title: "Protocol Adherence",
        description:
          "Answers evaluated against current NREMT and local EMS protocols.",
      },
      {
        title: "Time Pressure",
        description:
          "Simulates real-world urgency with timed response windows.",
      },
    ],
    about:
      "Aligns with NREMT cognitive exam blueprint. Ideal for EMTs and paramedics seeking certification or recertification. Certificate includes CME credits.",
  },

  // Physiotherapy
  {
    id: "24",
    title: "Physical Therapy Assessment & Intervention",
    category: {
      industry: "medical-paramedical",
      subcategory: "Physiotherapy",
    },
    difficulty: "Advanced",
    duration: 95,
    totalQuestions: 55,
    price: 54,
    servingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "NPTE Prep", "Clinical"],
    description:
      "Comprehensive evaluation of patient evaluation, therapeutic exercise prescription, manual therapy, and outcome measurement.",
    topics: [
      "Musculoskeletal Assessment",
      "Neurological Rehab",
      "Therapeutic Modalities",
      "Exercise Prescription",
      "Documentation",
    ],
    instructions: [
      {
        title: "Case Studies",
        description: "Develop treatment plans for complex patient cases.",
      },
      {
        title: "Evidence-Based Practice",
        description:
          "Questions reference current clinical practice guidelines.",
      },
      {
        title: "Ethical Scenarios",
        description: "Navigate professional boundary and consent situations.",
      },
    ],
    about:
      "Prepares PT students and clinicians for NPTE and specialty certifications. Certificate demonstrates clinical reasoning skills valued by rehab facilities and sports medicine clinics.",
  },

  // Occupational Therapy
  {
    id: "25",
    title: "Occupational Therapy Practice Certification",
    category: {
      industry: "medical-paramedical",
      subcategory: "Occupational Therapy",
    },
    difficulty: "Intermediate",
    duration: 85,
    totalQuestions: 60,
    price: 49,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["NBCOT Prep", "Certification", "Popular"],
    description:
      "Assess knowledge of activity analysis, adaptive equipment, pediatric/adult interventions, and occupational therapy frameworks.",
    topics: [
      "ADL Training",
      "Sensory Integration",
      "Hand Therapy",
      "Cognitive Rehab",
      "Discharge Planning",
    ],
    instructions: [
      {
        title: "Activity Analysis",
        description:
          "Break down occupations into component skills for intervention planning.",
      },
      {
        title: "Client-Centered Care",
        description:
          "Prioritize client goals and cultural considerations in responses.",
      },
      {
        title: "OTA vs OTR",
        description:
          "Questions tailored for both OTA and OTR certification paths.",
      },
    ],
    about:
      "Aligns with NBCOT exam content outline. Ideal for OT students and practitioners seeking certification or professional development. Certificate includes portfolio-building resources.",
  },

  // Dialysis Technician
  {
    id: "26",
    title: "Hemodialysis Technician Competency Exam",
    category: {
      industry: "medical-paramedical",
      subcategory: "Dialysis Technician",
    },
    difficulty: "Intermediate",
    duration: 65,
    totalQuestions: 50,
    price: 44,
    passingScore: 80,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "CCHT Prep", "Specialized"],
    description:
      "Evaluate proficiency in dialysis machine operation, water treatment, patient monitoring, and infection control protocols.",
    topics: [
      "Dialyzer Setup",
      "Vascular Access Care",
      "Complication Management",
      "Water Quality Testing",
      "Emergency Procedures",
    ],
    instructions: [
      {
        title: "Machine Simulation",
        description:
          "Virtual dialysis machine interface for setup and troubleshooting practice.",
      },
      {
        title: "Protocol Compliance",
        description:
          "Answers evaluated against CDC and CMS dialysis regulations.",
      },
      {
        title: "Patient Safety Focus",
        description: "Emphasis on preventing infections and adverse events.",
      },
    ],
    about:
      "Prepares technicians for CCHT or BONENT certification exams. Certificate demonstrates specialized competency valued by dialysis centers and nephrology practices.",
  },

  // Medical Lab Technology (MLT)
  {
    id: "27",
    title: "Medical Laboratory Science Comprehensive Exam",
    category: {
      industry: "medical-paramedical",
      subcategory: "Medical Lab Technology (MLT)",
    },
    difficulty: "Advanced",
    duration: 110,
    totalQuestions: 70,
    price: 59,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["ASCP Prep", "Certification", "Popular"],
    description:
      "Comprehensive assessment across clinical chemistry, hematology, microbiology, immunology, and laboratory management.",
    topics: [
      "Clinical Chemistry Assays",
      "Hematology Differentials",
      "Microbial Identification",
      "Immunohematology",
      "Lab Management",
    ],
    instructions: [
      {
        title: "Discipline Sections",
        description: "5 sections - complete all within total time limit.",
      },
      {
        title: "Case Interpretation",
        description:
          "Interpret lab results in clinical context for diagnosis support.",
      },
      {
        title: "Quality Systems",
        description:
          "Questions on QC, QA, and regulatory compliance (CLIA, CAP).",
      },
    ],
    about:
      "Aligns with ASCP MLS/MLT certification exams. Ideal for lab science students and professionals seeking advancement. Certificate includes continuing education credits.",
  },

  // Operation Theatre Technician
  {
    id: "28",
    title: "Surgical Technology & OR Management Certification",
    category: {
      industry: "medical-paramedical",
      subcategory: "Operation Theatre Technician",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 55,
    price: 49,
    passingScore: 77,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "NBSTSA Prep", "Popular"],
    description:
      "Test knowledge of sterile technique, surgical instrumentation, patient positioning, and perioperative safety protocols.",
    topics: [
      "Sterile Field Maintenance",
      "Instrument Identification",
      "Surgical Counts",
      "Patient Positioning",
      "Specimen Handling",
    ],
    instructions: [
      {
        title: "Instrument Recognition",
        description:
          "Visual identification of surgical instruments and their uses.",
      },
      {
        title: "Scenario Responses",
        description:
          "Choose correct actions in intraoperative emergency scenarios.",
      },
      {
        title: "Aseptic Technique",
        description:
          "Questions emphasize maintaining sterility throughout procedures.",
      },
    ],
    about:
      "Prepares surgical tech students for NBSTSA CST exam. Certificate demonstrates OR competency valued by hospitals and ambulatory surgery centers.",
  },

  // ==================== ENGINEERING & CORE TECHNICAL ====================

  // Mechanical Engineering
  {
    id: "29",
    title: "Mechanical Engineering Fundamentals Assessment",
    category: {
      industry: "engineering-core",
      subcategory: "Mechanical Engineering",
    },
    difficulty: "Intermediate",
    duration: 90,
    totalQuestions: 60,
    price: 44,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["FE Exam Prep", "Certification", "Popular"],
    description:
      "Comprehensive evaluation of mechanics, thermodynamics, materials science, and machine design principles.",
    topics: [
      "Statics & Dynamics",
      "Thermodynamics Cycles",
      "Stress-Strain Analysis",
      "Fluid Mechanics",
      "Manufacturing Processes",
    ],
    instructions: [
      {
        title: "Calculator Policy",
        description:
          "NCEES-approved calculator required - list provided pre-exam.",
      },
      {
        title: "Reference Handbook",
        description: "Digital FE Reference Handbook accessible during exam.",
      },
      {
        title: "Problem Types",
        description:
          "Multiple-choice and alternative item types (drag-and-drop, point-and-click).",
      },
    ],
    about:
      "Aligns with NCEES FE Mechanical exam specifications. Ideal for engineering students and EIT candidates. Certificate demonstrates foundational engineering competency.",
  },

  // Electrical Engineering
  {
    id: "30",
    title: "Electrical Engineering Principles Certification",
    category: {
      industry: "engineering-core",
      subcategory: "Electrical Engineering",
    },
    difficulty: "Intermediate",
    duration: 85,
    totalQuestions: 55,
    price: 49,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["FE Exam Prep", "Certification", "Popular"],
    description:
      "Assessment of circuit analysis, power systems, electronics, control systems, and electrical safety standards.",
    topics: [
      "AC/DC Circuits",
      "Power Generation & Distribution",
      "Analog/Digital Electronics",
      "Control Systems",
      "NEC Compliance",
    ],
    instructions: [
      {
        title: "Circuit Simulations",
        description: "Analyze circuit behavior using virtual simulation tools.",
      },
      {
        title: "Code References",
        description: "Questions reference NEC, IEEE, and NESC standards.",
      },
      {
        title: "Calculations",
        description:
          "Phasor math, power factor correction, and fault analysis problems.",
      },
    ],
    about:
      "Prepares candidates for FE Electrical and PE Power exams. Certificate validates electrical engineering knowledge for utilities, consulting firms, and industrial employers.",
  },

  // Civil Engineering
  {
    id: "31",
    title: "Civil Engineering Design & Construction Exam",
    category: {
      industry: "engineering-core",
      subcategory: "Civil Engineering",
    },
    difficulty: "Advanced",
    duration: 100,
    totalQuestions: 65,
    price: 54,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["FE/PE Prep", "Certification", "Popular"],
    description:
      "Advanced evaluation of structural analysis, geotechnical engineering, transportation systems, and construction management.",
    topics: [
      "Structural Load Analysis",
      "Soil Mechanics",
      "Highway Design",
      "Water Resources",
      "Project Scheduling",
    ],
    instructions: [
      {
        title: "Design Problems",
        description:
          "Multi-step problems requiring engineering judgment and code application.",
      },
      {
        title: "Code Books",
        description: "Access to AISC, ACI, and AASHTO excerpts during exam.",
      },
      {
        title: "Software Tools",
        description: "Basic spreadsheet functions permitted for calculations.",
      },
    ],
    about:
      "Aligns with NCEES FE Civil and PE Civil exam content. Ideal for civil engineering graduates and licensed professionals seeking advancement. Certificate enhances credibility with clients and employers.",
  },

  // Electronics & Communication
  {
    id: "32",
    title: "Electronics & Communication Systems Certification",
    category: {
      industry: "engineering-core",
      subcategory: "Electronics & Communication",
    },
    difficulty: "Intermediate",
    duration: 80,
    totalQuestions: 50,
    price: 44,
    passingScore: 74,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Certification", "GATE Prep", "Popular"],
    description:
      "Test knowledge of analog/digital circuits, signals & systems, communication protocols, and embedded systems design.",
    topics: [
      "Op-Amp Circuits",
      "Digital Logic Design",
      "Modulation Techniques",
      "Microcontroller Programming",
      "PCB Design Basics",
    ],
    instructions: [
      {
        title: "Circuit Analysis",
        description: "Analyze schematics and predict circuit behavior.",
      },
      {
        title: "Code Snippets",
        description:
          "Interpret and debug embedded C code for microcontrollers.",
      },
      {
        title: "Standards Knowledge",
        description:
          "Questions on IEEE, 3GPP, and IoT communication standards.",
      },
    ],
    about:
      "Prepares students for GATE EC and industry roles in telecommunications, consumer electronics, and IoT. Certificate demonstrates practical electronics competency.",
  },

  // GATE / PSU Exams
  {
    id: "33",
    title: "GATE Engineering Aptitude & Technical Mastery",
    category: {
      industry: "engineering-core",
      subcategory: "GATE / PSU Exams",
    },
    difficulty: "Advanced",
    duration: 180,
    totalQuestions: 100,
    price: 39,
    passingScore: 70,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["GATE Prep", "PSU Recruitment", "Popular"],
    description:
      "Comprehensive practice exam covering engineering mathematics, general aptitude, and discipline-specific technical subjects.",
    topics: [
      "Engineering Mathematics",
      "Verbal/Numerical Ability",
      "Core Technical Subjects",
      "Previous Year Patterns",
      "Time Management",
    ],
    instructions: [
      {
        title: "Section Timing",
        description:
          "Aptitude (45 min), Technical (135 min) - simulate real GATE timing.",
      },
      {
        title: "Negative Marking",
        description:
          "Practice with 1/3 negative marking for MCQs - strategic guessing required.",
      },
      {
        title: "Virtual Calculator",
        description:
          "Use on-screen calculator as provided in actual GATE exam.",
      },
    ],
    about:
      "Created by GATE toppers and PSU recruiters. Detailed analytics compare performance with previous year cutoffs. Ideal for aspirants targeting IITs, NITs, and public sector undertakings.",
  },

  // ==================== GOVERNMENT & PUBLIC SECTOR ====================

  // Civil Services
  {
    id: "34",
    title: "Civil Services Prelims Practice Assessment",
    category: {
      industry: "government-public",
      subcategory: "Civil Services",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 100,
    price: 49,
    passingScore: 66, // Approx UPSC prelims cutoff
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["UPSC Prep", "CSAT", "Popular"],
    description:
      "Simulated UPSC Civil Services Prelims exam covering General Studies Paper I and CSAT Paper II.",
    topics: [
      "Current Affairs",
      "Indian Polity",
      "History & Culture",
      "Geography",
      "Logical Reasoning",
      "Comprehension",
    ],
    instructions: [
      {
        title: "Two Papers",
        description:
          "GS Paper I (100 Q) + CSAT Paper II (80 Q) - both must be attempted.",
      },
      {
        title: "Negative Marking",
        description:
          "1/3 marks deducted for wrong answers - practice strategic attempts.",
      },
      {
        title: "Time Management",
        description: "Strict 2-hour limit per paper - no extra time.",
      },
    ],
    about:
      "Created by former civil servants and UPSC coaching experts. Detailed explanations and cutoff analysis help refine preparation strategy. Not affiliated with UPSC.",
  },

  // SSC Exams
  {
    id: "35",
    title: "SSC CGL Tier-I Comprehensive Practice",
    category: {
      industry: "government-public",
      subcategory: "SSC Exams",
    },
    difficulty: "Intermediate",
    duration: 60,
    totalQuestions: 100,
    price: 29,
    passingScore: 70,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["SSC Prep", "Government Jobs", "Popular"],
    description:
      "Full-length practice test for SSC CGL Tier-I covering Reasoning, General Awareness, Quantitative Aptitude, and English.",
    topics: [
      "Analogies & Classification",
      "Current Affairs",
      "Arithmetic & Algebra",
      "Grammar & Comprehension",
    ],
    instructions: [
      {
        title: "Sectional Timing",
        description: "20 minutes per section - manage time across 4 sections.",
      },
      {
        title: "Negative Marking",
        description:
          "0.5 marks deducted for incorrect answers - attempt wisely.",
      },
      {
        title: "Bilingual Options",
        description:
          "Questions available in English and Hindi - select preference pre-exam.",
      },
    ],
    about:
      "Aligned with latest SSC CGL exam pattern and syllabus. Ideal for aspirants targeting Group B and C government posts. Detailed performance report highlights weak areas.",
  },

  // Railways
  {
    id: "36",
    title: "Railway Recruitment Board (RRB) NTPC Practice Test",
    category: {
      industry: "government-public",
      subcategory: "Railways",
    },
    difficulty: "Beginner",
    duration: 90,
    totalQuestions: 100,
    price: 24,
    passingScore: 65,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["RRB Prep", "Railway Jobs", "Entry-Level"],
    description:
      "Practice assessment for RRB NTPC exams covering Mathematics, Reasoning, General Awareness, and General Science.",
    topics: [
      "Number Systems",
      "Coding-Decoding",
      "Indian Railways History",
      "Basic Physics & Biology",
    ],
    instructions: [
      {
        title: "Computer Based Test",
        description:
          "Simulates actual CBT interface with question palette and navigation.",
      },
      {
        title: "No Negative Marking",
        description:
          "Practice attempting all questions - no penalty for wrong answers.",
      },
      {
        title: "Regional Language",
        description: "Select from 15+ languages as per RRB notification.",
      },
    ],
    about:
      "Created by railway exam experts and former RRB toppers. Questions mirror difficulty and pattern of recent NTPC exams. Ideal for graduate and undergraduate level aspirants.",
  },

  // Defence
  {
    id: "37",
    title: "Defence Services Selection Board (SSB) Practice Assessment",
    category: {
      industry: "government-public",
      subcategory: "Defence",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 60,
    price: 39,
    passingScore: 72,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["NDA Prep", "CDS Prep", "Popular"],
    description:
      "Comprehensive practice for NDA, CDS, and AFCAT exams covering English, General Knowledge, Mathematics, and Reasoning.",
    topics: [
      "Verbal Ability",
      "Defence Current Affairs",
      "Trigonometry & Geometry",
      "Logical Deduction",
    ],
    instructions: [
      {
        title: "Adaptive Difficulty",
        description:
          "Question difficulty adjusts based on performance to simulate real exam pressure.",
      },
      {
        title: "Time Pressure",
        description: "Strict timing per section to build speed and accuracy.",
      },
      {
        title: "Physical Standards Info",
        description:
          "Post-exam guide includes medical and physical fitness requirements.",
      },
    ],
    about:
      "Designed by defence exam coaches and serving officers. Helps aspirants understand exam pattern, syllabus, and selection process for Indian Armed Forces entries.",
  },

  // State Government Exams
  {
    id: "38",
    title: "State PSC Prelims Practice Test (Multi-State)",
    category: {
      industry: "government-public",
      subcategory: "State Government Exams",
    },
    difficulty: "Intermediate",
    duration: 120,
    totalQuestions: 100,
    price: 34,
    passingScore: 68,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["State PSC", "Regional Exams", "Popular"],
    description:
      "Customizable practice exam for various State Public Service Commission prelims with region-specific general studies.",
    topics: [
      "State History & Culture",
      "Regional Current Affairs",
      "State Polity & Governance",
      "Local Geography & Economy",
    ],
    instructions: [
      {
        title: "State Selection",
        description:
          "Choose your target state exam for customized question bank.",
      },
      {
        title: "Bilingual Mode",
        description:
          "Questions in English and regional language as per state notification.",
      },
      {
        title: "Negative Marking",
        description: "Configurable based on selected state exam pattern.",
      },
    ],
    about:
      "Covers major state PSC exams including UPPSC, MPPSC, TNPSC, WBPSC, and more. Created by state exam experts with updated syllabus and previous year trends.",
  },

  // ==================== EDUCATION & TEACHING ====================

  // Teacher Eligibility Tests
  {
    id: "39",
    title: "CTET & State TET Comprehensive Practice",
    category: {
      industry: "education-teaching",
      subcategory: "Teacher Eligibility Tests",
    },
    difficulty: "Intermediate",
    duration: 150,
    totalQuestions: 150,
    price: 34,
    passingScore: 60, // CTET qualifying marks
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["CTET Prep", "TET", "Popular"],
    description:
      "Full-length practice test for CTET and State TET exams covering Child Development, Pedagogy, and Subject Knowledge.",
    topics: [
      "Child Psychology",
      "Inclusive Education",
      "Language Pedagogy",
      "Mathematics/Science Concepts",
      "EVS",
    ],
    instructions: [
      {
        title: "Two Papers",
        description:
          "Paper I (Classes I-V) or Paper II (Classes VI-VIII) - select during registration.",
      },
      {
        title: "No Negative Marking",
        description: "Attempt all questions - focus on accuracy and speed.",
      },
      {
        title: "Bilingual Questions",
        description:
          "Available in English and Hindi with subject-specific terminology.",
      },
    ],
    about:
      "Aligned with latest CTET and state TET syllabi. Created by NCTE-certified educators. Detailed feedback helps strengthen pedagogical content knowledge.",
  },

  // UGC NET
  {
    id: "40",
    title: "UGC NET Paper-I General Practice Test",
    category: {
      industry: "education-teaching",
      subcategory: "UGC NET",
    },
    difficulty: "Advanced",
    duration: 180,
    totalQuestions: 100,
    price: 44,
    passingScore: 40, // UGC NET qualifying percentile
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["UGC NET", "JRF Prep", "Popular"],
    description:
      "Comprehensive practice for UGC NET Paper-I covering Teaching Aptitude, Research Aptitude, Reasoning, and General Awareness.",
    topics: [
      "Teaching Methodologies",
      "Research Methods",
      "Logical Reasoning",
      "Data Interpretation",
      "Higher Education System",
    ],
    instructions: [
      {
        title: "Paper-I Focus",
        description:
          "Practice only Paper-I (common for all subjects) - select subject for Paper-II separately.",
      },
      {
        title: "No Negative Marking",
        description:
          "Attempt all questions - every mark counts for JRF qualification.",
      },
      {
        title: "Previous Year Questions",
        description: "30% questions from actual previous year UGC NET papers.",
      },
    ],
    about:
      "Created by UGC NET qualified faculty and JRF holders. Helps aspirants understand exam pattern, time management, and high-yield topics for Paper-I.",
  },

  // Teaching Aptitude
  {
    id: "41",
    title: "Pedagogical Skills & Classroom Management Assessment",
    category: {
      industry: "education-teaching",
      subcategory: "Teaching Aptitude",
    },
    difficulty: "Intermediate",
    duration: 60,
    totalQuestions: 50,
    price: 29,
    passingScore: 70,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Teacher Training", "Certification", "Popular"],
    description:
      "Evaluate teaching methodologies, lesson planning, student engagement strategies, and classroom assessment techniques.",
    topics: [
      "Learning Theories",
      "Differentiated Instruction",
      "Formative Assessment",
      "Behavior Management",
      "EdTech Integration",
    ],
    instructions: [
      {
        title: "Scenario-Based",
        description:
          "Respond to realistic classroom scenarios with multiple valid approaches.",
      },
      {
        title: "Reflective Practice",
        description:
          "Some questions require justifying teaching decisions with pedagogical rationale.",
      },
      {
        title: "Inclusive Focus",
        description:
          "Emphasis on strategies for diverse learners and special needs students.",
      },
    ],
    about:
      "Ideal for pre-service teachers, B.Ed students, and in-service educators seeking professional development. Certificate demonstrates pedagogical competency for hiring committees.",
  },

  // Subject-Specific Teaching Exams
  {
    id: "42",
    title: "Subject Mastery & Pedagogy: Mathematics Teaching",
    category: {
      industry: "education-teaching",
      subcategory: "Subject-Specific Teaching Exams",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 60,
    price: 39,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Math Teaching", "Certification", "Popular"],
    description:
      "Advanced assessment of mathematical content knowledge combined with effective teaching strategies for secondary level mathematics.",
    topics: [
      "Algebra & Calculus Concepts",
      "Geometry & Proof",
      "Problem-Solving Pedagogy",
      "Common Student Misconceptions",
      "Technology in Math Ed",
    ],
    instructions: [
      {
        title: "Content + Pedagogy",
        description:
          "Questions test both mathematical knowledge and how to teach it effectively.",
      },
      {
        title: "Student Work Analysis",
        description:
          "Evaluate sample student solutions and plan remedial instruction.",
      },
      {
        title: "Curriculum Alignment",
        description: "Questions reference Common Core and NCTM standards.",
      },
    ],
    about:
      "Designed for secondary math teachers and aspiring educators. Certificate demonstrates subject-specific pedagogical content knowledge valued by schools and districts.",
  },

  // ==================== LAW & LEGAL ====================

  // CLAT
  {
    id: "43",
    title: "CLAT UG Comprehensive Practice Test",
    category: {
      industry: "law-legal",
      subcategory: "CLAT",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 120,
    price: 49,
    passingScore: 70, // Approx competitive score
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["CLAT Prep", "Law Entrance", "Popular"],
    description:
      "Full-length practice exam for CLAT UG covering English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques.",
    topics: [
      "Reading Comprehension",
      "Legal Principles & Facts",
      "Critical Reasoning",
      "Data Interpretation",
      "Legal GK",
    ],
    instructions: [
      {
        title: "Sectional Timing",
        description:
          "Practice with suggested time per section: English (25 min), Current Affairs (20 min), etc.",
      },
      {
        title: "Negative Marking",
        description:
          "0.25 marks deducted for wrong answers - strategic attempting required.",
      },
      {
        title: "Passage-Based",
        description:
          "Most questions based on passages - practice efficient reading and extraction.",
      },
    ],
    about:
      "Created by CLAT toppers and NLU faculty. Mirrors latest CLAT pattern with emphasis on legal reasoning and current affairs. Detailed analytics help target weak areas.",
  },

  // Judiciary Exams
  {
    id: "44",
    title: "Judicial Services Prelims Practice Assessment",
    category: {
      industry: "law-legal",
      subcategory: "Judiciary Exams",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 100,
    price: 54,
    passingScore: 65,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Judiciary Prep", "Law Exams", "Popular"],
    description:
      "Comprehensive practice for state judicial services prelims covering Law Papers, General Knowledge, and Language.",
    topics: [
      "Constitutional Law",
      "Criminal Procedure",
      "Civil Procedure",
      "Evidence Act",
      "Local Laws & GK",
    ],
    instructions: [
      {
        title: "State Selection",
        description:
          "Choose target state for customized law syllabus and local acts.",
      },
      {
        title: "Bilingual Mode",
        description:
          "Law questions in English; GK/Language in English and regional language.",
      },
      {
        title: "Case Law Focus",
        description:
          "Questions reference landmark judgments and recent Supreme Court rulings.",
      },
    ],
    about:
      "Created by serving judicial officers and judiciary coaching experts. Helps aspirants understand state-specific syllabus, exam pattern, and important legal provisions.",
  },

  // Legal Aptitude
  {
    id: "45",
    title: "Legal Reasoning & Analytical Skills Certification",
    category: {
      industry: "law-legal",
      subcategory: "Legal Aptitude",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 50,
    price: 39,
    passingScore: 72,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["LSAT Prep", "Legal Reasoning", "Popular"],
    description:
      "Test ability to analyze legal arguments, identify assumptions, evaluate evidence, and apply legal principles to fact patterns.",
    topics: [
      "Argument Analysis",
      "Logical Flaws",
      "Principle-Fact Application",
      "Inference Drawing",
      "Legal Ethics Scenarios",
    ],
    instructions: [
      {
        title: "Passage-Based",
        description:
          "All questions based on legal passages, case summaries, or statutory excerpts.",
      },
      {
        title: "No Prior Law Knowledge",
        description:
          "Questions test reasoning skills, not memorized legal knowledge.",
      },
      {
        title: "Time Pressure",
        description: "Practice managing time for complex analytical questions.",
      },
    ],
    about:
      "Ideal for law school aspirants preparing for LSAT-India, CLAT, or AILET. Also valuable for legal professionals enhancing analytical skills. Certificate demonstrates critical thinking competency.",
  },

  // Corporate Law Certifications
  {
    id: "46",
    title: "Corporate Law & Compliance Certification",
    category: {
      industry: "law-legal",
      subcategory: "Corporate Law Certifications",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 55,
    price: 69,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Corporate Law", "Certification", "Popular"],
    description:
      "Advanced assessment of company law, securities regulations, M&A fundamentals, compliance frameworks, and corporate governance.",
    topics: [
      "Companies Act Provisions",
      "SEBI Regulations",
      "Contract Drafting Basics",
      "Insolvency & Bankruptcy",
      "Corporate Governance Codes",
    ],
    instructions: [
      {
        title: "Case Studies",
        description:
          "Analyze corporate scenarios and recommend legally compliant solutions.",
      },
      {
        title: "Drafting Exercises",
        description:
          "Some questions require identifying errors in legal clauses or drafting simple provisions.",
      },
      {
        title: "Regulatory Updates",
        description:
          "Questions based on recent amendments and regulatory circulars.",
      },
    ],
    about:
      "Designed for corporate lawyers, in-house counsel, and compliance professionals. Certificate demonstrates specialized knowledge valued by law firms, corporations, and regulatory bodies.",
  },

  // ==================== MANAGEMENT & BUSINESS ====================

  // MBA Entrance
  {
    id: "47",
    title: "MBA Entrance Comprehensive Practice (CAT/XAT Pattern)",
    category: {
      industry: "management-business",
      subcategory: "MBA Entrance",
    },
    difficulty: "Advanced",
    duration: 120,
    totalQuestions: 100,
    price: 49,
    passingScore: 70, // Approx competitive percentile
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["CAT Prep", "XAT Prep", "Popular"],
    description:
      "Full-length practice test covering Quantitative Aptitude, Verbal Ability, Data Interpretation, and Logical Reasoning for top MBA entrance exams.",
    topics: [
      "Arithmetic & Algebra",
      "Reading Comprehension",
      "Data Tables & Graphs",
      "Puzzles & Arrangements",
      "Critical Reasoning",
    ],
    instructions: [
      {
        title: "Sectional Timing",
        description:
          "40 minutes per section - practice time allocation strategy.",
      },
      {
        title: "Negative Marking",
        description:
          "Variable negative marking as per CAT/XAT pattern - attempt strategically.",
      },
      {
        title: "Non-MCQ Questions",
        description:
          "Practice typing answers for non-MCQ questions as in actual CAT.",
      },
    ],
    about:
      "Created by IIM alumni and MBA entrance experts. Mirrors latest CAT/XAT pattern with emphasis on speed, accuracy, and selection strategy. Detailed analytics compare with previous year cutoffs.",
  },

  // Business Aptitude
  {
    id: "48",
    title: "Business Acumen & Analytical Skills Assessment",
    category: {
      industry: "management-business",
      subcategory: "Business Aptitude",
    },
    difficulty: "Intermediate",
    duration: 60,
    totalQuestions: 50,
    price: 34,
    passingScore: 72,
    attemptsAllowed: 3,
    attemptsRemaining: 3,
    tags: ["Aptitude Test", "Campus Recruitment", "Popular"],
    description:
      "Evaluate numerical reasoning, verbal ability, logical thinking, and business scenario analysis for campus placements and entry-level roles.",
    topics: [
      "Percentage & Profit/Loss",
      "Business English",
      "Logical Deduction",
      "Caselets & Data Sufficiency",
      "Basic Economics",
    ],
    instructions: [
      {
        title: "Adaptive Difficulty",
        description:
          "Question difficulty adjusts based on performance to accurately assess ability.",
      },
      {
        title: "Time Pressure",
        description:
          "Strict timing to simulate real recruitment test conditions.",
      },
      {
        title: "No Calculators",
        description:
          "Practice mental math and estimation skills valued by employers.",
      },
    ],
    about:
      "Ideal for college students preparing for campus placements and fresh graduates applying to corporate roles. Certificate demonstrates business readiness to recruiters.",
  },

  // Marketing
  {
    id: "49",
    title: "Digital Marketing Strategy & Analytics Certification",
    category: {
      industry: "management-business",
      subcategory: "Marketing",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 50,
    price: 44,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Digital Marketing", "Certification", "Popular"],
    description:
      "Assessment of SEO/SEM, social media marketing, content strategy, analytics tools, and campaign optimization techniques.",
    topics: [
      "Keyword Research",
      "Google Ads & Analytics",
      "Social Media Algorithms",
      "Conversion Optimization",
      "Marketing Attribution",
    ],
    instructions: [
      {
        title: "Platform Simulations",
        description:
          "Practice tasks in simulated Google Ads and Meta Ads interfaces.",
      },
      {
        title: "Case Analysis",
        description:
          "Analyze campaign performance data and recommend optimization strategies.",
      },
      {
        title: "Current Trends",
        description:
          "Questions updated quarterly with latest platform changes and best practices.",
      },
    ],
    about:
      "Created by digital marketing practitioners and agency leaders. Certificate demonstrates practical skills valued by brands, agencies, and startups. Includes portfolio project template.",
  },

  // HR & Operations
  {
    id: "50",
    title: "Human Resources Management Certification",
    category: {
      industry: "management-business",
      subcategory: "HR & Operations",
    },
    difficulty: "Intermediate",
    duration: 70,
    totalQuestions: 55,
    price: 39,
    passingScore: 74,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["HR Certification", "SHRM Prep", "Popular"],
    description:
      "Comprehensive evaluation of talent acquisition, performance management, compensation, employee relations, and HR analytics.",
    topics: [
      "Recruitment Strategies",
      "Performance Appraisal Methods",
      "Compensation Structures",
      "Labor Laws",
      "HR Metrics",
    ],
    instructions: [
      {
        title: "Scenario-Based",
        description:
          "Respond to realistic HR dilemmas with legally compliant and ethical solutions.",
      },
      {
        title: "Case Studies",
        description:
          "Analyze organizational scenarios and design HR interventions.",
      },
      {
        title: "Regulatory Focus",
        description:
          "Questions reference current labor laws and compliance requirements.",
      },
    ],
    about:
      "Aligns with SHRM-CP and PHR certification content. Ideal for HR professionals, MBA HR students, and career changers. Certificate demonstrates HR competency for hiring managers.",
  },

  // Entrepreneurship
  {
    id: "51",
    title: "Startup Founders & Business Model Validation Assessment",
    category: {
      industry: "management-business",
      subcategory: "Entrepreneurship",
    },
    difficulty: "Advanced",
    duration: 85,
    totalQuestions: 45,
    price: 54,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Startup", "Business Model", "Popular"],
    description:
      "Test ability to validate business ideas, design lean experiments, analyze unit economics, and pitch to investors.",
    topics: [
      "Problem-Solution Fit",
      "MVP Design",
      "Customer Discovery",
      "Financial Projections",
      "Pitch Deck Essentials",
    ],
    instructions: [
      {
        title: "Case-Based",
        description:
          "Analyze startup scenarios and recommend evidence-based next steps.",
      },
      {
        title: "Financial Modeling",
        description:
          "Basic spreadsheet tasks for TAM/SAM/SOM and burn rate calculations.",
      },
      {
        title: "Pitch Component",
        description:
          "One question requires structuring a 60-second elevator pitch.",
      },
    ],
    about:
      "Created by successful founders and venture capitalists. Ideal for aspiring entrepreneurs, incubator applicants, and innovation managers. Certificate includes investor-ready pitch template.",
  },

  // ==================== SKILLED TRADES & VOCATIONAL ====================

  // Electrician
  {
    id: "52",
    title: "Residential & Commercial Electrical Installation Certification",
    category: {
      industry: "skilled-trades",
      subcategory: "Electrician",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 50,
    price: 39,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Trade Certification", "NEC", "Popular"],
    description:
      "Evaluate knowledge of electrical codes, wiring methods, circuit design, safety protocols, and troubleshooting techniques.",
    topics: [
      "NEC Code Application",
      "Circuit Calculations",
      "Conduit Bending",
      "Grounding & Bonding",
      "Troubleshooting Methods",
    ],
    instructions: [
      {
        title: "Code Book Access",
        description:
          "Digital NEC excerpts available during exam for reference.",
      },
      {
        title: "Diagram Interpretation",
        description:
          "Read and interpret electrical schematics and wiring diagrams.",
      },
      {
        title: "Safety Focus",
        description:
          "Questions emphasize OSHA compliance and personal protective equipment.",
      },
    ],
    about:
      "Prepares electricians for state licensing exams and industry certifications. Certificate demonstrates code knowledge and practical skills valued by contractors and employers.",
  },

  // Plumbing
  {
    id: "53",
    title: "Plumbing Systems Installation & Repair Certification",
    category: {
      industry: "skilled-trades",
      subcategory: "Plumbing",
    },
    difficulty: "Intermediate",
    duration: 70,
    totalQuestions: 45,
    price: 34,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Trade Certification", "IPC", "Popular"],
    description:
      "Assessment of plumbing codes, pipe sizing, fixture installation, drainage systems, and water supply design.",
    topics: [
      "IPC/UPC Codes",
      "Pipe Materials & Joining",
      "Venting Principles",
      "Water Heater Installation",
      "Troubleshooting Leaks",
    ],
    instructions: [
      {
        title: "Code Reference",
        description: "Digital IPC/UPC code excerpts available during exam.",
      },
      {
        title: "Blueprint Reading",
        description: "Interpret plumbing isometrics and architectural plans.",
      },
      {
        title: "Calculations",
        description:
          "Pipe sizing, pressure loss, and fixture unit calculations.",
      },
    ],
    about:
      "Prepares plumbers for journeyman licensing and industry certifications. Certificate demonstrates code compliance and technical competency valued by contractors and municipalities.",
  },

  // Automotive
  {
    id: "54",
    title: "Automotive Technician Certification (ASE Prep)",
    category: {
      industry: "skilled-trades",
      subcategory: "Automotive",
    },
    difficulty: "Intermediate",
    duration: 80,
    totalQuestions: 50,
    price: 44,
    passingScore: 70, // ASE passing threshold
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["ASE Prep", "Automotive", "Popular"],
    description:
      "Comprehensive assessment of engine repair, electrical systems, brakes, suspension, and diagnostic procedures.",
    topics: [
      "Engine Diagnostics",
      "Electrical Systems",
      "Brake Systems",
      "HVAC",
      "OBD-II Scanning",
    ],
    instructions: [
      {
        title: "Scenario-Based",
        description:
          "Diagnose vehicle symptoms and recommend repair procedures.",
      },
      {
        title: "Tool Knowledge",
        description:
          "Questions on proper use of diagnostic tools and equipment.",
      },
      {
        title: "Safety Protocols",
        description: "Emphasis on shop safety and environmental regulations.",
      },
    ],
    about:
      "Aligns with ASE certification test specifications. Ideal for automotive students and technicians seeking certification. Certificate demonstrates technical proficiency valued by dealerships and repair shops.",
  },

  // Construction
  {
    id: "55",
    title: "Construction Management & Safety Certification",
    category: {
      industry: "skilled-trades",
      subcategory: "Construction",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 55,
    price: 49,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["OSHA", "Construction", "Popular"],
    description:
      "Evaluate knowledge of construction methods, project scheduling, cost estimation, OSHA safety standards, and quality control.",
    topics: [
      "Reading Blueprints",
      "Critical Path Method",
      "Material Estimation",
      "Fall Protection",
      "Scaffold Safety",
    ],
    instructions: [
      {
        title: "Plan Interpretation",
        description: "Analyze construction drawings and specifications.",
      },
      {
        title: "Scenario Responses",
        description: "Choose correct actions in safety and quality scenarios.",
      },
      {
        title: "OSHA Focus",
        description:
          "Questions reference current OSHA 10/30 hour training content.",
      },
    ],
    about:
      "Prepares construction professionals for OSHA certifications and industry credentials. Certificate demonstrates safety leadership and management skills valued by contractors and project owners.",
  },

  // Technician Certifications
  {
    id: "56",
    title: "Industrial Maintenance Technician Certification",
    category: {
      industry: "skilled-trades",
      subcategory: "Technician Certifications",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 60,
    price: 54,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Maintenance", "Certification", "Popular"],
    description:
      "Comprehensive assessment of mechanical, electrical, pneumatic, and hydraulic systems maintenance and troubleshooting.",
    topics: [
      "Preventive Maintenance",
      "Motor Controls",
      "Pneumatic Circuits",
      "Hydraulic Systems",
      "Predictive Maintenance Tools",
    ],
    instructions: [
      {
        title: "System Diagrams",
        description: "Interpret ladder logic, P&IDs, and hydraulic schematics.",
      },
      {
        title: "Troubleshooting Sequences",
        description: "Select logical diagnostic steps for equipment failures.",
      },
      {
        title: "Safety Integration",
        description:
          "Lockout/tagout procedures integrated into all technical questions.",
      },
    ],
    about:
      "Prepares technicians for SMA, ISA, and manufacturer certifications. Certificate demonstrates multi-craft competency valued by manufacturing plants and industrial facilities.",
  },

  // ==================== CREATIVE & MEDIA ====================

  // Graphic Design
  {
    id: "57",
    title: "Visual Design Principles & Adobe Creative Suite Certification",
    category: {
      industry: "creative-media",
      subcategory: "Graphic Design",
    },
    difficulty: "Intermediate",
    duration: 75,
    totalQuestions: 45,
    price: 44,
    passingScore: 75,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Adobe Certified", "Design", "Popular"],
    description:
      "Evaluate knowledge of color theory, typography, layout principles, and proficiency in Photoshop, Illustrator, and InDesign workflows.",
    topics: [
      "Color Models & Psychology",
      "Typography Hierarchy",
      "Grid Systems",
      "Vector vs Raster",
      "Print vs Digital Prep",
    ],
    instructions: [
      {
        title: "Visual Questions",
        description:
          "Analyze design samples and identify principle violations or improvements.",
      },
      {
        title: "Software Scenarios",
        description:
          "Choose correct tool or workflow for specific design tasks.",
      },
      {
        title: "Portfolio Component",
        description:
          "Post-exam: Submit a mini project for optional portfolio review.",
      },
    ],
    about:
      "Aligns with Adobe Certified Professional exam objectives. Ideal for design students and professionals seeking credential validation. Certificate demonstrates technical and creative competency.",
  },

  // Animation & VFX
  {
    id: "58",
    title: "3D Animation & Visual Effects Fundamentals",
    category: {
      industry: "creative-media",
      subcategory: "Animation & VFX",
    },
    difficulty: "Advanced",
    duration: 90,
    totalQuestions: 40,
    price: 59,
    passingScore: 78,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Maya/Blender", "VFX", "Popular"],
    description:
      "Assessment of 3D modeling, rigging, animation principles, lighting, rendering, and compositing workflows.",
    topics: [
      "Modeling Topology",
      "Keyframe Animation",
      "Particle Systems",
      "Lighting & Shading",
      "Compositing Nodes",
    ],
    instructions: [
      {
        title: "Software Agnostic",
        description:
          "Questions focus on concepts applicable to Maya, Blender, Houdini, etc.",
      },
      {
        title: "Pipeline Knowledge",
        description:
          "Questions on asset management, version control, and render farm workflows.",
      },
      {
        title: "Artistic Judgment",
        description:
          "Some questions require selecting aesthetically appropriate solutions.",
      },
    ],
    about:
      "Created by VFX artists and animation supervisors. Ideal for students and professionals in film, gaming, and advertising. Certificate demonstrates technical artistry valued by studios.",
  },

  // Video Editing
  {
    id: "59",
    title: "Professional Video Editing & Post-Production Certification",
    category: {
      industry: "creative-media",
      subcategory: "Video Editing",
    },
    difficulty: "Intermediate",
    duration: 70,
    totalQuestions: 45,
    price: 49,
    passingScore: 74,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Premiere Pro", "DaVinci", "Popular"],
    description:
      "Evaluate proficiency in editing workflows, color grading, audio mixing, effects application, and delivery specifications.",
    topics: [
      "Timeline Management",
      "Color Correction vs Grading",
      "Audio Sync & Mixing",
      "Transitions & Effects",
      "Export Codecs",
    ],
    instructions: [
      {
        title: "Workflow Scenarios",
        description:
          "Choose efficient editing strategies for different project types.",
      },
      {
        title: "Technical Knowledge",
        description:
          "Questions on codecs, resolutions, frame rates, and delivery specs.",
      },
      {
        title: "Creative Judgment",
        description:
          "Some questions require selecting narratively appropriate editing choices.",
      },
    ],
    about:
      "Aligns with Adobe Premiere Pro and DaVinci Resolve certification objectives. Ideal for editors, content creators, and video producers. Certificate demonstrates post-production expertise.",
  },

  // Journalism & Mass Communication
  {
    id: "60",
    title: "Digital Journalism & Media Ethics Certification",
    category: {
      industry: "creative-media",
      subcategory: "Journalism & Mass Communication",
    },
    difficulty: "Intermediate",
    duration: 65,
    totalQuestions: 50,
    price: 39,
    passingScore: 72,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["Journalism", "Ethics", "Popular"],
    description:
      "Assessment of news writing, multimedia storytelling, fact-checking, media law, and ethical decision-making in digital media.",
    topics: [
      "Inverted Pyramid Writing",
      "Source Verification",
      "Copyright & Fair Use",
      "Social Media Guidelines",
      "Crisis Communication",
    ],
    instructions: [
      {
        title: "Writing Samples",
        description:
          "Evaluate and improve sample news articles for clarity and accuracy.",
      },
      {
        title: "Ethical Dilemmas",
        description:
          "Choose appropriate actions in realistic journalism scenarios.",
      },
      {
        title: "Platform Knowledge",
        description:
          "Questions on best practices for web, social, and broadcast media.",
      },
    ],
    about:
      "Created by experienced journalists and media educators. Ideal for journalism students, content creators, and communications professionals. Certificate demonstrates ethical and technical competency.",
  },

  // UI/UX Design
  {
    id: "61",
    title: "User Experience Design & Research Certification",
    category: {
      industry: "creative-media",
      subcategory: "UI/UX Design",
    },
    difficulty: "Intermediate",
    duration: 80,
    totalQuestions: 50,
    price: 54,
    passingScore: 76,
    attemptsAllowed: 2,
    attemptsRemaining: 2,
    tags: ["UX Research", "Figma", "Popular"],
    description:
      "Evaluate user research methods, information architecture, wireframing, usability testing, and design system implementation.",
    topics: [
      "User Personas & Journeys",
      "Card Sorting & IA",
      "Wireframe Fidelity",
      "Usability Heuristics",
      "Design Handoff",
    ],
    instructions: [
      {
        title: "Case Studies",
        description:
          "Analyze product scenarios and recommend user-centered design solutions.",
      },
      {
        title: "Tool Knowledge",
        description:
          "Questions on Figma, Sketch, and user research tools workflows.",
      },
      {
        title: "Accessibility Focus",
        description:
          "Emphasis on WCAG guidelines and inclusive design practices.",
      },
    ],
    about:
      "Aligns with NN/g and UXPA certification content. Ideal for designers, product managers, and researchers. Certificate demonstrates user-centered design competency valued by tech companies.",
  },
];
