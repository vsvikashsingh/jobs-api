require('dotenv').config();
require('express-async-errors');
const express = require('express');

const connectDB = require('./db/connect')

const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/jobs')

const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res)=>{
  res.send('home')
})
app.use('/api/jobs', jobsRoutes)
app.use('/api/auth', authRoutes)

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
