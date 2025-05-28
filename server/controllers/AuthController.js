const { User } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')

class AuthController {
  
  static async register(req, res, next) {
    try {
      const { username, email, password, firstName, lastName, phoneNumber, location } = req.body

      const newUser = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        location
      })

      const token = createToken({
        id: newUser.id, 
        email: newUser.email
      })

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        token
      })

    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })
      
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        })
      }

      if (!user.password && user.oauthProvider) {
        return res.status(400).json({
          message: 'Please login with your social media account'
        })
      }

      const isValidPassword = comparePassword(password, user.password)
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: 'Invalid email or password' 
        })
      }

      const token = createToken({
        id: user.id, 
        email: user.email
      })

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = AuthController