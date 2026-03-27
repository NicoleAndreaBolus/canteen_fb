import React, { useState } from "react";
import { submitFeedback } from "../api";
import { Star, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2 for the summary

export default function FeedbackForm({ navigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ customer_name: "", comment: "" });
  
  const [ratings, setRatings] = useState({
    Food: 5,
    Service: 5,
    Staff: 5,
    Cleanliness: 5,
    Value: 5
  });
  
  const [hoverRating, setHoverRating] = useState({ category: '', val: 0 });
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  // Calculate overall rating dynamically for the preview step
  const totalScore = Object.values(ratings).reduce((sum, val) => sum + val, 0);
  const overallRating = Math.round(totalScore / 5);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setStatus({ loading: true, message: "Securing feedback with EdDSA...", type: "info" });
    
    const categoryBreakdown = `[Scores -> Food: ${ratings.Food}/5 | Service: ${ratings.Service}/5 | Staff: ${ratings.Staff}/5 | Clean: ${ratings.Cleanliness}/5 | Value: ${ratings.Value}/5]`;
    const finalComment = `${categoryBreakdown}\n\n${form.comment}`;

    const payload = {
      customer_name: form.customer_name,
      rating: overallRating,
      comment: finalComment
    };

    try {
      await submitFeedback(payload);
      setStatus({ loading: false, message: "Feedback digitally signed and saved!", type: "success" });
      setTimeout(() => navigate('landing'), 2500); 
    } catch (err) {
      setStatus({ loading: false, message: err.message, type: "error" });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 20px' }}>
      <div className="animate-in" style={{ border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '30px', fontSize: '11px', color: '#666', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        🔒 EdDSA Secured
      </div>
      
      <h1 className="serif animate-in" style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>
        Rate Your <span style={{ color: 'var(--accent-gold)' }}>Experience</span>
      </h1>
      <p className="animate-in" style={{ color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'center' }}>
        Your feedback is signed with Ed25519 and saved securely.
      </p>
      
      <button className="btn-secondary animate-in" onClick={() => navigate('landing')} style={{ border: 'none', boxShadow: 'none' }}>
        ← Back to Home
      </button>

      {/* Upgraded 4-Step Progress Indicator */}
      <div className="step-indicator animate-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '30px 0' }}>
        {[1, 2, 3, 4].map((num, idx) => (
          <React.Fragment key={num}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '14px', fontWeight: 500, transition: 'all 0.3s',
              border: `2px solid ${step >= num ? 'var(--accent-gold)' : 'var(--border-color)'}`, 
              color: step >= num ? (step === num ? 'white' : 'var(--accent-gold)') : '#999',
              backgroundColor: step === num ? 'var(--accent-gold)' : 'transparent'
            }}>
              {num}
            </div>
            {idx < 3 && <div style={{ width: '30px', height: '2px', backgroundColor: step > num ? 'var(--accent-gold)' : 'var(--border-color)', transition: 'all 0.3s' }}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="card animate-in" style={{ width: '100%', maxWidth: '500px' }}>
        
        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="animate-in">
            <label>Full Name (Optional)</label>
            <input name="customer_name" placeholder="e.g. Maria Santos" value={form.customer_name} onChange={handleChange} />
            <button className="btn-primary" style={{ marginTop: '30px' }} onClick={() => setStep(2)}>Next: Category Ratings →</button>
          </div>
        )}

        {/* STEP 2: MULTI-CATEGORY STARS */}
        {step === 2 && (
          <div className="animate-in">
            <h3 className="serif" style={{ marginBottom: '25px', color: 'var(--text-dark)', fontSize: '1.4rem', textAlign: 'center' }}>How did we do today?</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {Object.keys(ratings).map((category, index) => (
                <div key={category} className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', backgroundColor: 'var(--input-bg)', borderRadius: '12px', animationDelay: `${index * 0.05}s` }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)' }}>{category}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isHovered = hoverRating.category === category && hoverRating.val >= star;
                      const isActive = ratings[category] >= star;
                      return (
                        <Star
                          key={star} size={24}
                          onClick={() => handleRatingChange(category, star)}
                          onMouseEnter={() => setHoverRating({ category, val: star })}
                          onMouseLeave={() => setHoverRating({ category: '', val: 0 })}
                          fill={isHovered || isActive ? 'var(--accent-gold)' : 'transparent'}
                          color={isHovered || isActive ? 'var(--accent-gold)' : '#dcd8ce'}
                          style={{ cursor: 'pointer', transition: 'all 0.2s', transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Next: Comments →</button>
            </div>
          </div>
        )}

        {/* STEP 3: COMMENTS */}
        {step === 3 && (
          <div className="animate-in">
            <label>Written Comments (Optional)</label>
            <textarea name="comment" placeholder="Tell us what you liked or how we can improve..." value={form.comment} onChange={handleChange} style={{ height: '120px' }}></textarea>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(4)}>Review Feedback →</button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW & SUBMIT */}
        {step === 4 && (
          <div className="animate-in">
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <CheckCircle2 size={40} color="var(--success)" style={{ marginBottom: '10px' }} />
              <h3 className="serif" style={{ color: 'var(--text-dark)', fontSize: '1.5rem' }}>Review Your Feedback</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Verify your responses before securely signing.</p>
            </div>

            <div style={{ backgroundColor: 'var(--input-bg)', borderRadius: '16px', padding: '20px', marginBottom: '25px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SUBMITTED BY</span>
                <span style={{ fontWeight: 500 }}>{form.customer_name || 'Anonymous'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OVERALL SCORE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-gold)', fontSize: '16px' }}>{overallRating} / 5</span>
                  <Star size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CATEGORY BREAKDOWN</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(ratings).map(([cat, val]) => (
                    <div key={cat} style={{ fontSize: '12px', backgroundColor: 'white', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                      {cat}: <strong>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {form.comment && (
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>COMMENTS</span>
                  <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#555' }}>"{form.comment}"</p>
                </div>
              )}
            </div>

            {status.message && (
              <div className="animate-in" style={{ marginBottom: '20px', padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: 500, backgroundColor: status.type === 'error' ? 'var(--danger-bg)' : status.type === 'success' ? 'var(--success-bg)' : '#f5f3ec', color: status.type === 'error' ? 'var(--danger)' : status.type === 'success' ? 'var(--success)' : 'var(--text-dark)' }}>
                {status.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(3)} disabled={status.loading}>Edit</button>
              <button className="btn-primary" style={{ flex: 2, backgroundColor: 'var(--bg-dark-green)' }} onClick={handleSubmit} disabled={status.loading}>
                {status.loading ? "Signing..." : "Sign & Submit Securely"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}