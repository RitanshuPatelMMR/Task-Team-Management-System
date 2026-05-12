const router      = require('express').Router({ mergeParams: true });
const c           = require('../controllers/commentController');
const verifyToken = require('../middleware/auth');

router.get('/',     verifyToken, c.getAll);
router.post('/',    verifyToken, c.create);
router.put('/:id',  verifyToken, c.update);
router.delete('/:id', verifyToken, c.remove);

module.exports = router;