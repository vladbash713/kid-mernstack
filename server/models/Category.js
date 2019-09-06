const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  activateState:{
    isActivated: {
      type:Boolean,
      default: true
    },
    reason: String
  },
});

mongoose.model('Category', CategorySchema);