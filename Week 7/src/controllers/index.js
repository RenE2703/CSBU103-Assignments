// Export controllers as routers
const indexController = require('./indexController');
const userController = require('./userController');

module.exports = {
  indexController,
  userController
};
