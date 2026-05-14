const router      = require('express').Router();
const controller  = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const checkRole   = require('../middleware/role');

router.get('/',           verifyToken, checkRole('Admin','Manager'), controller.getAll);
router.post('/',          verifyToken, checkRole('Admin'), controller.create);
router.put('/:id/role',   verifyToken, checkRole('Admin'), controller.updateRole);
router.put('/:id/status', verifyToken, checkRole('Admin'), controller.updateStatus);
router.delete('/:id',     verifyToken, checkRole('Admin'), controller.remove);  // ADD THIS

module.exports = router;