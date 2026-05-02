import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShieldCheck, Activity, AlertTriangle, AlertOctagon, 
  RefreshCw, Server, WifiOff, Globe, Zap, List, 
  UserX, ShieldAlert, Cpu, Database, Pause, Play
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import styles from '../styles/SecurityDashboard.module.css';

/**
 * Security Command Center — Dashboard PRO
 * 
 * Reglas de refresh inteligente:
 *   CRITICAL (score > 75): 2s   (no 1s — evita auto-amplificar carga)
 *   WARNING  (score > 40): 5s
 *   NORMAL   (score <= 40): 10s
 *   PAUSED:  manual only
 * 
 * El endpoint /stats está excluido del tracking de RPS en el backend,
 * así que el dashboard NO se mide a sí mismo.
 */

const REFRESH_RATES = {
  CRITICAL: 2000,
  WARNING: 5000,
  NORMAL: 10000
};

const SecurityDashboardPage = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_RATES.NORMAL);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [paused, setPaused] = useState(false);
  const [incidentMode, setIncidentMode] = useState(false);
  const timerRef = useRef(null);
  const fetchCountRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (paused) return;

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/admin/security/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Dashboard-Poll': 'true' // Signal to backend: exclude from RPS tracking
        }
      });

      if (!response.ok) throw new Error('Security Orchestrator Unreachable');
      
      const result = await response.json();
      if (!result.success) throw new Error('Invalid response from backend');

      setData(result);
      setError(null);
      setLastUpdated(new Date());
      fetchCountRef.current++;

      // Append to chart history (keep last 30 data points)
      setHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          rps: result.observability.rps,
          errors: result.observability.errors4xx + result.observability.errors5xx,
          latency: result.observability.latencyP95,
          pressure: result.observability.attackPressure,
          blocked: result.observability.blocked
        };
        return [...prev, newPoint].slice(-30);
      });

      // Adaptive refresh rate (deterministic, based on score thresholds)
      const score = result.header.riskScore;
      const isCrit = score > 75 || result.header.controlPlane === 'RED';
      const isWarn = score > 40 || result.header.controlPlane === 'ORANGE' || result.header.controlPlane === 'YELLOW';

      if (isCrit) {
        setRefreshInterval(REFRESH_RATES.CRITICAL);
        setIncidentMode(true);
      } else if (isWarn) {
        setRefreshInterval(REFRESH_RATES.WARNING);
        setIncidentMode(false);
      } else {
        setRefreshInterval(REFRESH_RATES.NORMAL);
        setIncidentMode(false);
      }

    } catch (err) {
      setError(err.message);
      // On error, slow down to avoid hammering a down server
      setRefreshInterval(15000);
    } finally {
      setLoading(false);
    }
  }, [paused]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    return () => clearTimeout(timerRef.current);
  }, []);

  // Scheduled fetch with dynamic interval
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(fetchData, refreshInterval);
    return () => clearTimeout(timerRef.current);
  }, [refreshInterval, lastUpdated, paused, fetchData]);

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <RefreshCw className="animate-spin text-blue-500 mb-4" size={48} />
        <h2 className="text-xl font-bold">SEC_OS_INIT</h2>
        <p className="text-sm text-gray-500 mt-2">Conectando con el orquestador de seguridad...</p>
      </div>
    );
  }

  if (!data) return null;

  const { header, observability, intelligence } = data;
  const isCritical = header.threatLevel === 'CRITICAL';

  const getControlPlaneColor = (level) => {
    switch(level) {
      case 'RED': return '#ef4444';
      case 'ORANGE': return '#f97316';
      case 'YELLOW': return '#eab308';
      default: return '#22c55e';
    }
  };

  const getThreatColor = (level) => {
    switch(level) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      default: return '#22c55e';
    }
  };

  return (
    <div className={`${styles.dashboardContainer} ${incidentMode ? styles.incidentMode : ''}`}>
      
      {/* ═══════════════════════════════════════════════════════════════
          ZONE A: GLOBAL COMMAND HEADER (sticky top)
          ═══════════════════════════════════════════════════════════════ */}
      <header className={styles.commandHeader}>
        <div className="flex items-center gap-4">
          <ShieldAlert 
            className={isCritical ? styles.pulseRed : ''} 
            size={32} 
            style={{ color: isCritical ? '#ef4444' : '#3b82f6' }}
          />
          <div>
            <h1 className="text-xl font-black tracking-tighter">SECURITY_COMMAND_CENTER</h1>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              v2.4.0-STABLE // {header.mode} // polls: {fetchCountRef.current}
            </p>
          </div>
        </div>

        <div className={styles.statusGroup}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Control Plane</span>
            <div className={styles.statusValue} style={{ color: getControlPlaneColor(header.controlPlane) }}>
              ● {header.controlPlane}
            </div>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Global Risk</span>
            <div className={styles.statusValue} style={{ color: header.riskScore > 50 ? '#f97316' : '#3b82f6' }}>
              {header.riskScore}
            </div>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Threat Level</span>
            <div className={styles.statusValue} style={{ color: getThreatColor(header.threatLevel) }}>
              {header.threatLevel}
            </div>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>p95 Latency</span>
            <div className={styles.statusValue}>{header.latency}ms</div>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Active Blocks</span>
            <div className={styles.statusValue} style={{ color: header.activeAttacks > 0 ? '#ef4444' : 'inherit' }}>
              {header.activeAttacks}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPaused(!paused)} 
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border transition-colors"
            style={{ 
              borderColor: paused ? '#eab308' : 'var(--border-primary)', 
              color: paused ? '#eab308' : 'var(--text-secondary)',
              background: 'transparent'
            }}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
            {paused ? 'RESUME' : 'PAUSE'}
          </button>
          <div className="text-right">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              {paused ? 'PAUSED' : `${refreshInterval / 1000}s`}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 p-3 rounded-lg text-sm" 
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
          <WifiOff size={18} /> {error}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ZONE B: CORE OBSERVABILITY GRID (charts)
          ═══════════════════════════════════════════════════════════════ */}
      <div className={styles.observabilityGrid}>
        
        {/* Traffic & Errors */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className="font-bold flex items-center gap-2">
              <Activity size={18} style={{ color: '#3b82f6' }} /> Traffic & Errors
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              RPS (area) vs Blocked (line)
            </span>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={10} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area type="monotone" dataKey="rps" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRps)" strokeWidth={2} name="RPS" />
                <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} dot={false} name="Blocked" />
                <Line type="monotone" dataKey="errors" stroke="#f59e0b" strokeWidth={1} dot={false} name="4xx" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Pressure & Latency */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3 className="font-bold flex items-center gap-2">
              <Zap size={18} style={{ color: '#f97316' }} /> Attack Pressure Index
            </h3>
            <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
              Pressure (step) vs Latency (dashed)
            </span>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={10} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Line type="stepAfter" dataKey="pressure" stroke="#f59e0b" strokeWidth={3} dot={false} name="Pressure %" />
                <Line type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={1} dot={false} strokeDasharray="5 5" name="Latency ms" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE C: SECURITY INTELLIGENCE PANEL
          ═══════════════════════════════════════════════════════════════ */}
      <div className={styles.intelligencePanel}>
        
        {/* Event Stream */}
        <div className={styles.intelligenceCard}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <List size={18} style={{ color: '#60a5fa' }} /> Security Event Stream
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                LIFO × {intelligence.events.length}
              </span>
            </div>
          </div>
          <div className={styles.eventStream}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>TYPE</th>
                  <th>IP</th>
                  <th>ENDPOINT</th>
                  <th>ACTION</th>
                  <th>SCORE</th>
                </tr>
              </thead>
              <tbody>
                {intelligence.events.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                      Sistema limpio. Sin eventos de mitigación.
                    </td>
                  </tr>
                ) : (
                  intelligence.events.map((evt, idx) => (
                    <tr key={evt.correlationId || evt.id || idx}>
                      <td className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour12: false })}
                      </td>
                      <td className="font-bold text-[11px]" style={{ color: '#60a5fa' }}>
                        {evt.type || 'ANOMALY'}
                      </td>
                      <td className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {evt.ip}
                      </td>
                      <td className="text-[11px]" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {evt.method} {evt.endpoint}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${
                          evt.action === 'BLOCKED' || evt.decision === 'BLOCKED' ? styles.severityHigh 
                          : evt.action === 'RATE_LIMITED' || evt.decision === 'RATE_LIMITED' ? styles.severityMedium 
                          : styles.severityLow
                        }`}>
                          {evt.action || evt.decision}
                        </span>
                      </td>
                      <td className="font-mono text-[11px] text-center font-bold">
                        {evt.riskScore || evt.severity || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar: Top IPs + Rules */}
        <div className="flex flex-col gap-6">
          
          {/* Top Attackers */}
          <div className={styles.intelligenceCard}>
            <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <UserX size={14} /> Top Hostile IPs (24h)
            </h3>
            <div className="flex flex-col gap-3">
              {(!intelligence.topAttackers || intelligence.topAttackers.length === 0) ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Sin IPs hostiles persistentes.
                </p>
              ) : (
                intelligence.topAttackers.map((atk, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded"
                    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)' }}>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{atk.ip}</span>
                    <span className="text-xs font-bold" style={{ color: '#ef4444' }}>{atk.hits} hits</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rule Trigger Analysis */}
          <div className={styles.intelligenceCard}>
            <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Database size={14} /> Rule Trigger Analysis
            </h3>
            <div className="flex flex-col gap-4">
              {(!intelligence.triggeredRules || intelligence.triggeredRules.length === 0) ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Sin reglas activadas hoy.
                </p>
              ) : (
                intelligence.triggeredRules.map((rule, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-mono" style={{ color: '#60a5fa' }}>{rule.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{rule.hits} hits</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, rule.hits * 2)}%`,
                          backgroundColor: rule.severity === 'HIGH' ? '#ef4444' : rule.severity === 'MEDIUM' ? '#f59e0b' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SecurityDashboardPage;
