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
var Categories = ['internacional', 'futbol', 'economia', 'cultura', 'tenis', 'moda', 'celebridad'];

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
            if (Category === "futbol") url = "https://www.lostiempos.com/deportes/futbol";
            if (Category === "economia") url = "https://www.lostiempos.com/actualidad/economia";
            if (Category === "tenis") url = "https://www.lostiempos.com/deportes/tenis";
            if (Category === "cultura") url = "https://www.lostiempos.com/doble-click/cultura";
            if (Category === "celebridad") url = "https://www.lostiempos.com/doble-click/espectaculos";
            if (Category === "moda") url = "https://www.lostiempos.com/doble-click/moda";
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
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Lostiempos - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.lostiempos.com",
                    sourceLogo: "https://www.lostiempos.com/sites/default/files/styles/medium/public/periodistas/logo_ok.jpg?itok=RjfYQ__G"
                  });
                }
              }

              return data;
            }, Category));

          case 36:
            PageData = _context2.sent;
            //    console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('es', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
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
  var AllData_WithConetent, i, item, url, Content, contenthtml;
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
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.node-content').innerHTML;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context3.sent;

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
              content: Content,
              contenthtml: contenthtml
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

module.exports = LARAZON;