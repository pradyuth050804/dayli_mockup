import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Upload, BarChart3, Sparkles, ArrowRight, ArrowLeft, Check, Layers, Edit3, AlertTriangle, FileText, Search, FlaskConical, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  registerUser,
  createClient,
  getUser,
  getClients,
  uploadReport,
  analyseReport,
  ParameterData,
  ReadFileResponse,
  Report,
} from '../lib/api';

const steps = [
  { id: 1, icon: Brain, title: 'Biology Profile', desc: 'Tell us about yourself' },
  { id: 2, icon: Upload, title: 'Biomarker Upload', desc: 'Upload your lab reports' },
  { id: 3, icon: Edit3, title: 'Review Data', desc: 'Verify extracted markers' },
  { id: 4, icon: BarChart3, title: 'AI Analysis', desc: 'Processing your data' },
  { id: 5, icon: Sparkles, title: 'Your Results', desc: 'Detailed analysis' },
];

const healthGoals = [
  'Lose Weight', 'Build Muscle', 'Improve Energy', 'Better Sleep',
  'Reduce Stress', 'Gut Health', 'Healthy Ageing', 'Hormonal Balance',
  'Immune Support', 'Brain Function', 'Heart Health', 'Joint Health',
];

const healthConditions = [
  'Diabetes / Pre-diabetes', 'Thyroid Disorders', 'PCOS / Hormonal Issues',
  'High Blood Pressure', 'High Cholesterol', 'Digestive Issues',
  'Anxiety / Depression', 'Autoimmune Conditions', 'None of the above',
];

