const multer = require('multer')

// Use memory storage (don't save to disk)
const storage = multer.memoryStorage()

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false)
  }
}

// Configure multer for Cloudinary
const upload = multer({
  storage: storage, // Memory storage for Cloudinary
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
})

module.exports = upload