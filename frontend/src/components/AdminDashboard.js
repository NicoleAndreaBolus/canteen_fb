import React, { useEffect, useState } from "react";
import { getAllFeedbacks, verifyFeedback } from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, FileText, CheckCircle, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminDashboard({ navigate }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [verifyState, setVerifyState] = useState({});
  const [activeMenu, setActiveMenu] = useState("dashboard"); // <-- New State for Sidebar

  useEffect(() => {
    getAllFeedbacks().then(setFeedbacks).catch(console.error);
  }, []);

  const total = feedbacks.length;
  const avg = total > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1) : "0.0";
  
  const pieData = [5, 4, 3, 2, 1].map(star => ({
    name: `${star} Stars`,
    value: feedbacks.filter(f => f.rating === star).length
  })).filter(d => d.value > 0);
  const COLORS = ['#1b3022', '#2b7a4b', '#b37e34', '#d4a373', '#b33939'];

  const handleVerify = async (feedback) => {
    setVerifyState(prev => ({ ...prev, [feedback.id]: "checking" }));
    setTimeout(async () => {
      try {
        const { valid } = await verifyFeedback(feedback);
        setVerifyState(prev => ({ ...prev, [feedback.id]: valid ? "valid" : "invalid" }));
      } catch (e) {
        setVerifyState(prev => ({ ...prev, [feedback.id]: "invalid" }));
      }
    }, 800);
  };

  // Helper for Sidebar Buttons
  const MenuItem = ({ id, icon: Icon, label }) => {
    const isActive = activeMenu === id;
    return (
      <div 
        onClick={() => setActiveMenu(id)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', 
          borderRadius: '8px', 
          color: isActive ? 'var(--accent-gold)' : '#a0aab2', 
          marginBottom: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <Icon size={20} /> <span style={{ fontWeight: isActive ? 500 : 400 }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f7f1' }}>
      
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: 'var(--bg-dark-green)', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 className="serif" style={{ color: 'white', fontSize: '1.4rem', marginBottom: '5px' }}>CIT <span style={{ color: 'var(--accent-gold)' }}>Canteen</span></h2>
        <p style={{ fontSize: '11px', color: '#a0aab2', marginBottom: '40px' }}>EdDSA Secured • Admin</p>

        {/* Live Sidebar Buttons */}
        <MenuItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
        <MenuItem id="records" icon={FileText} label="All Records" />
        <MenuItem id="verify" icon={ShieldCheck} label="Crypto Logs" />

        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>CIT Admin</div>
            <div style={{ fontSize: '11px', color: '#a0aab2' }}>admin@cit.edu.ph</div>
          </div>
          <LogOut size={18} color="#a0aab2" style={{ cursor: 'pointer' }} onClick={() => navigate('landing')} title="Logout" />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px 50px', overflowY: 'auto' }}>
        
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeMenu === "dashboard" && (
          <div>
            <h1 className="serif" style={{ fontSize: '2.2rem', marginBottom: '5px' }}>Dashboard <span style={{ color: 'var(--accent-gold)' }}>Overview</span></h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Real-time verified insights from PostgreSQL.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div className="card" style={{ borderTop: '4px solid var(--bg-dark-green)' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Total Records</div>
                <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--bg-dark-green)' }}>{total}</div>
              </div>
              <div className="card" style={{ borderTop: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Overall Average</div>
                <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--bg-dark-green)' }}>{avg} <span style={{ fontSize: '1rem', color: '#999' }}>/ 5</span></div>
              </div>
              <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>Data Integrity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <CheckCircle color="var(--success)" /> <span style={{ fontWeight: 500, color: 'var(--success)' }}>EdDSA Active</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div className="card">
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#666', marginBottom: '20px' }}>Score Distribution</h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card" style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#666' }}>Recent Logs</h3>
                  <button className="btn-secondary" style={{ fontSize: '12px', padding: '4px 12px' }} onClick={() => setActiveMenu('records')}>View All →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Name</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Rating</th>
                      <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Integrity Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.slice(0, 4).map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: 500 }}>{f.customer_name || 'Anonymous'}</td>
                        <td style={{ padding: '12px' }}>{f.rating} / 5</td>
                        <td style={{ padding: '12px' }}>
                          <button className="btn-secondary" onClick={() => handleVerify(f)} style={{ padding: '4px 10px', fontSize: '12px', marginRight: '10px' }}>Verify</button>
                          {verifyState[f.id] === 'checking' && <span className="badge badge-checking">Verifying...</span>}
                          {verifyState[f.id] === 'valid' && <span className="badge badge-valid">✓ Authentic</span>}
                          {verifyState[f.id] === 'invalid' && <span className="badge badge-invalid">✗ Tampered</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2 & 3: FULL RECORDS / CRYPTO LOGS */}
        {(activeMenu === "records" || activeMenu === "verify") && (
          <div className="card" style={{ minHeight: '80vh' }}>
            <h1 className="serif" style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{activeMenu === 'records' ? 'All Feedback Records' : 'Cryptographic Logs'}</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>Verify the EdDSA signatures of all historical entries.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>ID</th>
                  <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Name</th>
                  <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Comment</th>
                  <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Rating</th>
                  <th style={{ padding: '12px', fontSize: '13px', color: '#666' }}>Integrity Check</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', color: '#999', fontSize: '13px' }}>#{f.id}</td>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{f.customer_name || 'Anonymous'}</td>
                    <td style={{ padding: '12px', fontSize: '14px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={f.comment}>{f.comment}</td>
                    <td style={{ padding: '12px' }}>{f.rating} / 5</td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn-secondary" onClick={() => handleVerify(f)} style={{ padding: '4px 10px', fontSize: '12px', marginRight: '10px' }}>Verify Signature</button>
                      {verifyState[f.id] === 'checking' && <span className="badge badge-checking">Verifying...</span>}
                      {verifyState[f.id] === 'valid' && <span className="badge badge-valid">✓ Authentic</span>}
                      {verifyState[f.id] === 'invalid' && <span className="badge badge-invalid">✗ Tampered</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}