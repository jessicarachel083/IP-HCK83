const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

async function authentication(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.get("Authorization")
    
    if (!authHeader) {
      return res.status(401).json({
        message: "Please provide access token"
      })
    }

    // Extract token (handle both "Bearer TOKEN" and raw token)
    let token
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7) // Remove "Bearer " prefix
    } else {
      token = authHeader // Raw token
    }

    console.log("🔑 Token received:", token.substring(0, 20) + "...")

    // Verify token
    const decoded = verifyToken(token)
    console.log("🔑 Token decoded:", decoded)
    
    // Find user from token
    const user = await User.findByPk(decoded.id)
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token - user not found"
      })
    }

    console.log("🔑 User authenticated:", user.email)

    // Add user info to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }

    next()

  } catch (error) {
    console.log("🚨 Auth error:", error.message)
    console.log("🚨 Full error:", error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token format"
      })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token has expired"
      })
    } else {
      return res.status(401).json({
        message: "Authentication failed"
      })
    }
  }
}

module.exports = authentication