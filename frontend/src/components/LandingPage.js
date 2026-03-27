import React from 'react';
import { ShieldCheck, Utensils } from 'lucide-react';

export default function LandingPage({ navigate }) {
  return (
    <div className="landing-bg">
      <div style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', color: '#c59b41', marginBottom: '30px', letterSpacing: '1px' }}>
        • EdDSA • Ed25519 • Group 1 • Mid Lab 2
      </div>
      
      <h1 className="serif" style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '15px', color: '#f7f4ec' }}>
        CIT Canteen<br/>Evaluation System
      </h1>
      <p style={{ color: '#a0aab2', textAlign: 'center', maxWidth: '400px', marginBottom: '60px' }}>
        Every feedback submission is digitally signed with a real Ed25519 private key to ensure authenticity.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Customer Portal Card */}
        <div 
          onClick={() => navigate('customer')}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', width: '300px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <div style={{ background: 'rgba(255,255,255,0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Utensils color="#f7f4ec" size={28} />
          </div>
          <h3 className="serif" style={{ color: '#f7f4ec', fontSize: '1.4rem', marginBottom: '10px' }}>Customer Portal</h3>
          <p style={{ color: '#8a99a8', fontSize: '13px' }}>Rate your experience — signed with real EdDSA</p>
        </div>

        {/* Admin Portal Card */}
        <div 
          onClick={() => navigate('admin-login')}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', width: '300px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <div style={{ background: 'rgba(255,255,255,0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShieldCheck color="#5192ff" size={28} />
          </div>
          <h3 className="serif" style={{ color: '#f7f4ec', fontSize: '1.4rem', marginBottom: '10px' }}>Admin Portal</h3>
          <p style={{ color: '#8a99a8', fontSize: '13px' }}>Dashboard, records, verification & audit log</p>
        </div>

      </div>
    </div>
  );
}