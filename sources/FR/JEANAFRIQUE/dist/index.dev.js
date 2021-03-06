'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../model/Category'),
    category = _require2.category; //block ads


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
var Categories = ['politic', "culture"];

var JEAN = function JEAN() {
  (function _callee2() {
    var browser, page, AllData, i, Category, url, count, PageData;
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
              _context2.next = 38;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "";
            if (Category === "politic") url = "https://www.jeuneafrique.com/rubriques/politique/";else {
              if (Category === "culture") url = "https://www.jeuneafrique.com/rubriques/culture/";
            }
            _context2.prev = 13;
            _context2.next = 16;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 16:
            count = i;

            if (!(count == 0)) {
              _context2.next = 20;
              break;
            }

            _context2.next = 20;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 20:
            _context2.next = 26;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](13);
            _context2.next = 26;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 26:
            _context2.next = 28;
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

          case 28:
            _context2.next = 30;
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 30:
            _context2.next = 32;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('article a>img'); // inside boucle for

              var links = "";
              var titles = "";
              var data = [];

              for (var j = 0; j < 6; j++) {
                titles = j == 0 ? document.querySelectorAll('article h1') : document.querySelectorAll('article h2');
                links = j == 0 ? document.querySelectorAll('article a') : document.querySelectorAll('article>a+a');
                var index = j == 0 ? j : j - 1;

                if (typeof titles[index] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[index].textContent.trim(),
                    link: links[index].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "LeQuotidien",
                    sourceLink: "https://www.lequotidien.com",
                    sourceLogo: "https://www.otlhotelsaguenay.ca/uploads/1/0/6/8/106825145/editor/le-quotidien-logo1_10.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 32:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 35:
            i++;
            _context2.next = 9;
            break;

          case 38:
            _context2.next = 45;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 45;
            return regeneratorRuntime.awrap(browser.close());

          case 45:
            _context2.prev = 45;
            _context2.next = 48;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 48:
            _context2.next = 55;
            break;

          case 50:
            _context2.prev = 50;
            _context2.t2 = _context2["catch"](45);
            console.log(_context2.t2);
            _context2.next = 55;
            return regeneratorRuntime.awrap(browser.close());

          case 55:
            _context2.next = 57;
            return regeneratorRuntime.awrap(browser.close());

          case 57:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 40], [13, 22], [45, 50]]);
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
              var second_text = document.querySelectorAll('.ja-teads-inread p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content;
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var authr = document.querySelector('.art-header-author>a').textContent.trim();
              return authr;
            } catch (_unused3) {
              try {
                var authr = document.querySelector('.box__description-title>span').textContent.trim();
                return authr;
              } catch (_unused4) {
                return null;
              }
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

module.exports = JEAN;