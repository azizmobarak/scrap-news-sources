'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/formatimage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../../function/sendtoserver'),
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
var Categories = ['environnement', 'politique'];

var LEPARISIAN = function LEPARISIAN() {
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
              _context2.next = 33;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "";
            if (Category === "politique") url = "https://www.leparisien.fr/politique/";else {
              if (Category === "environnement") url = "https://www.leparisien.fr/environnement/";
            }
            _context2.prev = 13;
            _context2.next = 16;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](13);
            _context2.next = 22;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 22:
            _context2.next = 24;
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

          case 24:
            _context2.next = 26;
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 26:
            _context2.next = 28;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.story-preview>div .story-headline');
              var images = document.querySelectorAll('.story-preview>a>div>img');
              var links = document.querySelectorAll('.story-preview>a');
              var data = [];

              for (var j = 0; j < 5; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Leparisien - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.leparisien.fr/",
                    sourceLogo: "https://www.leparisien.fr/pf/resources/images/E-LOGO-LP-192x60@2x.png?d=306"
                  });
                }
              }

              return data;
            }, Category));

          case 28:
            PageData = _context2.sent;
            // console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('fr', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 30:
            i++;
            _context2.next = 9;
            break;

          case 33:
            _context2.next = 40;
            break;

          case 35:
            _context2.prev = 35;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 40;
            return regeneratorRuntime.awrap(browser.close());

          case 40:
            _context2.prev = 40;
            _context2.next = 43;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 43:
            _context2.next = 50;
            break;

          case 45:
            _context2.prev = 45;
            _context2.t2 = _context2["catch"](40);
            console.log(_context2.t2);
            _context2.next = 50;
            return regeneratorRuntime.awrap(browser.close());

          case 50:
            _context2.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 35], [13, 18], [40, 45]]);
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
            _context3.next = 20;
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
              var second_text = document.querySelectorAll('.article-section>section>p');
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
              return document.querySelector('.article-section').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.author>span').textContent.trim();
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
              contenthtml: contenthtml
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

module.exports = LEPARISIAN;