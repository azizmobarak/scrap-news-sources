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
var Categories = ['politic'];

var FIGARO = function FIGARO() {
  (function _callee3() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context3.sent;
            _context3.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context3.sent;
            AllData = [];
            _context3.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context3.next = 31;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context3.prev = 11;
            _context3.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.lefigaro.fr/politique'));

          case 14:
            _context3.next = 20;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](11);
            _context3.next = 20;
            return regeneratorRuntime.awrap(page["goto"]('https://www.lefigaro.fr/politique'));

          case 20:
            _context3.next = 22;
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
            _context3.next = 24;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 24:
            _context3.next = 26;
            return regeneratorRuntime.awrap(page.evaluate(function _callee2(Category) {
              var titles, images, links, data, j, img;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      titles = document.querySelectorAll('article.fig-profile>a>h2');
                      images = ""; // look inside next for boucle

                      links = document.querySelectorAll('article.fig-profile>a');
                      data = [];

                      for (j = 0; j < 4; j++) {
                        img = "";

                        if (j == 0) {
                          images = document.querySelectorAll('.fig-profile__media>img');
                          img = typeof images[j] != "undefined" ? images[j].srcset : null;
                        } else {
                          images = document.querySelectorAll('article.fig-profile>a>figure>div>img');
                          img = typeof images[j - 1] != "undefined" ? images[j - 1].srcset : null;
                        }

                        if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                          data.push({
                            time: Date.now(),
                            title: titles[j].textContent.trim(),
                            link: links[j].href,
                            images: img == null ? null : img.split(' ')[0],
                            Category: Category,
                            source: "Le Figaro",
                            sourceLink: "https://www.lefigaro.fr",
                            sourceLogo: "https://images-na.ssl-images-amazon.com/images/I/41MSIU5OVUL.png"
                          });
                        }
                      }

                      return _context2.abrupt("return", data);

                    case 6:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            }, Category));

          case 26:
            PageData = _context3.sent;
            //  console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 28:
            i++;
            _context3.next = 9;
            break;

          case 31:
            _context3.next = 38;
            break;

          case 33:
            _context3.prev = 33;
            _context3.t1 = _context3["catch"](7);
            console.log(_context3.t1);
            _context3.next = 38;
            return regeneratorRuntime.awrap(browser.close());

          case 38:
            _context3.prev = 38;
            _context3.next = 41;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 41:
            _context3.next = 48;
            break;

          case 43:
            _context3.prev = 43;
            _context3.t2 = _context3["catch"](38);
            console.log(_context3.t2);
            _context3.next = 48;
            return regeneratorRuntime.awrap(browser.close());

          case 48:
            _context3.next = 50;
            return regeneratorRuntime.awrap(browser.close());

          case 50:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[7, 33], [11, 16], [38, 43]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context4.next = 17;
            break;
          }

          item = data[i];
          url = item.link;
          _context4.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var first_text = document.querySelectorAll(".fig-body>.fig-paragraph");
              var first_cont = "";

              for (var _i = 0; _i < first_text.length; _i++) {
                first_cont = first_cont + "\n" + first_text[_i].textContent;
              }

              return first_cont;
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context4.sent;
          _context4.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.fig-content-metas__author').textContent.trim();
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          author = _context4.sent;

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
          _context4.next = 2;
          break;

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = FIGARO;