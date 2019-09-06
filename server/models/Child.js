const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChildSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  photo: {
    data: Buffer, contentType: String
  },
  birthday: Date,
  school: String,
  language: String,
  grade: String,
  parent_id: String,
  country: String,
  
});

mongoose.model('Child', ChildSchema);