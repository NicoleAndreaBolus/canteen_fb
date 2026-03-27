import React, { useState } from "react";
import { submitFeedback } from "../api";

export default function FeedbackForm({ navigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ customer_name: "", rating: 5, comment: "" });
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "rating" ? Number(value) : value });
  };

  const handleSubmit = async () => {
    setStatus({ loading: true, message: "Securing feedback with EdDSA...", type: "info" });
    try {
      await submitFeedback(form);
      setStatus({ loading: false, message: "Feedback digitally signed and saved!", type: "success" });
      setTimeout(() => navigate('landing'), 2500); // Go back home after success
    } catch (err) {
      setStatus({ loading: false, message: err.message, type: "error" });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px' }}>
      <div style={{ border: '1px solid #e5e2d9', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', color: '#666', marginBottom: '20px' }}>
        🔒 EdDSA Secured
      </div>
      
      <h1 className="serif" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
        Rate Your <span style={{ color: 'var(--accent-gold)' }}>Experience</span>
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Your feedback is signed with Ed25519 and saved securely.</p>
      
      <button className="btn-secondary" onClick={() => navigate('landing')}>← Back</button>

      <div className="step-indicator">
        <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        {step === 1 && (
          <div>
            <label>Full Name (Optional)</label>
            <input name="customer_name" placeholder="e.g. Maria Santos" value={form.customer_name} onChange={handleChange} />
            <button className="btn-primary" style={{ marginTop: '30px' }} onClick={() => setStep(2)}>Next: Rate Experience →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Overall Rating</label>
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
              <option value={4}>⭐⭐⭐⭐ - Good</option>
              <option value={3}>⭐⭐⭐ - Average</option>
              <option value={2}>⭐⭐ - Poor</option>
              <option value={1}>⭐ - Terrible</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Next: Comments →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Comments</label>
            <textarea name="comment" placeholder="Tell us what you liked or how we can improve..." value={form.comment} onChange={handleChange} style={{ height: '120px' }}></textarea>
            
            {status.message && (
              <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center', color: status.type === 'error' ? 'red' : 'green' }}>
                {status.message}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)} disabled={status.loading}>Back</button>
              <button className="btn-primary" style={{ flex: 2, backgroundColor: 'var(--bg-dark-green)' }} onClick={handleSubmit} disabled={status.loading}>
                {status.loading ? "Signing..." : "Sign & Submit securely"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}