const express = require('express');
const cors = require('cors');

require('express-async-errors');

const app = express();
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const apiRouter = require('./controllers/api');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use('/api', apiRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
