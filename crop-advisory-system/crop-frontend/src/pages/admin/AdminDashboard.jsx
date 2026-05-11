import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>EN ▾</div>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #301B30 0%, #2A1B2A 100%)', padding: '2rem 1.5rem 3rem', color: 'white' }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.25rem' }}>System Administrator</p>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Admin Panel 🧑‍💻</h1>
        <div style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          162 total users · Full system access
        </div>
      </div>

      <div style={{ padding: '0 1.5rem', marginTop: '-1.5rem' }}>
        {/* System Status */}
        <div className="glass-card" style={{ background: 'white', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '1.05rem' }}>System Status</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>All Online ✓</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Backend API', status: 'Online' },
              { label: 'ML Service', status: 'Online' },
              { label: 'MySQL DB', status: 'Online' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}></span>
                  <span style={{ fontWeight: 600 }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>128</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>FARMERS</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>5</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>OFFICERS</div>
          </div>
        </div>

        {/* Admin Features */}
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>Admin Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Manage Users', icon: '👥', color: '#F0F4FF', path: '/admin/users' },
            { label: 'Add Officer', icon: '👤', color: '#FFF9F0', path: '/admin/users' },
            { label: 'Crop Database', icon: '🌾', color: '#F0FFF4', path: '/admin/crops' },
            { label: 'Policy Insights', icon: '🏛️', color: '#F5F5FF', path: '#' },
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

export default AdminDashboard
