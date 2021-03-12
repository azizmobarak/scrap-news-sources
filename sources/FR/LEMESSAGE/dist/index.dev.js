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
var Categories = ['economy'];

var LEMESSAGE = function LEMESSAGE() {
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
              _context2.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.lemessager.fr/economie";
            _context2.prev = 12;
            _context2.next = 15;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 15:
            _context2.next = 17;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 17:
            if (!(i == 0)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 20;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 20:
            _context2.next = 29;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](12);
            _context2.next = 26;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 26:
            if (!(i == 0)) {
              _context2.next = 29;
              break;
            }

            _context2.next = 29;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 29:
            _context2.next = 31;
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

          case 31:
            _context2.next = 33;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 33:
            _context2.next = 35;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('#gr-unes-titres img');
              var links = document.querySelectorAll('#gr-unes-titres h4>a');
              var titles = document.querySelectorAll('#gr-unes-titres h4');
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof titles[j] != "undefined" && links[j] != null) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "Le Messager",
                    sourceLink: "https://www.lemessager.fr",
                    sourceLogo: "https://journal.lemessager.fr/medias/specifique_titre/mes/images/logo_square.png"
                  });
                }
              }

              return data;
            }, Category));

          case 35:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 38:
            i++;
            _context2.next = 9;
            break;

          case 41:
            _context2.next = 48;
            break;

          case 43:
            _context2.prev = 43;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 48;
            return regeneratorRuntime.awrap(browser.close());

          case 48:
            _context2.prev = 48;
            _context2.next = 51;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 51:
            _context2.next = 58;
            break;

          case 53:
            _context2.prev = 53;
            _context2.t2 = _context2["catch"](48);
            console.log(_context2.t2);
            _context2.next = 58;
            return regeneratorRuntime.awrap(browser.close());

          case 58:
            _context2.next = 60;
            return regeneratorRuntime.awrap(browser.close());

          case 60:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 43], [12, 22], [48, 53]]);
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
          url = item.link; //      console.log(url)

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.gr-article-content p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content.trim();
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.gr-meta-author>a').textContent.trim();
            } catch (_unused3) {
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
              images: item.images === "" ? null : item.images,
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

module.exports = LEMESSAGE;