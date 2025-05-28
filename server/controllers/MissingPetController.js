const { MissingPet, User, Sighting, Comment } = require('../models')

class MissingPetController {
  
  // POST /missing-pets - Create missing pet report
  static async create(req, res, next) {
    try {
      const { 
        petName, 
        petType, 
        breed, 
        color, 
        petPhoto, 
        lastSeenLocation, 
        lastSeenDate, 
        contactInfo 
      } = req.body

      // For now, we'll use userId = 1 (later we'll get from JWT token)
      const userId = req.user.id

      const newMissingPet = await MissingPet.create({
        userId,
        petName,
        petType,
        breed,
        color,
        petPhoto,
        lastSeenLocation,
        lastSeenDate,
        contactInfo,
        status: 'missing' // default status
      })

      res.status(201).json({
        message: 'Missing pet reported successfully',
        missingPet: newMissingPet
      })

    } catch (error) {
      next(error)
    }
  }

  // GET /missing-pets - Get all missing pets
  static async getAll(req, res, next) {
    try {
      const missingPets = await MissingPet.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email', 'firstName', 'lastName']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      res.status(200).json({
        message: 'Missing pets retrieved successfully',
        count: missingPets.length,
        missingPets
      })

    } catch (error) {
      next(error)
    }
  }

  // GET /missing-pets/:id - Get specific missing pet
  static async getById(req, res, next) {
    try {
      const { id } = req.params

      const missingPet = await MissingPet.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phoneNumber']
          },
          {
            model: Sighting,
            include: [
              {
                model: User,
                attributes: ['id', 'username', 'firstName', 'lastName']
              }
            ]
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ['id', 'username', 'firstName', 'lastName']
              }
            ]
          }
        ]
      })

      if (!missingPet) {
        return res.status(404).json({
          message: 'Missing pet not found'
        })
      }

      res.status(200).json({
        message: 'Missing pet details retrieved successfully',
        missingPet
      })

    } catch (error) {
      next(error)
    }
  }

  // PATCH /missing-pets/:id/status - Update pet status
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status } = req.body
      const userId = req.user.id

      // Validate status
      const validStatuses = ['missing', 'found', 'closed']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status. Must be: missing, found, or closed'
        })
      }

      const missingPet = await MissingPet.findByPk(id)

      if (!missingPet) {
        return res.status(404).json({
          message: 'Missing pet not found'
        })
      }

       // Check if user owns this pet
       if (missingPet.userId !== userId) {
        return res.status(403).json({
          message: 'You can only update status of your own pets'
        })
      }

      await missingPet.update({ status })

      res.status(200).json({
        message: `Pet status updated to: ${status}`,
        missingPet
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = MissingPetController