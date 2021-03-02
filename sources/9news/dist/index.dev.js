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
var Categories = ['education'];

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
              _context.next = 34;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.9news.com/education'));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(page.waitForSelector('.story-list__image-link>div>img'));

          case 16:
            _context.next = 24;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            _context.next = 22;
            return regeneratorRuntime.awrap(page["goto"]('https://www.9news.com/education'));

          case 22:
            _context.next = 24;
            return regeneratorRuntime.awrap(page.waitForSelector('.story-list__image-link>div>img'));

          case 24:
            _context.next = 26;
            return regeneratorRuntime.awrap(page.click('button.notifications__button'));

          case 26:
            _context.next = 28;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.story-list>.story-list__list li  .story-list__title-link');
              var images = document.querySelectorAll('.story-list>.story-list__list li .story-list__image-link>div>img');
              var links = document.querySelectorAll('.story-list>.story-list__list li  .story-list__title-link');
              var data = [];

              for (var j = 0; j < titles.length; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j == 0 ? j : j + 2] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "9NEWS",
                    sourceLink: "https://www.9news.com",
                    sourceLogo: "https://mw3.wsj.net/mw5/content/logos/mw_logo_social.png"
                  });
                }
              }

              return data;
            }, Category));

          case 28:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 31:
            i++;
            _context.next = 9;
            break;

          case 34:
            _context.next = 40;
            break;

          case 36:
            _context.prev = 36;
            _context.t1 = _context["catch"](7);
            _context.next = 40;
            return regeneratorRuntime.awrap(browser.close());

          case 40:
            _context.prev = 40;
            _context.next = 43;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 43:
            _context.next = 50;
            break;

          case 45:
            _context.prev = 45;
            _context.t2 = _context["catch"](40);
            console.log(_context.t2);
            _context.next = 50;
            return regeneratorRuntime.awrap(browser.close());

          case 50:
            _context.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 36], [11, 18], [40, 45]]);
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
              var first_text = document.querySelectorAll(".article__body div>p");
              var first_cont = "";

              for (var _i = 0; _i < first_text.length; _i++) {
                first_cont = first_cont + "\n" + first_text[_i].textContent;
              }

              return first_cont;
            } catch (_unused3) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              return document.querySelector(".article__author").textContent.trim().substring(8, 100);
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
          console.log(AllData_WithConetent); // await InsertData(AllData_WithConetent);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = ninenews;