// Brings in express server
const express = require('express')
const connectDB = require('./config/db')

//Initialize our app variable with express
const app = express()

// Connect Database
connectDB()

// Initialize Middleware. Allows us to get data in req.body (route pages)
app.use(express.json({extended: false}));

//Single endpoint just to test API. Send data to browser
app.get('/', (req, res) => res.send('API Running'))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

//Port variable that looks for enviroment variable called PORT to use. When deployed heroku thats where it will get the port
//Local default of 5000
const PORT = process.env.PORT || 5000

//Take app variable and LISTENING on porte
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));