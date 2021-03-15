'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
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
var Categories = ['economy', 'opinion', 'international', 'spain'];

var ELMONDO = function ELMONDO() {
  (function _callee2() {
    var browser, page, AllData, i, Category, url, PageData;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context2.sent;
            _context2.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context2.sent;
            AllData = [];
            _context2.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context2.next = 44;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.elmundo.es/economia.html";
            if (Category === "opinion") url = "https://www.elmundo.es/opinion.html";
            if (Category === "international") url = "https://www.elmundo.es/internacional.html";
            if (Category === "spain") url = "https://www.elmundo.es/espana.html";
            _context2.prev = 15;
            _context2.next = 18;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 18:
            _context2.next = 20;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 20:
            if (!(i == 0)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 23;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 23:
            _context2.next = 32;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](15);
            _context2.next = 29;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 29:
            if (!(i == 0)) {
              _context2.next = 32;
              break;
            }

            _context2.next = 32;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 32:
            _context2.next = 34;
            return regeneratorRuntime.awrap(page.evaluate(function () {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(function _callee() {
                var scrollHeight;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= 1000) {
                          clearInterval(timer);
                          resolve();
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }, 100);
            }));

          case 34:
            _context2.next = 36;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 36:
            _context2.next = 38;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = ".ue-c-cover-content__link";
              var titles = "h2";
              var authors = ".ue-c-cover-content__byline-name";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (articles[j].querySelector(titles) != null && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category,
                    author: articles[j].querySelector(authors) != null ? articles[j].querySelector(authors).textContent.replace('Redacción:', '').trim() : null,
                    source: "ELMUNDO",
                    sourceLink: "https://www.elmundo.es/",
                    sourceLogo: "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/102015/elmundo_0.png"
                  });
                }
              }

              return data;
            }, Category));

          case 38:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 41:
            i++;
            _context2.next = 9;
            break;

          case 44:
            _context2.next = 51;
            break;

          case 46:
            _context2.prev = 46;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 51;
            return regeneratorRuntime.awrap(browser.close());

          case 51:
            _context2.prev = 51;
            _context2.next = 54;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 54:
            _context2.next = 61;
            break;

          case 56:
            _context2.prev = 56;
            _context2.t2 = _context2["catch"](51);
            console.log(_context2.t2);
            _context2.next = 61;
            return regeneratorRuntime.awrap(browser.close());

          case 61:
            _context2.next = 63;
            return regeneratorRuntime.awrap(browser.close());

          case 63:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 46], [15, 25], [51, 56]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 14;
            break;
          }

          item = data[i];
          url = item.link; // console.log(url)

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // I-first try to get all content 
              var text = document.querySelectorAll('.ue-l-article__body p');
              var scond_content = "";

              for (var _i = 0; _i < text.length; _i++) {
                scond_content = scond_content + "\n" + text[_i].textContent;
              }

              return scond_content;
            } catch (_unused2) {
              try {
                // II-first try to get all content
                var text = document.querySelectorAll('.ue-c-article--first-letter-highlighted');
                var scond_content = "";

                for (var _i2 = 0; _i2 < text.length; _i2++) {
                  scond_content = scond_content + "\n" + text[_i2].textContent;
                }

                return scond_content;
              } catch (_unused3) {
                return null;
              }
            }
          }));

        case 9:
          Content = _context3.sent;

          if (Content != null && Content != "") {
            AllData_WithConetent.push({
              time: Date.now(),
              title: item.title,
              link: item.link,
              images: item.images === "" ? null : item.images,
              Category: item.Category,
              source: item.source,
              sourceLink: item.sourceLink,
              sourceLogo: item.sourceLogo,
              author: item.author,
              content: Content
            });
          }

        case 11:
          i++;
          _context3.next = 2;
          break;

        case 14:
          _context3.next = 16;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = ELMONDO;