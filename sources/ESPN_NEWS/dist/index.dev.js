'use strict';

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
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
var Categories = ['nba', 'soccer', 'mma', 'nfl', 'boxing', 'golf', 'racing', 'tennis', 'f1'];

var ESPN = function ESPN() {
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
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.espn.com/', '', Category].join('')));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(page.click('#onetrust-accept-btn-handler'));

          case 16:
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            _context.next = 22;
            return regeneratorRuntime.awrap(page["goto"](['https://www.espn.com/', '', Category].join('')));

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.contentItem .contentItem__content--story h1');
              var images = document.querySelectorAll('.contentItem .contentItem__content--story figure>picture>source+source');
              var links = document.querySelectorAll('.contentItem .contentItem__content--story a');

              if (Category === "mba") {
                Category = "basketball";
              } else {
                if (Category === "soccer") {
                  Category = "football";
                } else {
                  if (Category === "nfl") {
                    Category = "rugby";
                  } else {
                    if (Category === "f1") {
                      Category = "formulaone";
                    } else {
                      if (Category === "mma") {
                        Category = "sport";
                      }
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < 3; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent,
                    link: links[j].href,
                    images: typeof images[j + 1] == "undefined" || images[j + 1] == null ? null : images[j + 1].getAttribute('data-srcset') == null ? null : images[j + 1].getAttribute('data-srcset').split(",")[0],
                    Category: Category,
                    source: "ESPN",
                    sourceLink: "https://espn.com",
                    sourceLogo: "https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                  });
                }
              }

              return data;
            }, Category));

          case 24:
            PageData = _context.sent;
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 26:
            i++;
            _context.next = 9;
            break;

          case 29:
            _context.next = 35;
            break;

          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](7);
            _context.next = 35;
            return regeneratorRuntime.awrap(browser.close());

          case 35:
            _context.prev = 35;
            _context.next = 38;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 38:
            _context.next = 44;
            break;

          case 40:
            _context.prev = 40;
            _context.t2 = _context["catch"](35);
            _context.next = 44;
            return regeneratorRuntime.awrap(browser.close());

          case 44:
            _context.next = 46;
            return regeneratorRuntime.awrap(browser.close());

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 31], [11, 18], [35, 40]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, author;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 17;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.next = 7;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var text = document.querySelectorAll(".article-body p");
              var cont = "";

              for (var _i = 0; _i < text.length; _i++) {
                cont = cont + "\n" + text[_i].textContent;
              }

              return cont;
            } catch (_unused4) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector(".author").textContent;
              if (auth === "ESPN") auth = (_readOnlyError("auth"), null);
              return auth;
            } catch (_unused5) {
              return null;
            }
          }));

        case 12:
          author = _context2.sent;

          if (item.images != null && Content != null && Content != "") {
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

        case 14:
          i++;
          _context2.next = 2;
          break;

        case 17:
          _context2.next = 19;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ESPN;