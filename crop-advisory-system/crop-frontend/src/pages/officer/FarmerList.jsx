import { useState } from 'react'

const FarmerList = () => {
  const [activeFilter, setActiveFilter] = useState('All')

  const farmers = [
    { name: 'Rajesh Kumar', crop: 'Tomato', size: '4.5 ac', soil: 'Loamy', phone: '9123456789', status: 'Active', color: '#00B894', bg: '#F0F4FF' },
    { name: 'Vijay Deshpande', crop: 'Potato', size: '6.2 ac', soil: 'Loamy', phone: '9876543210', status: 'Alert', color: 'var(--danger)', bg: '#FFF5F5' },
    { name: 'Suresh Patil', crop: 'Maize', size: '2.8 ac', soil: 'Sandy', phone: '9000000001', status: 'Active', color: '#00B894', bg: '#F0FFF4' },
    { name: 'Anil Jadhav', crop: 'Tomato', size: '3.1 ac', soil: 'Clay', phone: '9988776655', status: 'Active', color: '#00B894', bg: '#F5F5FF' },
  ]

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <span>🌿</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem' }}>EN ▾</div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Farmer List</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Nashik District · 6 farmers</p>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search farmer..." 
            className="input-field" 
            style={{ paddingLeft: '2.8rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['All', 'Active', 'Alert'].map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '1.5rem', 
                border: activeFilter === f ? '1.5px solid var(--primary)' : '1.5px solid #E3E8E3',
                background: activeFilter === f ? '#F0F4F1' : 'white',
                color: activeFilter === f ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="animate-up">
          {farmers.map((farmer, i) => (
            <div key={i} className="glass-card" style={{ background: 'white', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: farmer.bg, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
                  {farmer.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{farmer.name}</h4>
                    <span className="role-badge" style={{ background: farmer.status === 'Active' ? '#E8F5E9' : '#FFF3F0', color: farmer.color }}>
                      {farmer.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {farmer.crop === 'Tomato' ? '🍅' : farmer.crop === 'Potato' ? '🥔' : '🌽'} {farmer.crop} · {farmer.size}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    · {farmer.soil}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>
                    📞 {farmer.phone}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>View Profile</button>
                <button className="btn btn-outline" style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' }}>Add Visit Log</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmerList
