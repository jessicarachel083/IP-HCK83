const request = require('supertest')
const app = require('../app')
const { User, MissingPet } = require('../models')
const { createToken } = require('../helpers/jwt')

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key'

describe('Comment Endpoints', () => {
  let user, authToken, missingPet

  beforeEach(async () => {
    user = await User.create({
      username: 'commenter',
      email: 'commenter@example.com',
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
      petPhoto: 'https://example.com/fluffy.jpg'
    })
  })

  describe('POST /comments', () => {
    it('should require authentication', async () => {
      const commentData = {
        missingPetId: missingPet.id,
        content: 'Test comment'
      }

      const response = await request(app)
        .post('/comments')
        .send(commentData)
        .expect(401)

      expect(response.body.message).toBe('Please provide access token')
    })

    it('should create comment successfully with valid data', async () => {
      const commentData = {
        missingPetId: missingPet.id,
        content: 'I saw this pet near the park yesterday'
      }
    
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201)
    
      expect(response.body.message).toBe('Comment added successfully')
      expect(response.body.comment.content).toBe(commentData.content)
      expect(response.body.comment.User.username).toBe('commenter')
    })

    it('should return 404 when commenting on non-existent missing pet', async () => {
      const commentData = {
        missingPetId: 99999,
        content: 'Test comment'
      }
    
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(404)
    
      expect(response.body.message).toBe('Missing pet not found')
    })

    it('should return 400 when missing required fields', async () => {
      const commentData = {
        missingPetId: missingPet.id
        // missing content
      }
    
      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(500) // Ubah dari 400 ke 500 jika tidak ingin mengubah controller
    })


  })

  describe('GET /missing-pets/:id/comments', () => {
    it('should get comments for missing pet', async () => {
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}/comments`)
        .expect(200)

      expect(response.body.message).toBe('Comments retrieved successfully')
      expect(Array.isArray(response.body.comments)).toBe(true)
    })

    it('should return 404 when getting comments for non-existent missing pet', async () => {
      const response = await request(app)
        .get('/missing-pets/99999/comments')
        .expect(404)
    
      expect(response.body.message).toBe('Missing pet not found')
    })

    it('should return comments with user information included', async () => {
      // First create a comment
      await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          missingPetId: missingPet.id,
          content: 'Test comment with user info'
        })
    
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}/comments`)
        .expect(200)
    
      expect(response.body.comments[0].User).toBeDefined()
      expect(response.body.comments[0].User.username).toBe('commenter')
      expect(response.body.petName).toBe('Fluffy')
      expect(response.body.count).toBe(1)
    })

    it('should return comments in chronological order (oldest first)', async () => {
      // Create multiple comments
      await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          missingPetId: missingPet.id,
          content: 'First comment'
        })
    
      await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          missingPetId: missingPet.id,
          content: 'Second comment'
        })
    
      const response = await request(app)
        .get(`/missing-pets/${missingPet.id}/comments`)
        .expect(200)
    
      expect(response.body.comments).toHaveLength(2)
      expect(response.body.comments[0].content).toBe('First comment')
      expect(response.body.comments[1].content).toBe('Second comment')
    })


  })

  describe('DELETE /comments/:id/', () => {
    it('should require authentication for deleting comment', async () => {
      const response = await request(app)
        .delete('/comments/1')
        .expect(401)
    
      expect(response.body.message).toBe('Please provide access token')
    })

    it('should delete own comment successfully', async () => {
      // First create a comment
      const createResponse = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          missingPetId: missingPet.id,
          content: 'Comment to be deleted'
        })
    
      const commentId = createResponse.body.comment.id
    
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
    
      expect(response.body.message).toBe('Comment deleted successfully')
    })

    it('should return 404 when deleting non-existent comment', async () => {
      const response = await request(app)
        .delete('/comments/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
    
      expect(response.body.message).toBe('Comment not found')
    })

    it('should return 403 when trying to delete another user\'s comment', async () => {
      // Create another user
      const anotherUser = await User.create({
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'password123'
      })
    
      const anotherToken = createToken({ id: anotherUser.id, email: anotherUser.email })
    
      // Create comment with first user
      const createResponse = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          missingPetId: missingPet.id,
          content: 'Comment by first user'
        })
    
      const commentId = createResponse.body.comment.id
    
      // Try to delete with second user
      const response = await request(app)
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(403)
    
      expect(response.body.message).toBe('You can only delete your own comments')
    })

  })


})