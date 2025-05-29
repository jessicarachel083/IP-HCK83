const { Comment, User, MissingPet } = require('../models')

class CommentController {
  
  // POST /comments - Add comment to missing pet case
  static async create(req, res, next) {
    try {
      const { missingPetId, content } = req.body

      // Get userId from authenticated user
      const userId = req.user.id

      // Check if missing pet exists
      const missingPet = await MissingPet.findByPk(missingPetId)
      
      if (!missingPet) {
        return res.status(404).json({
          message: 'Missing pet not found'
        })
      }

      const newComment = await Comment.create({
        missingPetId,
        userId,
        content
      })

      // Include user info in response
      const commentWithUser = await Comment.findByPk(newComment.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      })

      res.status(201).json({
        message: 'Comment added successfully',
        comment: commentWithUser
      })

    } catch (error) {
      next(error)
    }
  }

  // GET /missing-pets/:id/comments - Get all comments for a missing pet
  static async getByMissingPetId(req, res, next) {
    try {
      const { id } = req.params

      // Check if missing pet exists
      const missingPet = await MissingPet.findByPk(id)
      
      if (!missingPet) {
        return res.status(404).json({
          message: 'Missing pet not found'
        })
      }

      const comments = await Comment.findAll({
        where: { missingPetId: id },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        order: [['createdAt', 'ASC']] // Oldest first (like a conversation)
      })

      res.status(200).json({
        message: 'Comments retrieved successfully',
        petName: missingPet.petName,
        count: comments.length,
        comments
      })

    } catch (error) {
      next(error)
    }
  }

  // DELETE /comments/:id - Delete own comment
  static async delete(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const comment = await Comment.findByPk(id)

      if (!comment) {
        return res.status(404).json({
          message: 'Comment not found'
        })
      }

      // Check if user owns this comment
      if (comment.userId !== userId) {
        return res.status(403).json({
          message: 'You can only delete your own comments'
        })
      }

      await comment.destroy()

      res.status(200).json({
        message: 'Comment deleted successfully'
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = CommentController