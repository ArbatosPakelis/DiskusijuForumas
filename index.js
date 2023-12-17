const express = require('express')
const app = express()
const AppError = require('./utils/appError');
const usersRouter = require("./routes/usersRouter");
const pagesRouter = require("./routes/pagesRouter");
const threadsRouter = require("./routes/threadsRouter");
const commentsRouter = require("./routes/commentsRouter");
const followsRouter = require("./routes/followsRouter");
const db = require("./models");
const cors = require('cors');
app.use(express.json());

const corsOptions = {
  origin: 'https://diskusiju-forumas-frontend-46917224cc75.herokuapp.com',
};
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

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

  
db.sequelize.sync().then(() => {
    console.log('Tables created successfully!');
 }).catch((error) => {
    console.error('Unable to create tables : ', error);
 });


app.use('/api/v1/users', usersRouter);
app.use('/api/v1/pages', pagesRouter);
app.use('/api/v1/threads', threadsRouter);
app.use('/api/v1/comments', commentsRouter);
app.use('/api/v1/follows', followsRouter);

// db.sequelize.sync();
console.log('Paths seems to work');
app.use('/', (req, res) => {
  res.json({"message":"your API works !"});
});
app.use('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});
console.log('Other paths seem to work');
// app.listen(5000, () => {console.log("Server started on port 5000")})
const PORT = process.env.PORT || 5000;
console.log('Creating port');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
