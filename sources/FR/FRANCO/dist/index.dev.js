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
var Categories = ['opinion', 'science'];

var FRANCO = function FRANCO() {
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

            url = "https://lefranco.ab.ca/category/opinions/";
            if (Category === "science") url = "https://lefranco.ab.ca/category/science/";
            _context2.prev = 13;
            _context2.next = 16;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 16:
            _context2.next = 18;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 18:
            _context2.next = 24;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t0 = _context2["catch"](13);
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
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 28:
            _context2.next = 30;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var images = document.querySelectorAll('article .penci-image-holder');
              var links = document.querySelectorAll('article .penci-image-holder');
              var titles = document.querySelectorAll('article h2');
              var data = [];

              for (var j = 0; j < 6; j++) {
                if (typeof titles[j] != "undefined" && links[j] != null) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].style.backgroundImage.substring(images[j].style.backgroundImage.indexOf('http'), images[j].style.backgroundImage.indexOf('")')),
                    Category: Category,
                    source: "LE FRANCO",
                    sourceLink: "https://lefranco.ab.ca/",
                    sourceLogo: "https://lecdea.ca/wp-content/uploads/2020/10/Le-Franco-logo.png"
                  });
                }
              }

              return data;
            }, Category));

          case 30:
            PageData = _context2.sent;
            //  console.log(PageData);
            PageData.map(function (item) {
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
    }, null, null, [[7, 37], [13, 20], [42, 47]]);
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
            _context3.next = 15;
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
              // first try to get all content
              var second_text = document.querySelectorAll('article .entry-content>p');
              var scond_content = "";

              for (var _i = 0; _i < 5; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content + ".. .";
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context3.sent;
          author = null;

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

        case 12:
          i++;
          _context3.next = 2;
          break;

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = FRANCO;