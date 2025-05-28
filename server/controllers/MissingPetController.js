const { MissingPet, User, Sighting, Comment } = require('../models')
const cloudinary = require('../config/cloudinary')
const { generateContent } = require('../helpers/gemini')

class MissingPetController {
  
  // POST /missing-pets - Create missing pet report
  static async create(req, res, next) {
    try {
      const { 
        petName, 
        petType, 
        breed, 
        color, 
        lastSeenLocation, 
        lastSeenDate, 
        contactInfo 
      } = req.body

      // For now, we'll use userId = 1 (later we'll get from JWT token)
      const userId = req.user.id
      
      let petPhoto = null

      if (req.file) {
        console.log("📷 File received:", req.file.originalname)
        
        // Convert to base64 (like your previous approach)
        const base64File = req.file.buffer.toString("base64")
        const dataURI = `data:${req.file.mimetype};base64,${base64File}`

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "missing-pets", // Organize uploads
          public_id: `${petName}-${Date.now()}` // Unique filename
        })

        console.log("☁️ Cloudinary upload success:", uploadResult.secure_url)
        petPhoto = uploadResult.secure_url
      }

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
        missingPet: newMissingPet,
        uploadedPhoto: petPhoto ? {
          url: petPhoto,
          uploaded: true
        } : null
      })

    } catch (error) {
      console.log("🚨 Upload error:", error.message)
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

  static async generateDescription(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // const missingPet = await MissingPet.findByPk(id)

      const missingPet = await MissingPet.findByPk(id, {
        include: [
          {
            model: Sighting,
            include: [
              {
                model: User,
                attributes: ['username', 'firstName']
              }
            ]
          },
          {
            model: Comment,
            include: [
              {
                model: User,
                attributes: ['username', 'firstName']
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

      // Check if user owns this pet
      if (missingPet.userId !== userId) {
        return res.status(403).json({
          message: 'You can only generate descriptions for your own pets'
        })
      }

      let sightingsInfo = ""
      if (missingPet.Sightings && missingPet.Sightings.length > 0) {
        const recentSightings = missingPet.Sightings.slice(0, 3) // Latest 3 sightings
        sightingsInfo = "\n\nRecent Sightings:\n" + recentSightings.map(sighting => 
          `- Spotted at ${sighting.location} on ${sighting.sightingDate} by ${sighting.User?.firstName || 'someone'}`
        ).join('\n')
      }

      let commentsInfo = ""
      if (missingPet.Comments && missingPet.Comments.length > 0) {
        const recentComments = missingPet.Comments.slice(-2) // Latest 2 comments
        commentsInfo = "\n\nCommunity Updates:\n" + recentComments.map(comment => 
          `- ${comment.User?.firstName || 'Someone'}: ${comment.content.slice(0, 80)}${comment.content.length > 80 ? '...' : ''}`
        ).join('\n')
      }

      // Create prompt for AI (following your lecture pattern)
      const prompt = `
Generate a factual, concise missing pet description in Bahasa Indonesia. Maximum 5 sentences. Be compassionate but professional.

Pet Information:
- Name: ${missingPet.petName}
- Type: ${missingPet.petType}
- Breed: ${missingPet.breed}
- Color: ${missingPet.color || 'Mixed colors'}
- Last seen: ${missingPet.lastSeenLocation} on ${missingPet.lastSeenDate}
- Contact: ${missingPet.contactInfo}
${sightingsInfo}
${commentsInfo}

Requirements:
1. Write in Bahasa Indonesia
2. Start with pet's name and basic facts
3. Include key identifying features
4. Mention last known location and date
5. If there are sightings or community updates, briefly summarize the most relevant information
6. End with contact instruction
7. Maximum 5 sentences
8. Professional but caring tone
9. Focus on facts that help identification

Generate the description in Bahasa Indonesia now.
      `

      console.log("🤖 Generating description with AI...")
      // console.log("Prompt:", prompt)

      // Generate content using AI (like your lecture)
      const generation = await generateContent(prompt)
      
      console.log("🤖 AI Generation:", generation)

      // Update pet description in database
      await missingPet.update({ description: generation })

      res.status(200).json({
        message: 'Pet description generated successfully',
        description: generation,
        petName: missingPet.petName,
        includedSightings: missingPet.Sightings?.length || 0,
        includedComments: missingPet.Comments?.length || 0
      })

    } catch (error) {
      console.log("🚨 AI Generation error:", error.message)
      next(error)
    }
  }


}

module.exports = MissingPetController