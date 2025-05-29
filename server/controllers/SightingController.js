const { Sighting, User, MissingPet } = require('../models')

class SightingController {
  
  // POST /sightings - Report pet sighting
  static async create(req, res, next) {
    try {
      const { 
        missingPetId, 
        location, 
        sightingDate, 
        description 
      } = req.body

      // Get reporterId from authenticated user
      const reporterId = req.user.id

      // Check if missing pet exists
      const missingPet = await MissingPet.findByPk(missingPetId)
      
      if (!missingPet) {
        return res.status(404).json({
          message: 'Missing pet not found'
        })
      }

      // Check if pet is still missing (not found or closed)
      if (missingPet.status !== 'missing') {
        return res.status(400).json({
          message: `Cannot report sighting - pet status is: ${missingPet.status}`
        })
      }

      const newSighting = await Sighting.create({
        missingPetId,
        reporterId,
        location,
        sightingDate,
        description,
        isVerified: false // default
      })

      // Include reporter info in response
      const sightingWithReporter = await Sighting.findByPk(newSighting.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      })

      res.status(201).json({
        message: 'Sighting reported successfully',
        sighting: sightingWithReporter
      })

    } catch (error) {
      next(error)
    }
  }

  // GET /missing-pets/:id/sightings - Get all sightings for a missing pet
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

      const sightings = await Sighting.findAll({
        where: { missingPetId: id },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ],
        order: [['sightingDate', 'DESC'], ['createdAt', 'DESC']]
      })

      res.status(200).json({
        message: 'Sightings retrieved successfully',
        petName: missingPet.petName,
        count: sightings.length,
        sightings
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = SightingController