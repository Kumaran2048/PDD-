import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import { SUPPORTED_REGIONS } from '../utils/constants'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'farmer', district: '', state: ''
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const states = Object.keys(SUPPORTED_REGIONS)
  const districts = form.state ? SUPPORTED_REGIONS[form.state] : []

  const handle = (e) => {
    const { name, value } = e.target
    if (name === 'state') {
      setForm({ ...form, state: value, district: '' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.state || !form.district) {
      setError('Please select a supported state and district.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(`/${user.role}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-cream)' }}>
      <div className="premium-header" style={{ padding: '3rem 1.5rem 2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌱</div>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Join CropAdvisor</h1>
          <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>Start your smart farming journey</p>
          <div style={{ marginTop: '1rem', display: 'inline-block', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.2)', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
            Service currently available in 6 major states
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem 1.5rem', flex: 1, background: 'var(--bg-cream)', marginTop: '-1.5rem', borderRadius: '2.5rem 2.5rem 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)' }}>
        
        {error && <div className="alert-banner" style={{ background: '#FFF3F0', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          <div className="alert-dot"></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{error}</span>
        </div>}

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input name="name" className="input-field" placeholder="John Doe" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">PHONE</label>
              <input name="phone" className="input-field" placeholder="Mobile No." value={form.phone} onChange={handle} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input name="email" type="email" className="input-field" placeholder="name@email.com" value={form.email} onChange={handle} required />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input name="password" type="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={handle} required minLength={6} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">STATE</label>
              <select name="state" className="input-field" value={form.state} onChange={handle} required style={{ appearance: 'auto' }}>
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">DISTRICT</label>
              <select name="district" className="input-field" value={form.district} onChange={handle} required disabled={!form.state} style={{ appearance: 'auto' }}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '1.1rem' }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Sign In</span>
        </p>
      </div>
    </div>
  )
}

export default Register
