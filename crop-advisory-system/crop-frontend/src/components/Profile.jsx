import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import API from '../utils/api'

const Profile = () => {
  const { user, logout } = useAuth()
  const { lang, setLang } = useLang()
  const navigate = useNavigate()
  
  const [farmProfile, setFarmProfile] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: user?.name || '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (user?.role === 'farmer') {
      API.get('/farm/profile')
        .then(res => setFarmProfile(res.data.profile))
        .catch(err => console.error(err))
    }
  }, [user])

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      await API.put('/auth/profile', { name: editForm.name })
      // For demo, we just reload the page to get the updated token/user context
      window.location.reload()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setIsEditing(false)
    }
  }

  const languages = ['GB English', 'IN हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు']

  const getRoleEmoji = (role) => {
    if (role === 'farmer') return '🧑‍🌾'
    if (role === 'officer') return '👨‍💼'
    return '⚙️'
  }

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%', paddingBottom: '6rem' }}>
      {/* Top Banner */}
      <div className="premium-header" style={{ padding: '3rem 1.5rem 2rem', borderRadius: '0 0 2rem 2rem', textAlign: 'center' }}>
        <div style={{ 
          width: 80, height: 80, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.2)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', 
          margin: '0 auto 1rem',
          border: '3px solid rgba(255,255,255,0.4)',
          position: 'relative'
        }}>
          {getRoleEmoji(user?.role)}
        </div>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <input 
              type="text" 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              style={{ padding: '0.4rem', borderRadius: '0.5rem', border: 'none', color: '#333' }}
            />
            <button onClick={handleSaveProfile} disabled={loading} style={{ background: 'var(--accent)', border: 'none', borderRadius: '0.5rem', padding: '0 1rem', fontWeight: 'bold' }}>
              Save
            </button>
          </div>
        ) : (
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {user?.name || 'User'} 
            <span onClick={() => setIsEditing(true)} style={{ fontSize: '1rem', cursor: 'pointer', opacity: 0.6 }}>✏️</span>
          </h1>
        )}

        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email || ''}</p>
        <span className="role-badge" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 700, padding: '0.4rem 1rem', textTransform: 'capitalize' }}>
          {user?.role || 'Farmer'}
        </span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        
        {/* Officer specific view */}
        {user?.role === 'officer' && (
          <div className="glass-card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              Your Assignment
            </div>
            <div style={{ fontWeight: 600 }}>District: {user?.district || 'Not Assigned'}</div>
            <div style={{ fontWeight: 600 }}>State: {user?.state || 'Not Assigned'}</div>
          </div>
        )}

        {/* Farmer specific views */}
        {user?.role === 'farmer' && (
          <>
            <div className="glass-card" style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
                Your District Officer
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  👨‍💼
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>Officer Priya Sharma</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>📞 9876543210</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>✉️ priya@agr.gov.in</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: 'var(--text-muted)' }}>Land Size</span>
                <span style={{ fontWeight: 600 }}>{farmProfile?.landSize || 0} acres</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: 'var(--text-muted)' }}>Soil Type</span>
                <span style={{ fontWeight: 600 }}>{farmProfile?.soilType || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: 'var(--text-muted)' }}>District</span>
                <span style={{ fontWeight: 600 }}>{farmProfile?.district || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Active Crop</span>
                <span style={{ fontWeight: 600 }}>{farmProfile?.activeCrop?.name ? `🌿 ${farmProfile.activeCrop.name}` : 'None'}</span>
              </div>
            </div>
          </>
        )}

        {/* Settings Card - For ALL Users */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>
            LANGUAGE / भाषा / ভাষা
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {languages.map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2rem',
                  border: lang === l ? '1.5px solid var(--primary)' : '1px solid #ccc',
                  background: lang === l ? '#E8F5E9' : 'white',
                  color: lang === l ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <span style={{ color: 'var(--text-muted)' }}>Theme</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '2rem',
                border: 'none',
                background: darkMode ? '#333' : '#E8F5E9',
                color: darkMode ? 'white' : 'var(--primary-dark)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', gap: '0.4rem', alignItems: 'center'
              }}
            >
              {darkMode ? '🌙 Dark Mode' : '🍌 Dark Mode'}
            </button>
          </div>
        </div>

        {/* Sign Out - For ALL Users */}
        <button 
          onClick={handleSignOut}
          style={{
            width: '100%', padding: '1.2rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '0.75rem',
            fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(211, 84, 0, 0.2)'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Profile
