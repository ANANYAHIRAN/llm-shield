import React, { useState } from 'react';
import { Key, Copy, CheckCircle, Plus, Eye, EyeOff, Activity, Clock, Server, AlertCircle, Trash2, X } from 'lucide-react';

export default function ApiKeys({ apiKeys, setApiKeys }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showKeyVals, setShowKeyVals] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState('TESTING');
  const [keyToDelete, setKeyToDelete] = useState(null);

  const getMasked = (key) => key.substring(0, 13) + '••••••••••••' + key.slice(-4);

  const handleCopy = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShow = (id) => {
    setShowKeyVals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;
    const newStr = 'sk-llmshield-' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    setApiKeys([...apiKeys, {
      id: Math.random().toString(36).substring(2, 9),
      name: newKeyName,
      env: newKeyEnv,
      key: newStr,
      totalRequests: 0,
      lastUsed: 'Never',
      limit: newKeyEnv === 'PRODUCTION' ? 10000 : 1000,
      used: 0,
      active: apiKeys.length === 0
    }]);
    
    setNewKeyName('');
    setIsModalOpen(false);
  };

  const removeKey = (id) => {
    const newList = apiKeys.filter(k => k.id !== id);
    if (newList.length > 0 && !newList.find(k => k.active)) {
      newList[0].active = true;
    }
    setApiKeys(newList);
    setKeyToDelete(null);
  };

  const setActive = (id) => {
    setApiKeys(apiKeys.map(k => ({
      ...k,
      active: k.id === id
    })));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto md:mx-0 relative pb-10">
      <div>
        <h2 className="text-2xl font-mono font-bold text-white mb-2 max-w-[200px]">API KEYS</h2>
        <p className="text-sm text-gray-400">Manage your secret keys to authenticate with the LLM_SHIELD API.</p>
      </div>

      <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 p-4 rounded-lg flex items-start space-x-3">
        <AlertCircle className="text-[#00ff41] w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-mono text-[#00ff41]">
          Your API key authenticates requests to the LLM_SHIELD API. Never expose it in client-side code, public repositories, or unsecured environments.
        </p>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#00ff41] text-black hover:bg-[#00cc33] font-mono text-sm font-bold rounded shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Key</span>
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map(k => (
          <div key={k.id} className={`glass-card p-6 ${k.active ? 'border-[#00ff41]/50 shadow-[0_0_15px_rgba(0,255,65,0.05)]' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg border ${k.active ? 'bg-[#00ff41]/10 border-[#00ff41]/30 text-[#00ff41]' : 'bg-[#162b42]/50 border-[#162b42] text-gray-400'}`}>
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center">
                    {k.name}
                  </h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono border uppercase tracking-wider ${k.env === 'PRODUCTION' ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/50' : 'bg-[#ffb300]/20 text-[#ffb300] border-[#ffb300]/50'}`}>
                      {k.env}
                    </span>
                    {k.active && <span className="text-[10px] bg-[#162b42] text-white px-2 py-0.5 rounded font-mono border border-gray-600">DEFAULT</span>}
                  </div>
                </div>
              </div>

              {!k.active && (
                <button 
                  onClick={() => setActive(k.id)}
                  className="text-xs font-mono text-gray-400 hover:text-[#00ff41] transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="bg-[#050a0f] border border-[#162b42] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="font-mono text-sm tracking-wider text-gray-300 break-all">
                {showKeyVals[k.id] ? k.key : getMasked(k.key)}
              </div>
              <div className="flex space-x-2 w-full md:w-auto">
                <button 
                  onClick={() => toggleShow(k.id)}
                  className="flex-1 md:flex-none px-3 py-2 bg-[#162b42]/50 hover:bg-[#162b42] text-gray-300 rounded transition-colors flex items-center justify-center cursor-pointer"
                >
                  {showKeyVals[k.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleCopy(k.id, k.key)}
                  className="flex-1 md:flex-none px-4 py-2 bg-[#162b42]/50 hover:bg-[#162b42] text-gray-300 rounded transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {copiedKey === k.id ? <CheckCircle className="w-4 h-4 text-[#00ff41]" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm font-mono">{copiedKey === k.id ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#162b42]/50">
              <div className="flex flex-wrap gap-2 md:gap-4">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#162b42]/30 rounded-md border border-[#162b42]">
                  <Activity className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-xs text-gray-300">Requests: {k.totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#162b42]/30 rounded-md border border-[#162b42]">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-xs text-gray-300">Last Used: {k.lastUsed}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#162b42]/30 rounded-md border border-[#162b42]">
                  <Server className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-xs text-gray-300">
                    Limit: {k.limit}/day — 
                  </span>
                  <div className="w-[80px] h-2 bg-[#050a0f] rounded-full mx-2 overflow-hidden border border-[#162b42]">
                    <div className="h-full bg-[#00ff41]/60" style={{width: `${(k.used/k.limit)*100}%`}}></div>
                  </div>
                  <span className="font-mono text-xs tracking-wider text-gray-400">{k.used} used</span>
                </div>
              </div>
              
              <button 
                onClick={() => setKeyToDelete(k.id)}
                className="p-2 text-gray-500 hover:text-[#ff2a2a] hover:bg-[#ff2a2a]/10 rounded transition-colors cursor-pointer"
                title="Revoke Key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {apiKeys.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-mono">
            No API keys found. Establish a new key to authenticate.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md border border-[#00ff41]/30 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
            <div className="px-6 py-4 border-b border-[#162b42] flex justify-between items-center">
              <h3 className="font-mono font-bold text-white uppercase text-lg">Create New Key</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#00ff41] mb-2 tracking-widest">KEY NAME</label>
                <input 
                  type="text" 
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Backend" 
                  className="w-full bg-[#050a0f] border border-[#162b42] text-white rounded p-3 font-mono text-sm focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]" autoFocus
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-[#00ff41] mb-2 tracking-widest">ENVIRONMENT</label>
                <select 
                  value={newKeyEnv}
                  onChange={e => setNewKeyEnv(e.target.value)}
                  className="w-full bg-[#050a0f] border border-[#162b42] text-white rounded p-3 font-mono text-sm focus:outline-none focus:border-[#00ff41]"
                >
                  <option value="PRODUCTION">Production</option>
                  <option value="TESTING">Testing / Development</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#162b42] flex justify-end space-x-3 bg-black/40">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-mono text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button 
                onClick={createKey}
                disabled={!newKeyName.trim()}
                className="px-6 py-2 bg-[#00ff41] text-black hover:bg-[#00cc33] font-mono text-sm font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                GENERATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {keyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-sm border border-[#ff2a2a]/30">
            <div className="p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-[#ff2a2a]" />
              </div>
              <h3 className="font-mono font-bold text-white text-lg">Revoke API Key?</h3>
              <p className="text-gray-400 text-sm">Any applications using this key will immediately be denied access. This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-[#162b42] flex justify-end space-x-3 bg-black/40">
              <button 
                onClick={() => setKeyToDelete(null)}
                className="px-4 py-2 font-mono text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button 
                onClick={() => removeKey(keyToDelete)}
                className="px-6 py-2 bg-[#ff2a2a] text-white hover:bg-red-600 font-mono text-sm font-bold rounded transition-all shadow-[0_0_15px_rgba(255,42,42,0.3)] cursor-pointer"
              >
                REVOKE KEY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
