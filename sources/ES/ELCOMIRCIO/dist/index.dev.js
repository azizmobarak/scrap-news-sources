'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/sendtoserver'),
    SendToServer = _require2.SendToServer;

var _require3 = require('../../../function/formatimage'),
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
var Categories = ['política', 'salud', 'economía'];

var SCRAP = function SCRAP() {
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

            url = "https://elcomercio.pe/politica/";
            if (Category === "salud") url = "https://elcomercio.pe/noticias/coronavirus/";
            if (Category === "economía") url = "https://elcomercio.pe/economia/";
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

          case 27:
            _context2.next = 29;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 29:
            _context2.next = 31;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = "a";
              var titles = "h2";

              if (Category === "health") {
                articles = document.querySelectorAll('.story-item');
                images = "img";
                links = ".story-item__title";
                titles = "h2";
              }

              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  var img = articles[j].querySelector(images).src;
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : img,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Elcomercio - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://elcomercio.pe",
                    sourceLogo: "https://cdna.elcomercio.pe/resources/dist/elcomercio/images/logo_fb.jpg"
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
              setTimeout(function () {
                SendToServer('es', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
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
          url = item.link; // console.log(url)

          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.story-contents__content p');
              var scond_content = "";

              for (var _i = 1; _i < second_text.length / 2; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content + ".. .";
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.story-contents__content').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;
          _context3.next = 15;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.story-contents__author-link').textContent;
            } catch (_unused4) {
              return null;
            }
          }));

        case 15:
          author = _context3.sent;

          if (Content != null && Content != "" && Content.length > 255) {
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
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 17:
          i++;
          _context3.next = 2;
          break;

        case 20:
          console.log(AllData_WithConetent);
          _context3.next = 23;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = SCRAP;