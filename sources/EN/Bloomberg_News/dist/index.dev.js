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
var Categories = ['markets', 'technology', 'opinion', 'businessweek', 'new-economy-forum'];

var Bloomberg = function Bloomberg() {
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
              _context.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category);
            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.bloomberg.com/', '', Category].join('')));

          case 15:
            _context.next = 34;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](12);
            _context.next = 21;
            return regeneratorRuntime.awrap(page["goto"](['https://www.bloomberg.com/', '', Category].join('')));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(page.solveRecaptchas());

          case 23:
            _context.t1 = regeneratorRuntime;
            _context.t2 = Promise;
            _context.t3 = page.waitForNavigation();
            _context.t4 = page.click(".g-recaptcha");
            _context.next = 29;
            return regeneratorRuntime.awrap(page.$eval('input[type=submit]', function (el) {
              return el.click();
            }));

          case 29:
            _context.t5 = _context.sent;
            _context.t6 = [_context.t3, _context.t4, _context.t5];
            _context.t7 = _context.t2.all.call(_context.t2, _context.t6);
            _context.next = 34;
            return _context.t1.awrap.call(_context.t1, _context.t7);

          case 34:
            _context.next = 36;
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
              }; // bloomberg serction one
              // change the source logo to http 


              var titles = document.querySelector('.single-story-module__headline-link');
              var images = document.querySelector('.single-story-module img');
              var time = document.querySelector('.single-story-module time');
              var link = document.querySelector('.single-story-module a');

              if (Category === "opinion" || Category === "businessweek" || Category === "new-economy-forum") {
                var elem = document.createTextNode('p');
                elem.textContent = "minute";
                time = elem;
              } //change category name


              var cateogryName = "";

              switch (Category) {
                case "businessweek":
                  cateogryName = "business";
                  break;

                case "new-economy-forum":
                  cateogryName = "economy";
                  break;

                default:
                  cateogryName = Category;
                  break;
              } //////////////////////////////


              var data = [];

              for (var j = 0; j < 1; j++) {
                if (WordExist(time == null ? "nothing" : time.textContent) == true && titles != null) {
                  data.push({
                    time: Date.now(),
                    title: titles.textContent.trim(),
                    link: link.href,
                    images: typeof images != "undefined" ? images.src : null,
                    Category: cateogryName,
                    source: "Bloomberg",
                    sourceLink: "https://www.bloomberg.com/",
                    sourceLogo: "bloomberg logo"
                  });
                }
              }

              return data;
            }, Category));

          case 36:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 38:
            i++;
            _context.next = 9;
            break;

          case 41:
            _context.next = 47;
            break;

          case 43:
            _context.prev = 43;
            _context.t8 = _context["catch"](7);
            _context.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context.prev = 47;
            _context.next = 50;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 50:
            _context.next = 56;
            break;

          case 52:
            _context.prev = 52;
            _context.t9 = _context["catch"](47);
            _context.next = 56;
            return regeneratorRuntime.awrap(browser.close());

          case 56:
            _context.next = 58;
            return regeneratorRuntime.awrap(browser.close());

          case 58:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 43], [12, 17], [47, 52]]);
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
            _context2.next = 17;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url);

          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('div.body-copy-v2.fence-body p');
            var textArray = [];

            for (var _i = 0; _i < text.length; _i++) {
              textArray.push(text[_i].textContent);
              textArray.push('   ');
            }

            return textArray.join('\n');
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.lede-text-v2__byline').textContent.split('\n')[1].trim();
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
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

        case 14:
          i++;
          _context2.next = 2;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = Bloomberg;