const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.use((req, res, next) => {
    console.log(`🔐 Auth route: ${req.method} ${req.path}`);
    console.log('🔐 Auth body:', req.body);
    next();
  });
  
  // POST /api/auth/register
  router.post('/register', (req, res, next) => {
    console.log('🔐 Register route hit!');
    AuthController.register(req, res, next);
  });
  
  // POST /api/auth/login
  router.post('/login', (req, res, next) => {
    console.log('🔐 Login route hit!');
    AuthController.login(req, res, next);
  });

  console.log('✅ Auth routes configured');

module.exports = router;