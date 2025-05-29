const { User } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { createToken } = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()

const client = new OAuth2Client()

class AuthController {
  
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body // Remove firstName, lastName, phoneNumber, location

      if (!password) {
        return res.status(400).json({
          message: "Password is required for regular registration"
        })
      }

      const newUser = await User.create({
        username,
        email,
        password
        // Remove firstName, lastName, phoneNumber, location
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
        access_token: token
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
        access_token: token
      })

    } catch (error) {
      next(error)
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { id_token } = req.body
      
      if (!id_token) {
        return res.status(400).json({ message: 'ID token is required' })
      }
      
      // Verify Google token (like your lecture)
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload()
      
      // Check if user exists
      const user = await User.findOne({ where: { email: payload.email } })

      let access_token // Declare once with let
      let responseUser

      if (!user) {
        // Create new OAuth user (adapted to your User table)
        const newUser = await User.create({
          username: payload.email.split('@')[0], // Generate username from email
          email: payload.email,
          password: null, // OAuth users don't need password
          firstName: payload.given_name,
          lastName: payload.family_name,
          profilePicture: payload.picture,
          oauthProvider: 'google',
          oauthId: payload.sub
        })

        access_token = createToken({ id: newUser.id, email: newUser.email })
        responseUser = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profilePicture: newUser.profilePicture
        }
        
        return res.status(201).json({ 
          message: 'Google login successful',
          user: responseUser,
          access_token 
        })
      }

      // Existing user login
      access_token = createToken({ id: user.id, email: user.email })
      responseUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture
      }
      
      res.status(200).json({ 
        message: 'Google login successful',
        user: responseUser,
        access_token 
      })

    } catch (error) {
      console.log("🚨 Google OAuth error:", error.message)
      next(error)
    }
  }

}

module.exports = AuthController