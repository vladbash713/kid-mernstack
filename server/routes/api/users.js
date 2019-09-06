const router = require('express').Router();
const auth = require('../auth');
const users = require('../../controllers/users.controller.js');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, users.create);
// Retrieve all users
router.get('/', auth.required, users.findAll);
//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, users.currentOne);
//GET current route (required, only authenticated users have access)
router.get('/:userId', auth.required, users.findOne);
// Update a User with userId
router.post('/update/:userId', auth.required, users.update);
// Delete a User with userId
router.delete('/:userId', auth.required, users.delete);
//POST login route (optional, everyone has access)
router.post('/login', auth.optional, users.login);
router.post('/forgot', auth.optional, users.forgot);
router.get('/reset/:token', auth.optional, users.reset);

module.exports = router;