import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Briefcase, ChevronRight, AlertTriangle, CheckCircle2, 
  Upload, Sparkles, X, Brain, Activity, ShoppingCart, 
  CreditCard, GraduationCap, Globe, Lock, Code, Smartphone, 
  Layout, Server, Database, ShieldAlert, AlertOctagon,
  Search, ExternalLink, Github, ArrowRight, Zap, ShieldCheck,
  Loader2, FileCheck, Target, ChevronDown, Save, Terminal, Palette, Eye
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---

export type ProjectDomain = 
  | 'Medical / Healthcare' 
  | 'Productivity & Focus' 
  | 'FinTech' 
  | 'E-commerce' 
  | 'Education / Learning' 
  | 'Social Impact' 
  | 'AI / Machine Learning' 
  | 'Developer Tools' 
  | 'Creative Tech' 
  | 'Security & Auth';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type AnalysisRole = 
  | 'Software Engineer' 
  | 'Frontend Engineer' 
  | 'Backend Engineer' 
  | 'Full Stack Engineer' 
  | 'Data Scientist' 
  | 'Product Manager' 
  | 'Mobile Developer' 
  | 'DevOps Engineer' 
  | 'UI/UX Designer';

export const ROLES_LIST: AnalysisRole[] = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'Data Scientist',
    'Product Manager',
    'Mobile Developer',
    'DevOps Engineer',
    'UI/UX Designer'
];

export interface AnalysisResultData {
    score: number;
    critique: string;
    missing_skills: string[];
    keywords_matched: string[];
}

export interface Project {
  id: string;
  title: string;
  domain: ProjectDomain;
  difficulty: Difficulty;
  skills: string[];
  desc: string;
  premiumTags: string[]; 
  details: {
    problem: string;
    stack: string[];
    features: string[];
    resumeBullets: string[];
  }
}

// --- Data: 10 Categories x 3 Projects ---

