const request = require('supertest')
const app = require('../app')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Auth Endpoints', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201)

      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.access_token).toBeDefined()
    })
    
  })

  describe('POST /login', () => {
    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(401)

      expect(response.body.message).toBe('Invalid email or password')
    })

    it('should login successfully with valid credentials', async () => {
      // First register a user
      const userData = {
        username: 'logintest',
        email: 'login@example.com',
        password: 'password123'
      }
    
      await request(app)
        .post('/register')
        .send(userData)
        .expect(201)
    
      // Then login
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      }
    
      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(200)
    
      expect(response.body.access_token).toBeDefined()
      expect(response.body.message).toBe('Login successful')
    })

    
  })
})