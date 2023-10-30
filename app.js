require('dotenv').config();
require('express-async-errors');
const express = require('express');

//security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')

const connectDB = require('./db/connect')

const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/jobs')

const  authenticateUser = require('./middleware/authentication')
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//to allow access to rate limiter if server behind a reverse proxy e.g heroku
//app.set('trust proxy', 1)

//limit express requests to 100 from each IP per windowMs
app.use(rateLimiter({
  windowMs: 15*60*1000,
  max:100,
}))

app.use(express.json());
// extra security packages
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res)=>{
  res.send('home')
})
app.use('/api/jobs', authenticateUser, jobsRoutes)
app.use('/api/auth', authRoutes)

//error handler middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
