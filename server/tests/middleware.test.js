const request = require('supertest')
const app = require('../app')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Middleware Tests', () => {
  describe('Authentication Middleware', () => {
    it('should reject request without token', async () => {
      const response = await request(app)
        .post('/missing-pets')
        .send({
          petName: 'Test Pet',
          petType: 'dog'
        })
        .expect(401)

      expect(response.body.message).toBe('Please provide access token')
    })

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .post('/missing-pets')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          petName: 'Test Pet',
          petType: 'dog'
        })
        .expect(401)

      expect(response.body.message).toBe('Invalid token format')
    })
  })
})