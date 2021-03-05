const apiRouter = require('express').Router();

apiRouter.get('/', async (req, res) => {
  res.send('This is inhumane');
});

module.exports = apiRouter;
