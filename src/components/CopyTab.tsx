import React, { useState } from "react";
import { WebsiteCopy } from "../types";
import { Copy, Check, FileText, Globe, List, PhoneCall, Sparkles, Star, Tag, Info } from "lucide-react";

interface CopyTabProps {
  copyData: WebsiteCopy | null;
  promptText: string;
}

export const CopyTab: React.FC<CopyTabProps> = ({ copyData, promptText }) => {
  const [activeSubTab, setActiveSubTab] = useState<"homepage" | "aboutUs" | "services" | "contact">("homepage");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyText = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!copyData) {
    return (
      <div id="copy-tab-empty" className="flex flex-col items-center justify-center p-12 text-center border border-slate-200 rounded-3xl bg-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No copy compiled yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
          Fill in your project inputs in the left config panel and trigger the generator to build your Bento-structured copywriting system.
        </p>
      </div>
    );
  }

  const { homepage, aboutUs, services, contact } = copyData;

  return (
    <div id="copy-tab-root" className="space-y-6">
      {/* 1. The Content & Structure Prompt (Hero Bento Box) */}
      <div id="prompt-box-wrapper" className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full -mr-20 -mt-20 blur-3xl opacity-20 pointer-events-none"></div>
        
        <div>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                WP & LLM Ready
              </span>
              <span className="text-xs text-slate-400">1. The Content & Structure Prompt</span>
            </div>
            
            <button
              id="copy-freelancer-prompt-btn"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold shadow-md shadow-indigo-900/30 cursor-pointer active:scale-95"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPrompt ? "Copied!" : "Copy Full Prompt"}
            </button>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
            The Content & Structure Prompt
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-4">
            Hand this pristine, fully structured prompt to freelancers or copywriters. It contains your exact requirements formatted cleanly.
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-xs text-slate-300 font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line pr-2 custom-scrollbar">
            {promptText}
          </p>
        </div>
      </div>

      {/* Copy Content Workspace Grid */}
      <div id="copy-workspace-container" className="space-y-6">
        
        {/* Bento Subtabs Navigation bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSubTab("homepage")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "homepage"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Homepage
          </button>
          <button
            onClick={() => setActiveSubTab("aboutUs")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "aboutUs"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            About Us
          </button>
          <button
            onClick={() => setActiveSubTab("services")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "services"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <List className="w-3.5 h-3.5 text-emerald-500" />
            Services/Products
          </button>
          <button
            onClick={() => setActiveSubTab("contact")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "contact"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
            Contact Page
          </button>
        </div>

        {/* Dynamic Bento Box Grid Section */}
        {activeSubTab === "homepage" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Cell 1: Hero Section (Spans 8 cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden min-h-[340px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-60 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  [Hero Section]
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `H1 Headline: ${homepage.heroSection.headline}\nSubheadline: ${homepage.heroSection.subheadline}\nCTA Button: ${homepage.heroSection.ctaText}`,
                      "home-hero"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                  title="Copy Section"
                >
                  {copiedSection === "home-hero" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">H1 Header Headline</span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {homepage.heroSection.headline}
                </h1>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subheadline (Body Text)</span>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">
                  {homepage.heroSection.subheadline}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary CTA [Button]</span>
                <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs tracking-wider uppercase hover:bg-blue-500 transition-colors shadow-lg shadow-blue-100">
                  {homepage.heroSection.ctaText}
                </button>
              </div>
            </div>

            {/* Bento Cell 2: SEO Meta Card (Spans 4 cols) */}
            <div className="md:col-span-4 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[340px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  SEO Spec
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `SEO Title: ${homepage.seoTitle}\nSEO Description: ${homepage.seoDescription}`,
                      "home-seo"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
                  title="Copy SEO"
                >
                  {copiedSection === "home-seo" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Recommended Title Tag</span>
                  <div className="text-xs font-mono font-medium text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                    {homepage.seoTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Recommended Meta Description</span>
                  <div className="text-xs font-sans text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                    {homepage.seoDescription}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-400 leading-tight">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Critical SEO attributes to boost organic ranking on search engines.</span>
              </div>
            </div>

            {/* Bento Cell 3: Introduction (Spans 4 cols) */}
            <div className="md:col-span-4 bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[280px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-100/50 px-2.5 py-1 rounded-full border border-indigo-200/50">
                  [Intro Blurb]
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `Heading: ${homepage.introduction.heading}\nBody: ${homepage.introduction.bodyText}`,
                      "home-intro"
                    )
                  }
                  className="p-1.5 rounded-lg border border-indigo-100 bg-white text-slate-400 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
                >
                  {copiedSection === "home-intro" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Section Heading (H2 Header)</span>
                <h3 className="text-lg font-extrabold text-indigo-950 tracking-tight leading-snug mb-3">
                  {homepage.introduction.heading}
                </h3>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Introductory Copy (Body)</span>
                <p className="text-xs text-indigo-900/80 leading-relaxed font-sans">
                  {homepage.introduction.bodyText}
                </p>
              </div>

              <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-4">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Establishes Immediate Trust</span>
              </div>
            </div>

            {/* Bento Cell 4: 3-Column Services Preview (Spans 8 cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[280px]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  [Services Preview Layout]
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      homepage.features.map((f, idx) => `Service ${idx + 1}:\nTitle: ${f.title}\nDescription: ${f.description}`).join("\n\n"),
                      "home-features"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  {copiedSection === "home-features" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
                {homepage.features.map((feature, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:border-slate-200 transition-all hover:shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xs mb-3">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">{feature.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 font-medium leading-relaxed pt-3 border-t border-slate-100">
                💡 Perfect for a three-column card grid near the fold of your homepage to showcase immediate capabilities.
              </div>
            </div>

            {/* Bento Cell 5: CTA Banner Section (Spans 12 cols - full width) */}
            <div className="col-span-1 md:col-span-12 bg-indigo-600 text-white rounded-3xl p-8 md:p-10 border border-indigo-700 shadow-lg shadow-indigo-100 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 min-h-[180px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
              
              <div className="max-w-xl space-y-2">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest bg-indigo-500/30 px-2.5 py-1 rounded-full border border-indigo-500/40 inline-block">
                  [CTA Conversion Zone]
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                  {homepage.ctaSection.heading}
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  {homepage.ctaSection.body}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
                <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-slate-50 transition-colors">
                  {homepage.ctaSection.buttonText}
                </button>
                <button
                  onClick={() =>
                    handleCopyText(
                      `Heading: ${homepage.ctaSection.heading}\nBody: ${homepage.ctaSection.body}\nButton: ${homepage.ctaSection.buttonText}`,
                      "home-cta"
                    )
                  }
                  className="p-3 rounded-xl border border-indigo-500/60 text-indigo-200 hover:text-white hover:bg-indigo-500/40 transition-all cursor-pointer"
                  title="Copy CTA Section"
                >
                  {copiedSection === "home-cta" ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* About Us Tab Bento Layout */}
        {activeSubTab === "aboutUs" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Cell 1: Page Intro (Spans 4 cols) */}
            <div className="md:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[260px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  [H1 Page Heading]
                </span>
                <button
                  onClick={() => handleCopyText(`Heading: ${aboutUs.heading}`, "about-title")}
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "about-title" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">H1 Main Page Header Title</span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {aboutUs.heading}
                </h2>
              </div>

              <div className="text-[10px] text-slate-400 font-medium">
                💡 Typically placed at the top center or top left of the custom About page.
              </div>
            </div>

            {/* Bento Cell 2: Mission and Values Statement (Spans 8 cols) */}
            <div className="md:col-span-8 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  [Mission & Values]
                </span>
                <button
                  onClick={() => handleCopyText(aboutUs.missionStatement, "about-mission")}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {copiedSection === "about-mission" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">The Mission Statement Callout</span>
                <blockquote className="text-lg md:text-xl font-serif italic text-amber-100 leading-relaxed max-w-2xl">
                  "{aboutUs.missionStatement}"
                </blockquote>
              </div>

              <div className="text-[10px] text-slate-400 font-medium">
                💡 Perfect for an elegant high-contrast blockquote layout with prominent serif styling.
              </div>
            </div>

            {/* Bento Cell 3: Background Story (Spans 8 cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  [Company Story]
                </span>
                <button
                  onClick={() => handleCopyText(aboutUs.backgroundStory, "about-story")}
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "about-story" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Narrative Story Copy</span>
                <p className="text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line max-w-2xl">
                  {aboutUs.backgroundStory}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-100">
                💡 Written in an engaging, narrative style to connect with prospective business clients.
              </div>
            </div>

            {/* Bento Cell 4: SEO Specs (Spans 4 cols) */}
            <div className="md:col-span-4 bg-slate-50/50 rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  SEO Spec
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `SEO Title: ${aboutUs.seoTitle}\nSEO Description: ${aboutUs.seoDescription}`,
                      "about-seo"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "about-seo" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">About Us Title Tag</span>
                  <div className="text-xs font-mono font-medium text-slate-800 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {aboutUs.seoTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">About Us Meta Description</span>
                  <div className="text-xs font-sans text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {aboutUs.seoDescription}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
                💡 Promotes brand authority and helps capture search interest.
              </div>
            </div>

          </div>
        )}

        {/* Services Tab Bento Layout */}
        {activeSubTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Cell 1: Services Intro Banner (Spans 8 cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[260px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-60 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  [Main Introduction]
                </span>
                <button
                  onClick={() => handleCopyText(`Heading: ${services.heading}\nIntro: ${services.description}`, "services-intro")}
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "services-intro" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">H1 Page Heading Title</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                  {services.heading}
                </h1>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Introductory Paragraph Copy</span>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {services.description}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-100 mt-4">
                💡 Best suited for the top header section of your main services catalog page.
              </div>
            </div>

            {/* Bento Cell 2: SEO Meta (Spans 4 cols) */}
            <div className="md:col-span-4 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[260px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  SEO Spec
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `SEO Title: ${services.seoTitle}\nSEO Description: ${services.seoDescription}`,
                      "services-seo"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {copiedSection === "services-seo" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title Tag</span>
                  <div className="text-xs font-mono font-medium text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    {services.seoTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Meta Description</span>
                  <div className="text-xs font-sans text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    {services.seoDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Cell 3: Comprehensive Offerings List (Spans 12 cols) */}
            <div className="md:col-span-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  [Deep List of Catalog Offerings]
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      services.offerings.map((o, idx) => `Offering ${idx + 1}:\nTitle: ${o.title}\nDescription: ${o.description}`).join("\n\n"),
                      "services-list"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "services-list" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {services.offerings.map((offering, idx) => (
                  <div key={idx} className="p-5 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-start gap-4 hover:shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{offering.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{offering.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Contact Tab Bento Layout */}
        {activeSubTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Cell 1: Contact Pitch (Spans 8 cols) */}
            <div className="md:col-span-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  [Introductory Call to Action]
                </span>
                <button
                  onClick={() => handleCopyText(`Heading: ${contact.heading}\nText: ${contact.introText}\nButton: ${contact.ctaText}`, "contact-copy")}
                  className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {copiedSection === "contact-copy" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">H1 Contact Page Header Title</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {contact.heading}
                </h1>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Encouraging Pitch Copy (Body Text)</span>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl mb-6">
                  {contact.introText}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Action Form Button Header</span>
                <button className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-rose-100 transition-colors">
                  {contact.ctaText}
                </button>
              </div>
            </div>

            {/* Bento Cell 2: SEO Meta (Spans 4 cols) */}
            <div className="md:col-span-4 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  SEO Spec
                </span>
                <button
                  onClick={() =>
                    handleCopyText(
                      `SEO Title: ${contact.seoTitle}\nSEO Description: ${contact.seoDescription}`,
                      "contact-seo"
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {copiedSection === "contact-seo" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Title Tag</span>
                  <div className="text-xs font-mono font-medium text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    {contact.seoTitle}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Meta Description</span>
                  <div className="text-xs font-sans text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                    {contact.seoDescription}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-tight">
                💡 Drives clicks directly from local search map queries.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
