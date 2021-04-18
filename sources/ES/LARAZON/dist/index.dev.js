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
var Categories = ['economía', 'España', 'internacional', 'estilo de Vida'];

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
              _context2.next = 40;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            url = "https://www.larazon.es/economia/";
            if (Category === "internacional") url = "https://www.larazon.es/internacional/";
            if (Category === "España") url = "https://www.larazon.es/espana/";
            if (Category === "estilo de Vida") url = "https://www.larazon.es/lifestyle/";
            _context2.prev = 15;
            _context2.next = 18;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 18:
            _context2.next = 20;
            return regeneratorRuntime.awrap(page.waitForSelector('footer'));

          case 20:
            if (!(i == 0)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 23;
            return regeneratorRuntime.awrap(page.click('#didomi-notice-agree-button'));

          case 23:
            _context2.next = 29;
            break;

          case 25:
            _context2.prev = 25;
            _context2.t0 = _context2["catch"](15);
            _context2.next = 29;
            return regeneratorRuntime.awrap(page["goto"](url));

          case 29:
            _context2.next = 31;
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

          case 31:
            _context2.next = 33;
            return regeneratorRuntime.awrap(page.waitFor(3000));

          case 33:
            _context2.next = 35;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('article');
              var images = "img";
              var links = "h3>a";
              var titles = "h3";
              var authors = ".card__byline>ul>li"; // if(Category==="opinion"){
              //     articles=document.querySelectorAll('.articulo__interior');
              //     links = "figure .enlace";
              //     titles="h2";
              //     authors=".autor-nombre";
              // }

              var data = [];

              for (var j = 0; j < 8; j++) {
                if (typeof articles[j].querySelector(titles) != "undefined" && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent.trim(),
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    author: articles[j].querySelector(authors).textContent.trim(),
                    source: "LARAZON - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.larazon.es",
                    sourceLogo: "https://www.tibagroup.com/wp-content/uploads/2016/11/LOGO-LA-RAZON-alta2-2.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 35:
            PageData = _context2.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('es', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 37:
            i++;
            _context2.next = 9;
            break;

          case 40:
            _context2.next = 47;
            break;

          case 42:
            _context2.prev = 42;
            _context2.t1 = _context2["catch"](7);
            console.log(_context2.t1);
            _context2.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context2.prev = 47;
            _context2.next = 50;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 50:
            _context2.next = 57;
            break;

          case 52:
            _context2.prev = 52;
            _context2.t2 = _context2["catch"](47);
            console.log(_context2.t2);
            _context2.next = 57;
            return regeneratorRuntime.awrap(browser.close());

          case 57:
            _context2.next = 59;
            return regeneratorRuntime.awrap(browser.close());

          case 59:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[7, 42], [15, 25], [47, 52]]);
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
          url = item.link;
          _context3.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              // first try to get all content
              var second_text = document.querySelectorAll('.article__body-container p');
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
          _context3.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article__body-container').innerHTML;
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
              author: item.author,
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