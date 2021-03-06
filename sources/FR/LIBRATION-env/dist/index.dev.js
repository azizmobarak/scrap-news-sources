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
var Categories = ['environment'];

var LIBRATION = function LIBRATION() {
  (function _callee2() {
    var browser, page, AllData, i, Category, PageData;
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
              _context2.next = 31;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context2.prev = 11;
            _context2.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.liberation.fr/environnement/'));

          case 14:
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](11);
            _context2.next = 20;
            return regeneratorRuntime.awrap(page["goto"]('https://www.liberation.fr/environnement/'));

          case 20:
            _context2.next = 22;
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

                        if (totalHeight >= 2000) {
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

          case 22:
            _context2.next = 24;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 24:
            _context2.next = 26;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('article a>h2');
              var images = document.querySelectorAll('article picture>img');
              var links = document.querySelectorAll('article div>div>a:nth-child(1)');
              var data = [];

              for (var j = 0; j < 3; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j == 0 ? j : j + 1].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "Libération",
                    sourceLink: "https://www.liberation.fr/politique",
                    sourceLogo: "https://www.liberation.fr/pf/resources/images/liberation.png?d=10"
                  });
                }
              }

              return data;
            }, Category));

          case 26:
            PageData = _context2.sent;
            // console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 28:
            i++;
            _context2.next = 9;
            break;

          case 31:
            _context2.next = 37;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t1 = _context2["catch"](7);
            _context2.next = 37;
            return regeneratorRuntime.awrap(browser.close());

          case 37:
            _context2.prev = 37;
            _context2.next = 40;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 40:
            _context2.next = 47;
            break;

          case 42:
            _context2.prev = 42;
            _context2.t2 = _context2["catch"](37);
            console.log(_context2.t2);
            _context2.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context2.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 33], [11, 16], [37, 42]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 17;
            break;
          }

          item = data[i];
          url = item.link;
          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.article-body-wrapper p.article_link');
              var first_text = document.querySelector('.margin-md-bottom>div:nth-child(3)').textContent;
              var scond_content = "";

              for (var _i = 0; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return first_text + "\n" + scond_content;
            } catch (_unused3) {
              try {
                // second try to get all content
                var second_text = document.querySelectorAll('.article-body-wrapper p.article_link');
                var scond_content = "";

                for (var _i2 = 0; _i2 < second_text.length; _i2++) {
                  scond_content = scond_content + "\n" + second_text[_i2].textContent;
                }

                return scond_content;
              } catch (_unused4) {
                // the last try will return a null content
                return null;
              }
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('span.link_primary-color>span').textContent.trim();
            } catch (_unused5) {
              return null;
            }
          }));

        case 12:
          author = _context3.sent;

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
              content: Content
            });
          }

        case 14:
          i++;
          _context3.next = 2;
          break;

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = LIBRATION;