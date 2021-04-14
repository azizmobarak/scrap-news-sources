"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../model/Category'),
    category = _require.category;

var InsertData = function InsertData(data) {
  var lang, type;
  return regeneratorRuntime.async(function InsertData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          lang = "fr";
          type = "Article";
          data.map(function (article) {
            var _articledetails;

            var articleCateory = article.Category;
            var articledetails = (_articledetails = {
              articleTitle: article.title,
              articleSourceLink: article.link,
              articleImageURL: article.images,
              categoryName: articleCateory,
              mediaName: article.source,
              mediaLogo: article.sourceLogo
            }, _defineProperty(_articledetails, "mediaName", article.source), _defineProperty(_articledetails, "articleType", type), _defineProperty(_articledetails, "authorName", article.author), _defineProperty(_articledetails, "articleLanguage", lang), _defineProperty(_articledetails, "articleDescription", article.content), _defineProperty(_articledetails, "articleCleanDescription", article.contenthtml), _articledetails);
            console.log(articledetails);
            var Model = category("articles");
            Model.find({
              $and: [{
                articleSourceLink: articledetails.articleSourceLink
              }, {
                categoryName: articledetails.categoryName
              }]
            }, function (err, doc) {
              if (err) console.log(err);else {
                if (typeof doc[0] != "undefined") {} else {
                  var newModel = new Model(articledetails);
                  newModel.save(function (err, doc) {
                    if (err) console.log(err);else {
                      console.log("insert");
                    }
                  });
                }
              }
            });
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  InsertData: InsertData
};