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
var Categories = ['cuba', 'politic', 'economy', 'health', 'opinion'];

var LARAZON = function LARAZON() {
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
              _context2.next = 36;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //console.log(Category)
            //navigate to category sub route

            url = "http://www.cubadebate.cu/etiqueta/cuba/";
            if (Category === "politic") url = "http://www.cubadebate.cu/categoria/temas/politica-temas/";
            if (Category === "economy") url = "http://www.cubadebate.cu/categoria/temas/economia-temas/";
            if (Category === "health") url = "http://www.cubadebate.cu/categoria/temas/salud-medicina/";
            if (Category === "opinion") url = "http://www.cubadebate.cu/categoria/opinion/";
            _context2.prev = 16;
            _context2.next = 19;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 19:
            _context2.next = 25;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](16);
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
            return regeneratorRuntime.awrap(page.waitFor(2000));

          case 29:
            _context2.next = 31;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('#main .generic');
              var images = "img";
              var links = ".title>a";
              var titles = ".title>a";
              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category,
                    source: "CubaDebate " + Category,
                    sourceLink: "http://www.cubadebate.cu",
                    sourceLogo: "http://www.cadenagramonte.cu/english/images/stories/cubadebate-logo.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 31:
            PageData = _context2.sent;
            //   console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 33:
            i++;
            _context2.next = 9;
            break;

          case 36:
            _context2.next = 43;
            break;

          case 38:
            _context2.prev = 38;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 43;
            return regeneratorRuntime.awrap(browser.close());

          case 43:
            _context2.prev = 43;
            _context2.next = 46;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 46:
            _context2.next = 53;
            break;

          case 48:
            _context2.prev = 48;
            _context2.t2 = _context2["catch"](43);
            console.log(_context2.t2);
            _context2.next = 53;
            return regeneratorRuntime.awrap(browser.close());

          case 53:
            _context2.next = 55;
            return regeneratorRuntime.awrap(browser.close());

          case 55:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 38], [16, 21], [43, 48]]);
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
              var second_text = document.querySelectorAll('.note_content p');
              var scond_content = "";

              for (var _i = 1; _i < second_text.length; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent.trim().replaceAll('\n', '');
              }

              return scond_content;
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
              images: item.images === "" ? null : item.images,
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

module.exports = LARAZON;