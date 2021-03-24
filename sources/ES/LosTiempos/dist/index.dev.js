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
var Categories = ['international', 'football', 'economy', 'culture', 'tennis', 'fashion', 'celebrity'];

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
              _context2.next = 41;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            url = "https://www.lostiempos.com/actualidad/mundo";
            if (Category === "football") url = "https://www.lostiempos.com/deportes/futbol";
            if (Category === "economy") url = "https://www.lostiempos.com/actualidad/economia";
            if (Category === "tennis") url = "https://www.lostiempos.com/deportes/tenis";
            if (Category === "culture") url = "https://www.lostiempos.com/doble-click/cultura";
            if (Category === "celebrity") url = "https://www.lostiempos.com/doble-click/espectaculos";
            if (Category === "fashion") url = "https://www.lostiempos.com/doble-click/moda";
            _context2.prev = 19;
            _context2.next = 22;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 22:
            _context2.next = 24;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 24:
            _context2.next = 30;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](19);
            _context2.next = 30;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 30:
            _context2.next = 32;
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

          case 32:
            _context2.next = 34;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 34:
            _context2.next = 36;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('.views-row');
              var images = "img";
              var links = "a";
              var titles = ".views-field-title";
              var data = [];

              for (var j = 0; j < 5; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category,
                    source: "Lostiempos " + Category,
                    sourceLink: "https://www.lostiempos.com",
                    sourceLogo: "https://www.lostiempos.com/sites/default/files/styles/medium/public/periodistas/logo_ok.jpg?itok=RjfYQ__G"
                  });
                }
              }

              return data;
            }, Category));

          case 36:
            PageData = _context2.sent;
            // console.log(PageData);
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
    }, null, null, [[7, 43], [19, 26], [48, 53]]);
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
              var second_text = document.querySelectorAll('.field-item p');
              var scond_content = "";

              for (var _i = 0; _i < second_text.length - 1; _i++) {
                scond_content = scond_content + "\n" + second_text[_i].textContent;
              }

              return scond_content.replaceAll('\n', '');
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
              author: null,
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

module.exports = LARAZON;