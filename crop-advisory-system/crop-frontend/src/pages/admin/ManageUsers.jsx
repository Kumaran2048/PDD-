import { useState } from 'react'
import API from '../../utils/api'

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('Add New Officer')
  const [form, setForm] = useState({
    name: 'Officer Meena Rao',
    email: 'meena@agr.gov.in',
    phone: '9876500001',
    password: 'password',
    state: 'Maharashtra',
    district: 'Solapur',
    role: 'officer'
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      await API.post('/auth/register', form)
      setMsg({ type: 'success', text: 'Officer account created successfully!' })
      setForm({ ...form, name: '', email: '', phone: '', password: '' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create officer' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>EN ▾</div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Add Agriculture Officer</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Only admin can create officer accounts</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {['Add New Officer', 'Manage Officers'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                flex: 1, padding: '0.75rem', borderRadius: '0.75rem', 
                border: activeTab === tab ? '1.5px solid var(--primary)' : '1.5px solid #E3E8E3',
                background: activeTab === tab ? '#F0F4F1' : 'white',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Add New Officer' ? (
          <div className="animate-up">
            <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
              {msg.text && (
                <div className="alert-banner" style={{ background: msg.type === 'success' ? '#E8F5E9' : '#FFF3F0', color: msg.type === 'success' ? '#2E7D32' : 'var(--danger)' }}>
                  <div className="alert-dot" style={{ background: msg.type === 'success' ? '#2E7D32' : 'var(--danger)' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{msg.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">FULL NAME</label>
                  <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">OFFICIAL EMAIL</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">MOBILE NUMBER</label>
                  <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">PASSWORD</label>
                  <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">ASSIGN STATE</label>
                  <select className="input-field" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} style={{ appearance: 'none' }}>
                    <option>Maharashtra</option><option>Karnataka</option><option>Gujarat</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ASSIGN DISTRICT</label>
                  <select className="input-field" value={form.district} onChange={(e) => setForm({...form, district: e.target.value})} style={{ appearance: 'none' }}>
                    <option>Solapur</option><option>Nashik</option><option>Pune</option>
                  </select>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: '#2D4F39', marginTop: '1rem' }}>
                  {loading ? 'Creating...' : 'Add Agriculture Officer'}
                </button>
              </form>
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>HOW IT WORKS</p>
            </div>
          </div>
        ) : (
          <div className="animate-up">
             <div className="glass-card" style={{ background: 'white' }}>
               <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading officer list...</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
