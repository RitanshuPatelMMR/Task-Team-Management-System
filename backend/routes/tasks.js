const router      = require('express').Router();
const c           = require('../controllers/taskController');
const verifyToken = require('../middleware/auth');
const checkRole   = require('../middleware/role');

router.get('/',       verifyToken, c.getAll);
router.get('/:id',    verifyToken, c.getOne);
router.post('/',      verifyToken, checkRole('Admin','Manager'), c.create);
router.put('/:id',    verifyToken, c.update);
router.delete('/:id', verifyToken, checkRole('Admin','Manager'), c.remove);

module.exports = router;