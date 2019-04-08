const mongoose = require('mongoose');
const db = require('../db');

const newsSchema = mongoose.Schema({
  title: String,
  description: String,
  fullUrl: String,
  image: String,
});

const ms2News = mongoose.model('MS2News', newsSchema);

module.exports = ms2News;
