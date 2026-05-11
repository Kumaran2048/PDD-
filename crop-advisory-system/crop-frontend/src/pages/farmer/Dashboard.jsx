import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import API from '../../utils/api'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [profile, setProfile]     = useState(null)
  const [alerts, setAlerts]       = useState([])
  const [summary, setSummary]     = useState(null)
  const [tasks, setTasks]         = useState([])
  const [insights, setInsights]   = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get('/farm/profile');
        const prof = profileRes.data.profile;
        setProfile(prof);

        const requests = [
          API.get('/alert/my-alerts'),
          API.get('/expense/summary')
        ];

        if (prof?.activeCrop) {
          requests.push(API.get('/tasks'));
          requests.push(API.get('/insights/ai-insights'));
          requests.push(API.get('/weather/current'));
        }

        const results = await Promise.allSettled(requests);
        
        results.forEach(res => {
          if (res.status === 'fulfilled') {
            const path = res.value.request.responseURL || '';
            if (path.includes('/alert/my-alerts')) setAlerts(res.value.data.alerts || []);
            if (path.includes('/expense/summary')) setSummary(res.value.data);
            if (path.includes('/tasks')) setTasks(res.value.data);
            if (path.includes('/insights/ai-insights')) setInsights(res.value.data.insights || []);
            if (path.includes('/weather/current')) setWeatherData(res.value.data);
          }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}/complete`)
      setTasks(tasks.map(t => t._id === taskId ? { ...t, isCompleted: true } : t))
    } catch (err) {
      console.error("Failed to complete task", err)
    }
  }

  if (loading) return <div className="loading-page"><div className="spinner spinner-dark"></div><p>Loading dashboard...</p></div>

  return (
    <div style={{ background: '#F9FBF9', minHeight: '100%' }}>
      {/* App Header */}
      <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-dark)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>🌱</span> CropAdvisor
        </div>
        <div style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/farmer/profile')}>
          EN ▾
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            {alerts.filter(a => !a.isRead).length > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>{t('greeting')}</p>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>{user?.name?.split(' ')[0]} 👋</h1>

        {/* Active Crop Card */}
        <div className="premium-header" style={{ borderRadius: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {profile?.activeCrop ? 'Active Crop' : 'Getting Started'}
          </div>
          {profile?.activeCrop ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem' }}>
                    {profile.activeCrop.name} {profile.activeCrop.name === 'Tomato' ? '🍅' : '🌾'}
                    <span style={{ fontWeight: 400, opacity: 0.8 }}> · {profile?.landSize || 0} ac</span>
                  </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Est. Profit</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹62,400</div>
                </div>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: '0.5rem' }}>
                <div style={{ width: '56%', height: '100%', background: 'var(--accent)', borderRadius: 3 }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Growth: 56% · Day 42 of 75</div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
               <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Ready to start growing?</h2>
               <button 
                 onClick={() => navigate('/farmer/crops')} 
                 style={{ background: 'white', color: 'var(--primary-dark)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
               >
                 Select Your Crop →
               </button>
            </div>
          )}
        </div>

        {/* District Officer Card */}
        <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
             <img src="https://ui-avatars.com/api/?name=Priya+Sharma&background=random" alt="Officer" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your District Officer</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Officer Priya Sharma</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>📞 +91 9876543210</div>
          </div>
          <div className="role-badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Active</div>
        </div>

        {/* Smart AI Advisory Engine */}
        {(weatherData?.impactAnalysis || insights.length > 0) && (
          <div className="glass-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🧠</span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{t('insights') || 'Smart AI Advisory'}</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Weather Impact Analysis */}
              {weatherData?.impactAnalysis?.map((impact, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#F0F9F4', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌦️</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)' }}>Weather Impact</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{impact}</div>
                  </div>
                </div>
              ))}
              
              {/* AI Insights */}
              {insights.map((insight, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#EBF5FB', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2980B9' }}>AI Insight</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{insight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Farm Tasks */}
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>✅ {t('tasks') || "Today's Farm Tasks"}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              {tasks.filter(t => !t.isCompleted).length} Pending
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tasks.length > 0 ? tasks.map(task => (
              <label key={task._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer', opacity: task.isCompleted ? 0.6 : 1 }}>
                <input 
                  type="checkbox" 
                  checked={task.isCompleted} 
                  onChange={() => handleToggleTask(task._id)}
                  disabled={task.isCompleted}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--primary)' }} 
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.description}</div>
                </div>
              </label>
            )) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No tasks for today. Great job!</p>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div style={{ color: 'var(--danger)', fontSize: '1.2rem', fontWeight: 700 }}>₹30,700</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('expenses')}</div>
          </div>
          <div className="stat-card">
            <div style={{ color: 'var(--success)', fontSize: '1.2rem', fontWeight: 700 }}>₹31,700</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('profit')}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{t('quickActions') || 'Quick Actions'}</h3>
        <div className="action-grid" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div className="action-card" onClick={() => navigate('/farmer/profit')}>
            <div className="action-icon">💰</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('predict')}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/disease')}>
            <div className="action-icon">📸</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('scanDisease')}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/crops')}>
            <div className="action-icon">🌾</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('cropAdvice')}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/market')}>
            <div className="action-icon">📊</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('marketPrices')}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/expenses')}>
            <div className="action-icon">💸</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('addExpense')}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/schemes')}>
            <div className="action-icon">🏛️</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('schemes') || 'Govt Schemes'}</div>
          </div>
          <div className="action-card" onClick={() => navigate('/farmer/planning')}>
            <div className="action-icon">📅</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('planning') || 'Seasonal Planning'}</div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="alert-banner" style={{ background: '#FFF3F0', border: 'none' }}>
            <div className="alert-dot"></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#D35400' }}>OUTBREAK: Tomato Late Blight in 7 farms</div>
              <div style={{ fontSize: '0.75rem', color: '#E67E22' }}>2h ago</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmerDashboard
