import { useState } from 'react'

const DiseaseAlerts = () => {
  const outbreaks = [
    { name: 'Tomato Late Blight', location: 'Nashik', farms: 7, risk: 'High Risk', color: 'var(--danger)' },
    { name: 'Corn Common Rust', location: 'Ahmednagar', farms: 5, risk: 'Medium Risk', color: 'var(--warning)' },
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
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Outbreak Detection Map</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Active disease clusters · Last 7 days</p>

        {/* Heatmap Card */}
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>NASHIK DISTRICT - DISEASE HEATMAP</div>
          
          <div style={{ height: 200, background: '#F8FAF8', borderRadius: '1rem', position: 'relative', marginBottom: '1.5rem', border: '1px solid #E3E8E3' }}>
            {/* Mock Bubbles */}
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: 60, height: 60, background: 'rgba(225, 112, 85, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--danger)', border: '2px solid var(--danger)' }}>7</div>
            <div style={{ position: 'absolute', top: '50%', left: '40%', width: 30, height: 30, background: 'rgba(0, 184, 148, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--success)', border: '2px solid var(--success)', fontSize: '0.8rem' }}>2</div>
            <div style={{ position: 'absolute', top: '30%', left: '70%', width: 50, height: 50, background: 'rgba(253, 203, 110, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--warning)', border: '2px solid var(--warning)' }}>5</div>
            <div style={{ position: 'absolute', top: '65%', left: '60%', width: 40, height: 40, background: 'rgba(225, 112, 85, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--danger)', border: '2px solid var(--danger)', fontSize: '0.9rem' }}>3</div>
          </div>
          
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Bubble size = severity</div>
          
          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--danger)' }}></span> High (5+)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--warning)' }}></span> Medium
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }}></span> Low
            </div>
          </div>
        </div>

        {/* List */}
        <div className="animate-up">
          {outbreaks.map((ob, i) => (
            <div key={i} className="glass-card" style={{ background: 'white', padding: '1.25rem', marginBottom: '1rem', borderLeft: `4px solid ${ob.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{ob.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    📍 {ob.location} · {ob.farms} farms
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: ob.color, background: ob.color + '15', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    {ob.risk}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiseaseAlerts
