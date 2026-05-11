const router      = require('express').Router();
const c           = require('../controllers/projectController');
const verifyToken = require('../middleware/auth');
const checkRole   = require('../middleware/role');

router.get('/',             verifyToken, c.getAll);
router.get('/:id',          verifyToken, c.getOne);
router.post('/',            verifyToken, checkRole('Admin','Manager'), c.create);
router.put('/:id',          verifyToken, checkRole('Admin','Manager'), c.update);
router.delete('/:id',       verifyToken, checkRole('Admin'), c.remove);
router.post('/:id/members', verifyToken, checkRole('Admin','Manager'), c.assignMembers);

module.exports = router;
