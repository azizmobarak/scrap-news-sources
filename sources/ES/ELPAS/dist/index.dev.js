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
var Categories = ['international', 'opinion', 'spain'];

var ELPAS = function ELPAS() {
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
              _context2.next = 42;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://elpais.com/internacional/";
            if (Category === "opinion") url = "https://elpais.com/tag/c/ac1a39ea27fc68d52e94d1751fc14765";
            if (Category === "spain") url = "https://elpais.com/espana/";
            _context2.prev = 14;
            _context2.next = 17;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 17:
            _context2.next = 19;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 19:
            if (!(i == 0)) {
              _context2.next = 22;
              break;
            }

            _context2.next = 22;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 22:
            _context2.next = 31;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](14);
            _context2.next = 28;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 28:
            if (!(i == 0)) {
              _context2.next = 31;
              break;
            }

            _context2.next = 31;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 31:
            _context2.next = 33;
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

          case 33:
            _context2.next = 35;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 35:
            _context2.next = 37;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = "article h2>a";
              var titles = "article h2";
              var authors = ".author";

              if (Category === "opinion") {
                articles = document.querySelectorAll('.articulo__interior');
                links = "figure .enlace";
                titles = "h2";
                authors = ".autor-nombre";
              }

              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category,
                    author: articles[j].querySelector(authors).textContent.trim(),
                    source: "EL PAIS",
                    sourceLink: "https://elpais.com",
                    sourceLogo: "https://resources.audiense.com/hs-fs/hubfs/Resources%20Website%20(Migration)/El_Pais_logo_small.png?width=210&name=El_Pais_logo_small.png"
                  });
                }
              }

              return data;
            }, Category));

          case 37:
            PageData = _context2.sent;
            //  console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 39:
            i++;
            _context2.next = 9;
            break;

          case 42:
            _context2.next = 49;
            break;

          case 44:
            _context2.prev = 44;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
            _context2.prev = 49;
            _context2.next = 52;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 52:
            _context2.next = 59;
            break;

          case 54:
            _context2.prev = 54;
            _context2.t2 = _context2["catch"](49);
            console.log(_context2.t2);
            _context2.next = 59;
            return regeneratorRuntime.awrap(browser.close());

          case 59:
            _context2.next = 61;
            return regeneratorRuntime.awrap(browser.close());

          case 61:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 44], [14, 24], [49, 54]]);
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
              // first try to get all content
              var second_text = document.querySelectorAll('.article_body p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content;
            } catch (_unused2) {
              return null;
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

module.exports = ELPAS;