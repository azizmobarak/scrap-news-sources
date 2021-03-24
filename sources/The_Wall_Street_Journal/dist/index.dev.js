"use strict";

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData; //block ads


puppeteer.use(AdblockerPlugin()); // stealth

puppeteer.use(puppeteer_stealth()); // captcha configuration

puppeteer.use(Recaptcha({
  provider: {
    id: '2captcha',
    token: process.env.KEY
  },
  visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)

}));
puppeteer.use(puppeteer_agent());
var Categories = ['us', 'economy', 'technology', 'opinion', 'realestate', 'world', 'politics', 'business', 'markets', 'life-arts', 'types/asia-news', 'types/china-news', 'types/latin-america-news', 'economy', 'types/africa-news', 'types/canada-news', 'types/middle-east-news'];

var WALLSTREET = function WALLSTREET() {
  (function _callee() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context.sent;
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 27;
              break;
            }

            //get the right category by number
            Category = Categories[i]; // console.log(Category)

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.wsj.com/news/', '', Category].join('')));

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](['https://www.wsj.com/news/', '', Category].join('')));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // Los Angelece News classes
              var articles = document.querySelectorAll("article");
              var titleClassName = "h2";
              var imageClassName = "img";
              var linkClassName = "a"; //change category name

              var categoryName = Category;

              switch (Category) {
                case 'world':
                  categoryName = "international";
                  break;

                case 'life-arts':
                  categoryName = "art&design";
                  break;

                case 'realestate':
                  categoryName = "business";
                  break;

                case 'politics':
                  categoryName = "politic";
                  break;

                case 'markets':
                  categoryName = "market";
                  break;

                default:
                  if (Category.indexOf('asia') != -1) {
                    categoryName = "international";
                  } else {
                    if (categoryName.indexOf('africa') != -1) {
                      categoryName = "international";
                    } else {
                      if (categoryName.indexOf('china') != -1) {
                        categoryName = 'international';
                      } else {
                        if (categoryName.indexOf('america') != -1) {
                          categoryName = "international";
                        } else {
                          if (categoryName.indexOf('middle-east') != -1) {
                            categoryName = "international";
                          } else {
                            if (categoryName.indexOf('canada') != -1) {
                              categoryName = "canada";
                            } else {
                              cateogryName = Category;
                            }
                          }
                        }
                      }
                    }
                  }

              } ////////////////////////////////////


              var data = [];

              for (var j = 0; j < 4; j++) {
                if (j > 0) titleClassName = "h3";

                if (articles[j].querySelector(titleClassName) != null && articles[j].querySelector(linkClassName) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titleClassName).textContent.trim(),
                    link: articles[j].querySelector(linkClassName).href,
                    images: articles[j].querySelector(imageClassName) != null ? articles[j].querySelector(imageClassName).src : null,
                    Category: categoryName,
                    source: "The WallStreetJournal " + categoryName,
                    sourceLink: "https://www.wsj.com",
                    sourceLogo: "https://assets.website-files.com/5a33ed4f5aec59000163e8fa/5bbf5920e9654bdac813dc27_WSJ%20thumbnial.png"
                  });
                }
              }

              return data;
            }, Category));

          case 22:
            PageData = _context.sent;
            //  console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 24:
            i++;
            _context.next = 9;
            break;

          case 27:
            _context.next = 34;
            break;

          case 29:
            _context.prev = 29;
            _context.t1 = _context["catch"](7);
            console.log(_context.t1);
            _context.next = 34;
            return regeneratorRuntime.awrap(browser.close());

          case 34:
            _context.prev = 34;
            _context.next = 37;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 37:
            _context.next = 44;
            break;

          case 39:
            _context.prev = 39;
            _context.t2 = _context["catch"](34);
            console.log(e);
            _context.next = 44;
            return regeneratorRuntime.awrap(browser.close());

          case 44:
            _context.next = 46;
            return regeneratorRuntime.awrap(browser.close());

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 29], [11, 16], [34, 39]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 26;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url)

          _context2.next = 7;
          return regeneratorRuntime.awrap(page.setJavaScriptEnabled(false));

        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 10:
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](7);
          _context2.next = 16;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('.snippet div+div+div+div p');
              var textArray = [];

              for (var _i = 0; _i < text.length - 1; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push('   ');
              }

              return textArray.join('\n');
            } catch (_unused3) {
              return null;
            }
          }));

        case 18:
          Content = _context2.sent;
          _context2.next = 21;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-button').textContent.trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 21:
          author = _context2.sent;

          if (Content != null && Content != "") {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: author,
              content: Content != null ? Content : null
            });
          }

        case 23:
          i++;
          _context2.next = 2;
          break;

        case 26:
          _context2.next = 28;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 28:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 12]]);
};

module.exports = WALLSTREET;