export default function CompanionAIPage() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress tracking for extraction & analysis
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionPhase, setExtractionPhase] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const extractionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analysisTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const extractionPhases = [
    { icon: FileText, label: 'Reading PDF pages...' },
    { icon: Search, label: 'Detecting biomarker values...' },
    { icon: FlaskConical, label: 'Matching to reference ranges...' },
    { icon: ClipboardCheck, label: 'Finalizing extraction...' },
  ];

  const analysisPhases = [
    { icon: Search, label: 'Scoring blood markers against optimal ranges' },
    { icon: BarChart3, label: 'Calculating panel health scores' },
    { icon: Brain, label: 'Generating possible deviation reasons' },
    { icon: Edit3, label: 'Writing clinical summary notes' },
  ];

  // Start extraction progress simulation
  const startExtractionProgress = () => {
    setExtractionProgress(0);
    setExtractionPhase(0);
    let progress = 0;
    extractionTimerRef.current = setInterval(() => {
      progress += Math.random() * 3 + 0.5;
      if (progress > 92) progress = 92; // Cap at 92% until real completion
      setExtractionProgress(progress);
      setExtractionPhase(Math.min(Math.floor(progress / 25), 3));
    }, 300);
  };

  const completeExtractionProgress = () => {
    if (extractionTimerRef.current) clearInterval(extractionTimerRef.current);
    setExtractionProgress(100);
    setExtractionPhase(3);
  };

  // Start analysis progress simulation
  const startAnalysisProgress = () => {
    setAnalysisProgress(0);
    setAnalysisPhase(0);
    let progress = 0;
    analysisTimerRef.current = setInterval(() => {
      progress += Math.random() * 2 + 0.3;
      if (progress > 90) progress = 90; // Cap at 90% until real completion
      setAnalysisProgress(progress);
      setAnalysisPhase(Math.min(Math.floor(progress / 25), 3));
    }, 400);
  };

  const completeAnalysisProgress = () => {
    if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
    setAnalysisProgress(100);
    setAnalysisPhase(3);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (extractionTimerRef.current) clearInterval(extractionTimerRef.current);
      if (analysisTimerRef.current) clearInterval(analysisTimerRef.current);
    };
  }, []);

  // Survey state
  const [survey, setSurvey] = useState({
    age: '',
    gender: '',
    weight_kg: '',
    height_cm: '',
    activity_level: '',
    diet_type: '',
    health_goals: [] as string[],
    health_conditions: [] as string[],
    sleep_hours: '',
    stress_level: 5,
    smoking: false,
    alcohol_frequency: '',
  });

  // Backend integration state
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [biomarkerFile, setBiomarkerFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ReadFileResponse | null>(null);
  const [editableParams, setEditableParams] = useState<ParameterData[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // ─── On mount: detect returning user ───
  useEffect(() => {
    const checkReturningUser = async () => {
      if (!session || !user) {
        setInitializing(false);
        return;
      }
      try {
        const token = session.access_token;
        // Check if user is registered in backend
        const userRes = await getUser(token);
        if (userRes.data) {
          // User exists — check for existing clients
          const clientsRes = await getClients(token);
          const clients = clientsRes.data?.content || [];
          if (clients.length > 0) {
            // Returning user with existing client — skip survey
            setClientId(clients[0].id);
            setClientName(clients[0].name);
            setIsReturningUser(true);
            setStep(2);
          } else {
            // User registered but no clients — show survey
            setStep(1);
          }
        } else {
          // New user — show survey
          setStep(1);
        }
      } catch {
        // API unreachable or error — default to survey
        setStep(1);
      } finally {
        setInitializing(false);
      }
    };
    checkReturningUser();
  }, [session, user]);

  const toggleGoal = (goal: string) => {
    setSurvey(s => ({
      ...s,
      health_goals: s.health_goals.includes(goal)
        ? s.health_goals.filter(g => g !== goal)
        : [...s.health_goals, goal],
    }));
  };

  const toggleCondition = (cond: string) => {
    setSurvey(s => ({
      ...s,
      health_conditions: s.health_conditions.includes(cond)
        ? s.health_conditions.filter(c => c !== cond)
        : [...s.health_conditions, cond],
    }));
  };

  // ─── Step 1: Submit survey + register user + create client in backend ───

  const submitSurvey = async () => {
    if (!user || !session) { navigate('/auth'); return; }
    setLoading(true);
    setError(null);

    try {
      // Save survey to Supabase (ignore errors — non-critical)
      try {
        await supabase.from('health_surveys').insert({
          user_id: user.id,
          age: parseInt(survey.age),
          gender: survey.gender,
          weight_kg: parseFloat(survey.weight_kg),
          height_cm: parseFloat(survey.height_cm),
          activity_level: survey.activity_level,
          diet_type: survey.diet_type,
          health_goals: survey.health_goals,
          health_conditions: survey.health_conditions,
          sleep_hours: parseFloat(survey.sleep_hours),
          stress_level: survey.stress_level,
          smoking: survey.smoking,
          alcohol_frequency: survey.alcohol_frequency,
        });
      } catch {
        // Non-critical — continue
      }

      const token = session.access_token;

      // Register user in backend (ignore "already exists")
      try {
        await registerUser(token, user.email || '');
      } catch {
        // User may already be registered — that's fine
      }

      // Create a client record in the backend (auto-recovers from duplicates)
      const birthYear = new Date().getFullYear() - parseInt(survey.age);
      const birthMonth = `${birthYear}-01`;
      const clientData = {
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        phoneNumber: '0000000000',
        gender: survey.gender.toUpperCase(),
        birthMonth,
        email: user.email,
      };

      const clientRes = await createClient(token, clientData);

      if (clientRes.data?.id) {
        setClientId(clientRes.data.id);
        setClientName(clientRes.data.name);
        setStep(2);
      } else {
        // Last resort: try fetching existing clients directly
        const existingClients = await getClients(token);
        const clients = existingClients.data?.content || [];
        if (clients.length > 0) {
          setClientId(clients[0].id);
          setClientName(clients[0].name);
          setStep(2);
        } else {
          throw new Error('Failed to create or find a client profile. Please try again.');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Upload PDF and extract biomarkers ───

  const submitBiomarker = async () => {
    if (!user || !session || !clientId) return;
    if (!biomarkerFile) {
      setError('Please upload a blood report PDF');
      return;
    }
    setLoading(true);
    setError(null);
    startExtractionProgress();

    try {
      const token = session.access_token;
      const reportDate = new Date().toISOString().split('T')[0]; // Today's date

      const res = await uploadReport(
        token,
        [biomarkerFile],
        clientId,
        reportDate,
        {
          height: survey.height_cm ? parseInt(survey.height_cm) : undefined,
          weight: survey.weight_kg ? parseFloat(survey.weight_kg) : undefined,
          diet: survey.diet_type || undefined,
          existingConditions: survey.health_conditions.filter(c => c !== 'None of the above'),
        }
      );

      if (res.data) {
        setExtractedData(res.data);
        setReportId(res.data.reportId);

        // Flatten the data map into a single array for editing
        const allParams: ParameterData[] = [];
        for (const params of Object.values(res.data.data)) {
          allParams.push(...params);
        }
        setEditableParams(allParams);

        // Also save to Supabase for tracking
        await supabase.from('biomarker_reports').insert({
          user_id: user.id,
          report_name: biomarkerFile.name,
          report_type: 'blood_panel',
          processing_status: 'extracted',
        });

        completeExtractionProgress();
        await new Promise(r => setTimeout(r, 600)); // Brief pause to show 100%
        setStep(3);
      } else {
        throw new Error(res.message || 'Failed to extract biomarkers from PDF');
      }
    } catch (err: unknown) {
      completeExtractionProgress();
      const message = err instanceof Error ? err.message : 'Failed to process report';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Edit a parameter value ───

  const updateParamValue = (index: number, newValue: string) => {
    setEditableParams(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value: newValue };
      return updated;
    });
  };

  // ─── Step 3 → 4: Confirm biomarkers and run analysis ───

  const confirmAndAnalyse = async () => {
    if (!session || !reportId) return;
    setLoading(true);
    setError(null);
    setStep(4);
    startAnalysisProgress();

    try {
      const token = session.access_token;
      const res = await analyseReport(token, reportId, editableParams);

      if (res.data?.report) {
        const report: Report = res.data.report;

        // Store report in sessionStorage for AnalysisPage to pick up
        sessionStorage.setItem(`report_${report.id}`, JSON.stringify(report));

        // Update Supabase
        if (user) {
          await supabase.from('health_plans').insert({
            user_id: user.id,
            plan_data: { reportId: report.id },
            priority_areas: survey.health_goals.slice(0, 3),
          });
          await supabase.from('user_profiles').upsert({
            id: user.id,
            health_plan_generated: true,
            survey_completed: true,
          });
        }

        completeAnalysisProgress();
        await new Promise(r => setTimeout(r, 800)); // Brief pause to show 100%
        setStep(5);

        // Navigate to analysis page after brief delay for animation
        setTimeout(() => {
          navigate(`/analysis/${report.id}`);
        }, 1500);
      } else {
        throw new Error(res.message || 'Analysis failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      setStep(3); // Go back to review step
    } finally {
      setLoading(false);
    }
  };

  // ─── Landing (step 0) ───

  if (step === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-12 flex flex-col px-6">
        <div className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dayli-red-light border border-dayli-red-light rounded-full text-dayli-red-dark text-sm font-medium mb-6">
                <Sparkles size={16} className="text-dayli-red-dark" />
                Precision Nutrition Intelligence
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
                Decode your biomarkers for<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-dayli-red-dark to-dayli-red-dark">
                  ultimate optimization.
                </span>
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-xl">
                Your body's data holds the key to optimal health. By understanding your unique biomarkers, we can build a hyper-personalized health plan that actually works.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-dayli-red-light flex items-center justify-center flex-shrink-0">
                  <Upload size={24} className="text-dayli-red-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Upload Your Blood Work</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    Securely upload your recent lab results, hormone panels, or metabolic reports. Our AI extracts and structures your data instantly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-dayli-red-light flex items-center justify-center flex-shrink-0">
                  <Brain size={24} className="text-dayli-red-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Advanced AI Analysis</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    The Companion AI processes 47+ health vectors, crossing your biomarkers against a massive database of clinical nutrition research.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-dayli-red-light flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={24} className="text-dayli-red-dark" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Identify Nutrient Gaps</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    We identify exactly where your body needs support—from micro-deficiencies to systemic inflammation—and prescribe targeted blends.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 text-center border border-stone-200 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-dayli-red-dark flex items-center justify-center mx-auto mb-8 shadow-lg shadow-dayli-red-dark/20">
                <Layers size={32} strokeWidth={2.5} className="text-white" />
              </div>
              <h2 className="text-[2rem] leading-tight font-black text-stone-900 mb-5 tracking-tight">
                Your Companion AI<br />
                <span className="text-dayli-red-dark">Biology Coach</span>
              </h2>
              <p className="text-stone-500 mb-10 leading-relaxed text-[15px]">
                Get a precision health plan built on your actual biology. Upload your biomarkers, complete a quick survey, and receive science-backed supplement recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-dayli-red-dark hover:bg-dayli-red text-white font-semibold rounded-full text-sm transition-all shadow-md"
                >
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-full text-sm border border-stone-200 transition-all"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Initializing: checking for returning user ───
  if (initializing) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-stone-100 text-center">
            <div className="w-12 h-12 border-3 border-dayli-red-light border-t-dayli-red-dark rounded-full animate-spin mx-auto mb-6" />
            <p className="text-stone-500 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main wizard ───

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12 overflow-x-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-dayli-red' : isActive ? 'bg-dayli-red-dark' : 'bg-stone-200'
                    }`}>
                    {isDone ? <Check size={20} className="text-white" /> : <Icon size={20} className={isActive ? 'text-white' : 'text-stone-400'} />}
                  </div>
                  <span className={`text-xs font-medium mt-2 hidden sm:block ${isActive ? 'text-dayli-red-dark' : 'text-stone-400'}`}>
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-12 sm:w-16 mx-2 transition-colors ${step > s.id ? 'bg-dayli-red' : 'bg-stone-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
          >
            <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
              <button onClick={() => setError(null)} className="text-red-500 text-xs mt-1 hover:text-red-700">Dismiss</button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Survey ─── */}
          {step === 1 && (
            <motion.div key="survey" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
                <h2 className="text-3xl font-black text-stone-900 mb-2">Biology Profile</h2>
                <p className="text-stone-500 mb-8">Help us understand your unique biology and health goals.</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Age</label>
                      <input type="number" value={survey.age} onChange={e => setSurvey(s => ({ ...s, age: e.target.value }))}
                        placeholder="32" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Gender</label>
                      <select value={survey.gender} onChange={e => setSurvey(s => ({ ...s, gender: e.target.value }))}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red bg-white">
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Weight (kg)</label>
                      <input type="number" value={survey.weight_kg} onChange={e => setSurvey(s => ({ ...s, weight_kg: e.target.value }))}
                        placeholder="70" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Height (cm)</label>
                      <input type="number" value={survey.height_cm} onChange={e => setSurvey(s => ({ ...s, height_cm: e.target.value }))}
                        placeholder="170" className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Activity Level</label>
                      <select value={survey.activity_level} onChange={e => setSurvey(s => ({ ...s, activity_level: e.target.value }))}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red bg-white">
                        <option value="">Select</option>
                        <option>Sedentary (desk job)</option>
                        <option>Lightly Active (1-2x/week)</option>
                        <option>Moderately Active (3-4x/week)</option>
                        <option>Very Active (5-6x/week)</option>
                        <option>Athlete</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Diet Type</label>
                      <select value={survey.diet_type} onChange={e => setSurvey(s => ({ ...s, diet_type: e.target.value }))}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red bg-white">
                        <option value="">Select</option>
                        <option>Omnivore</option><option>Vegetarian</option><option>Vegan</option>
                        <option>Keto / Low Carb</option><option>Gluten Free</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Health Goals (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {healthGoals.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleGoal(goal)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${survey.health_goals.includes(goal)
                            ? 'bg-dayli-red-dark text-white shadow-lg shadow-dayli-red-dark/20'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">Health Conditions</label>
                    <div className="flex flex-wrap gap-2">
                      {healthConditions.map(cond => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${survey.health_conditions.includes(cond)
                            ? 'bg-amber-500 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Sleep Hours/Night</label>
                      <input type="number" step="0.5" value={survey.sleep_hours} onChange={e => setSurvey(s => ({ ...s, sleep_hours: e.target.value }))}
                        placeholder="7.5" min="4" max="12"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:border-dayli-red" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-3">
                        Stress Level: <span className="text-dayli-red-dark">{survey.stress_level}/10</span>
                      </label>
                      <input type="range" min="1" max="10" value={survey.stress_level}
                        onChange={e => setSurvey(s => ({ ...s, stress_level: parseInt(e.target.value) }))}
                        className="w-full accent-dayli-red-dark" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={submitSurvey}
                  disabled={loading || !survey.age || !survey.gender}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-dayli-red-dark hover:bg-dayli-red-dark disabled:bg-stone-300 text-white font-semibold text-lg rounded-2xl transition-all hover:scale-[1.02]"
                >
                  {loading ? 'Setting up...' : 'Continue to Biomarkers'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Upload PDF ─── */}
          {step === 2 && (
            <motion.div key="biomarker" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
                {!loading && (
                  <button onClick={() => { setIsReturningUser(false); setStep(1); }} className="flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6">
                    <ArrowLeft size={18} /> {isReturningUser ? 'Fill out survey' : 'Back'}
                  </button>
                )}
                <h2 className="text-3xl font-black text-stone-900 mb-2">Upload Biomarkers</h2>
                {isReturningUser && clientName && (
                  <div className="mb-4 px-4 py-3 bg-dayli-red-light border border-dayli-red-light rounded-xl">
                    <p className="text-dayli-red-dark text-sm font-medium">
                      ✨ Welcome back, <span className="font-bold">{clientName}</span>! Upload a new blood report to get fresh insights.
                    </p>
                  </div>
                )}
                <p className="text-stone-500 mb-8">Upload your blood test report (PDF) for AI-powered biomarker extraction and analysis.</p>

                {!loading ? (
                  <>
                    <div
                      className="border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center hover:border-dayli-red transition-colors cursor-pointer"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={e => setBiomarkerFile(e.target.files?.[0] || null)}
                      />
                      <Upload size={40} className="text-stone-300 mx-auto mb-4" />
                      {biomarkerFile ? (
                        <div>
                          <p className="text-dayli-red-dark font-semibold">{biomarkerFile.name}</p>
                          <p className="text-stone-400 text-sm mt-1">Click to change file</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-stone-600 font-semibold mb-1">Drop your report here</p>
                          <p className="text-stone-400 text-sm">PDF · Max 28MB</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={submitBiomarker}
                      disabled={!biomarkerFile}
                      className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-dayli-red-dark hover:bg-dayli-red-dark disabled:bg-stone-300 text-white font-semibold rounded-2xl transition-all hover:scale-[1.02]"
                    >
                      Extract & Continue <ArrowRight size={20} />
                    </button>
                  </>
                ) : (
                  /* ─── Extraction Progress Bar ─── */
                  <div className="py-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-dayli-red-light flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-dayli-red-dark" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-700">{biomarkerFile?.name}</p>
                        <p className="text-xs text-stone-400">Processing your blood report</p>
                      </div>
                      <span className="text-sm font-bold text-dayli-red-dark tabular-nums">{Math.round(extractionProgress)}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-dayli-red to-dayli-red"
                        style={{ width: `${extractionProgress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>

                    {/* Phase indicators */}
                    <div className="space-y-3">
                      {extractionPhases.map((phase, i) => {
                        const PhaseIcon = phase.icon;
                        const isActive = extractionPhase === i;
                        const isComplete = extractionPhase > i || extractionProgress >= 100;
                        return (
                          <motion.div
                            key={phase.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-dayli-red-light border border-dayli-red-light' :
                              isComplete ? 'bg-stone-50' : 'opacity-40'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isComplete ? 'bg-dayli-red' : isActive ? 'bg-dayli-red-light' : 'bg-stone-100'
                              }`}>
                              {isComplete ? (
                                <Check size={16} className="text-white" />
                              ) : (
                                <PhaseIcon size={16} className={isActive ? 'text-dayli-red-dark' : 'text-stone-400'} />
                              )}
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'text-dayli-red-dark' : isComplete ? 'text-stone-500' : 'text-stone-400'
                              }`}>
                              {phase.label}
                            </span>
                            {isActive && (
                              <div className="ml-auto w-4 h-4 border-2 border-dayli-red-light border-t-dayli-red-dark rounded-full animate-spin" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Review Extracted Biomarkers ─── */}
          {step === 3 && extractedData && (
            <motion.div key="review" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6">
                  <ArrowLeft size={18} /> Back
                </button>
                <h2 className="text-3xl font-black text-stone-900 mb-2">Review Extracted Data</h2>
                <p className="text-stone-500 mb-2">{extractedData.message}</p>

                {extractedData.largelyDeviatedParams && extractedData.largelyDeviatedParams.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700 text-sm">
                      <strong>Highlighted parameters may need review:</strong>{' '}
                      {extractedData.largelyDeviatedParams.join(', ')}
                    </p>
                  </div>
                )}

                {/* Parameter table grouped by category */}
                {Object.entries(extractedData.data).map(([category, params]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">{category}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-stone-200">
                            <th className="text-left py-2 px-3 text-stone-500 font-medium">Parameter</th>
                            <th className="text-left py-2 px-3 text-stone-500 font-medium">Value</th>
                            <th className="text-left py-2 px-3 text-stone-500 font-medium">Units</th>
                            <th className="text-left py-2 px-3 text-stone-500 font-medium">Optimal Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {params.map((param) => {
                            const globalIdx = editableParams.findIndex(
                              p => p.parameterName === param.parameterName
                            );
                            const isDeviated = extractedData.largelyDeviatedParams?.includes(param.parameterName);
                            return (
                              <tr key={param.parameterName} className={`border-b border-stone-50 ${isDeviated ? 'bg-amber-50/50' : ''}`}>
                                <td className={`py-2 px-3 font-medium ${isDeviated ? 'text-amber-700' : 'text-stone-700'}`}>
                                  {param.parameterName}
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={globalIdx >= 0 ? editableParams[globalIdx].value : param.value}
                                    onChange={e => {
                                      if (globalIdx >= 0) updateParamValue(globalIdx, e.target.value);
                                    }}
                                    className={`w-20 px-2 py-1 border rounded-lg text-sm focus:outline-none focus:border-dayli-red ${isDeviated ? 'border-amber-300 bg-amber-50' : 'border-stone-200'}`}
                                  />
                                </td>
                                <td className="py-2 px-3 text-stone-500">{param.units}</td>
                                <td className="py-2 px-3 text-stone-500">
                                  {param.parameterInfo
                                    ? `${param.parameterInfo.minValue} – ${param.parameterInfo.maxValue}`
                                    : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <button
                  onClick={confirmAndAnalyse}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-dayli-red-dark hover:bg-dayli-red-dark disabled:bg-stone-300 text-white font-semibold text-lg rounded-2xl transition-all hover:scale-[1.02]"
                >
                  {loading ? 'Starting Analysis...' : 'Confirm & Analyse Report'}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: Analysis Loading ─── */}
          {step === 4 && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-stone-100">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#e7e5e4" strokeWidth="6" />
                      <motion.circle
                        cx="40" cy="40" r="36" fill="none"
                        stroke="url(#progressGrad)" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 - (226.2 * analysisProgress / 100)}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-dayli-red-dark tabular-nums">{Math.round(analysisProgress)}%</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-stone-900 mb-2">AI Analysis Running</h2>
                  <p className="text-stone-500 text-sm max-w-md mx-auto">
                    Our precision AI is analyzing your blood report, scoring health panels, and generating clinical insights.
                  </p>
                </div>

                {/* Linear progress bar */}
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden mb-8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-dayli-red via-dayli-red to-dayli-red bg-[length:200%_100%]"
                    style={{ width: `${analysisProgress}%` }}
                    animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {/* Phase steps */}
                <div className="max-w-md mx-auto space-y-2">
                  {analysisPhases.map((phase, i) => {
                    const PhaseIcon = phase.icon;
                    const isActive = analysisPhase === i;
                    const isComplete = analysisPhase > i || analysisProgress >= 100;
                    return (
                      <motion.div
                        key={phase.label}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 ${isActive ? 'bg-dayli-red-light border border-dayli-red-light shadow-sm shadow-dayli-red-light' :
                          isComplete ? 'bg-stone-50/80' : 'opacity-35'
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isComplete ? 'bg-dayli-red shadow-lg shadow-dayli-red/30' :
                          isActive ? 'bg-white border-2 border-dayli-red-light' : 'bg-stone-100'
                          }`}>
                          {isComplete ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                              <Check size={16} className="text-white" />
                            </motion.div>
                          ) : (
                            <PhaseIcon size={16} className={isActive ? 'text-dayli-red-dark' : 'text-stone-400'} />
                          )}
                        </div>
                        <span className={`text-sm font-medium flex-1 ${isActive ? 'text-dayli-red-dark' : isComplete ? 'text-stone-500 line-through decoration-stone-300' : 'text-stone-400'
                          }`}>
                          {phase.label}
                        </span>
                        {isActive && (
                          <div className="w-5 h-5 border-2 border-dayli-red-light border-t-dayli-red-dark rounded-full animate-spin" />
                        )}
                        {isComplete && (
                          <span className="text-xs font-semibold text-dayli-red">Done</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 5: Redirect to analysis page ─── */}
          {step === 5 && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white rounded-3xl p-16 shadow-sm border border-stone-100 text-center">
                <div className="w-20 h-20 rounded-full bg-dayli-red-light flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-dayli-red-dark" />
                </div>
                <h2 className="text-3xl font-black text-stone-900 mb-4">Analysis Complete!</h2>
                <p className="text-stone-500 mb-8">Redirecting you to your detailed analysis results...</p>
                <div className="w-8 h-8 border-3 border-dayli-red-light border-t-dayli-red rounded-full animate-spin mx-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
