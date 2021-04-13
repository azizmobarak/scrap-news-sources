'use strict';

var puppeteer = require('puppeteer-extra');

var puppeteer_stealth = require('puppeteer-extra-plugin-stealth');

var puppeteer_agent = require('puppeteer-extra-plugin-anonymize-ua');

var Recaptcha = require('puppeteer-extra-plugin-recaptcha');

var AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

var _require = require('../../function/insertData'),
    InsertData = _require.InsertData;

var _require2 = require('../../function/formatimage'),
    FormatImage = _require2.FormatImage;

var _require3 = require('../../function/sendtoserver'),
    sebdtoserver = _require3.sebdtoserver; //block ads


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
              _context.next = 31;
              break;
            }

            //get the right category by number
            Category = Categories[i]; //navigate to category sub route

            _context.prev = 11;
            _context.next = 14;
            return regeneratorRuntime.awrap(page["goto"]('https://www.economist.com/the-economist-explains/'));

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(page.click('#_evidon-banner-acceptbutton'));

          case 16:
            _context.next = 23;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            console.log(_context.t0);
            _context.next = 23;
            return regeneratorRuntime.awrap(page["goto"]('https://www.economist.com/the-economist-explains/'));

          case 23:
            _context.next = 25;
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
                    Category: Category + charAt(0).toUpperCase() + Category.slice(1),
                    source: "The Economist - " + Category + charAt(0).toUpperCase() + Category.slice(1),
                    sourceLink: "https://www.economist.com",
                    sourceLogo: "https://e7.pngegg.com/pngimages/355/504/png-clipart-the-economist-logo-economist-group-magazine-organization-others-miscellaneous-company.png"
                  });
                }
              }

              return data;
            }, Category));

          case 25:
            PageData = _context.sent;
            console.log(PageData);
            PageData.map(function (item, j) {
              item.images = FormatImage(item.images);
              setTimeout(function () {
                SendToServer('en', item.Category, item.source, item.sourceLogo);
              }, 2000 * j);
              AllData.push(item);
            });

          case 28:
            i++;
            _context.next = 9;
            break;

          case 31:
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t1 = _context["catch"](7);
            _context.next = 37;
            return regeneratorRuntime.awrap(browser.close());

          case 37:
            _context.prev = 37;
            _context.next = 40;
            return regeneratorRuntime.awrap(GetContent(page, AllData));

          case 40:
            _context.next = 47;
            break;

          case 42:
            _context.prev = 42;
            _context.t2 = _context["catch"](37);
            console.log(_context.t2);
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
    }, null, null, [[7, 33], [11, 18], [37, 42]]);
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
              var first_text = document.querySelectorAll(".article__body-text");
              var first_cont = "";

              for (var _i = 0; _i < first_text.length; _i++) {
                first_cont = first_cont + "\n" + first_text[_i].textContent;
              }

              return first_cont;
            } catch (_unused2) {
              return null;
            }
          }));

        case 9:
          Content = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(page.evaluate(function () {
            try {
              var first_text = document.querySelectorAll(".article__body-text");
              var first_cont = "";

              for (var _i2 = 0; _i2 < first_text.length; _i2++) {
                first_cont = first_cont + "<br/>" + first_text[_i2].innerHTML;
              }

              return first_cont;
            } catch (_unused3) {
              return null;
            }
          }));

        case 12:
          contenthtml = _context2.sent;

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
              content: Content,
              contenthtml: contenthtml
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

module.exports = MARKETWATCH;