import { Link, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🐾 Pet Finder
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/create-pet" className="nav-link">Report Missing Pet</Link>
              <span className="nav-welcome">Welcome, {user?.firstName || user?.username}!</span>
              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-button register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar