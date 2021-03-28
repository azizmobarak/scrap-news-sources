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
var Categories = ['politics', 'media', 'opinion', 'economy', 'markets', 'technology', 'entertainment', 'sports', 'lifestyle', 'health', 'security', 'computers', 'video-games', 'science', 'us', 'movies'];

var FOXNEWS = function FOXNEWS() {
  (function _callee() {
    var browser, page, AllData, i, Category, url, PageData;
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
            AllData = []; // boucle on categories started 

            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 43;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            url = ""; // switch url depending on categories

            if (Category === "economy" || Category === "markets" || Category === "technology") {
              url = "https://www.foxbusiness.com/";
            } else {
              if (Category === "security" || Category === "computers" || Category === "video-games") {
                url = "https://www.foxnews.com/category/tech/topics/";
              } else {
                if (Category === "movies") {
                  url = "https://www.foxnews.com/category/entertainment/";
                } else {
                  url = "https://www.foxnews.com/";
                }
              }
            } // ------------------------------------------------------------


            _context.prev = 14;
            _context.next = 17;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 17:
            _context.next = 36;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](14);
            _context.next = 23;
            return regeneratorRuntime.awrap(page["goto"]([url, '', Category].join('')));

          case 23:
            _context.next = 25;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 25:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 31;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 31:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 36;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 36:
            _context.next = 38;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // function to look for a word inside other words
              var WordExist = function WordExist(searchIn) {
                if (searchIn.indexOf("second") != -1) {
                  return true;
                } else {
                  if (searchIn.indexOf("seconds") != -1) {
                    return true;
                  } else {
                    if (searchIn.indexOf("minute") != -1) {
                      return true;
                    } else {
                      if (searchIn.indexOf("minutes") != -1) {
                        return true;
                      } else {
                        if (searchIn.startsWith("1 hour") != false || searchIn.startsWith("an hour") != false) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    }
                  }
                }
              }; // Fox classes


              var titleClassName = ".article h4.title";
              var linkClassName = ".article h4.title a";
              var imageClassName = ".article-list .article a>img";
              var timeClassName = ".article-list .article span.time";

              if (Category === "economy" || Category === "markets" || Category === "technology") {
                titleClassName = ".collection-river .article h3.title";
                linkClassName = ".collection-river .article h3.title>a";
                imageClassName = ".collection-river .article a>picture>img";
                timeClassName = ".collection-river .article time.time";
              } else {
                if (Category === "lifestyle") {
                  Category = "life&style";
                } else {
                  if (Category === "politics") {
                    Category = "politic";
                  } else {
                    if (Category === "sports") {
                      Category = "sport";
                    }
                  }
                }
              } // get lists


              var titles = document.querySelectorAll(titleClassName);
              var links = document.querySelectorAll(linkClassName);
              var images = document.querySelectorAll(imageClassName);
              var time = document.querySelectorAll(timeClassName); // collect data in data table

              var data = [];

              for (var j = 0; j < images.length; j++) {
                if (WordExist(typeof time[j] == "undefined" ? "nothing" : time[j].textContent) == true && typeof time[j] != "undefined" && typeof titles[j] != "undefined" && images[j].src.indexOf('http') == 0) {
                  data.push({
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] != "undefined" ? images[j].src : null,
                    Category: Category,
                    source: "FoxNews Channel_" + Category,
                    sourceLink: "https://www.foxnews.com",
                    sourceLogo: "https://pbs.twimg.com/profile_images/918480715158716419/4X8oCbge_400x400.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 38:
            PageData = _context.sent;
            PageData.map(function (item) {
              console.log(item.Category);
              AllData.push(item);
            });

          case 40:
            i++;
            _context.next = 9;
            break;

          case 43:
            _context.next = 49;
            break;

          case 45:
            _context.prev = 45;
            _context.t8 = _context["catch"](7);
            _context.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
            _context.prev = 49;
            _context.next = 52;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 52:
            _context.next = 58;
            break;

          case 54:
            _context.prev = 54;
            _context.t9 = _context["catch"](49);
            _context.next = 58;
            return regeneratorRuntime.awrap(browser.close());

          case 58:
            _context.next = 60;
            return regeneratorRuntime.awrap(browser.close());

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 45], [14, 19], [49, 54]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHTML, Author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 20;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll('.article-content p');
              var textArray = [];

              for (var _i = 1; _i < text.length; _i++) {
                textArray.push(text[_i].textContent);
                textArray.push(' ');
              }

              return textArray.join(' ').replaceAll('\n', '  ');
            } catch (_unused3) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article-content').innerHTML;
            } catch (_unused4) {
              return null;
            }
          }));

        case 12:
          ContentHTML = _context2.sent;
          _context2.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('.author-byline span>span>a');

            if (typeof auth != "undefined" && auth != null) {
              if (auth.textContent.indexOf('Content provided') != -1) {
                return null;
              }

              return auth.textContent;
            } else {
              return null;
            }
          }));

        case 15:
          Author = _context2.sent;

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
              author: Author,
              content: Content.substring(0, 3000),
              contentHTML: ContentHTML
            });
          }

        case 17:
          i++;
          _context2.next = 2;
          break;

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = FOXNEWS;