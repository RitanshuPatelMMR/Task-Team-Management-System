const router      = require('express').Router();
const c           = require('../controllers/dashboardController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, c.getSummary);

module.exports = router;