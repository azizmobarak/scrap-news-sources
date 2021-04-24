'use strict';

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../../function/formatImage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../../function/sendToserver'),
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
var Categories = ['nba', 'soccer', 'mma', 'nfl', 'boxing', 'golf', 'racing', 'tennis', 'f1'];

var ESPN = function ESPN() {
  (function _callee() {
    var browser, page, AllData, i, Category, count, PageData;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(puppeteer.launch({
              headless: false,
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
              _context.next = 32;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            count = 1;
            _context.next = 15;
            return regeneratorRuntime.awrap(page["goto"](['https://www.espn.com/', '', Category].join('')));

          case 15:
            if (!(count == 1)) {
              _context.next = 18;
              break;
            }

            _context.next = 18;
            return regeneratorRuntime.awrap(page.click('#onetrust-accept-btn-handler'));

          case 18:
            count++;
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](11);
            _context.next = 25;
            return regeneratorRuntime.awrap(page["goto"](['https://www.espn.com/', '', Category].join('')));

          case 25:
            _context.next = 27;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var articles = document.querySelectorAll('.contentItem .contentItem__content');
              var titles = "h1";
              var images = "source+source";
              var links = "a";

              if (Category === "nba") {
                Category = "basketball";
              } else {
                if (Category === "soccer") {
                  Category = "football";
                } else {
                  if (Category === "nfl") {
                    Category = "rugby";
                  } else {
                    if (Category === "f1") {
                      Category = "formula 1";
                    } else {
                      if (Category === "mma") {
                        Category = "boxing";
                      }
                    }
                  }
                }
              }

              var data = [];

              for (var j = 0; j < 2; j++) {
                if (articles[j].querySelector(titles) != null && articles[j].querySelector(links) != null) {
                  data.push({
                    time: Date.now(),
                    title: articles[j].querySelector(titles).textContent,
                    link: articles[j].querySelector(links).href,
                    images: articles[j].querySelector(images) == null ? null : articles[j].querySelector(images).srcset.split(",")[0] === "" ? null : articles[j].querySelector(images).srcset.split(",")[0],
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "ESPN - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://espn.com",
                    sourceLogo: "https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                  });
                }
              }

              return data;
            }, Category));

          case 27:
            PageData = _context.sent;
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 29:
            i++;
            _context.next = 9;
            break;

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t1 = _context["catch"](7);
            _context.next = 38;
            return regeneratorRuntime.awrap(browser.close());

          case 38:
            _context.prev = 38;
            _context.next = 41;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 41:
            _context.next = 47;
            break;

          case 43:
            _context.prev = 43;
            _context.t2 = _context["catch"](38);
            _context.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
            _context.next = 49;
            return regeneratorRuntime.awrap(browser.close());

          case 49:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 34], [11, 21], [38, 43]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml, author;
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
          console.log(url);
          _context2.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context2.next = 10;
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

        case 10:
          Content = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector(".article-body").innerHTML;
            } catch (_unused5) {
              return null;
            }
          }));

        case 13:
          contenthtml = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector(".author").textContent;
              if (auth === "ESPN") auth = (_readOnlyError("auth"), null);
              return auth;
            } catch (_unused6) {
              return null;
            }
          }));

        case 16:
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
              content: Content,
              contenthtml: contenthtml
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

module.exports = ESPN;