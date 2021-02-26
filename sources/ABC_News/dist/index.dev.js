'use strict';

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
var Categories = ['politics', 'health', 'sports', 'international', 'business'];

var ABC_NEWS = function ABC_NEWS() {
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
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://abcnews.go.com/', '', Category].join('')));

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](11);
            _context.next = 20;
            return regeneratorRuntime.awrap(page["goto"](['https://abcnews.go.com/', '', Category].join('')));

          case 20:
            _context.next = 22;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              // function to look for a word inside other words for time
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
                        if (searchIn.indexOf("hour") != -1) {
                          return true;
                        } else {
                          if (searchIn.startsWith("1 hour") != false || searchIn.startsWith("2 hours") != false || searchIn.startsWith("an hour") != false) {
                            return true;
                          } else {
                            return false;
                          }
                        }
                      }
                    }
                  }
                }
              };

              var titles = document.querySelectorAll('.ContentRoll__Headline>h2>a.AnchorLink');
              var images = document.querySelectorAll('.ContentRoll__Image img');
              var time = document.querySelectorAll('.ContentRoll__Date');
              if (Category === "sports") Category = "sport";
              if (Category === "politics") Category = "politic";
              var data = [];

              for (var j = 0; j < titles.length; j++) {
                if (WordExist(time[j].textContent) == true) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent,
                    link: titles[j].href,
                    images: typeof images[j] == "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "ABC NEWS",
                    sourceLink: "https://abcnews.go.com",
                    sourceLogo: "https://gray-wbay-prod.cdn.arcpublishing.com/resizer/fln06LgHS8awdDtCHhWoikKI7UE=/1200x675/smart/cloudfront-us-east-1.images.arcpublishing.com/gray/X3TAX5IMPBHY7EBGM6XW47YETE.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 22:
            PageData = _context.sent;
            PageData.map(function (item) {
              console.log(item.Category);
              AllData.push(item);
            });

          case 24:
            i++;
            _context.next = 9;
            break;

          case 27:
            _context.next = 33;
            break;

          case 29:
            _context.prev = 29;
            _context.t1 = _context["catch"](7);
            _context.next = 33;
            return regeneratorRuntime.awrap(browser.close());

          case 33:
            _context.prev = 33;
            _context.next = 36;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t2 = _context["catch"](33);
            _context.next = 42;
            return regeneratorRuntime.awrap(browser.close());

          case 42:
            _context.next = 44;
            return regeneratorRuntime.awrap(browser.close());

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 29], [11, 16], [33, 38]]);
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
            _context2.next = 18;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          console.log(url);
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelector('.Article__Wrapper>.Article__Content') == null ? null : document.querySelector('.Article__Wrapper>.Article__Content').textContent;
            return text;
          }));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector('.Byline__Author').textContent;
              var upperCaseWords = auth.match(/(\b[A-Z][A-Z]+|\b[A-Z]\b)/g);
              return upperCaseWords[0] + " " + upperCaseWords[1];
            } catch (_unused4) {
              return null;
            }
          }));

        case 13:
          author = _context2.sent;

          if (item.images != null && Content != null && Content != "") {
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
              content: Content
            });
          }

        case 15:
          i++;
          _context2.next = 2;
          break;

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ABC_NEWS;