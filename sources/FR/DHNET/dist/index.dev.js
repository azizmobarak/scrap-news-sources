'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/SendToserver.js'),
    SendToServer = _require2.SendToServer;

var _require3 = require('../../../function/FormatImage.js'),
    FormatImage = _require3.FormatImage; //block ads


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
var Categories = ['football', 'tennis', 'basketball'];

var DHNET = function DHNET() {
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
              _context2.next = 37;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.dhnet.be/sports/football";
            if (Category === "tennis") url = "https://www.dhnet.be/sports/tennis";
            if (Category === "basketball") url = "https://www.dhnet.be/sports/basket";
            _context2.prev = 14;
            _context2.next = 17;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 17:
            _context2.next = 19;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 25;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 25:
            _context2.next = 27;
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

          case 27:
            _context2.next = 29;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 29:
            _context2.next = 31;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('article img');
              var links = document.querySelectorAll('article .teaser_link');
              var titles = document.querySelectorAll('article h2.teaser_title');
              var data = [];

              for (var j = 0; j < 5; j++) {
                if (typeof titles[j] != "undefined" && links[j] != null) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "DH NET - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.dhnet.be",
                    sourceLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/La_Derni%C3%A8re_Heure_logo.svg/1200px-La_Derni%C3%A8re_Heure_logo.svg.png"
                  });
                }
              }

              return data;
            }, Category));

          case 31:
            PageData = _context2.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              console.log(item.images);
              setTimeout(function () {
                console.log("request here");
                SendToServer("fr", item.Category, item.source, item.sourceLogo);
              }, 5000 * j);
              AllData.push(item);
            });

          case 34:
            i++;
            _context2.next = 9;
            break;

          case 37:
            _context2.next = 44;
            break;

          case 39:
            _context2.prev = 39;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 44;
            return regeneratorRuntime.awrap(browser.close());

          case 44:
            _context2.prev = 44;
            _context2.next = 47;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 47:
            _context2.next = 54;
            break;

          case 49:
            _context2.prev = 49;
            _context2.t2 = _context2["catch"](44);
            console.log(_context2.t2);
            _context2.next = 54;
            return regeneratorRuntime.awrap(browser.close());

          case 54:
            _context2.next = 56;
            return regeneratorRuntime.awrap(browser.close());

          case 56:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 39], [14, 21], [44, 49]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHTML, author;
  return regeneratorRuntime.async(function GetContent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context3.next = 20;
            break;
          }

          item = data[i];
          url = item.link; //  console.log(url)

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article-text').textContent;
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article-text').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          ContentHTML = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author-name').textContent.trim();
            } catch (_unused4) {
              return null;
            }
          }));

        case 15:
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
              contentHTML: ContentHTML
            });
          }

        case 17:
          i++;
          _context3.next = 2;
          break;

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = DHNET;