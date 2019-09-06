const mongoose = require('mongoose');
const Child = mongoose.model('Child');

// Create and Save a new Child
exports.create = (req, res) => {
    const { body: { child } } = req;
    if(!child.name) {
        return res.status(422).json({
        errors: {
            name: 'is required',
        },
        });
    }

    if(!child.parent_id) {
        return res.status(422).json({
        errors: 'parent_id is needed'
        });
    }
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
    var finalImg = {
      contentType: req.file.mimetype,
      data:  new Buffer(encode_image, 'base64')
    };

  const finalChild = new Child(child);
  finalChild.photo = finalImg;

  return finalChild.save()
  .then(data => {
    res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the child."
      });
  });
};

// Retrieve and return all children from the database.
exports.findAll = (req, res) => {
  Child.find()
    .then(children => {
        res.send(children);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving children."
        });
    });
};

// Retrieve and return all children from the database.
exports.findAllByUserId = (req, res) => {
    if(!req.body.parent_id) return res.json('Parent_id is needed.');
    Child.find({ parent_id: req.body.parent_id }).then(children => {
        res.send(children);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving children."
        });
    });
  };

// Find a single child with a childId
exports.findOne = (req, res) => {
    const id = req.params.childId;
    return Child.findById(id)
    .then(child => {
      if(!child) {
          return res.status(404).send({
              message: "Child not found with id " + req.params.childId
          });            
      }
      res.send(child);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Child not found with id " + req.params.childId
              });                
          }
          return res.status(500).send({
              message: "Error retrieving child with id " + req.params.childId
          });
      });

};

// Update a child identified by the childId in the request
exports.update = (req, res) => {
    const { body: { child } } = req;
    // Validate Request
    if(!child.name) {
        return res.status(400).send({
            message: "Child name can not be empty"
        });
    }
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
    var finalImg = {
      contentType: req.file.mimetype,
      data:  new Buffer(encode_image, 'base64')
    };
    
    // Find child and update it with the request body
    Child.findByIdAndUpdate(req.params.childId, {
        name: child.name,
        photo: finalImg,
        birthday: child.birthday,
        school: child.school,
        language: child.language,
        grade: child.grade,
        parent_id: child.parent_id,
        country: child.country

    }, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Child not found with id " + req.params.childId
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Child not found with id " + req.params.childId
            });                
        }
        return res.status(500).send({
            message: "Error updating child with id " + req.params.childId
        });
    });

};

// Delete a child with the specified childId in the request
exports.delete = (req, res) => {
  Child.findByIdAndRemove(req.params.childId)
    .then(child => {
        if(!child) {
            return res.status(404).send({
                message: "Child not found with id " + req.params.childId
            });
        }
        res.send({message: "Child deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Child not found with id " + req.params.childId
            });                
        }
        return res.status(500).send({
            message: "Could not delete child with id " + req.params.childId
        });
    });
};
