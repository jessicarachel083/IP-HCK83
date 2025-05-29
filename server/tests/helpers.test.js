const { hashPassword, comparePassword } = require('../helpers/bcrypt')
const { createToken, verifyToken } = require('../helpers/jwt')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Helper Functions', () => {
  describe('Bcrypt Helper', () => {
    it('should hash password correctly', () => {
      const password = 'testpassword123'
      const hashedPassword = hashPassword(password)
      
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
    })

    it('should compare password correctly', () => {
      const password = 'testpassword123'
      const hashedPassword = hashPassword(password)
      const isValid = comparePassword(password, hashedPassword)
      
      expect(isValid).toBe(true)
    })
  })

  describe('JWT Helper', () => {
    it('should create token correctly', () => {
      const payload = { id: 1, email: 'test@example.com' }
      const token = createToken(payload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })

    it('should verify token correctly', () => {
      const payload = { id: 1, email: 'test@example.com' }
      const token = createToken(payload)
      const decoded = verifyToken(token)
      
      expect(decoded.id).toBe(payload.id)
      expect(decoded.email).toBe(payload.email)
    })
  })
})