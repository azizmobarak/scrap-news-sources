'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/formatImage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../../function/sendToserver'),
    SendToServer = _require3.SendToServer; //block ads


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
var Categories = ['politique', 'international', 'science', 'technologie'];

var LEPOINT = function LEPOINT() {
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
              _context2.next = 35;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.lepoint.fr/politique/";
            if (Category === "international") url = "https://www.lepoint.fr/monde/";
            if (Category === "science") url = "https://www.lepoint.fr/sciences-nature/";
            if (Category === "technologie") url = "https://www.lepoint.fr/high-tech-internet/";
            _context2.prev = 15;
            _context2.next = 18;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 18:
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](15);
            _context2.next = 24;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 24:
            _context2.next = 26;
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

          case 26:
            _context2.next = 28;
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 28:
            _context2.next = 30;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var article = document.querySelectorAll('article');
              var images = "img";
              var links = "figure>a";
              var titles = "h2";
              var data = [];

              for (var j = 0; j < 5; j++) {
                if (typeof article[j].querySelector(titles) != "undefined" && article[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: article[j].querySelector(titles).textContent.trim(),
                    link: j == 0 ? article[j].querySelector("a").href : article[j].querySelector(links).href,
                    images: typeof article[j].querySelector(images) === "undefined" ? null : article[j].querySelector(images).src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Le Point - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.lepoint.fr/",
                    sourceLogo: "https://www.lebal.paris/wp-content/uploads/2018/07/18117-1.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 30:
            PageData = _context2.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('fr', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 32:
            i++;
            _context2.next = 9;
            break;

          case 35:
            _context2.next = 42;
            break;

          case 37:
            _context2.prev = 37;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 42;
            return regeneratorRuntime.awrap(browser.close());

          case 42:
            _context2.prev = 42;
            _context2.next = 45;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 45:
            _context2.next = 52;
            break;

          case 47:
            _context2.prev = 47;
            _context2.t2 = _context2["catch"](42);
            console.log(_context2.t2);
            _context2.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
            _context2.next = 54;
            return regeneratorRuntime.awrap(browser.close());

          case 54:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 37], [15, 20], [42, 47]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 30;
            break;
          }

          item = data[i];
          url = item.link;
          _context3.prev = 5;
          _context3.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context3.next = 17;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](5);
          i++;
          item = data[i];
          url = item.link;
          _context3.next = 17;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.ArticleBody p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content;
            } catch (_unused3) {
              return null;
            }
          }));

        case 19:
          Content = _context3.sent;
          _context3.next = 22;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.ArticleBody').innerHTML;
            } catch (_unused4) {
              return null;
            }
          }));

        case 22:
          contenthtml = _context3.sent;
          _context3.next = 25;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var authr = document.querySelector('.SigatureAuthorNames>span>a').textContent.trim();
              return authr;
            } catch (_unused5) {
              return null;
            }
          }));

        case 25:
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
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 27:
          i++;
          _context3.next = 2;
          break;

        case 30:
          _context3.next = 32;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[5, 10]]);
};

module.exports = LEPOINT;