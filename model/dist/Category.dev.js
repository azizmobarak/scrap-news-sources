"use strict";

var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
  articleCreatedDate: {
    type: Date,
    "default": Date.now()
  },
  articleTitle: {
    type: String,
    required: true
  },
  articleImageURL: String,
  authorName: {
    type: String,
    "default": null
  },
  articleType: {
    type: String,
    "default": "Article",
    "enum": ["Article", 'InternVideo', 'YoutubeVideo']
  },
  videoLink: {
    type: String,
    "default": null
  },
  categoryName: {
    type: String,
    required: true
  },
  mediaName: {
    type: String,
    required: true
  },
  mediaLogo: String,
  articleLanguage: {
    type: String,
    "enum": ['fr', 'en', 'es', 'ar']
  },
  articleSourceLink: String,
  articleDescription: String
});

var category = function category(name) {
  return mongoose.model(name, CategorySchema);
};

module.exports = {
  category: category
};