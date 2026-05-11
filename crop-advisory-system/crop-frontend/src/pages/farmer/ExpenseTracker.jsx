import { useState, useEffect } from 'react'
import API from '../../utils/api'

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([])
  const [total, setTotal]       = useState(30700)
  const [loading, setLoading]   = useState(true)

  const fetchData = async () => {
    try {
      const expRes = await API.get('/expense')
      if (expRes.status === 200) {
        setExpenses(expRes.value.data.expenses || [])
        setTotal(expRes.value.data.total || 30700)
      }
    } catch {
      // Fallback for demo
      setExpenses([
        { _id: '1', type: 'Seeds', amount: 3200, description: 'Tomato · Apr 02', icon: '🌱' },
        { _id: '2', type: 'Fertilizer', amount: 8500, description: 'Tomato · Apr 10', icon: '🧪' },
        { _id: '3', type: 'Labor', amount: 12000, description: 'Tomato · Apr 15', icon: '👷' },
        { _id: '4', type: 'Irrigation', amount: 4200, description: 'Tomato · Apr 18', icon: '💧' },
        { _id: '5', type: 'Pesticide', amount: 2800, description: 'Tomato · Apr 22', icon: '🧴' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Loading expenses...</p></div>

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
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Expenses</h2>

        {/* Total Card */}
        <div className="glass-card" style={{ background: '#FFF3F0', border: 'none', marginBottom: '1.5rem', padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total - Tomato Season</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>₹{total.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{expenses.length} transactions recorded</div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card" style={{ background: 'white', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Category Breakdown</h4>
          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ width: '40%', background: '#4A90E2' }}></div>
            <div style={{ width: '30%', background: '#4CAF50' }}></div>
            <div style={{ width: '20%', background: '#FFC107' }}></div>
            <div style={{ width: '10%', background: '#9C27B0' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A90E2' }}></span>
              Labor (₹12,000)
            </div>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }}></span>
              Fert. (₹8,500)
            </div>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFC107' }}></span>
              Irrig. (₹4,200)
            </div>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9C27B0' }}></span>
              Seeds (₹3,200)
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="animate-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem' }}>All Transactions</h3>
            <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', background: 'none', border: 'none' }}>+ Add New</button>
          </div>
          
          {expenses.map((exp) => (
            <div key={exp._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #F2F5F3' }}>
              <div style={{ width: 44, height: 44, background: '#F2F5F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {exp.icon || '💰'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.description}</div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--danger)' }}>
                -₹{exp.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker
