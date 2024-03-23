const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./config/db')
const CustomError = require('./errors/CustomError')
const errorHandler = require('./Handlers/errorHandler')
// const bodyParser = require("body-parser")

// app.use(bodyParser.urlencoded({ extended: true }));

//routes
const userRoutes = require('./routes/userRoutes')
dotenv.config()
connectDb()

app.use(express.json())
app.use('/api/user', userRoutes)

app.all('*', (req, res, next) => {
    const error = new CustomError(`Can't find ${req.originalUrl} on this server`, 404)
    next(error)

}) 
app.use(errorHandler)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)

})