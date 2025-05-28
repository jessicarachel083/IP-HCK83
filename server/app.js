const express = require('express')
const app = express()
const routers = require("./routes")
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", routers)

app.use(errorHandler)

module.exports = app