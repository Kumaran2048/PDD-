import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]     = useState({ email: 'farmer@demo.com', password: 'password' })
  const [role, setRole]     = useState('farmer') 
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(`/${user.role}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const setDemoRole = (selectedRole) => {
    setRole(selectedRole)
    const demoEmails = { farmer: 'farmer@demo.com', officer: 'officer@demo.com', admin: 'admin@demo.com' }
    setForm({ email: demoEmails[selectedRole], password: 'password' })
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-cream)' }}>
      <div className="premium-header" style={{ padding: '4rem 1.5rem 3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌿</div>
          <h1 style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>CropAdvisor</h1>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Smart farming for every field</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '2rem', justifyContent: 'center' }}>
          {['Disease AI', 'Market AI', 'Smart Advice'].map(tag => (
            <span key={tag} style={{ 
              background: 'rgba(255,255,255,0.12)', 
              padding: '0.4rem 0.9rem', 
              borderRadius: '2rem', 
              fontSize: '0.7rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: '2rem 1.5rem', flex: 1, background: 'var(--bg-cream)', marginTop: '-2rem', borderRadius: '2.5rem 2.5rem 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', color: 'var(--primary-dark)' }}>Sign In</h2>

        <div className="role-tabs">
          {['farmer', 'officer', 'admin'].map(r => (
            <button 
              key={r}
              className={`role-tab ${role === r ? 'active' : ''}`}
              onClick={() => setDemoRole(r)}
            >
              {r === 'farmer' ? 'Farmer' : r === 'officer' ? 'Officer' : 'Admin'}
            </button>
          ))}
        </div>

        {error && <div className="alert-banner" style={{ background: '#FFF3F0', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          <div className="alert-dot"></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{error}</span>
        </div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">OFFICIAL EMAIL</label>
            <input
              name="email" type="email"
              className="input-field"
              placeholder="name@email.com"
              value={form.email}
              onChange={handle}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              name="password" type="password"
              className="input-field"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem', padding: '1.1rem' }}>
            {loading ? 'Authenticating...' : 'Sign In Now →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Register</span>
        </p>
      </div>
    </div>
  )
}

export default Login
