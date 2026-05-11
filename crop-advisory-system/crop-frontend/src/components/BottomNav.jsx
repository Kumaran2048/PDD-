import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

const navLinks = {
  farmer: [
    { to: '/farmer',         icon: '🏠', label: 'home' },
    { to: '/farmer/crops',   icon: '🌾', label: 'crops' },
    { to: '/farmer/profit',  icon: '🧠', label: 'sim' },
    { to: '/farmer/disease', icon: '📷', label: 'scan' },
    { to: '/farmer/weather', icon: '🌦️', label: 'weather' },
  ],
  officer: [
    { to: '/officer',          icon: '🏠', label: 'home' },
    { to: '/officer/farmers',  icon: '👥', label: 'farmers' },
    { to: '/officer/diseases', icon: '🦠', label: 'disease' },
    { to: '/officer/profile',  icon: '⚙️', label: 'profile' },
  ],
  admin: [
    { to: '/admin',       icon: '🏠', label: 'home' },
    { to: '/admin/users', icon: '👥', label: 'users' },
    { to: '/admin/crops', icon: '🌾', label: 'crops' },
    { to: '/admin/profile',icon: '⚙️', label: 'profile' },
  ]
}

const BottomNav = () => {
  const { user } = useAuth()
  const { t } = useLang()
  const role = user?.role || 'farmer'
  const links = navLinks[role] || navLinks.farmer

  return (
    <nav className="bottom-nav">
      {links.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          end={link.to.startsWith('/')}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{link.icon}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {t(link.label)}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