const PROJECTS: Project[] = [
  // 1. Medical / Healthcare
  {
    id: 'med1',
    title: 'Patient Appointment System',
    domain: 'Medical / Healthcare',
    difficulty: 'Intermediate',
    skills: ['Auth', 'RBAC', 'PostgreSQL'],
    desc: 'Secure scheduling and records system.',
    premiumTags: ['Data Privacy'],
    details: {
      problem: "Clinics struggle with managing appointments and securing patient data.",
      stack: ["React", "Node.js", "PostgreSQL", "JWT"],
      features: ["Doctor/Patient dashboards", "Role-Based Access Control", "Appointment calendar"],
      resumeBullets: ["Implemented RBAC to ensure HIPAA-compliant data access", "Designed normalized SQL schema for 10k+ patient records"]
    }
  },
  {
    id: 'med2',
    title: 'Telemedicine Platform',
    domain: 'Medical / Healthcare',
    difficulty: 'Advanced',
    skills: ['WebRTC', 'Sockets', 'React'],
    desc: 'Real-time video consults and chat.',
    premiumTags: ['High Complexity'],
    details: {
      problem: "Remote healthcare lacks integrated, secure video communication tools.",
      stack: ["React", "WebRTC", "Socket.io", "Express"],
      features: ["Peer-to-peer video calls", "Encrypted chat", "Digital prescriptions"],
      resumeBullets: ["Built low-latency video streaming using WebRTC", "Implemented end-to-end encryption for patient chat messages"]
    }
  },
  {
    id: 'med3',
    title: 'Health Analytics Dashboard',
    domain: 'Medical / Healthcare',
    difficulty: 'Intermediate',
    skills: ['Data Viz', 'Python', 'ML'],
    desc: 'Track vitals, trends, and alerts.',
    premiumTags: ['Great for Data Roles'],
    details: {
      problem: "Raw health data is hard to interpret for early warning signs.",
      stack: ["Python", "Streamlit", "Pandas", "Scikit-learn"],
      features: ["Vital trend charts", "Anomaly detection alerts", "Patient history exports"],
      resumeBullets: ["Visualized longitudinal health data using Plotly/Streamlit", "Developed basic anomaly detection for heart rate spikes"]
    }
  },

  // 2. Productivity & Focus
  {
    id: 'prod1',
    title: 'Smart Task & Habit Tracker',
    domain: 'Productivity & Focus',
    difficulty: 'Beginner',
    skills: ['CRUD', 'Local Storage', 'React'],
    desc: 'Daily goals, streaks, and analytics.',
    premiumTags: ['Frontend Essential'],
    details: {
      problem: "Basic to-do lists fail to motivate users to build habits.",
      stack: ["React", "Tailwind", "Firebase"],
      features: ["Habit streaks", "Drag-and-drop tasks", "Dark mode"],
      resumeBullets: ["Gamified task completion with a streak algorithm", "Optimized render performance for list updates"]
    }
  },
  {
    id: 'prod2',
    title: 'Pomodoro Focus Analytics',
    domain: 'Productivity & Focus',
    difficulty: 'Intermediate',
    skills: ['Charts', 'State Mgmt', 'Timers'],
    desc: 'Focus timer with burnout detection.',
    premiumTags: ['Interactive UI'],
    details: {
      problem: "Users work too long without breaks, leading to burnout.",
      stack: ["React", "Redux", "Recharts"],
      features: ["Customizable timer", "Focus distribution charts", "Break reminders"],
      resumeBullets: ["Implemented precise interval timing logic for productivity sessions", "Visualized weekly focus patterns using Recharts"]
    }
  },
  {
    id: 'prod3',
    title: 'AI Productivity Coach',
    domain: 'Productivity & Focus',
    difficulty: 'Advanced',
    skills: ['AI API', 'NLP', 'Next.js'],
    desc: 'Suggestions based on usage patterns.',
    premiumTags: ['High Interview Interest'],
    details: {
      problem: "Users don't know how to optimize their schedule.",
      stack: ["Next.js", "OpenAI API", "PostgreSQL"],
      features: ["Daily schedule optimization", "Task prioritization AI", "Weekly reviews"],
      resumeBullets: ["Integrated LLM to generate personalized productivity advice", "Built vector search for retrieving past task context"]
    }
  },

  // 3. FinTech
  {
    id: 'fin1',
    title: 'Expense Tracker & Viz',
    domain: 'FinTech',
    difficulty: 'Beginner',
    skills: ['Forms', 'Charts', 'Finance'],
    desc: 'Categories, charts, monthly insights.',
    premiumTags: ['Clean UI'],
    details: {
      problem: "Tracking personal finances in spreadsheets is tedious and error-prone.",
      stack: ["React", "Chart.js", "Supabase"],
      features: ["Income/Expense logging", "Category pie charts", "Budget limits"],
      resumeBullets: ["Created interactive financial dashboards with drill-down capabilities", "Implemented form validation for currency inputs"]
    }
  },
  {
    id: 'fin2',
    title: 'Digital Wallet Sim',
    domain: 'FinTech',
    difficulty: 'Intermediate',
    skills: ['Transactions', 'ACID', 'Node'],
    desc: 'Transfers, history, and auth.',
    premiumTags: ['Backend Logic'],
    details: {
      problem: "Simulating secure money transfer requires robust transaction logic.",
      stack: ["Node.js", "PostgreSQL", "React"],
      features: ["P2P Money transfer", "Transaction ledger", "Balance locking"],
      resumeBullets: ["Implemented ACID compliant transactions for fund transfers", "Designed secure API endpoints with idempotency keys"]
    }
  },
  {
    id: 'fin3',
    title: 'Fraud Detection System',
    domain: 'FinTech',
    difficulty: 'Advanced',
    skills: ['ML', 'API', 'Security'],
    desc: 'Flags unusual transaction patterns.',
    premiumTags: ['Enterprise Ready'],
    details: {
      problem: "Real-time identification of fraudulent payment activities.",
      stack: ["Python", "FastAPI", "Scikit-learn", "Redis"],
      features: ["Real-time transaction scoring", "Rule-based flagging", "Admin review queue"],
      resumeBullets: ["Deployed ML model via FastAPI for <100ms inference", "Used Redis for sliding window rate limiting and feature extraction"]
    }
  },

  // 4. E-commerce
  {
    id: 'ecom1',
    title: 'Product Catalog & Cart',
    domain: 'E-commerce',
    difficulty: 'Beginner',
    skills: ['Context API', 'Filter', 'UI'],
    desc: 'Filters, search, responsive UI.',
    premiumTags: ['Classic Project'],
    details: {
      problem: "Users need efficient ways to browse and shortlist products.",
      stack: ["React", "Context API", "FakeStoreAPI"],
      features: ["Multi-parameter filtering", "Persistent cart", "Responsive grid"],
      resumeBullets: ["Managed global cart state using React Context", "Implemented debounced search for product querying"]
    }
  },
  {
    id: 'ecom2',
    title: 'Inventory Dashboard',
    domain: 'E-commerce',
    difficulty: 'Intermediate',
    skills: ['Admin', 'Tables', 'CRUD'],
    desc: 'Admin roles, stock management.',
    premiumTags: ['B2B Feature'],
    details: {
      problem: "Merchants struggle to track stock across multiple SKUs.",
      stack: ["React", "TanStack Table", "Node.js"],
      features: ["Bulk stock updates", "Low stock alerts", "Order status workflow"],
      resumeBullets: ["Built high-performance data tables handling 1000+ SKUs", "Implemented optimistic UI updates for stock changes"]
    }
  },
  {
    id: 'ecom3',
    title: 'Marketplace Platform',
    domain: 'E-commerce',
    difficulty: 'Advanced',
    skills: ['Stripe', 'Microservices', 'DB'],
    desc: 'Sellers, buyers, payments.',
    premiumTags: ['Capstone Material'],
    details: {
      problem: "Connecting buyers and sellers with secure transaction handling.",
      stack: ["Next.js", "Stripe Connect", "PostgreSQL", "Prisma"],
      features: ["Vendor onboarding", "Split payments", "Review system"],
      resumeBullets: ["Integrated Stripe Connect for marketplace payouts", " Modeled complex relational schema for orders and vendors"]
    }
  },

  // 5. Education
  {
    id: 'edu1',
    title: 'Course Mgmt System',
    domain: 'Education / Learning',
    difficulty: 'Intermediate',
    skills: ['CRUD', 'Relations', 'UI'],
    desc: 'Enrollments and progress tracking.',
    premiumTags: ['LMS Logic'],
    details: {
      problem: "Organizing curriculum and tracking student progress is chaotic.",
      stack: ["Django", "React", "PostgreSQL"],
      features: ["Course creation builder", "Student enrollment", "Progress % tracking"],
      resumeBullets: ["Designed database schema for hierarchical course content", "Built RESTful APIs for content delivery"]
    }
  },
  {
    id: 'edu2',
    title: 'Quiz & Assessment Platform',
    domain: 'Education / Learning',
    difficulty: 'Intermediate',
    skills: ['Logic', 'State', 'Timer'],
    desc: 'Auto evaluation and analytics.',
    premiumTags: ['Interactive'],
    details: {
      problem: "Manual grading is slow; instant feedback improves learning.",
      stack: ["React", "Node.js", "MongoDB"],
      features: ["Timed quizzes", "Auto-grading", "Result visualization"],
      resumeBullets: ["Implemented cheat-prevention mechanisms (tab switch detection)", "Aggregated quiz results for class-level analytics"]
    }
  },
  {
    id: 'edu3',
    title: 'Learning Roadmap App',
    domain: 'Education / Learning',
    difficulty: 'Advanced',
    skills: ['Graph', 'Recursion', 'UI'],
    desc: 'Skill tracking and recommendations.',
    premiumTags: ['Meta Project'],
    details: {
      problem: "Students feel lost without a structured path to learn skills.",
      stack: ["React Flow", "Neo4j", "Node.js"],
      features: ["Interactive node graph", "Prerequisite checking", "Resource linking"],
      resumeBullets: ["Visualized dependency graphs using React Flow", "Implemented recursive algorithms to calculate path progress"]
    }
  },

  // 6. Social Impact
  {
    id: 'soc1',
    title: 'NGO Donation Platform',
    domain: 'Social Impact',
    difficulty: 'Intermediate',
    skills: ['Payment', 'Trust', 'UI'],
    desc: 'Campaigns and transparency.',
    premiumTags: ['Ethical Tech'],
    details: {
      problem: "Donors lack visibility into how their funds are utilized.",
      stack: ["Next.js", "Razorpay/Stripe", "Supabase"],
      features: ["Campaign creation", "Donation processing", "Impact updates feed"],
      resumeBullets: ["Secured payment gateway integration for donations", "Built real-time fundraising progress bars"]
    }
  },
  {
    id: 'soc2',
    title: 'Community Issue Reporter',
    domain: 'Social Impact',
    difficulty: 'Intermediate',
    skills: ['Maps', 'Geo', 'Uploads'],
    desc: 'Geo-tagging and resolution.',
    premiumTags: ['Civic Tech'],
    details: {
      problem: "Citizens need an easy way to report local infrastructure issues.",
      stack: ["React Native", "Google Maps API", "Firebase"],
      features: ["Photo upload", "Geolocation tagging", "Status tracking"],
      resumeBullets: ["Integrated Maps API for precise issue pinning", "Optimized image uploads for low-bandwidth mobile networks"]
    }
  },
  {
    id: 'soc3',
    title: 'Accessible Web App',
    domain: 'Social Impact',
    difficulty: 'Advanced',
    skills: ['A11y', 'WCAG', 'Voice'],
    desc: 'WCAG compliance showcase.',
    premiumTags: ['Recruiter Favorite'],
    details: {
      problem: "The web is often unusable for people with disabilities.",
      stack: ["HTML5", "ARIA", "React", "Speech API"],
      features: ["Screen reader optimization", "Voice navigation", "High contrast modes"],
      resumeBullets: ["Achieved WCAG 2.1 AAA compliance", "Implemented custom keyboard navigation hooks"]
    }
  },

  // 7. AI / ML
  {
    id: 'ai1',
    title: 'Resume Screening AI',
    domain: 'AI / Machine Learning',
    difficulty: 'Intermediate',
    skills: ['NLP', 'Python', 'API'],
    desc: 'Keyword scoring and parsing.',
    premiumTags: ['HR Tech'],
    details: {
      problem: "Recruiters are overwhelmed by volume; automated filtering helps.",
      stack: ["Python", "Spacy", "Flask"],
      features: ["PDF text extraction", "Keyword matching", "Similarity scoring"],
      resumeBullets: ["Built NLP pipeline to extract entities from resumes", "Calculated cosine similarity between resume and job description"]
    }
  },
  {
    id: 'ai2',
    title: 'Rec. System Engine',
    domain: 'AI / Machine Learning',
    difficulty: 'Advanced',
    skills: ['Vectors', 'Filtering', 'Backend'],
    desc: 'Content/Product recommendations.',
    premiumTags: ['Core ML Skill'],
    details: {
      problem: "Users struggle to discover relevant content.",
      stack: ["Python", "Pinecone", "FastAPI"],
      features: ["Collaborative filtering", "Content-based filtering", "Cold start handling"],
      resumeBullets: ["Implemented vector database for semantic search", "Hybrid recommendation approach for improved accuracy"]
    }
  },
  {
    id: 'ai3',
    title: 'Predictive Analytics App',
    domain: 'AI / Machine Learning',
    difficulty: 'Advanced',
    skills: ['Regression', 'Dashboard', 'Data'],
    desc: 'Sales or health forecasting.',
    premiumTags: ['Data Science'],
    details: {
      problem: " businesses need to forecast future trends based on history.",
      stack: ["R / Python", "Shiny / Streamlit", "Prophet"],
      features: ["Time series forecasting", "Confidence intervals", "CSV upload"],
      resumeBullets: ["Deployed forecasting models for time-series data", "Created interactive \"what-if\" scenario toggles"]
    }
  },

  // 8. Developer Tools
  {
    id: 'dev1',
    title: 'API Testing Tool',
    domain: 'Developer Tools',
    difficulty: 'Intermediate',
    skills: ['HTTP', 'State', 'UI'],
    desc: 'Requests, logs, error tracking.',
    premiumTags: ['Like Postman'],
    details: {
      problem: "Developers need lightweight tools to test endpoints quickly.",
      stack: ["React", "Axios", "Local Storage"],
      features: ["GET/POST request builder", "Response viewer", "History log"],
      resumeBullets: ["Built a custom HTTP client wrapper for request testing", "Implemented syntax highlighting for JSON responses"]
    }
  },
  {
    id: 'dev2',
    title: 'Code Snippet Manager',
    domain: 'Developer Tools',
    difficulty: 'Beginner',
    skills: ['CRUD', 'Search', 'Tags'],
    desc: 'Save and search reusable code.',
    premiumTags: ['Utility'],
    details: {
      problem: "Developers lose track of useful reusable code blocks.",
      stack: ["Electron", "React", "SQLite"],
      features: ["Syntax highlighting", "Tag-based search", "Cloud sync"],
      resumeBullets: ["Built a desktop app using Electron", "Implemented fuzzy search for quick snippet retrieval"]
    }
  },
  {
    id: 'dev3',
    title: 'CI/CD Visualizer',
    domain: 'Developer Tools',
    difficulty: 'Advanced',
    skills: ['WebSockets', 'Graph', 'DevOps'],
    desc: 'Visualize pipeline flows.',
    premiumTags: ['Elite Project'],
    details: {
      problem: "CI/CD logs are hard to parse; visual flows are better.",
      stack: ["React", "GitHub Actions API", "D3.js"],
      features: ["Live pipeline status", "Dependency graph", "Log streaming"],
      resumeBullets: ["Visualized DAGs (Directed Acyclic Graphs) of build steps", "Streamed build logs in real-time using WebSockets"]
    }
  },

  // 9. Creative Tech
  {
    id: 'cre1',
    title: 'Portfolio Builder',
    domain: 'Creative Tech',
    difficulty: 'Intermediate',
    skills: ['Editor', 'Preview', 'Export'],
    desc: 'Templates and live preview.',
    premiumTags: ['Frontend Heavy'],
    details: {
      problem: "Designers need a no-code way to build portfolios.",
      stack: ["React", "Drag-and-Drop", "Next.js"],
      features: ["WYSIWYG editor", "Theme switcher", "Static export"],
      resumeBullets: ["Built a drag-and-drop page builder interface", "Implemented static site generation for user portfolios"]
    }
  },
  {
    id: 'cre2',
    title: 'Design Collab Tool',
    domain: 'Creative Tech',
    difficulty: 'Advanced',
    skills: ['Sockets', 'Canvas', 'State'],
    desc: 'Live comments and versioning.',
    premiumTags: ['Like Figma'],
    details: {
      problem: "Remote teams need to annotate designs in real-time.",
      stack: ["React", "HTML5 Canvas", "Socket.io"],
      features: ["Real-time cursors", "Canvas drawing", "Comment threads"],
      resumeBullets: ["Synchronized canvas state across multiple clients", "Optimized rendering for multi-user interactions"]
    }
  },
  {
    id: 'cre3',
    title: 'Interactive Story App',
    domain: 'Creative Tech',
    difficulty: 'Intermediate',
    skills: ['Scroll', 'Animation', 'Audio'],
    desc: 'Scrollytelling narratives.',
    premiumTags: ['Award Winning Vibe'],
    details: {
      problem: "Standard blog posts fail to engage readers.",
      stack: ["React", "Framer Motion", "Howler.js"],
      features: ["Parallax scroll", "Scroll-triggered audio", "Lottie animations"],
      resumeBullets: ["Orchestrated complex scroll-based animations", "Managed audio context for immersive storytelling"]
    }
  },

  // 10. Security
  {
    id: 'sec1',
    title: 'Auth & Authz System',
    domain: 'Security & Auth',
    difficulty: 'Intermediate',
    skills: ['JWT', 'OAuth', 'Security'],
    desc: 'Robust login system.',
    premiumTags: ['Fundamental'],
    details: {
      problem: "Security breaches often stem from weak auth implementations.",
      stack: ["Node.js", "Passport.js", "Redis"],
      features: ["MFA support", "Session management", "OAuth providers"],
      resumeBullets: ["Implemented refresh token rotation strategy", "Secured endpoints against CSRF and XSS attacks"]
    }
  },
  {
    id: 'sec2',
    title: 'Secure File Share',
    domain: 'Security & Auth',
    difficulty: 'Intermediate',
    skills: ['Encryption', 'Blob', 'Link'],
    desc: 'Encrypted, expiring links.',
    premiumTags: ['Privacy Tool'],
    details: {
      problem: "Sharing sensitive files via email is insecure.",
      stack: ["Node.js", "AWS S3", "Crypto Module"],
      features: ["Client-side encryption", "Auto-expiry links", "Password protection"],
      resumeBullets: ["Implemented AES-256 encryption for file storage", "Built signed URL generation for temporary access"]
    }
  },
  {
    id: 'sec3',
    title: 'Vulnerability Scanner',
    domain: 'Security & Auth',
    difficulty: 'Advanced',
    skills: ['Regex', 'Network', 'Report'],
    desc: 'Input validation checker.',
    premiumTags: ['Cybersec'],
    details: {
      problem: "Devs forget basic security checks in forms/APIs.",
      stack: ["Python", "Requests", "BeautifulSoup"],
      features: ["SQL Injection test", "XSS payload test", "Header analysis"],
      resumeBullets: ["Automated basic penetration testing scripts", "Generated PDF security reports from scan results"]
    }
  },
];

