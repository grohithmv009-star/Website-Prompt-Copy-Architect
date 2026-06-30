import React, { useState, useEffect, useRef } from "react";
import { CodeResult } from "../types";
import { Copy, Check, Terminal, Code, Monitor, Smartphone, Sparkles, ExternalLink, Globe, Star } from "lucide-react";

interface CodeTabProps {
  codeData: CodeResult | null;
  promptText: string;
}

export const CodeTab: React.FC<CodeTabProps> = ({ codeData, promptText }) => {
  const [activeSubTab, setActiveSubTab] = useState<"preview-desktop" | "preview-mobile" | "html" | "css" | "js" | "combined">("preview-desktop");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && codeData && (activeSubTab === "preview-desktop" || activeSubTab === "preview-mobile")) {
      const iframe = iframeRef.current;
      iframe.srcdoc = codeData.combinedHtml;
    }
  }, [codeData, activeSubTab]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCodeBlock = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openInNewTab = () => {
    if (!codeData) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(codeData.combinedHtml);
      newWindow.document.close();
    }
  };

  if (!codeData) {
    return (
      <div id="code-tab-empty" className="flex flex-col items-center justify-center p-12 text-center border border-slate-200 rounded-3xl bg-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Terminal className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No code compiled yet</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
          Configure your business name and industry on the left, then click generate to compile beautiful responsive frontend layouts.
        </p>
      </div>
    );
  }

  return (
    <div id="code-tab-root" className="space-y-6">
      {/* Code Prompt Box (Dark Bento Banner) */}
      <div id="code-prompt-wrapper" className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 blur-3xl opacity-20 pointer-events-none"></div>

        <div>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                v0 & AI Ready
              </span>
              <span className="text-xs text-slate-400">2. The Custom Code Prompt</span>
            </div>

            <button
              id="copy-developer-prompt-btn"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all font-semibold shadow-md shadow-blue-900/30 cursor-pointer active:scale-95"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPrompt ? "Copied!" : "Copy Developer Prompt"}
            </button>
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
            The Responsive Layout Developer Prompt
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-4">
            Hand this fully rendered prompt to your development team or feed it into AI web builders (v0, Claude, or bolt.new) to spin up instant frontend pages.
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-xs text-slate-300 font-mono leading-relaxed max-h-32 overflow-y-auto whitespace-pre-line pr-2 custom-scrollbar">
            {promptText}
          </p>
        </div>
      </div>

      {/* Code / Preview Bento Block */}
      <div id="code-workspace-container" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation Head */}
        <div className="border-b border-slate-200 bg-slate-50/70 p-3 flex flex-wrap justify-between items-center gap-3">
          {/* Subtabs selectors */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveSubTab("preview-desktop")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "preview-desktop"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-blue-500" />
              Desktop Live
            </button>
            <button
              onClick={() => setActiveSubTab("preview-mobile")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "preview-mobile"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              Mobile Live
            </button>
            <button
              onClick={() => setActiveSubTab("html")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "html"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-500" />
              HTML5
            </button>
            <button
              onClick={() => setActiveSubTab("css")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "css"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              CSS overrides
            </button>
            <button
              onClick={() => setActiveSubTab("js")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "js"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-500" />
              JavaScript
            </button>
            <button
              onClick={() => setActiveSubTab("combined")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === "combined"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-rose-500" />
              Index.html Bundle
            </button>
          </div>

          {/* Action trigger */}
          {(activeSubTab === "preview-desktop" || activeSubTab === "preview-mobile") && (
            <button
              onClick={openInNewTab}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all border border-slate-200 shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Live Page
            </button>
          )}
        </div>

        {/* Dynamic Display Canvas */}
        <div className="bg-slate-50 p-6 min-h-[500px] flex items-center justify-center relative">
          
          {/* Live Desktop Frame */}
          {activeSubTab === "preview-desktop" && (
            <div id="desktop-device-mock" className="w-full h-[550px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
              {/* Browser bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                </div>
                <div className="mx-auto w-1/2 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-400 py-1 px-3 text-center truncate select-none font-sans font-medium">
                  https://my-minimalist-business-page.local
                </div>
              </div>
              <iframe
                ref={iframeRef}
                id="preview-desktop-iframe"
                title="Desktop Live Preview"
                className="w-full flex-grow border-0 bg-white"
              />
            </div>
          )}

          {/* Live Mobile Frame */}
          {activeSubTab === "preview-mobile" && (
            <div id="mobile-device-mock" className="w-[360px] h-[550px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative">
              {/* Phone speaker/camera details */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700/80"></span>
              </div>
              <div className="w-full h-full bg-white rounded-[26px] overflow-hidden flex flex-col relative z-10 border border-slate-950">
                <iframe
                  ref={iframeRef}
                  id="preview-mobile-iframe"
                  title="Mobile Live Preview"
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            </div>
          )}

          {/* HTML Block */}
          {activeSubTab === "html" && (
            <div className="w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
              <div className="bg-slate-850 px-4 py-3 flex justify-between items-center text-xs text-slate-300 font-mono border-b border-slate-800/80">
                <span>markup.html</span>
                <button
                  onClick={() => handleCopyCodeBlock(codeData.html, "html")}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-semibold bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-700"
                >
                  {copiedCode === "html" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "html" ? "Copied!" : "Copy Markup"}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-auto flex-grow bg-slate-950 leading-relaxed custom-scrollbar">
                <code>{codeData.html}</code>
              </pre>
            </div>
          )}

          {/* CSS Block */}
          {activeSubTab === "css" && (
            <div className="w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
              <div className="bg-slate-850 px-4 py-3 flex justify-between items-center text-xs text-slate-300 font-mono border-b border-slate-800/80">
                <span>styles.css</span>
                <button
                  onClick={() => handleCopyCodeBlock(codeData.css, "css")}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-semibold bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-700"
                >
                  {copiedCode === "css" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "css" ? "Copied!" : "Copy CSS"}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-auto flex-grow bg-slate-950 leading-relaxed custom-scrollbar">
                <code>{codeData.css || "/* No custom CSS override code needed. Formatted fully using Tailwind CSS utility styles. */"}</code>
              </pre>
            </div>
          )}

          {/* JS Block */}
          {activeSubTab === "js" && (
            <div className="w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
              <div className="bg-slate-850 px-4 py-3 flex justify-between items-center text-xs text-slate-300 font-mono border-b border-slate-800/80">
                <span>app.js</span>
                <button
                  onClick={() => handleCopyCodeBlock(codeData.javascript, "js")}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-semibold bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-700"
                >
                  {copiedCode === "js" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "js" ? "Copied!" : "Copy Scripts"}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-auto flex-grow bg-slate-950 leading-relaxed custom-scrollbar">
                <code>{codeData.javascript || "// No custom interactive JavaScript code needed."}</code>
              </pre>
            </div>
          )}

          {/* Combined Block */}
          {activeSubTab === "combined" && (
            <div className="w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col shadow-lg border border-slate-800">
              <div className="bg-slate-850 px-4 py-3 flex justify-between items-center text-xs text-slate-300 font-mono border-b border-slate-800/80">
                <span>index.html (Self-contained Page)</span>
                <button
                  onClick={() => handleCopyCodeBlock(codeData.combinedHtml, "combined")}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs font-semibold bg-slate-800 px-3 py-1 rounded-lg hover:bg-slate-700"
                >
                  {copiedCode === "combined" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === "combined" ? "Copied!" : "Copy Full File"}
                </button>
              </div>
              <pre className="p-5 text-xs font-mono text-slate-200 overflow-auto flex-grow bg-slate-950 leading-relaxed custom-scrollbar">
                <code>{codeData.combinedHtml}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
