import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const farmerLinks = [
  { to: '/farmer',            icon: '🏠', label: 'Dashboard'     },
  { to: '/farmer/crops',      icon: '🌾', label: 'Crop Advisor'  },
  { to: '/farmer/disease',    icon: '🍃', label: 'Leaf Scanner'  },
  { to: '/farmer/weather',    icon: '🌦️', label: 'Weather'       },
  { to: '/farmer/market',     icon: '💰', label: 'Market Prices' },
  { to: '/farmer/expenses',   icon: '📊', label: 'My Expenses'   },
]

const officerLinks = [
  { to: '/officer',           icon: '🏠', label: 'Dashboard'    },
  { to: '/officer/farmers',   icon: '🧑‍🌾', label: 'All Farmers' },
  { to: '/officer/diseases',  icon: '🚨', label: 'Disease Alerts'},
]

const adminLinks = [
  { to: '/admin',             icon: '🏠', label: 'Dashboard'    },
  { to: '/admin/crops',       icon: '🌾', label: 'Manage Crops' },
  { to: '/admin/users',       icon: '👥', label: 'Manage Users' },
  { to: '/admin/prices',      icon: '💰', label: 'Market Prices'},
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'farmer'
    ? farmerLinks
    : user?.role === 'officer'
    ? officerLinks
    : adminLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>🌾 CropAdvisor</h1>
        <p>Smart Farming Assistant</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/farmer' || link.to === '/officer' || link.to === '/admin'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
