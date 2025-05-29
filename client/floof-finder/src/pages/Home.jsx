import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchAllPets } from '../store/petsSlice'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pets, isLoading, error } = useSelector((state) => state.pets)

  useEffect(() => {
    dispatch(fetchAllPets())
  }, [dispatch])

  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`)
  }

  // Modern Pet Icons SVG Components
  // Updated Modern Pet Icons with artistic outlines
  const ModernDogIcon = () => (
    <svg viewBox="0 0 200 200" className="hero-icon">
      <defs>
        <linearGradient id="dogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Artistic background circle */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#dogGradient)" strokeWidth="3" strokeDasharray="5,5" opacity="0.3" />
      
      {/* Dog head with outline */}
      <circle cx="100" cy="90" r="45" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      
      {/* Ears with outlines */}
      <ellipse cx="75" cy="65" rx="15" ry="25" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" transform="rotate(-30 75 65)" />
      <ellipse cx="125" cy="65" rx="15" ry="25" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" transform="rotate(30 125 65)" />
      
      {/* Eyes with artistic touch */}
      <circle cx="88" cy="85" r="8" fill="white" stroke="#374151" strokeWidth="2" />
      <circle cx="112" cy="85" r="8" fill="white" stroke="#374151" strokeWidth="2" />
      <circle cx="88" cy="85" r="4" fill="#374151" />
      <circle cx="112" cy="85" r="4" fill="#374151" />
      
      {/* Nose with outline */}
      <ellipse cx="100" cy="100" rx="6" ry="4" fill="#374151" stroke="white" strokeWidth="1" />
      
      {/* Artistic mouth */}
      <path d="M 92 110 Q 100 118 108 110" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Body with outline */}
      <ellipse cx="100" cy="150" rx="35" ry="25" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      
      {/* Legs with outlines */}
      <rect x="78" y="170" width="10" height="22" rx="5" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      <rect x="94" y="170" width="10" height="22" rx="5" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      <rect x="110" y="170" width="10" height="22" rx="5" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      <rect x="126" y="170" width="10" height="22" rx="5" fill="url(#dogGradient)" stroke="#ea580c" strokeWidth="2" />
      
      {/* Decorative paw prints */}
      <g opacity="0.4">
        <circle cx="60" cy="160" r="3" fill="#ea580c" />
        <circle cx="55" cy="165" r="2" fill="#ea580c" />
        <circle cx="65" cy="165" r="2" fill="#ea580c" />
      </g>
    </svg>
  )

  const ModernCatIcon = () => (
    <svg viewBox="0 0 200 200" className="hero-icon">
      <defs>
        <linearGradient id="catGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      
      {/* Artistic background */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#catGradient)" strokeWidth="3" strokeDasharray="8,4" opacity="0.3" />
      
      {/* Cat head with outline */}
      <circle cx="100" cy="90" r="40" fill="url(#catGradient)" stroke="#7c3aed" strokeWidth="2" />
      
      {/* Ears with outlines */}
      <polygon points="70,60 85,45 85,75" fill="url(#catGradient)" stroke="#7c3aed" strokeWidth="2" />
      <polygon points="130,60 115,45 115,75" fill="url(#catGradient)" stroke="#7c3aed" strokeWidth="2" />
      
      {/* Inner ears */}
      <polygon points="75,60 80,50 80,70" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
      <polygon points="125,60 120,50 120,70" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
      
      {/* Cat eyes with artistic touch */}
      <ellipse cx="88" cy="85" rx="10" ry="12" fill="#10b981" stroke="#047857" strokeWidth="2" />
      <ellipse cx="112" cy="85" rx="10" ry="12" fill="#10b981" stroke="#047857" strokeWidth="2" />
      <ellipse cx="88" cy="85" rx="3" ry="10" fill="#374151" />
      <ellipse cx="112" cy="85" rx="3" ry="10" fill="#374151" />
      
      {/* Nose with outline */}
      <polygon points="100,95 95,100 105,100" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
      
      {/* Whiskers with artistic curves */}
      <path d="M 58 88 Q 70 85 80 88" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 58 95 Q 70 95 80 95" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 120 88 Q 130 85 142 88" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 120 95 Q 130 95 142 95" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Body with outline */}
      <ellipse cx="100" cy="145" rx="30" ry="20" fill="url(#catGradient)" stroke="#7c3aed" strokeWidth="2" />
      
      {/* Artistic tail */}
      <path d="M 130 145 Q 155 125 150 105 Q 145 95 140 100" stroke="url(#catGradient)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 130 145 Q 155 125 150 105 Q 145 95 140 100" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )

  const SearchIcon = () => (
    <svg viewBox="0 0 200 200" className="hero-icon">
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      
      {/* Artistic background elements */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#searchGradient)" strokeWidth="2" strokeDasharray="12,8" opacity="0.2" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#searchGradient)" strokeWidth="1" strokeDasharray="6,4" opacity="0.3" />
      
      {/* Magnifying glass with artistic outline */}
      <circle cx="80" cy="80" r="35" fill="rgba(59, 130, 246, 0.1)" stroke="url(#searchGradient)" strokeWidth="6" />
      <circle cx="80" cy="80" r="28" fill="none" stroke="white" strokeWidth="2" />
      
      {/* Handle with outline */}
      <line x1="108" y1="108" x2="140" y2="140" stroke="url(#searchGradient)" strokeWidth="8" strokeLinecap="round" />
      <line x1="108" y1="108" x2="140" y2="140" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
      
      {/* Artistic paw print in center */}
      <g transform="translate(80, 75)">
        <circle cx="0" cy="0" r="8" fill="url(#searchGradient)" stroke="#1e40af" strokeWidth="1" />
        <circle cx="-8" cy="8" r="4" fill="url(#searchGradient)" stroke="#1e40af" strokeWidth="1" />
        <circle cx="8" cy="8" r="4" fill="url(#searchGradient)" stroke="#1e40af" strokeWidth="1" />
        <circle cx="-4" cy="16" r="3" fill="url(#searchGradient)" stroke="#1e40af" strokeWidth="1" />
        <circle cx="4" cy="16" r="3" fill="url(#searchGradient)" stroke="#1e40af" strokeWidth="1" />
      </g>
      
      {/* Decorative search rays */}
      <g opacity="0.4">
        <line x1="45" y1="45" x2="50" y2="50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="115" x2="50" y2="110" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        <line x1="115" y1="45" x2="110" y2="50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Finding missing pets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        ⚠️ Error loading pets: {error}
      </div>
    )
  }

  return (
    <div className="home-container">
      {/* Split-Screen Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Missing
              <span className="hero-title-accent"> Pets</span>
            </h1>
            <p className="hero-description">
              Bantu anabul kembali ke hooman nya! Gabung sama komunitas kita dan jadilah pahlawan anabul.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{pets?.length || 0}</span>
                <span className="stat-label">Missing Pets</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Active Search</span>
              </div>
            </div>
          </div>
          
          <div className="hero-illustrations">
            <div className="illustration-grid">
              <div className="illustration-item">
                <ModernDogIcon />
              </div>
              <div className="illustration-item">
                <ModernCatIcon />
              </div>
              <div className="illustration-item">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Cards Section */}
      <section className="pets-section">
        {!pets || pets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No missing pets reported yet</h3>
            <p>Check back later or help by reporting a missing pet if you know of one.</p>
          </div>
        ) : Array.isArray(pets) ? (
          <div className="pets-grid">
            {pets.map((pet, index) => (
              <div 
                key={pet.id} 
                className="pet-card"
                onClick={() => handlePetClick(pet.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pet.petPhoto && (
                  <div className="pet-image-container">
                    <img 
                      src={pet.petPhoto} 
                      alt={pet.petName}
                      className="pet-image"
                    />
                    <div className="pet-image-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>
                )}
                
                <div className="pet-info">
                  <h3 className="pet-name">{pet.petName}</h3>
                  <div className="pet-details">
                    <p><span className="detail-icon">🐕</span><strong>Species:</strong> {pet.petType}</p>
                    <p><span className="detail-icon">🏷️</span><strong>Breed:</strong> {pet.breed}</p>
                    <p><span className="detail-icon">📍</span><strong>Last seen:</strong> {pet.lastSeenLocation}</p>
                    <p><span className="detail-icon">📅</span><strong>Date:</strong> {new Date(pet.lastSeenDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`pet-status ${pet.status?.toLowerCase() || 'missing'}`}>
                    {pet.status === 'missing' ? '🔍 Missing' : '✅ Found'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="error-message">
            ⚠️ Error: Expected array of pets, but got: {typeof pets}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home