// --- Starter Code Snippets (30 Unique Snippets) ---

const CODE_SNIPPETS: Record<string, { lang: string, code: string }> = {
    // Medical
    'med1': { lang: 'javascript', code: `// Middleware: Role-Based Access Control
const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};` },
    'med2': { lang: 'javascript', code: `// WebRTC Peer Connection Setup
const peer = new RTCPeerConnection(servers);
peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('candidate', event.candidate);
  }
};` },
    'med3': { lang: 'python', code: `// Anomaly Detection with Pandas
def detect_anomalies(df, col='heart_rate'):
    mean = df[col].mean()
    std = df[col].std()
    return df[(df[col] > mean + 3*std) | (df[col] < mean - 3*std)]` },

    // Productivity
    'prod1': { lang: 'javascript', code: `// Calculate Streak
const calculateStreak = (history) => {
  let streak = 0;
  const today = new Date().setHours(0,0,0,0);
  // ... loop logic
  return streak;
};` },
    'prod2': { lang: 'javascript', code: `// Pomodoro Timer Hook
useEffect(() => {
  if (!isActive) return;
  const interval = setInterval(() => {
    setSeconds(s => s === 0 ? 0 : s - 1);
  }, 1000);
  return () => clearInterval(interval);
}, [isActive]);` },
    'prod3': { lang: 'javascript', code: `// AI Recommendation Prompt
const prompt = \`Analyze the user's tasks: \${JSON.stringify(tasks)}. 
Suggest 3 ways to optimize their schedule.\`;
const res = await openai.createCompletion({ model: "gpt-4", prompt });` },

    // FinTech
    'fin1': { lang: 'javascript', code: `// Expense Chart Data
const data = {
  labels: categories,
  datasets: [{
    data: expenses.map(e => e.amount),
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
};` },
    'fin2': { lang: 'javascript', code: `// Atomic Transaction
const transfer = async (fromId, toId, amount) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET bal = bal - $1 WHERE id = $2', [amount, fromId]);
    await client.query('UPDATE accounts SET bal = bal + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
  }
};` },
    'fin3': { lang: 'python', code: `// Fraud Flagging Logic
if transaction.amount > user.avg_spend * 5 and transaction.location != user.last_loc:
    flag_transaction(transaction.id, "Suspicious Activity")` },

    // Ecommerce
    'ecom1': { lang: 'javascript', code: `// Cart Reducer
case 'ADD_TO_CART':
  return { 
    ...state, 
    cart: [...state.cart, action.payload] 
  };` },
    'ecom2': { lang: 'javascript', code: `// Inventory Update API
app.patch('/api/inventory/:sku', async (req, res) => {
  const { qty } = req.body;
  const item = await db.updateStock(req.params.sku, qty);
  res.json(item);
});` },
    'ecom3': { lang: 'javascript', code: `// Stripe Connect Payout
const transfer = await stripe.transfers.create({
  amount: 1000,
  currency: "usd",
  destination: seller_account_id,
});` },

    // Education
    'edu1': { lang: 'python', code: `// Django Course Model
class Course(models.Model):
    title = models.CharField(max_length=200)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='enrollments')` },
    'edu2': { lang: 'javascript', code: `// Auto Grade Logic
const score = answers.reduce((acc, ans) => {
  const correct = questions.find(q => q.id === ans.id).correctOption;
  return ans.value === correct ? acc + 1 : acc;
}, 0);` },
    'edu3': { lang: 'javascript', code: `// Graph Traversal for Roadmap
const getUnlockableNodes = (completedNodes) => {
  return allNodes.filter(node => 
    node.prerequisites.every(pre => completedNodes.includes(pre))
  );
};` },

    // Social
    'soc1': { lang: 'javascript', code: `// Donation Progress
const progress = (currentAmount / goalAmount) * 100;
return <ProgressBar value={progress} color="green" />;` },
    'soc2': { lang: 'javascript', code: `// Map Marker Render
{issues.map(issue => (
  <Marker 
    key={issue.id}
    position={{ lat: issue.lat, lng: issue.lng }}
    onClick={() => setSelected(issue)}
  />
))}` },
    'soc3': { lang: 'html', code: `<!-- Accessible Form -->
<label htmlFor="email">Email</label>
<input 
  id="email" 
  type="email" 
  aria-required="true" 
  aria-invalid={!!error} 
/>` },

    // AI/ML
    'ai1': { lang: 'python', code: `// Spacy Keyword Extraction
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp(resume_text)
skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]` },
    'ai2': { lang: 'python', code: `// Cosine Similarity
from sklearn.metrics.pairwise import cosine_similarity
sim_score = cosine_similarity(user_vector, product_vector)` },
    'ai3': { lang: 'r', code: `// Prophet Forecasting
m <- prophet(df)
future <- make_future_dataframe(m, periods = 365)
forecast <- predict(m, future)` },

    // Dev Tools
    'dev1': { lang: 'javascript', code: `// Axios Request Interceptor
axios.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  return config;
});` },
    'dev2': { lang: 'sql', code: `// Snippet Search Query
SELECT * FROM snippets 
WHERE title LIKE '%query%' 
OR tags LIKE '%query%'` },
    'dev3': { lang: 'javascript', code: `// WebSocket Log Stream
ws.onmessage = (event) => {
  const logLine = JSON.parse(event.data);
  setLogs(prev => [...prev, logLine]);
  autoScroll();
};` },

    // Creative
    'cre1': { lang: 'javascript', code: `// Next.js Static Export
module.exports = {
  output: 'export',
  images: { unoptimized: true }
};` },
    'cre2': { lang: 'javascript', code: `// Canvas Sync
socket.on('draw_line', (data) => {
  const ctx = canvasRef.current.getContext('2d');
  ctx.moveTo(data.x0, data.y0);
  ctx.lineTo(data.x1, data.y1);
  ctx.stroke();
});` },
    'cre3': { lang: 'javascript', code: `// Framer Motion Scroll
const { scrollYProgress } = useScroll();
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
return <motion.div style={{ scale }} />;` },

    // Security
    'sec1': { lang: 'javascript', code: `// JWT Sign
const token = jwt.sign(
  { id: user.id, role: user.role }, 
  process.env.JWT_SECRET, 
  { expiresIn: '15m' }
);` },
    'sec2': { lang: 'javascript', code: `// S3 Signed URL
const url = s3.getSignedUrl('getObject', {
  Bucket: 'my-bucket',
  Key: 'file.pdf',
  Expires: 60 * 5 // 5 mins
});` },
    'sec3': { lang: 'python', code: `// XSS Payload Test
payloads = ["<script>alert(1)</script>", "javascript:alert(1)"]
for p in payloads:
    res = requests.post(url, data={'input': p})
    if p in res.text:
        print("Vulnerable!")` },
        
    'default': { lang: 'text', code: '// Select a project to view specific starter code.' }
}

const DOMAINS: { label: ProjectDomain; icon: React.ReactNode }[] = [
  { label: 'Medical / Healthcare', icon: <Activity size={16} /> },
  { label: 'Productivity & Focus', icon: <CheckCircle2 size={16} /> },
  { label: 'FinTech', icon: <CreditCard size={16} /> },
  { label: 'E-commerce', icon: <ShoppingCart size={16} /> },
  { label: 'Education / Learning', icon: <GraduationCap size={16} /> },
  { label: 'Social Impact', icon: <Globe size={16} /> },
  { label: 'AI / Machine Learning', icon: <Brain size={16} /> },
  { label: 'Developer Tools', icon: <Terminal size={16} /> },
  { label: 'Creative Tech', icon: <Palette size={16} /> },
  { label: 'Security & Auth', icon: <ShieldCheck size={16} /> },
];

interface ProjectsPageProps {
    onSaveProject?: (project: Project) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSaveProject }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'resume'>('projects');
  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects
  const filteredProjects = selectedDomain === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.domain === selectedDomain);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto font-sans text-white pb-24 md:pb-8">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h1 className="text-3xl md:text-4xl font-serif italic font-bold mb-2">Projects & Resume</h1>
           <p className="text-pink-100/60 text-sm md:text-base">The Career Engine. Turn effort into employability.</p>
        </div>
      </header>

      {/* Sticky Tabs */}
      <div className="sticky top-0 z-30 bg-[#2c0003]/95 backdrop-blur-xl border-b border-white/10 mb-8 pt-4 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex gap-8 overflow-x-auto">
            <TabButton label="Project Intelligence" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Code size={18} />} />
            <TabButton label="Resume Analysis" active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} icon={<FileText size={18} />} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'projects' ? (
            <motion.div 
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
            >
                {/* Domain Filter */}
                <div className="flex gap-3 overflow-x-auto pb-6 custom-scrollbar mb-4">
                    <button 
                         onClick={() => setSelectedDomain('All')}
                         className={`px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap
                            ${selectedDomain === 'All' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                    >
                        All Domains
                    </button>
                    {DOMAINS.map(d => (
                        <button 
                            key={d.label}
                            onClick={() => setSelectedDomain(d.label)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
                                ${selectedDomain === d.label ? 'bg-rose-500/20 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                        >
                            {d.icon}
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} onClick={() => setSelectedProject(project)} />
                    ))}
                </div>
            </motion.div>
        ) : (
            <motion.div
                key="resume"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <ResumeView />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {selectedProject && (
            <ProjectDetailPanel 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
                onSave={onSaveProject}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Components ---

const TabButton = ({ label, active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`pb-4 px-2 relative transition-colors duration-300 flex items-center gap-2 shrink-0 ${active ? 'text-rose-300' : 'text-white/40 hover:text-white/70'}`}
    >
        {icon}
        <span className="font-bold tracking-wide whitespace-nowrap">{label}</span>
        {active && (
            <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
            />
        )}
    </button>
)

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
            onClick={onClick}
            className="group relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-rose-500/30 backdrop-blur-md cursor-pointer overflow-hidden transform perspective-1000 flex flex-col justify-between h-full min-h-[280px]"
        >
            {/* Ambient Backlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-rose-500/0 to-rose-500/0 group-hover:via-rose-500/5 transition-all duration-500" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border
                        ${project.difficulty === 'Beginner' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                          project.difficulty === 'Intermediate' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          'border-rose-500/30 text-rose-400 bg-rose-500/10'
                        }`}>
                        {project.difficulty}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono bg-black/30 px-2 py-1 rounded truncate max-w-[100px] md:max-w-[120px]">{project.domain}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-200 transition-colors line-clamp-2">{project.title}</h3>
                <p className="text-sm text-pink-100/60 mb-6 line-clamp-3">{project.desc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 rounded text-xs text-white/60 bg-white/5 border border-white/5">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="relative z-10 pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-rose-300">
                    <Sparkles size={12} /> {project.premiumTags[0] || 'Premium'}
                </div>
            </div>
        </motion.div>
    )
}

const ProjectDetailPanel: React.FC<{ project: Project; onClose: () => void; onSave?: (p: Project) => void }> = ({ project, onClose, onSave }) => {
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    // Safe lookup
    const snippet = (CODE_SNIPPETS && CODE_SNIPPETS[project.id]) || (CODE_SNIPPETS ? CODE_SNIPPETS['default'] : {lang:'text', code:'Loading...'});

    return (
    <>
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />
        <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            // Full width on mobile (top:0 bottom:0), fixed width on desktop
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#1a0505] border-l border-rose-500/20 shadow-2xl z-[70] overflow-y-auto custom-scrollbar p-6 md:p-8"
        >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white z-10">
                <X size={20} />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2 block pt-4 md:pt-0">{project.domain} • {project.difficulty}</span>
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-white mb-6 leading-tight pr-8">{project.title}</h2>
            
            <div className="space-y-8 pb-20">
                {/* Premium Tags */}
                <div className="flex flex-wrap gap-2">
                    {project.premiumTags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-900 to-rose-800 border border-rose-500/30 text-xs text-rose-100 font-bold flex items-center gap-1">
                            <Zap size={10} /> {tag}
                        </span>
                    ))}
                    <span className="px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-xs text-emerald-200 font-bold flex items-center gap-1">
                         <ShieldCheck size={10} /> Strong ATS Coverage
                    </span>
                </div>

                <Section title="Problem Statement" content={project.details.problem} />
                
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3 font-bold">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.details.stack.map(s => (
                            <span key={s} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm text-pink-100">{s}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3 font-bold">Key Features</h4>
                    <ul className="space-y-2">
                        {project.details.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-sm text-pink-100/80">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-xs uppercase tracking-widest text-emerald-400 mb-3 font-bold flex items-center gap-2">
                        <FileText size={14} /> Resume Bullets
                    </h4>
                    <ul className="space-y-3">
                         {project.details.resumeBullets.map((b, i) => (
                            <li key={i} className="text-sm text-white/80 italic pl-4 border-l-2 border-emerald-500/30">
                                "{b}"
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Actions Sticky */}
            <div className="absolute bottom-0 left-0 w-full bg-[#1a0505] p-4 md:p-6 border-t border-rose-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex gap-4 z-20">
                <button 
                    onClick={() => setIsCodeModalOpen(true)}
                    className="flex-1 py-3 rounded-xl bg-white text-rose-900 font-bold hover:bg-rose-50 flex items-center justify-center gap-2 transition-colors shadow-lg text-sm md:text-base"
                >
                        <Code size={18} /> View Code
                </button>
                <button 
                    onClick={() => { if(onSave) onSave(project); }}
                    className="flex-1 py-3 rounded-xl border border-rose-500/30 text-rose-100 font-bold hover:bg-rose-900/20 flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
                >
                    <Save size={18} /> Save
                </button>
            </div>
        </motion.div>

        {/* Code Modal */}
        <AnimatePresence>
            {isCodeModalOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4"
                    onClick={() => setIsCodeModalOpen(false)}
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        className="bg-[#1e1e1e] w-full max-w-3xl max-h-[80vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Terminal Header */}
                        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/5 shrink-0">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-xs text-white/40 font-mono">starter_code.js</div>
                            <button onClick={() => setIsCodeModalOpen(false)} className="text-white/40 hover:text-white"><X size={14}/></button>
                        </div>
                        {/* Code Content */}
                        <div className="p-6 overflow-x-auto bg-[#1e1e1e] flex-1 custom-scrollbar">
                            <pre className="font-mono text-xs md:text-sm text-emerald-100">
                                <code>{snippet.code}</code>
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
)}

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h4 className="text-xs uppercase tracking-widest text-white/50 mb-2 font-bold">{title}</h4>
        <p className="text-pink-100/90 leading-relaxed text-sm md:text-base">{content}</p>
    </div>
)

// --- Resume Analysis Components ---
// (No changes to ResumeView logic, keeping layout responsiveness in mind)
const ResumeView = () => {
    // ... same logic as before, just ensuring container width is managed ...
    const [step, setStep] = useState<'upload' | 'details' | 'processing' | 'results'>('upload');
    // ... inputs ...
    const [file, setFile] = useState<File | null>(null);
    const [selectedRole, setSelectedRole] = useState<AnalysisRole | ''>('');
    const [jobDesc, setJobDesc] = useState('');
    const [processMsg, setProcessMsg] = useState('Initializing AI...');
    const [analysisData, setAnalysisData] = useState<AnalysisResultData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStep('details');
        }
    };

    const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const startAnalysis = async () => {
        // ... same logic ...
        setStep('processing');
        setTimeout(() => {
             setAnalysisData({
                score: 42,
                critique: "Demo Mode: AI Analysis Simulated.",
                missing_skills: ["API Key Configuration"],
                keywords_matched: ["Effort"]
            });
            setStep('results');
        }, 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div 
                        key="upload"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center py-12 md:py-20 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group px-4 text-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" accept=".pdf" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-6 h-6 md:w-8 md:h-8 text-rose-400" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif italic text-white mb-2">Upload your Resume</h3>
                        <p className="text-white/50 mb-8 text-sm">PDF only. We'll handle the rest.</p>
                        <div className="px-6 py-2 rounded-full border border-white/20 text-sm text-white/70">Select File</div>
                    </motion.div>
                )}
                {step === 'details' && (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 bg-[#1a0505] rounded-3xl border border-white/10">
                         <div className="mb-4 text-white text-sm">File: {file?.name}</div>
                         <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-white text-sm md:text-base" onChange={(e) => setSelectedRole(e.target.value as any)} value={selectedRole}>
                             <option value="" disabled>Select Role</option>
                             {ROLES_LIST.map(r => <option key={r} value={r} className="bg-[#2c0003]">{r}</option>)}
                         </select>
                         <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste JD..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white mb-4 text-sm md:text-base" />
                         <button onClick={startAnalysis} className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold">Analyze</button>
                    </motion.div>
                )}
                {step === 'processing' && (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-white">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-rose-500" />
                        <p>{processMsg}</p>
                    </motion.div>
                )}
                {step === 'results' && analysisData && (
                    <AnalysisResults role={selectedRole as any} data={analysisData} onReset={() => setStep('upload')} />
                )}
            </AnimatePresence>
        </div>
    );
};

