'use strict';

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
var Categories = ['lifestyle', 'canada', 'world', 'entertainment', 'politics', 'health', 'sci-tech', 'sports', 'business'];

var CTV = function CTV() {
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
              _context.next = 30;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"](['https://www.ctvnews.ca/', '', Category].join('')));

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
            return regeneratorRuntime.awrap(page["goto"](['https://www.ctvnews.ca/', '', Category].join('')));

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.bn-headline .teaserTitle');
              var images = document.querySelectorAll('.teaserImage>a>img');
              var links = document.querySelectorAll('.teaserImage>a');

              if (Category === "sports") {
                Category = "sport";
              } else {
                if (Category === "sci-tech") {
                  Category = "technology";
                } else {
                  if (Category === "world") {
                    Category = "international";
                  } else {
                    if (Category === "lifestyle") {
                      Category = "life&style";
                    } else {
                      if (Category === "politics") {
                        Category = "politic";
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
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] == "undefined" || images[j] == null ? null : images[j].getAttribute('src'),
                    Category: Category,
                    source: "CTV",
                    sourceLink: "https://www.ctvnews.ca",
                    sourceLogo: "https://i.pinimg.com/originals/b3/69/c7/b369c7454adc03bfea8c6b2f4268be5a.png"
                  });
                }
              }

              return data;
            }, Category));

          case 24:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 27:
            i++;
            _context.next = 9;
            break;

          case 30:
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t1 = _context["catch"](7);
            _context.next = 36;
            return regeneratorRuntime.awrap(browser.close());

          case 36:
            _context.prev = 36;
            _context.next = 39;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 39:
            _context.next = 45;
            break;

          case 41:
            _context.prev = 41;
            _context.t2 = _context["catch"](36);
            _context.next = 45;
            return regeneratorRuntime.awrap(browser.close());

          case 45:
            _context.next = 47;
            return regeneratorRuntime.awrap(browser.close());

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 32], [11, 18], [36, 41]]);
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
              var text = document.querySelectorAll('.articleBody p');
              var cont = "";

              for (var _i = 0; _i < text.length; _i++) {
                cont = cont + "\n" + text[_i].textContent.replaceAll('\t', '');
              }

              return cont;
            } catch (_unused3) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var auth = document.querySelector(".byline").textContent;
              return auth;
            } catch (_unused4) {
              return null;
            }
          }));

        case 12:
          author = _context2.sent;

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

module.exports = CTV;