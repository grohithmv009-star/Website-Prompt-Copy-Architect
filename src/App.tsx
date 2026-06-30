import React, { useState } from "react";
import { ProjectParams, WebsiteCopy, CodeResult } from "./types";
import { CopyTab } from "./components/CopyTab";
import { CodeTab } from "./components/CodeTab";
import { GoogleSheetsHub } from "./components/GoogleSheetsHub";
import { 
  Sparkles, 
  Settings, 
  Terminal, 
  RefreshCw, 
  FileText, 
  Code, 
  AlertCircle, 
  BookOpen, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Info,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PRESETS: Record<string, ProjectParams> = {
  saas: {
    businessName: "Scribe AI",
    industry: "Artificial Intelligence / SaaS content tooling",
    targetAudience: "Growth marketers and content teams",
    goal: "Start a 14-day free trial (no credit card required)",
    tone: "Modern, futuristic, energetic, and highly authoritative",
    mainOfferings: "AI-Powered SEO Outlines, Competitor Gap Auditor, Real-time Conversion Predictor",
    accentColor: "#6366f1",
    visualStyle: "Sleek borders, clean cards, modern technical sans grids"
  },
  agency: {
    businessName: "PlumbRight Digital",
    industry: "Lead Generation & SEO for Local Plumbers",
    targetAudience: "Residential plumbers looking for steady qualified jobs",
    goal: "Schedule a 15-minute lead generation strategy call",
    tone: "Trustworthy, results-driven, plainspoken, and highly reassuring",
    mainOfferings: "Exclusive Phone Call Lead Routing, Google Business Profile Autopilot, Instant SMS Customer Wakeup",
    accentColor: "#0ea5e9",
    visualStyle: "Bright professional grids, trusted blue banners, structured whitespace"
  },
  consultant: {
    businessName: "Dr. Evelyn Vance",
    industry: "Leadership Development & Executive Advisory",
    targetAudience: "Newly promoted Fortune 500 executives and directors",
    goal: "Book a confidential executive strategy assessment",
    tone: "Elegant, polished, prestigious, and highly confidential",
    mainOfferings: "1-on-1 Strategic Leadership Coaching, Team Alignment Retreat Faciliation, Conflict Advisory",
    accentColor: "#d97706",
    visualStyle: "Classic editorial layout, soft light warm margins, high-contrast serif headers"
  }
};

const COLOR_PRESETS = [
  { name: "Indigo Modern", hex: "#6366f1" },
  { name: "Ocean Teal", hex: "#0d9488" },
  { name: "Crimson Gold", hex: "#dc2626" },
  { name: "Slate Dark", hex: "#1e293b" },
  { name: "Forest Sage", hex: "#16a34a" },
  { name: "Classic Blue", hex: "#2563eb" },
  { name: "Amber Gold", hex: "#d97706" }
];

export default function App() {
  const [params, setParams] = useState<ProjectParams>({
    businessName: "",
    industry: "",
    targetAudience: "",
    goal: "",
    tone: "Professional, clear, and concise",
    mainOfferings: "",
    accentColor: "#6366f1",
    visualStyle: "Minimalist, clean, airy with generous whitespace"
  });

  const [activeTab, setActiveTab] = useState<"copy" | "code" | "sheets">("copy");
  
  const [copyData, setCopyData] = useState<WebsiteCopy | null>(null);
  const [codeData, setCodeData] = useState<CodeResult | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    setParams({ ...PRESETS[presetKey] });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleAccentColorSelect = (hex: string) => {
    setParams(prev => ({ ...prev, accentColor: hex }));
  };

  // Content & Structure Prompt Template
  const getContentPromptTemplate = (p: ProjectParams) => {
    return `I need to build a simple, professional, 4-page business website similar in style and layout to business-explained.com. The target audience is ${p.targetAudience || "[Insert Target Audience]"} and the main goal of the site is to ${p.goal || "[Insert Goal]"}.

Please generate the complete, SEO-optimized website copy and a clear layout structure for the following pages:

Homepage: Needs a strong hero headline, a brief introduction, a 3-column 'Services' or 'Features' section, and a clear Call to Action (CTA).

About Us: A professional background story and mission statement.

Services/Products: A bulleted list of offerings with short, persuasive descriptions.

Contact Page: Short introductory text encouraging them to reach out.

For each page, provide the text content and indicate exactly where it goes (e.g., [Hero Section], [H2 Header], [Body Text], [Button]). Keep the tone ${p.tone || "professional, clear, and concise"}.`;
  };

  // Custom Code Prompt Template
  const getCustomCodePromptTemplate = (p: ProjectParams) => {
    return `Act as an expert frontend developer. Create a responsive, modern landing page inspired by the clean, minimalist aesthetic of business-explained.com.

Please write this using semantic HTML5, modern CSS3 (using Flexbox and CSS Grid), and vanilla JavaScript.

Include the following sections in a single-page layout:

Header: A simple navigation bar with a logo placeholder and links to 'About', 'Services', and 'Contact'.

Hero Section: A bold H1 headline, a short subheadline, and a primary CTA button.

Features/Services Section: A 3-column grid layout with placeholder icons, H3 titles, and brief descriptions.

Footer: Copyright info and placeholder social links.

Ensure the CSS includes a clean, professional color palette (whites, grays, and ${p.accentColor || "one primary accent color"} as accent) and that the design is fully responsive for mobile devices. Provide the HTML, CSS, and JS in separate, copy-pasteable blocks.`;
  };

  const generateWorkspace = async () => {
    if (!params.businessName.trim()) {
      setError("Please provide a Business Name before generating.");
      return;
    }
    if (!params.targetAudience.trim()) {
      setError("Please enter the Target Audience.");
      return;
    }
    if (!params.goal.trim()) {
      setError("Please explain the primary Goal of the website.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Copy Generation
      setLoadingStep("Formulating strategic copy structure...");
      const copyResponse = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!copyResponse.ok) {
        const errObj = await copyResponse.json();
        throw new Error(errObj.error || "Failed to generate website copywriting.");
      }

      setLoadingStep("Optimizing headers and keyword positioning...");
      const copyJson = await copyResponse.json();
      setCopyData(copyJson);

      // Step 2: Code Generation
      setLoadingStep("Architecting clean, semantic frontend code...");
      const codeResponse = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!codeResponse.ok) {
        const errObj = await codeResponse.json();
        throw new Error(errObj.error || "Failed to compile responsive layout code.");
      }

      setLoadingStep("Styling components with custom colors...");
      const codeJson = await codeResponse.json();
      setCodeData(codeJson);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-16">
      {/* Top Banner Header */}
      <nav id="header-bar" className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-6 lg:px-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center"><Sparkles className="w-2.5 h-2.5 text-white" /></div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              PROMPTSTUDIO<span className="text-blue-600">AI</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://business-explained.com" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 transition-all"
          >
            Inspired by business-explained.com
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </nav>

      {/* Main Container Grid */}
      <main id="main-content-layout" className="max-w-7xl mx-auto px-4 lg:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Business Configuration Forms */}
        <section id="config-panel" className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Configurations</h2>
            </div>
            
            {/* Quick Presets Dropdown/Badges */}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Presets</span>
          </div>

          {/* Quick preset badges */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset("saas")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                params.businessName === "Scribe AI"
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              SaaS Starter
            </button>
            <button
              onClick={() => applyPreset("agency")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                params.businessName === "PlumbRight Digital"
                  ? "bg-sky-50 text-sky-600 border-sky-200 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-sky-500" />
              Local Agency
            </button>
            <button
              onClick={() => applyPreset("consultant")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
                params.businessName === "Dr. Evelyn Vance"
                  ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              Elite Advisor
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Inputs Form */}
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Business / Brand Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="e.g. Apex Marketing, Scribe AI"
                value={params.businessName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans text-slate-800"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Industry or Niche
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                placeholder="e.g. Lead Generation for Plumbers, Tech Consulting"
                value={params.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans text-slate-800"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="targetAudience" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Target Audience</span>
                <span className="text-[10px] text-indigo-500 lowercase normal-case font-medium">Who is reading?</span>
              </label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                rows={2}
                placeholder="e.g. busy local business owners, newly promoted corporate directors looking for confidence coaching..."
                value={params.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans leading-relaxed text-slate-800"
              />
            </div>

            {/* main Goal */}
            <div>
              <label htmlFor="goal" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Primary Goal</span>
                <span className="text-[10px] text-indigo-500 lowercase normal-case font-medium">What is the call to action?</span>
              </label>
              <input
                id="goal"
                name="goal"
                type="text"
                placeholder="e.g. book a 15-minute lead audit call, start a free trial"
                value={params.goal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans text-slate-800"
              />
            </div>

            {/* Brand Tone */}
            <div>
              <label htmlFor="tone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Brand Tone of Voice
              </label>
              <select
                id="tone"
                name="tone"
                value={params.tone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans text-slate-800 cursor-pointer"
              >
                <option value="Professional, clear, and concise">Professional, clear, and concise</option>
                <option value="Modern, futuristic, energetic, and highly authoritative">Witty, high-energy, and futuristic</option>
                <option value="Trustworthy, results-driven, plainspoken, and highly reassuring">Friendly, warm, and highly reassuring</option>
                <option value="Refined, prestige-focused, confidential, and premium">Elegant, polished, prestigious, and high-status</option>
                <option value="Bold, disruptive, cheeky, and direct">Bold, cheeky, and disruptive</option>
              </select>
            </div>

            {/* Core Offerings */}
            <div>
              <label htmlFor="mainOfferings" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Core Offerings & Features
              </label>
              <textarea
                id="mainOfferings"
                name="mainOfferings"
                rows={2}
                placeholder="e.g. Done-For-You Local SEO, exclusive leads routing, automated email followup engine"
                value={params.mainOfferings}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans leading-relaxed text-slate-800"
              />
            </div>

            {/* Accent Color selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COLOR_PRESETS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAccentColorSelect(color.hex)}
                    className="w-7 h-7 rounded-full border border-slate-200 shadow-sm relative transition-all hover:scale-110 flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {params.accentColor === color.hex && (
                      <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white shadow-md"></span>
                    )}
                  </button>
                ))}
              </div>
              <input
                id="accentColor"
                name="accentColor"
                type="text"
                placeholder="Hex Color e.g. #6366f1"
                value={params.accentColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-mono text-slate-800"
              />
            </div>

            {/* Visual Style Layout */}
            <div>
              <label htmlFor="visualStyle" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Layout Visual Vibe
              </label>
              <input
                id="visualStyle"
                name="visualStyle"
                type="text"
                placeholder="e.g. minimalist light mode, spacious whitespace, airy"
                value={params.visualStyle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-sans text-slate-800"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div id="error-banner" className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Error Processing Workspace:</span>
                <p className="leading-relaxed">{error}</p>
                {error.includes("GEMINI_API_KEY") && (
                  <p className="font-semibold text-slate-600 mt-2 bg-white px-2 py-1 rounded border border-rose-200/50">
                    💡 Please go to the **Settings &gt; Secrets** panel in the upper right, and make sure your `GEMINI_API_KEY` is pasted correctly!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Trigger Workspace Button */}
          <button
            id="generate-workspace-btn"
            onClick={generateWorkspace}
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-80 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Crafting Website Assets...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Workspace</span>
              </>
            )}
          </button>

          {/* Info card describing capabilities */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed flex gap-2">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p>
                This workspace will instantly formulate filled-out prompts for your freelancers and developers.
              </p>
              <p className="mt-1 font-semibold text-indigo-600">
                It also automatically invokes Gemini on our server to create the actual fully written web page copy and responsive frontend code!
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Prompts, Generated Copy, and Live HTML Mock Preview */}
        <section id="results-panel" className="lg:col-span-7 space-y-6">
          {/* Main workspace Tabs switcher */}
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab("copy")}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                activeTab === "copy"
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4 text-blue-500" />
              1. Copy Workspace
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                activeTab === "code"
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Code className="w-4 h-4 text-blue-500" />
              2. Code Workspace
            </button>
            <button
              onClick={() => setActiveTab("sheets")}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                activeTab === "sheets"
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-transparent text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              3. Sheets Hub
            </button>
          </div>

          {/* Active Workspace Viewport with transitions */}
          <div className="relative min-h-[500px]">
            {/* Loading Indicator Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  id="loading-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm z-30 rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="w-16 h-16 relative mb-4">
                    {/* Ring loader */}
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  
                  <motion.h3 
                    key={loadingStep}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-base font-bold text-slate-800"
                  >
                    {loadingStep}
                  </motion.h3>
                  
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed font-medium">
                    Calling server-side Gemini to analyze inputs and synthesize ready-to-use copy and code.
                  </p>

                  <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4">
                    <div className="bg-indigo-600 h-full animate-pulse rounded-full w-4/5"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Display correct component */}
            {activeTab === "copy" ? (
              <CopyTab 
                copyData={copyData} 
                promptText={getContentPromptTemplate(params)} 
              />
            ) : activeTab === "code" ? (
              <CodeTab 
                codeData={codeData} 
                promptText={getCustomCodePromptTemplate(params)} 
              />
            ) : (
              <GoogleSheetsHub
                copyData={copyData}
                codeData={codeData}
                businessName={params.businessName}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
