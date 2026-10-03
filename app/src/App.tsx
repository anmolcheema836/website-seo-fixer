import { useState } from 'react';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleScan = async () => {
    setIsScanning(true);
    // In a real MCP App, this would connect via transport to the MCP server.
    // For demo UI purposes, we simulate the fetch delay.
    setTimeout(() => {
      setReport({
        score: 78,
        issues: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 1
        }
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Website SEO Fixer</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="url" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleScan}
          disabled={isScanning || !url}
          style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isScanning ? 'Auditing...' : 'Run Audit'}
        </button>
      </div>

      {report && (
        <div className="score-card">
          <h2>Overall SEO Score</h2>
          <div className="score-circle">{report.score}/100</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
            <div><strong style={{ color: '#dc2626' }}>{report.issues.critical}</strong> Critical</div>
            <div><strong style={{ color: '#ea580c' }}>{report.issues.high}</strong> High</div>
            <div><strong style={{ color: '#ca8a04' }}>{report.issues.medium}</strong> Medium</div>
            <div><strong style={{ color: '#16a34a' }}>{report.issues.low}</strong> Low</div>
          </div>
        </div>
      )}
    </div>
  );
}