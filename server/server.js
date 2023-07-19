//require in dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');

//set express functionallity to 'app' and establish PORT
const app = express();
const PORT = 3000;

//convert incoming requests to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//requiring in routers
const homeRouter = require('./routes/homeRouter');
const preferenceRouter = require('./routes/preferenceRouter');
// const signinRouter = require('./routes/signinRouter');
const signupRouter = require('./routes/signupRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

//establishing router paths
app.use('/api/home', homeRouter);
app.use('/api/preferences', preferenceRouter);
// app.use('/api/signin', signinRouter);
app.use('/api/signup', signupRouter);
app.use('/api/authentication', authRouter);
app.use('/api/user', userRouter);

//serve bundle during p roduction build
if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/dist', express.static(path.join(__dirname, '../dist')));
}

// serve index.html on the route '/'
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../client/index.html'));
});

//catch-all route
app.use((req, res) => {
  res.sendStatus(404);
});

//global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

//listen on PORT 3000
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

//export app
module.exports = app;
