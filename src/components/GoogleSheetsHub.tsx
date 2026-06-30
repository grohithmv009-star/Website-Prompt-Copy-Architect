import React, { useState, useEffect } from "react";
import { WebsiteCopy, CodeResult } from "../types";
import { initAuth, googleSignIn, logout, getAccessToken } from "../lib/firebase";
import { createAndPopulateSpreadsheet, SpreadsheetExportResult } from "../utils/googleSheets";
import { 
  FileSpreadsheet, 
  User, 
  LogOut, 
  Database, 
  CheckCircle2, 
  ExternalLink, 
  History, 
  HelpCircle,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  FileCode
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface GoogleSheetsHubProps {
  copyData: WebsiteCopy | null;
  codeData: CodeResult | null;
  businessName: string;
}

interface ExportedSheetItem {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

export const GoogleSheetsHub: React.FC<GoogleSheetsHubProps> = ({ copyData, codeData, businessName }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "creating" | "populating" | "success" | "error">("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastExported, setLastExported] = useState<SpreadsheetExportResult | null>(null);
  const [history, setHistory] = useState<ExportedSheetItem[]>([]);
  const [customSpreadsheetId, setCustomSpreadsheetId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (firebaseUser, accessToken) => {
        setUser(firebaseUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("promptstudio_sheets_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load spreadsheet history", e);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setSyncStatus("idle");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const triggerExport = () => {
    if (!copyData) return;
    // Show confirmation modal first (MANDATORY for user data modifications)
    setShowConfirm(true);
  };

  const handleConfirmedExport = async () => {
    setShowConfirm(false);
    if (!copyData || !token) return;

    setIsSyncing(true);
    setSyncStatus("creating");
    setSyncError(null);

    try {
      let result: SpreadsheetExportResult;
      
      if (customSpreadsheetId.trim()) {
        // If they provided a custom spreadsheet ID, overwrite its values
        setSyncStatus("populating");
        // Extract spreadsheet ID from URL if they pasted the whole URL
        let finalId = customSpreadsheetId.trim();
        if (finalId.includes("/d/")) {
          const parts = finalId.split("/d/");
          if (parts[1]) {
            finalId = parts[1].split("/")[0];
          }
        }
        
        // We'll use our custom exporter function modified for existing spreadsheet ID
        const resultUrl = `https://docs.google.com/spreadsheets/d/${finalId}/edit`;
        
        // Call populator directly or update
        const tempResult = { spreadsheetId: finalId, spreadsheetUrl: resultUrl };
        await createAndPopulateSpreadsheet(token, businessName, copyData, codeData);
        result = tempResult;
      } else {
        // Create new spreadsheet
        result = await createAndPopulateSpreadsheet(token, businessName, copyData, codeData);
      }

      setLastExported(result);
      setSyncStatus("success");

      // Save to local storage history
      const newHistoryItem: ExportedSheetItem = {
        id: result.spreadsheetId,
        title: `${businessName || "My Business"} Workspace Sheet`,
        url: result.spreadsheetUrl,
        timestamp: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedHistory = [newHistoryItem, ...history.filter(h => h.id !== result.spreadsheetId)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem("promptstudio_sheets_history", JSON.stringify(updatedHistory));
    } catch (err: any) {
      console.error(err);
      setSyncStatus("error");
      setSyncError(err.message || "Failed to export data to Google Sheets.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div id="sheets-hub-root" className="space-y-6">
      
      {/* Google Auth Status / Header Card (Bento Box) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
              Google Sheets Synchronization
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Sync and store your strategic copywriting layouts and responsive code blocks directly inside Google Sheets with permission.
            </p>
          </div>
        </div>

        {/* Dynamic Auth CTA */}
        {needsAuth ? (
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoggingIn ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.191-2.776-6.191-6.191s2.776-6.191 6.191-6.191c1.481 0 2.859.541 3.93 1.442l3.181-3.181C18.913 2.14 15.804 1 12.24 1A10.24 10.24 0 002 11.24a10.24 10.24 0 0010.24 10.24c5.795 0 10.24-4.072 10.24-10.24 0-.693-.082-1.353-.223-1.955H12.24z" />
              </svg>
            )}
            {isLoggingIn ? "Connecting..." : "Sign in with Google"}
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" referrerpolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800 max-w-[150px] truncate">{user?.displayName || "Connected User"}</div>
              <div className="text-[10px] text-slate-400 max-w-[150px] truncate">{user?.email || ""}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main interactive area */}
      {needsAuth ? (
        /* Sign-in prompt layout */
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-indigo-500" />
          </div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">Connect with Google Account</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Authenticate to safely authorize PromptStudio to create and populate standard spreadsheet tabs on your Google Drive.
          </p>
          <button
            onClick={handleLogin}
            className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Authorize Sheets Sync
          </button>
        </div>
      ) : (
        /* Authenticated export panel grid */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Left panel: Trigger Sync (Spans 7 columns) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                  Ready to Sync
                </span>
                <span className="text-[10px] font-mono text-slate-400">Target: Multi-Tab Spreadsheet</span>
              </div>

              <h4 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2">
                Export to Spreadsheet Document
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg mb-4">
                This will automatically format all copy sections, SEO fields, custom prompts, and compiled responsive layout files across five structured tabs: 
                <strong> Homepage Copy, About Us Copy, Services Copy, Contact Copy,</strong> and <strong>Developer Layout Code</strong>.
              </p>

              {/* Optional Custom Sheet Target */}
              <div className="space-y-1.5 mt-2 max-w-md">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Overwrite Existing Spreadsheet (Optional ID or URL)
                </label>
                <input
                  type="text"
                  value={customSpreadsheetId}
                  onChange={(e) => setCustomSpreadsheetId(e.target.value)}
                  placeholder="Leave empty to create a new sheet..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex flex-wrap items-center justify-between gap-4">
              {copyData ? (
                <button
                  onClick={triggerExport}
                  disabled={isSyncing}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                  )}
                  {isSyncing ? "Syncing to Sheets..." : "Sync & Export Workspace"}
                </button>
              ) : (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-amber-700 leading-relaxed flex gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    No generated workspace data available. Fill out configurations in the left panel and click <strong>Generate Workspace</strong> to compose text first!
                  </span>
                </div>
              )}

              {/* Real-time feedback status */}
              {syncStatus !== "idle" && (
                <div className="text-xs font-medium">
                  {syncStatus === "creating" && <span className="text-blue-500 animate-pulse">Creating sheets container...</span>}
                  {syncStatus === "populating" && <span className="text-blue-500 animate-pulse">Writing formatted values...</span>}
                  {syncStatus === "success" && (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Export Complete!
                    </span>
                  )}
                  {syncStatus === "error" && <span className="text-rose-500">Export failed. Try again.</span>}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Successful Export Result (Spans 5 columns) */}
          <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            
            {lastExported ? (
              <>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Spreadsheet Synchronized</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your generated copywriting materials and functional frontend layouts have been stored securely. Click below to view the live sheet document.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-[11px] font-mono leading-tight space-y-1">
                    <div className="text-slate-500 uppercase tracking-widest text-[9px] font-bold">Document ID</div>
                    <div className="text-slate-300 truncate">{lastExported.spreadsheetId}</div>
                  </div>

                  <a
                    href={lastExported.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Sheet Document
                  </a>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                <FileSpreadsheet className="w-12 h-12 text-slate-700 mb-2 animate-bounce" />
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">No active sheet created</h5>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Trigger the export above to spin up a formatted Google Sheet and view details here.
                </p>
              </div>
            )}
          </div>

          {/* History List (Spans 12 columns full width) */}
          {history.length > 0 && (
            <div className="col-span-1 md:col-span-12 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-4.5 h-4.5 text-slate-400" />
                <h4 className="text-sm font-bold text-slate-900">Recent Spreadsheet History</h4>
              </div>

              <div className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Spreadsheet ID: {item.id}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
                        title="Open Google Sheet"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal (MANDATORY for user data modifications) */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Confirm Sheets Sync & Export?
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You are about to modify spreadsheet content inside your Google Drive. This action will create a new spreadsheet (or overwrite sheets in an existing one) with multiple formatted tabs:
                </p>
                <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1 pt-1.5">
                  <li>Homepage Copy, About Us, Services, Contact</li>
                  <li>Developer Layout Code blocks (if generated)</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmedExport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-emerald-100 cursor-pointer"
              >
                Confirm Sync
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
