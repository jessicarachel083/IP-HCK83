const { sequelize } = require('../models')

// Set test environment and required env vars
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key'
process.env.CLOUDINARY_CLOUD_NAME = 'test'
process.env.CLOUDINARY_API_KEY = 'test'
process.env.CLOUDINARY_API_SECRET = 'test'
process.env.GEMINI_API_KEY = 'test'

// Setup and teardown for each test
beforeEach(async () => {
  // Sync database and clear data before each test
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  // Close database connection after all tests
  await sequelize.close()
})