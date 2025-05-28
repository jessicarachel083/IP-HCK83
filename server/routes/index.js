const router = require("express").Router()
const AuthController = require("../controllers/AuthController")
const MissingPetController = require("../controllers/MissingPetController")
const SightingController = require("../controllers/SightingController")
const CommentController = require("../controllers/CommentController")
const authentication = require("../middlewares/authentication")
const upload = require("../middlewares/upload")

// Auth routes (public)
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)

// Public routes
router.get("/missing-pets", MissingPetController.getAll)
router.get("/missing-pets/:id", MissingPetController.getById)
router.get("/missing-pets/:id/sightings", SightingController.getByMissingPetId)
router.get("/missing-pets/:id/comments", CommentController.getByMissingPetId)

// Protected routes (require login)
router.post("/missing-pets", authentication, upload.single('petPhoto'), MissingPetController.create)
router.patch("/missing-pets/:id/status", authentication, MissingPetController.updateStatus)
router.patch("/missing-pets/:id/generate-description", authentication, MissingPetController.generateDescription)
router.post("/sightings", authentication, SightingController.create)
router.post("/comments", authentication, CommentController.create)
router.delete("/comments/:id", authentication, CommentController.delete)

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Missing Pets API is working!" })
})

module.exports = router