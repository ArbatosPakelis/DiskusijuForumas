const express = require('express')
const app = express()
const usersRouter = require("./routes/usersRouter")
const pagesRouter = require("./routes/pagesRouter")
const threadsRouter = require("./routes/threadsRouter")
const commentsRouter = require("./routes/commentsRouter")
const followsRouter = require("./routes/followsRouter")
// const db = require("./models");

const { Sequelize } = require('sequelize');
const config = require("./config/config.json");
const sequelize = new Sequelize(config.development); // Use the "development" configuration

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

// db.sequelize.sync().then(() => {
//     console.log('Tables created successfully!');
//  }).catch((error) => {
//     console.error('Unable to create tables : ', error);
//  });


app.use('/api/v1/users', usersRouter);
app.use('/api/v1/pages', pagesRouter);
app.use('/api/v1/threads', threadsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/follows', followsRouter);

// db.sequelize.sync();
app.use('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

app.listen(5000, () => {console.log("Server started on port 5000")})
