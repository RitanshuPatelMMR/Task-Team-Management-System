const router      = require('express').Router();
const controller  = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const checkRole   = require('../middleware/role');

router.get('/',           verifyToken, checkRole('Admin'), controller.getAll);
router.post('/',          verifyToken, checkRole('Admin'), controller.create);
router.put('/:id/role',   verifyToken, checkRole('Admin'), controller.updateRole);
router.put('/:id/status', verifyToken, checkRole('Admin'), controller.updateStatus);

module.exports = router;