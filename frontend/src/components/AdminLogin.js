import React, { useState } from "react";
import { Shield } from 'lucide-react';

export default function AdminLogin({ navigate }) {
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") navigate("admin-dashboard");
    else alert("Invalid credentials. Try 'admin123'");
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '40px 30px' }}>
        
        <div style={{ background: 'var(--bg-dark-green)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Shield color="#5192ff" size={32} />
        </div>
        
        <h2 className="serif" style={{ fontSize: '1.8rem' }}>Admin <span style={{ color: 'var(--accent-gold)' }}>Login</span></h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>CIT Canteen Evaluation System</p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <label>Username</label>
          <input type="text" value="admin" disabled style={{ color: '#999' }} />
          
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

          <button type="submit" className="btn-dark" style={{ marginTop: '30px', marginBottom: '15px' }}>Login →</button>
        </form>

        <button className="btn-secondary" onClick={() => navigate('landing')}>← Back to Home</button>
      </div>
    </div>
  );
}