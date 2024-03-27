// models/sample.model.js
const mongoose = require('mongoose');

const Lead = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
});

module.exports = mongoose.model('lead', Lead);