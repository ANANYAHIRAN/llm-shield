import React, { useState } from 'react';
import { Copy, CheckCircle, Code, BookOpen } from 'lucide-react';

export default function ApiDocsTab() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCodeSnippet = (language) => {
    switch (language) {
      case 'JavaScript':
        return `fetch('http://localhost:5000/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: "your prompt here",
    ai_enabled: true 
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
      case 'Python':
        return `import requests

url = 'http://localhost:5000/api/scan'
payload = {
    "prompt": "your prompt here",
    "ai_enabled": True
}

response = requests.post(url, json=payload)
print(response.json())`;
      case 'curl':
        return `curl -X POST http://localhost:5000/api/scan \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "your prompt here", "ai_enabled": true}'`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-mono font-bold text-cyber-primary mb-2 flex items-center">
          <BookOpen className="mr-2 w-5 h-5" /> API_DOCUMENTATION
        </h2>
        <p className="text-cyber-muted font-mono text-sm max-w-2xl">
          Integrate the LLM_SHIELD Prompt Injection Detection engine directly into your applications. 
          The API returns a comprehensive risk analysis for any given prompt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <EndpointSpec />
        </div>
        
        <div className="space-y-6">
          <h3 className="font-mono font-bold text-cyber-text flex items-center mb-4">
            <Code className="mr-2 w-4 h-4 text-cyber-primary" /> IMPLEMENTATION_EXAMPLES
          </h3>
          
          {['JavaScript', 'Python', 'curl'].map((lang, idx) => (
            <div key={idx} className="bg-cyber-bg border border-cyber-border rounded overflow-hidden">
              <div className="flex justify-between items-center bg-cyber-surface px-4 py-2 border-b border-cyber-border">
                <span className="font-mono text-xs font-bold text-cyber-muted">{lang}</span>
                <button 
                  onClick={() => copyToClipboard(getCodeSnippet(lang), lang)}
                  className="text-cyber-muted hover:text-cyber-primary transition-colors focus:outline-none"
                  title="Copy to clipboard"
                >
                  {copied === lang ? <CheckCircle className="w-4 h-4 text-cyber-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-cyber-primary/90">
                <code>{getCodeSnippet(lang)}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EndpointSpec() {
  return (
    <div className="bg-cyber-bg border border-cyber-border rounded p-6">
      <div className="flex items-center space-x-3 mb-6">
        <span className="bg-cyber-primary text-cyber-bg font-mono font-bold px-3 py-1 rounded text-sm">POST</span>
        <span className="font-mono text-cyber-text">/api/scan</span>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-mono text-xs text-cyber-muted uppercase tracking-wider mb-2 border-b border-cyber-border pb-1">Request Body</h4>
          <pre className="bg-cyber-surface p-3 rounded text-sm font-mono text-cyber-text border border-cyber-border">
{JSON.stringify({ prompt: "string", ai_enabled: "boolean (optional)" }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-mono text-xs text-cyber-muted uppercase tracking-wider mb-2 border-b border-cyber-border pb-1">Response Format</h4>
          <pre className="bg-cyber-surface p-3 rounded text-sm font-mono text-cyber-text border border-cyber-border overflow-y-auto max-h-96">
{JSON.stringify({
  risk: "dangerous | suspicious | safe",
  score: "0-100",
  rule_score: "0-100",
  ai_score: "0-100",
  confidence: "high | medium | low",
  flags: ["matched_pattern_1"],
  ai_analysis: {
    is_injection: "boolean",
    reason: "Description of analysis",
    severity: "none | low | medium | high | critical",
    confidence: "0-100"
  },
  detection_method: "HYBRID | RULE_ONLY",
  message: "string"
}, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-mono text-xs text-cyber-muted uppercase tracking-wider mb-2 border-b border-cyber-border pb-1">Rate Limits</h4>
          <p className="text-sm font-mono text-cyber-warning">Maximum 20 requests per minute per IP address.</p>
        </div>
      </div>
    </div>
  );
}
