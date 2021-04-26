'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/formatImage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../function/sendToserver'),
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
var Categories = ['international'];

var ninenews = function ninenews() {
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
            return regeneratorRuntime.awrap(page["goto"]('https://www.sbs.com.au/news/topic/world'));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(page.WaitForSelector('.media-image>a>picture>img:nth-of-type(6)'));

          case 16:
            _context.next = 22;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            _context.next = 22;
            return regeneratorRuntime.awrap(page["goto"]('https://www.sbs.com.au/news/topic/world'));

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.preview__headline');
              var images = document.querySelectorAll('.media-image>a>picture>source');
              var links = document.querySelectorAll('.preview__headline>a');
              var data = [];

              for (var j = 0; j < 2; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j == 0 ? j : j + 2] === "undefined" ? null : images[j].srcset,
                    Category: Category.charAt(0).toUpperCase() + Category.slice(1),
                    source: "SBS - " + Category.charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.sbs.com.au",
                    sourceLogo: "https://i1.sndcdn.com/avatars-000069869393-zwvoyp-t500x500.jpg"
                  });
                }
              }

              return data;
            }, Category));

          case 24:
            PageData = _context.sent;
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
            _context.next = 45;
            break;

          case 40:
            _context.prev = 40;
            _context.t2 = _context["catch"](35);
            console.log(_context.t2);
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
    }, null, null, [[7, 31], [11, 18], [35, 40]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content, contenthtml;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 28;
            break;
          }

          item = data[i];
          url = item.link;
          _context2.prev = 5;
          _context2.next = 8;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 8:
          _context2.next = 18;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](5);
          i++;
          item = data[i];
          url = item.link;
          console.log(url);
          _context2.next = 18;
          return regeneratorRuntime.awrap(page["goto"](url));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article__body').textContent.length > 400 ? document.querySelector('.article__body').textContent.trim().substring(0, 1050) : null;
            } catch (_unused4) {
              return null;
            }
          }));

        case 20:
          Content = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector('.article__body').innerHTML;
            } catch (_unused5) {
              return null;
            }
          }));

        case 23:
          contenthtml = _context2.sent;

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
              author: null,
              content: Content,
              contenthtml: contenthtml
            });
          }

        case 25:
          i++;
          _context2.next = 2;
          break;

        case 28:
          _context2.next = 30;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 10]]);
};

module.exports = ninenews;