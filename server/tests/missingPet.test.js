const request = require('supertest')
const app = require('../app')
const { User, MissingPet } = require('../models')
const { createToken } = require('../helpers/jwt')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Missing Pet Endpoints', () => {
  let user, authToken

  beforeEach(async () => {
    user = await User.create({
      username: 'petowner',
      email: 'owner@example.com',
      password: 'password123'
    })

    authToken = createToken({ id: user.id, email: user.email })
  })

  describe('GET /missing-pets', () => {
    it('should get all missing pets', async () => {
      const response = await request(app)
        .get('/missing-pets')
        .expect(200)

      expect(response.body.message).toBe('Missing pets retrieved successfully')
      expect(Array.isArray(response.body.missingPets)).toBe(true)
    })
  })

  describe('POST /missing-pets', () => {
    it('should require authentication', async () => {
      const petData = {
        petName: 'Buddy',
        petType: 'dog'
      }

      const response = await request(app)
        .post('/missing-pets')
        .send(petData)
        .expect(401)

      expect(response.body.message).toBe('Please provide access token')
    })
  })

  describe('GET /missing-pets/:id', () => {
    it('should get specific missing pet by ID', async () => {
      const missingPet = await MissingPet.create({
        userId: user.id,
        petName: 'Fluffy',
        petType: 'cat',
        breed: 'Persian',
        petPhoto: 'http://example.com/photo.jpg',
        lastSeenLocation: 'Downtown',
        lastSeenDate: '2024-01-15',
        contactInfo: '081234567890'
      })
    
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}`)
        .expect(200)
    
      expect(response.body.message).toBe('Missing pet details retrieved successfully')
      expect(response.body.missingPet.petName).toBe('Fluffy')
    })

    it('should return 404 for non-existent missing pet', async () => {
      const response = await request(app)
        .get('/missing-pets/99999')
        .expect(404)
    
      expect(response.body.message).toBe('Missing pet not found')
    })
    
  })

  describe('PATCH /missing-pets/:id/status', () => {
    it('should update pet status when user owns the pet', async () => {
      const missingPet = await MissingPet.create({
        userId: user.id,
        petName: 'Rex',
        petType: 'dog',
        breed: 'Labrador',
        petPhoto: 'http://example.com/photo.jpg',
        lastSeenLocation: 'Park',
        lastSeenDate: '2024-01-15',
        contactInfo: '081234567890'
      })
    
      const response = await request(app)
        .patch(`/missing-pets/${missingPet.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'found' })
        .expect(200)
    
      expect(response.body.message).toBe('Pet status updated to: found')
      expect(response.body.missingPet.status).toBe('found')
    })

    it('should return 403 when user tries to update status of pet they do not own', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password123'
      })
    
      const missingPet = await MissingPet.create({
        userId: otherUser.id,
        petName: 'NotMyPet',
        petType: 'cat',
        breed: 'Siamese',
        petPhoto: 'http://example.com/photo.jpg',
        lastSeenLocation: 'Street',
        lastSeenDate: '2024-01-15',
        contactInfo: '081234567890'
      })
    
      const response = await request(app)
        .patch(`/missing-pets/${missingPet.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'found' })
        .expect(403)
    
      expect(response.body.message).toBe('You can only update status of your own pets')
    })

    it('should return 400 for invalid status value', async () => {
      const missingPet = await MissingPet.create({
        userId: user.id,
        petName: 'TestPet',
        petType: 'dog',
        breed: 'Mixed',
        petPhoto: 'http://example.com/photo.jpg',
        lastSeenLocation: 'Home',
        lastSeenDate: '2024-01-15',
        contactInfo: '081234567890'
      })
    
      const response = await request(app)
        .patch(`/missing-pets/${missingPet.id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid_status' })
        .expect(400)
    
      expect(response.body.message).toBe('Invalid status. Must be: missing, found, or closed')
    })

  })

})