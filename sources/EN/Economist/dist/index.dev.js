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
var Categories = ['economy'];

var MARKETWATCH = function MARKETWATCH() {
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
              _context.next = 36;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.economist.com/the-economist-explains/'));

          case 14:
            _context.prev = 14;
            _context.next = 17;
            return regeneratorRuntime.awrap(page.click('#_evidon-banner-acceptbutton'));

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](14);
            console.log(_context.t0);

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context["catch"](11);
            _context.next = 28;
            return regeneratorRuntime.awrap(page["goto"]('https://www.economist.com/the-economist-explains/'));

          case 28:
            _context.next = 30;
            return regeneratorRuntime.awrap(page.evaluate(function (Category) {
              var titles = document.querySelectorAll('.ds-layout-grid>.teaser__text>h2>a>span');
              var images = document.querySelectorAll('.ds-layout-grid>.teaser__image>img');
              var links = document.querySelectorAll('.ds-layout-grid>.teaser__text>h2>a');
              var data = [];

              for (var j = 0; j < titles.length; j++) {
                if (typeof titles[j] != "undefined" && typeof links[j] != "undefined") {
                  data.push({
                    time: Date.now(),
                    title: titles[j].textContent.trim(),
                    link: links[j].href,
                    images: typeof images[j] === "undefined" ? null : images[j].src,
                    Category: Category,
                    source: "MARKETWATCH",
                    sourceLink: "https://www.marketwatch.com/",
                    sourceLogo: "https://mw3.wsj.net/mw5/content/logos/mw_logo_social.png"
                  });
                }
              }

              return data;
            }, Category));

          case 30:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item) {
              AllData.push(item);
            });

          case 33:
            i++;
            _context.next = 9;
            break;

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t2 = _context["catch"](7);
            _context.next = 42;
            return regeneratorRuntime.awrap(browser.close());

          case 42:
            _context.prev = 42;
            _context.next = 45;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 45:
            _context.next = 52;
            break;

          case 47:
            _context.prev = 47;
            _context.t3 = _context["catch"](42);
            console.log(_context.t3);
            _context.next = 52;
            return regeneratorRuntime.awrap(browser.close());

          case 52:
            _context.next = 54;
            return regeneratorRuntime.awrap(browser.close());

          case 54:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[7, 38], [11, 24], [14, 19], [42, 47]]);
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
            _context2.next = 14;
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
              var first_text = document.querySelectorAll(".article__body-text");
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

          // var author = await page.evaluate(()=>{
          //     try{
          //      return document.querySelector('.author').textContent.trim();
          //     }catch{
          //       return null;
          //     }
          // })
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

        case 11:
          i++;
          _context2.next = 2;
          break;

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(InsertData(AllData_WithConetent));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = MARKETWATCH;