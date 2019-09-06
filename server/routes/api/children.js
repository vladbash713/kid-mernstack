const router = require('express').Router();
const auth = require('../auth');
const children = require('../../controllers/children.controller.js');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
   
const upload = multer({ storage: storage })

//POST new child route (required, only authenticated users have access)
router.post('/', [auth.required, upload.single('picture')], children.create);
// Retrieve all children
router.get('/', [auth.required, auth.isAdmin], children.findAll);
// Retrieve all children by parentId
router.get('/getChildrenByUserId', auth.required, children.findAllByUserId);
//GET current route (required, only authenticated users have access)
router.get('/:childId', auth.required, children.findOne);
// Update a child with childId
router.post('/update/:childId', [auth.required, upload.single('picture')], children.update);
// Delete a child with childId
router.delete('/:childId', auth.required, children.delete);

module.exports = router;