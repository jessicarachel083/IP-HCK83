import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchAllPets } from '../store/petsSlice'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pets, isLoading, error } = useSelector((state) => state.pets)

  console.log('Pets data:', pets, 'Type:', typeof pets, 'Is Array:', Array.isArray(pets))

  useEffect(() => {
    dispatch(fetchAllPets())
  }, [dispatch])

  const handlePetClick = (petId) => {
    navigate(`/pets/${petId}`)
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading missing pets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading pets: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>🐾 Missing Pets</h1>
        <p>Help reunite pets with their families</p>
      </div>

      {!pets || pets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No missing pets reported yet</h3>
          <p>Check back later or report a missing pet if you know of one.</p>
        </div>
      ) : Array.isArray(pets) ? (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div 
              key={pet.id} 
              className="pet-card"
              onClick={() => handlePetClick(pet.id)}
            >
              {pet.petPhoto && (
                <img 
                  src={pet.petPhoto} 
                  alt={pet.petName}
                  className="pet-image"
                />
              )}
              
              <div className="pet-info">
                <h3 className="pet-name">{pet.petName}</h3>
                <div className="pet-details">
                  <p><strong>Species:</strong> {pet.species}</p>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Last seen:</strong> {pet.lastSeenLocation}</p>
                  <p><strong>Date:</strong> {new Date(pet.dateLost).toLocaleDateString()}</p>
                </div>
                <span className={`pet-status ${pet.status?.toLowerCase() || 'missing'}`}>
                  {pet.status || 'Missing'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="error-message">
          Error: Expected array of pets, but got: {typeof pets}
          <br />
          <pre>{JSON.stringify(pets, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Home