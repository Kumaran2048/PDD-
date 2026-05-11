import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../utils/api'

const OfficerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800)
  }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Loading officer portal...</p></div>

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>EN ▾</div>
      </div>

      <div style={{ background: 'linear-gradient(180deg, var(--primary-dark) 0%, #243B2B 100%)', padding: '2rem 1.5rem 3rem', color: 'white' }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.25rem' }}>Agriculture Officer</p>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Priya Sharma 🧑‍💼</h1>
        <div style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📍</span> Nashik District · 6 farmers
        </div>
      </div>

      <div style={{ padding: '0 1.5rem', marginTop: '-1.5rem' }}>
        {/* Outbreak Alert */}
        <div className="animate-up" style={{ background: '#FFF3F0', borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(225, 112, 85, 0.1)' }}>
          <div style={{ fontSize: '1.8rem' }}>🦠</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem' }}>Active Outbreak Alert</div>
            <div style={{ fontSize: '0.8rem', color: '#D35400' }}>Tomato Late Blight · 5 farms</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>6</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>MY FARMERS</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)' }}>5</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>DISEASE CASES</div>
          </div>
        </div>

        {/* Portal Features */}
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>Portal Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Farmer List', icon: '👥', color: '#F0F4FF', path: '/officer/farmers' },
            { label: 'Disease Reports', icon: '🦠', color: '#FFF5F5', path: '/officer/diseases' },
            { label: 'Outbreak Map', icon: '🗺️', color: '#F0FFF4', path: '#' },
            { label: 'District Stats', icon: '📊', color: '#F5F5FF', path: '#' },
            { label: 'Broadcast', icon: '📢', color: '#FFF9F0', path: '#' },
            { label: 'AI Risk', icon: '🧠', color: '#FDF0FF', path: '#' },
          ].map(feature => (
            <div 
              key={feature.label} 
              className="action-card" 
              onClick={() => feature.path !== '#' && navigate(feature.path)}
              style={{ background: 'white', padding: '1.25rem', border: '1px solid #F2F5F3' }}
            >
              <div style={{ width: 44, height: 44, background: feature.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
                {feature.icon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OfficerDashboard