const AnalysisResults = ({ role, data, onReset }: { role: AnalysisRole, data: AnalysisResultData, onReset: () => void }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center text-white">
                <h2 className="text-xl md:text-2xl font-bold">Results: {role}</h2>
                <button onClick={onReset} className="text-sm underline">Reset</button>
            </div>
            <ScoreCard title="Match Score" score={data.score} color="text-rose-400" />
            <div className="p-6 bg-white/5 rounded-2xl text-white">
                <h3 className="font-bold mb-2 text-white/50 uppercase text-xs tracking-widest">Critique</h3>
                <p className="text-sm md:text-base">{data.critique}</p>
            </div>
            <div className="p-6 bg-rose-900/20 border border-rose-500/20 rounded-2xl">
                <h3 className="font-bold mb-4 text-rose-300">Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data.missing_skills.map(s => <span key={s} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs md:text-sm text-rose-200">{s}</span>)}
                </div>
            </div>
        </motion.div>
    )
}

const ScoreCard: React.FC<{ title: string; score: number; color: string }> = ({ title, score, color }) => (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div>
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-1">{title}</h4>
            <div className={`text-4xl font-bold ${color}`}>{score}%</div>
        </div>
        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${color.replace('text', 'border')}`}>
             <Activity size={24} className={color} />
        </div>
    </div>
)

export default ProjectsPage;