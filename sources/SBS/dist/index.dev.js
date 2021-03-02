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
              _context.next = 30;
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

              for (var j = 0; j < 6; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j == 0 ? j : j + 2] === "undefined" ? null : images[j].srcset,
                    Category: Category,
                    source: "SBS News",
                    sourceLink: "https://www.sbs.com.au",
                    sourceLogo: "https://mw3.wsj.net/mw5/content/logos/mw_logo_social.png"
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
    }, null, null, [[7, 32], [11, 18], [36, 41]]);
  })();
};

var GetContent = function GetContent(page, data) {
  var AllData_WithConetent, i, item, url, Content;
  return regeneratorRuntime.async(function GetContent$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          AllData_WithConetent = [];
          i = 0;

        case 2:
          if (!(i < data.length)) {
            _context2.next = 15;
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
            try {
              return document.querySelector('.article__body').textContent.length > 400 ? document.querySelector('.article__body').textContent.trim().substring(0, 1050) : null;
            } catch (_unused3) {
              return null;
            }
          }));

        case 10:
          Content = _context2.sent;

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
              content: Content
            });
          }

        case 12:
          i++;
          _context2.next = 2;
          break;

        case 15:
          console.log(AllData_WithConetent); // await InsertData(AllData_WithConetent);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ninenews;