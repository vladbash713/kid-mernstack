const mongoose = require('mongoose');
const passport = require('passport');
const Users = mongoose.model('Users');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

// Create and Save a new User
exports.create = (req, res) => {
  const { body: { user } } = req;
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  
  const finalUser = new Users(user);
  finalUser.setPassword(user.password);
  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));

};

exports.currentOne = (req, res) => {
    const { payload: { id } } = req;
    return Users.findById(id)
        .then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }
        return res.json({ user: user.toAuthJSON() });
        });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    Users.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
    const id = req.params.userId;
    return Users.findById(id)
        .then((user) => {
        if(!user) {
            return res.sendStatus(400);
        }
        return res.json({ user: user.toAuthJSON() });
        });

};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    const { body: { user } } = req;
    // Validate Request
    if(!user) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Find user and update it with the request body
    Users.findByIdAndUpdate(req.params.userId, {
        name: user.name,
        email: user.email,
        school: user.school,
        language: user.language,
        country: user.country,
        role: user.role,
        activateState: this.activateState
    }, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });

};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    Users.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
              message: "User not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });

};

exports.login = (req, res, next) => {
    const { body: { user } } = req;
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }

    if(passportUser) {
      if(!passportUser.activateState.isActivated) {
        return res.status(401).json({
          errors: {
            isActivated: 'It is needed to be activated by admin.',
          },
        });
      }
      const user = passportUser;
      user.token = passportUser.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
}

exports.forgot = (req, res, next) => {
  if(req.body.email === ''){
    return res.json('email required');
  }
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Users.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.json('No account with that email address exists.');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_ADDRESS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Link to Reset Password',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/api/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.json({'info': 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}

exports.reset = (req, res) => {
  Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.json('Password reset token is invalid or has expired.');
    }
    return res.status(200).send({email: user.email, message: 'password reset link a-ok.'})
  });
};