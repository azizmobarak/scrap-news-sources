'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/Formatimage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../function/SendToserver'),
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
var Categories = ['political-news-4689737', 'markets-news-4427704', 'personal-finance-4427760', 'economy-4689801', 'investing-essentials-4689754', 'company-news-4427705'];

var INVESTOPEDIA = function INVESTOPEDIA() {
  (function _callee() {
    var browser, page, AllData, i, Category, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: true,
              args: ['--enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb']
            }));

          case 2:
            browser = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(browser.newPage());

          case 5:
            page = _context.sent;
            AllData = [];
            _context.prev = 7;
            i = 0;

          case 9:
            if (!(i < Categories.length)) {
              _context.next = 29;
              break;
            }

            //get the right category by number
            Category = Categories[i];
            console.log(Category); //navigate to category sub route

            _context.prev = 12;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.investopedia.com/', '', Category].join('')));

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](12);
            _context.next = 21;
            return regeneratorRuntime.awrap(page["goto"](['https://www.investopedia.com/', '', Category].join('')));

          case 21:
            _context.next = 23;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('a.mntl-card .card__title');
              var images = document.querySelectorAll('a.mntl-card .card__media>img');
              var links = document.querySelectorAll('a.mntl-card');

              if (Category.indexOf('market') != -1) {
                Category = "market";
              } else {
                if (Category.indexOf('personal') != -1) {
                  Category = "money";
                } else {
                  if (Category.indexOf('political') != -1) {
                    Category = "politic";
                  } else {
                    if (Category.indexOf("economy") != -1 || Category.indexOf('company') != -1) {
                      Category = "economy";
                    } else {
                      if (Category.indexOf('investing') != -1) {
                        Category = "investing";
                      }
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < 4; j++) {
                if (typeof titles[j] != "undefined" && images[j].src.indexOf("data:image") == -1) {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent,
                    link: links[j].href,
                    images: typeof images[j] == "undefined" ? null : images[j].src,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "Investopedia - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.investopedia.com/",
                    sourceLogo: "https://download.logo.wine/logo/Investopedia/Investopedia-Logo.wine.png"
                  });
                }
              }

              return data;
            }, Category));

          case 23:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 26:
            i++;
            _context.next = 9;
            break;

          case 29:
            _context.next = 36;
            break;

          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](7);
            _context.next = 35;
            return regeneratorRuntime.awrap(browser.close());

          case 35:
            console.log(_context.t1);

          case 36:
            _context.prev = 36;
            _context.next = 39;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 39:
            _context.next = 46;
            break;

          case 41:
            _context.prev = 41;
            _context.t2 = _context["catch"](36);
            console.log(_context.t2);
            _context.next = 46;
            return regeneratorRuntime.awrap(browser.close());

          case 46:
            _context.next = 48;
            return regeneratorRuntime.awrap(browser.close());

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 31], [12, 17], [36, 41]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, ContentHtml, author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 21;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          console.log(url);
          _context2.next = 10;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var text = document.querySelectorAll('.article-body-content p');
            var Cont = "";

            if (_typeof(text != "undefined") && text != null) {
              for (var _i = 0; _i < text.length; _i++) {
                Cont = Cont + "\n" + text[_i].textContent;
              }

              return Cont;
            } else {
              return null;
            }
          }));

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelector('.article-body-content').innerHTML;
              return text;
            } catch (_unused2) {
              return null;
            }
          }));

        case 13:
          ContentHtml = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            var auth = document.querySelector('.byline__tooltip>a');

            if (typeof auth != "undefined" && auth != null) {
              return auth.textContent;
            } else {
              auth = document.querySelector('.byline__name');

              if (auth != null && typeof auth != "undefined") {
                return auth.textContent;
              } else {
                return null;
              }
            }
          }));

        case 16:
          author = _context2.sent;

          if (Content != null && Content != "" || ContentHtml != null) {
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
              contentHtml: ContentHtml
            });
          }

        case 18:
          i++;
          _context2.next = 2;
          break;

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = INVESTOPEDIA;