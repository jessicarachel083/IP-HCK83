const request = require('supertest')
const app = require('../app')
const { User, MissingPet } = require('../models')
const { createToken } = require('../helpers/jwt')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Sighting Endpoints', () => {
  let user, authToken, missingPet

  beforeEach(async () => {
    user = await User.create({
      username: 'reporter',
      email: 'reporter@example.com',
      password: 'password123'
    })

    authToken = createToken({ id: user.id, email: user.email })

    missingPet = await MissingPet.create({
      userId: user.id,
      petName: 'Fluffy',
      petType: 'cat',
      breed: 'Persian',
      color: 'white',
      lastSeenLocation: 'Central Park',
      lastSeenDate: '2024-01-15',
      contactInfo: 'Call 555-0123',
      status: 'missing',
      petPhoto: 'https://example.com/fluffy.jpg',
    })
  })

  describe('POST /sightings', () => {
    it('should require authentication', async () => {
      const sightingData = {
        missingPetId: missingPet.id,
        location: 'Near the fountain'
      }

      const response = await request(app)
        .post('/sightings')
        .send(sightingData)
        .expect(401)

      expect(response.body.message).toBe('Please provide access token')
    })

    it('should successfully create a sighting with valid data', async () => {
      const sightingData = {
        missingPetId: missingPet.id,
        location: 'Near the fountain',
        sightingDate: '2024-01-16T10:00:00Z',
        description: 'Saw a white cat that looks like Fluffy'
      }
    
      const response = await request(app)
        .post('/sightings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sightingData)
        .expect(201)
    
      expect(response.body.message).toBe('Sighting reported successfully')
      expect(response.body.sighting.location).toBe(sightingData.location)
      expect(response.body.sighting.isVerified).toBe(false)
    })

    it('should return 404 when missing pet does not exist', async () => {
      const sightingData = {
        missingPetId: 99999,
        location: 'Somewhere',
        sightingDate: '2024-01-16T10:00:00Z'
      }
    
      const response = await request(app)
        .post('/sightings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sightingData)
        .expect(404)
    
      expect(response.body.message).toBe('Missing pet not found')
    })

    it('should return 400 when trying to report sighting for non-missing pet', async () => {
      // Update pet status to 'found'
      await missingPet.update({ status: 'found' })
    
      const sightingData = {
        missingPetId: missingPet.id,
        location: 'Somewhere',
        sightingDate: '2024-01-16T10:00:00Z'
      }
    
      const response = await request(app)
        .post('/sightings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sightingData)
        .expect(400)
    
      expect(response.body.message).toContain('Cannot report sighting - pet status is:')
    })

    it('should create sighting without description (optional field)', async () => {
      const sightingData = {
        missingPetId: missingPet.id,
        location: 'Park entrance',
        sightingDate: '2024-01-16T14:00:00Z'
      }
    
      const response = await request(app)
        .post('/sightings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sightingData)
        .expect(201)
    
      expect(response.body.sighting.description).toBeNull()
    })

  })

  describe('GET /missing-pets/:id/sightings', () => {
    it('should get sightings for missing pet', async () => {
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}/sightings`)
        .expect(200)

      expect(response.body.message).toBe('Sightings retrieved successfully')
      expect(Array.isArray(response.body.sightings)).toBe(true)
    })

    it('should return 404 when missing pet does not exist', async () => {
      const response = await request(app)
        .get('/missing-pets/99999/sightings')
        .expect(404)
    
      expect(response.body.message).toBe('Missing pet not found')
    })

    it('should return empty array when no sightings exist', async () => {
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}/sightings`)
        .expect(200)
    
      expect(response.body.sightings).toEqual([])
      expect(response.body.count).toBe(0)
    })


  })
})