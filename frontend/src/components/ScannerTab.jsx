import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Loader, Activity, Cpu } from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function ScannerTab({ onApiCall }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(false);

  const fetchHistory = async () => {
    try {
      console.log('Fetching history from:', `${API_BASE}/history`);
      const response = await fetch(`${API_BASE}/history`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Fetch history error:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleScan = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    onApiCall();

    try {
      console.log('Sending scan request to:', `${API_BASE}/scan`);
      const response = await fetch(`${API_BASE}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ai_enabled: aiEnabled })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API returned an error');
      }
      
      console.log('Scan completed successfully:', data);
      setResult(data);
      fetchHistory();
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to connect to API. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-mono font-bold text-cyber-primary flex items-center">
            <span className="mr-2">&gt;</span> PROMPT_ANALYZER_MODULE
          </h2>
          <div className="flex items-center space-x-3 bg-cyber-bg border border-cyber-border rounded px-4 py-2">
            <Cpu className={`w-4 h-4 ${aiEnabled ? 'text-cyber-primary animate-pulse' : 'text-cyber-muted'}`} />
            <span className="font-mono text-sm text-cyber-text">AI ANALYSIS</span>
            <button 
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${aiEnabled ? 'bg-cyber-primary' : 'bg-cyber-border'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-cyber-bg transition-transform ${aiEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt to scan for injection patterns..."
          className="w-full h-48 bg-cyber-bg border border-cyber-border rounded text-cyber-text p-4 font-mono focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-colors resize-none"
        />
        
        <button
          onClick={handleScan}
          disabled={loading || !prompt.trim()}
          className="w-full py-4 bg-cyber-primary/20 hover:bg-cyber-primary/30 text-cyber-primary border border-cyber-primary rounded font-mono font-bold tracking-widest transition-all hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? <Loader className="animate-spin w-5 h-5 mr-3" /> : null}
          {loading ? 'ANALYZING...' : 'INITIATE_SCAN'}
        </button>

        {error && (
          <div className="p-4 bg-cyber-danger/10 border border-cyber-danger rounded flex items-start space-x-3 text-cyber-danger">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 border border-cyber-border rounded bg-cyber-bg p-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              result.risk === 'dangerous' ? 'bg-cyber-danger shadow-neon-danger' : 
              result.risk === 'suspicious' ? 'bg-[#ffb300]' : 'bg-cyber-primary'
            }`} />
            
            <div className="flex justify-between items-start mb-6 pl-4">
              <div>
                <h3 className="text-2xl font-mono font-bold uppercase" style={{
                  color: result.risk === 'dangerous' ? 'var(--cyber-danger)' : 
                         result.risk === 'suspicious' ? '#ffb300' : 'var(--cyber-primary)'
                }}>
                  RISK_LEVEL: {result.risk}
                </h3>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs font-mono font-bold bg-cyber-surface border border-cyber-border px-2 py-1 rounded text-cyber-text">
                    METHOD: {result.detection_method}
                  </span>
                  {result.ai_analysis?.skipped && (
                    <span className="text-xs font-mono font-bold bg-cyber-warning/20 border border-cyber-warning px-2 py-1 rounded text-[#ffb300]">
                      AI_SCAN: SKIPPED — RULE ENGINE SUFFICIENT
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold font-mono" style={{
                  color: result.risk === 'dangerous' ? 'var(--cyber-danger)' : 
                         result.risk === 'suspicious' ? '#ffb300' : 'var(--cyber-primary)'
                }}>
                  {result.score}
                </div>
                <div className="text-xs text-cyber-muted font-mono mt-1">FINAL_SCORE</div>
              </div>
            </div>

            <div className="pl-4 space-y-6">
              {/* Score Bars */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-mono text-cyber-muted">RULE SCORE</span>
                    <span className="text-xs font-mono text-cyber-text">{result.rule_score}/100</span>
                  </div>
                  <div className="w-full bg-cyber-surface rounded-full h-2 border border-cyber-border">
                    <div className="bg-cyber-primary h-1.5 rounded-full" style={{ width: `${result.rule_score}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-mono text-cyber-muted">AI SCORE</span>
                    <span className="text-xs font-mono text-cyber-text">{result.ai_score}/100</span>
                  </div>
                  <div className="w-full bg-cyber-surface rounded-full h-2 border border-cyber-border">
                    <div className="bg-[#ffb300] h-1.5 rounded-full" style={{ width: `${result.ai_score}%` }}></div>
                  </div>
                </div>
              </div>

              {result.ai_analysis && result.ai_analysis.reason && (
                <div className="bg-cyber-surface border border-cyber-border p-3 rounded">
                  <span className="text-xs font-mono text-cyber-primary block mb-1">AI_ANALYSIS_REASON:</span>
                  <span className="text-sm font-mono text-cyber-text">{result.ai_analysis.reason}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-cyber-border pt-6 mt-6">
                <div>
                  <div className="text-xs text-cyber-muted font-mono mb-1">CONFIDENCE</div>
                  <div className="font-mono text-lg uppercase text-cyber-text">{result.confidence}</div>
                </div>
                <div>
                  <div className="text-xs text-cyber-muted font-mono mb-1">FLAGS_DETECTED</div>
                  {result.flags && result.flags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.flags.map((flag, i) => (
                        <span key={i} className="px-2 py-1 bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger rounded text-xs font-mono">
                          {flag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-cyber-primary font-mono text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" /> NONE DETECTED
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-l border-cyber-border pl-8">
        <h3 className="font-mono font-bold text-cyber-muted mb-6 flex items-center">
          <Activity className="w-4 h-4 mr-2" /> RECENT_SCANS LOG
        </h3>
        
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <p className="text-cyber-muted/50 text-sm font-mono italic">No logs found...</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="bg-cyber-bg p-3 border border-cyber-border rounded text-sm relative">
                 <div className={`absolute top-0 left-0 w-1 h-full rounded-l ${
                  item.risk === 'dangerous' ? 'bg-cyber-danger' : 
                  item.risk === 'suspicious' ? 'bg-[#ffb300]' : 'bg-cyber-primary'
                }`} />
                <div className="font-mono text-xs text-cyber-muted mb-2 pl-3">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
                <div className="font-mono truncate text-cyber-text pl-3">
                  "{item.prompt}"
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
