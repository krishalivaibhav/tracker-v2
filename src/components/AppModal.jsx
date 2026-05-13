import { useState, useEffect } from 'react';
import { today } from '../utils/helpers.js';

export default function AppModal({ mode, initial, onSave, onClose }) {
  const [company, setCompany] = useState(initial?.company || '');
  const [role, setRole]       = useState(initial?.role || '');
  const [status, setStatus]   = useState(initial?.status || 'Applied');
  const [date, setDate]       = useState(initial?.date || today());
  const [notes, setNotes]     = useState(initial?.notes || '');

  useEffect(() => {
    setCompany(initial?.company || '');
    setRole(initial?.role || '');
    setStatus(initial?.status || 'Applied');
    setDate(initial?.date || today());
    setNotes(initial?.notes || '');
  }, [initial]);

  function handleSave() {
    if (!company.trim()) { alert('Enter a company name.'); return; }
    onSave({ company: company.trim(), role: role.trim(), status, date, notes: notes.trim() });
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{mode === 'edit' ? 'Edit Application' : 'Add Application'}</div>
        <div className="form-row" style={{ marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Razorpay" />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. SDE Intern" />
          </div>
        </div>
        <div className="form-row" style={{ marginBottom: '14px' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Wishlist">Wishlist</option>
              <option value="Applied">Applied</option>
              <option value="OA">Online Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date Applied</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="notes-area" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Referral, source, deadline..." />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
